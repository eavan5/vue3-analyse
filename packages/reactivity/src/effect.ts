// 依赖收集的原理：
// 借助js单线程的特点，默认调用effect的时候调用proxy的get，此时让属性记住依赖的effect，同理也让effect记住对应的属性
// 考的是数据结构 weakMap ： { map : new Set()}
// 稍后数据变化的时候 找到proxy的对象对应的map 通过key属性找到对应的set中的effect执行

import { recordEffectScope } from './index'

export let activeEffect = undefined

/**
 * 
 * @param effect ReactiveEffect实例
 */
function clearEffect(effect) {
	// 当执行effect的时候，我们需要重新建立起新的依赖收集，否则会导致重复渲染发生
	// 所以需要清理effect中存入属性中set中的effect

	// 每次执行前都需要将effect中 对应属性的set集合都清理掉
	const { deps } = effect // 存的是每个属性的set
	for (let i = 0; i < deps.length; i++) {
		deps[i].delete(effect) // 让依赖项中的effect删除掉
	}
	effect.deps.length = 0 // 清空数组
}

export class ReactiveEffect {
	public active = true
	public parent = null
	public deps = [] // 3.effect中收集了那些属性，后续清理的时候需要使用
	// constructor(public fn) {
	//   this.fn = fn
	// }
  constructor(public fn, public scheduler?) { 
    // 等价上面的this.xxx = xxx
		recordEffectScope(this)
	}

	run() {
		// 依赖收集 让属性和effect产生关联
		if (!this.active) { // 表示该effect不做响应式处理
			return this.fn()
		} else {
			try {
				this.parent = activeEffect // 2.在effect的回调里面继续使用effect函数是，通过此方法让他们记住当前的实例
				activeEffect = this
				clearEffect(this) // 3.清除副作用: 清空之前的属性依赖，重新做依赖收集，防止effect的回调函数被多次调用 // vue2 vue3都是需要清理的
				return this.fn() // 去proxy对象 去取值的时候，需要把当前的effect函数关联上去，等到数据更新，effect的函数会继续执行
			} finally {
				// 取消当前正在运行的effect
				activeEffect = this.parent // 2.出来的时候再把父亲还原回去
				this.parent = null // 2.在effect的回调里面继续使用effect函数是，通过此方法让他们记住当前的实例
			}
		}
	}
	stop() {
		if (this.active) {
			this.active = false
			clearEffect(this)
		}
	}
}

// 将对象里面的key去关联对应的effect，一个属性可以对应多个effect

// 外层用一个map {object: {name: [effect, effect], age: [effect, effect]}}
const targetMap = new WeakMap() // 定一个全局的map去存储映射关系

/**
 * 触发该obj的key对应的effect
 * @param target reactive（obj）里面的obj
 * @param key 对应的key
 * @returns 
 */
export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		return // 没有依赖任何的effect
	}
	let effects = depsMap.get(key)
	triggerEffects(effects)
}

/**
 * 触发effect集合
 * @param effects effect的集合
 */
export function triggerEffects(effects) {
	if (effects) {
		// 4.重新生成一个新的effect，目的是为了防止一边清空依赖 重新执行effect.run() 又添加遍历老的effects导致一边删除一边新增 // index3-分支切换
		effects = new Set(effects)
		effects &&
			effects.forEach(effect => {
				if (effect !== activeEffect) {
					// 4 . 这里面是防止effect的回调又调用自己 导致被无限调用（调用栈溢出）（ps.也就是当前effect里面再更改当前effect收集的属性，这样就死循环了）
					if (effect.scheduler) {
						effect.scheduler() // 可以提供一个调用函数，用户实现自己的逻辑,组件更新也是用的这个方法
					} else {
						effect.run() // 4. 数据变化了，就执行里面的effect·
					}
				}
			})
	}
}

/**
 * 
 * @param target reactive(obj)里面的obj对象
 * @param key obj对应的key
 */
export function track(target, key) {
	if (activeEffect) {
		let depsMap = targetMap.get(target)
		if (!depsMap) {
			targetMap.set(target, (depsMap = new Map()))
		}
		let deps = depsMap.get(key)
		if (!deps) {
			depsMap.set(key, (deps = new Set()))
		}
		trackEffects(deps)
	}
}

/**
 * 1.传入一个deps（Set）去接收当前活动的的effect（active Effect）
 * 2.并且让活动的effect将当前的这个对象的收集到的effect的Set集合再反向收集到activeEffect的deps中
 * @param deps Set实例
 */
export function trackEffects(deps) {
	let shouldTrack = !deps.has(activeEffect)

	if (shouldTrack && activeEffect) {
		deps.add(activeEffect) // 进行依赖收集
		activeEffect.deps.push(deps) // 3.反向收集依赖，当执行了effect之后需要反向清除依赖
	}
	// 3.让属性去记住所用到的effect是谁，但是哪个effect对应哪个属性应该也要知道（后期需要一些清理工作）
}

/**
 * 
 * @param fn 传入的副作用函数的回调
 * @param options 一些配置项，比如调度器scheduler
 * @returns 
 */
export function effect(fn, options: Record<string, any> = {}) {
	// 将用户传递的函数变成响应式的effect
	const _effect = new ReactiveEffect(fn, options.scheduler)
	_effect.run() // 先去执行一次，去进行依赖收集
	const runner = _effect.run.bind(_effect)  // 保证是当前的effect
	runner.effect = _effect // 暴露effect的实例
	return runner // 用户可以手动调用runner重新执行
}

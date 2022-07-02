
// 依赖收集的原理：
// 借助js单线程的特点，默认调用effect的时候调用proxy的get，此时让属性记住依赖的effect，同理也让effect记住对应的属性
// 考的是数据结构 weakMap ： { map : new Set()}
// 稍后数据变化的时候 找到proxy的对象对应的map 通过key属性找到对应的set中的effect执行


export let activeEffect = undefined


function clearEffect (effect) {
  // debugger
  // 当执行effect的时候，我们需要重新建立起新的依赖收集，否则会导致重复渲染发生
  // 所以需要清理effect中存入属性中set中的effect

  // 每次执行前都需要将effect中 对应属性的set集合都清理掉
  let deps = effect.deps // 存的是每个属性的set
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}


export class ReactiveEffect {
  public active = true
  public parent = null
  public deps = [] // 3.effect中使用了那些属性，后续清理的时候需要使用
  // constructor(public fn) {
  //   this.fn = fn
  // }
  constructor(public fn, public scheduler) { // 等价上面

  }

  run () {
    // 依赖收集 让属性和effect产生关联
    if (!this.active) {
      return this.fn()
    } else {
      try {
        this.parent = activeEffect // 2.在effect的回调里面继续使用effect函数是，通过此方法让他们记住当前的实例
        activeEffect = this
        clearEffect(this) // 3.清除副作用: 清空之前的属性依赖，重新做依赖收集，防止effect的回调函数被多次调用 // vue2 vue3都是需要清理的
        return this.fn()  // 去proxy对象 去取值的时候，需要把当前的effect函数关联上去，等到数据更新，effect的函数会继续执行
      } finally {
        // 取消当前正在运行的effect
        activeEffect = this.parent  // 2.出来的时候再把父亲还原回去
        this.parent = null // 2.在effect的回调里面继续使用effect函数是，通过此方法让他们记住当前的实例
      }
    }
  }
  stop () {
    if (this.active) {
      this.active = false
      clearEffect(this)
    }
  }
}

// 将对象里面的key去关联对应的effect，一个属性可以对应多个effect

// 外层用一个map {object: {name: [effect, effect], age: [effect, effect]}}
const targetMap = new WeakMap()
export function trigger (target, key, value) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    return // 没有依赖任何的effect
  }
  let effects = depsMap.get(key)
  if (effects) {
    // 4.重新生成一个新的effect，目的是为了防止一边清空依赖 重新执行effect.run() 又添加遍历老的effects导致一边删除一边新增 // index3-分支切换
    effects = new Set(effects)
    effects && effects.forEach(effect => {
      if (effect !== activeEffect) { // 这里面是防止effect的回调又调用自己 导致被无限调用（调用栈溢出）
        if (effect.scheduler) {
          effect.scheduler() // 可以提供一个调用函数，用户实现自己的逻辑
        } else {
          effect.run() // 4. 数据变化了，就执行里面的effect
        }
      }
    })
  }
}

export function track (target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    let shouldTrack = !deps.has(activeEffect)
    if (shouldTrack) {
      deps.add(activeEffect)
      activeEffect.deps.push(deps) // 3.反向收集依赖，当执行了effect之后需要反向清除依赖
    }
    // 3.让属性去记住所用到的effect是谁，但是哪个effect对应哪个属性应该也要知道（后期需要一些清理工作）

  }
  // console.log(activeEffect, targetMap);


}

export function effect (fn, options: Record<string, any> = {}) {


  // 将用户传递的函数变成响应式的effect
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect // 暴露effect的实例
  return runner // 用户可以手动调用runner重新执行
}
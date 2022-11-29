import { isReactive } from './baseHandler'
import { ReactiveEffect } from './effect'

export function watch(getter, cb, options = {}) {
	doWatch(getter, cb, options)
}

export function watchEffect(effect, options) {
	return doWatch(effect, null, options)
}

function doWatch(source, callback, options = {}) {
	let getter
	if (isReactive(source)) {
		// 判断是否是响应式对象
		// 创建一个effect，让effect收集getter的所有属性
		getter = () => source
	} else {
		getter = source // 当是函数的时候
	}

	let oldValue, cleanup
	let onCleanup = fn => {
		cleanup = fn
	}
	const job = () => {
		if (callback) {
			let newValue = effect.run() // 数据变化之后重新调用effect.run函数会获得最新的值
			if (cleanup) cleanup() // 如果有cleanup函数，就执行，清除上一次的副作用
			callback(newValue, oldValue, onCleanup)
			oldValue = newValue
		} else {
			effect.run() // 调用run方法，重新收集依赖
		}
	}
	// console.log(getter)

	const effect = new ReactiveEffect(getter, job)

	// 默认调用run方法会执行get方法，此时source作为第一次的老值
	oldValue = effect.run() // 默认执行一次,拿到老值
}

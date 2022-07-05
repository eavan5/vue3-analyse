import { isReactive } from './baseHandler'
import { ReactiveEffect } from './effect'

export function watch(source, cb) {
	let getter
	if (isReactive(source)) {
		// 判断是否是响应式对象
		// 创建一个effect，让effect收集source的所有属性
		getter = () => source
	}
	let oldValue
	const job = () => {
		let newValue = effect.run() // 数据变化之后重新调用effect.run函数会获得最新的值
		cb(newValue, oldValue)
		oldValue = newValue
	}
	console.log(getter)

	const effect = new ReactiveEffect(getter, job)

	// 默认调用run方法会执行get方法，此时source作为第一次的老值
	oldValue = effect.run() // 默认执行一次,拿到老值
}

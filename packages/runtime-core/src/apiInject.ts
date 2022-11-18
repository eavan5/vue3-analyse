import { instance } from './components'

export function provide(key, value) {
	// provide 必须要用在setup中 因为要拿实例
	if (!instance) return // 如果没有实例 则直接返回 说明这个方法没有在setup中使用
	let parentProvides = instance.parent && instance.parent.provide // 获取父亲的provide + 自己的provide

	// 第一次应该创建一个全新的provides，后续就用自己的
	let currentProvides = instance.provides // 自己的
	if (currentProvides === parentProvides) {
		// provides: parent ? parent.provides : Object.create(null), 默认是相同的
		//  说明是第一次
		currentProvides = instance.provides = Object.create(parentProvides) // 这样就可以让子不能轻易修改父provide，让层级更加清晰
	}
	// 下一个儿子会获取所有的provide

	currentProvides[key] = value
}

// 前置条件 组件的实例的provides 指向的是parent的provides
// 1） 我们先取出自己父亲身上的provides ，默认是父亲的provides,创建一个新的provides 重新给自己的provides赋值
// 2） 在上面添加属性
// 3） 再次provide的时候， 拿父亲的provides，再取出自己的provides，此时不想等了，直接用自己身上的添加属性

// provide('a', 1)
// provide('b', 1)
// provide('c', 1) // 不能覆盖

export function inject(key, defaultValue?) {
	// debugger
	if (!instance) return
	const provides = instance.parent && instance.parent.provides // 父组件的provides
	if (provides && key in provides) {
		return provides[key]
	} else {
		return defaultValue
	}
}

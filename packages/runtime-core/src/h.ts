import { isObject } from '@vue/shared'
import { createVNode, isVNode } from './createVNode'

export function h(type, propsOrChildren?, children?) {
	const l = arguments.length
	if (l === 2) {
		// 只有属性，或者一个元素儿子的时候
		if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
			if (isVNode(propsOrChildren)) {
				// h('div',h('span'))
				return createVNode(type, null, [propsOrChildren])
			}
			return createVNode(type, propsOrChildren) // h('div',{style:{color:'red'}});
		} else {
			// 传递儿子列表的情况
			return createVNode(type, null, propsOrChildren) // h('div',null,[h('span'),h('span')])
		}
	} else {
		if (l > 3) {
			// 超过3个除了前两个都是儿子
			children = Array.prototype.slice.call(arguments, 2)
		} else if (l === 3 && isVNode(children)) {
			children = [children] // 儿子是元素将其包装成 h('div',null,[h('span')])
		}
		return createVNode(type, propsOrChildren, children) // h('div',null,'jw')
	}
}
// 注意子节点是：数组、文本、null

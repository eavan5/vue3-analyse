import { isArray, isObject, isString } from '@vue/shared'

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export function isVNode(val) {
	return !!val.__v_isVNode
}

export function isSameVNode(v1, v2) {
	return v1.type === v2.type && v1.key === v2.key
}

export function createVNode(type, props = null, children = null) {
	// console.log(type, props, children)
	// 后续判断不同的类型的虚拟节点
	let shapeFlag = isString(type)
		? ShapeFlags.ELEMENT
		: isObject(type)
		? ShapeFlags.STATEFUL_COMPONENT
		: 0 //标记是元素还是什么节点

	// 我要将当前的虚拟节点和自己儿子的虚拟节点映射起来 权限组合 位运算
	const vnode = {
		//vnode要对应实际的节点
		__v_isVNode: true,
		type,
		props,
		children,
		key: props && props.key,
		el: null,
		shapeFlag,
		// 打个标记
	}

	if (children) {
		let temp = 0
		if (isArray(children)) {
			// 走到createVNode 要么是数组 要么是字符串 h()中会对children进行处理
			temp = ShapeFlags.ARRAY_CHILDREN
		} else {
			children = String(children)
			temp = ShapeFlags.TEXT_CHILDREN
		}
		vnode.shapeFlag = temp | shapeFlag
	}

	// console.log(vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN)

	// shapeFlags 对应的是vnode的类型,我想知道虚拟节点的儿子是数组 还是元素 还是文本节点 还是组件
	// 之前是 通过 isArray 或者 isString ...来判断的 vue2的写法
	return vnode
}

export const enum ShapeFlags { // vue3提供的形状标识
	ELEMENT = 1, // 元素节点 1
	FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件 2
	STATEFUL_COMPONENT = 1 << 2, // 状态式组件 4
	TEXT_CHILDREN = 1 << 3, // 文本子节点 /8
	ARRAY_CHILDREN = 1 << 4, // 数组子节点 16
	SLOTS_CHILDREN = 1 << 5, // 插槽子节点 32
	TELEPORT = 1 << 6, // 空组件 64
	SUSPENSE = 1 << 7, // 懒加载 128
	COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 组件需要被保持 256
	COMPONENT_KEPT_ALIVE = 1 << 9, // 组件已被保持 512
	COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}

// 0 -> 当前所在位的值 * 进制^（当前所在位的值 - 1）
// 000000001 =》 1* 2^0 = 1
// 000000010 =》 1* 2^1 = 2
// 000000100 =》 1* 3^2 = 4
// 000000111 =》1* 2^0 + 1* 2^1 + 1* 2^2 = 7

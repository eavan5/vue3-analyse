import { isFunction } from '@vue/shared'
import { reactive } from '@vue/reactivity'

export function createComponentInstance(vnode) {
	let instance = {
		data: null, // 组件的数据
		vnode, // 标识实例对应的虚拟节点
		subTree: null, // 组件对应render里面的渲染的虚拟节点
		isMounted: false, // 组件是否挂载
		update: null, // 组件的更新函数 effect.run
		render: null, // 组件的渲染函数
	}

	return instance
}

export function setupComponent(instance) {
	// type就是用户传入的组件类型
	let { type, props, children } = instance.vnode
	// console.log(type)
	let { data, render } = type
	if (data) {
		if (!isFunction(data)) {
			return console.warn('this data is not a function')
		}
		instance.data = reactive(data.call({})) // 给实例赋予data属性
	}
	instance.render = render
}

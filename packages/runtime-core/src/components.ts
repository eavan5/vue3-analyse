import { hasOwn, isFunction } from '@vue/shared'
import { reactive } from '@vue/reactivity'

export function createComponentInstance(vnode) {
	let instance = {
		data: null, // 组件的数据
		vnode, // 标识实例对应的虚拟节点
		subTree: null, // 组件对应render里面的渲染的虚拟节点
		isMounted: false, // 组件是否挂载
		update: null, // 组件的更新函数 effect.run
		render: null, // 组件的渲染函数
		propsOptions: vnode.type.props || {}, //  vnode的props render(h(VueComponent, { a: 1, b: 2, c: 3 }), app) 总的a,b,c
		props: {}, // 组件的props 用户传入用来接收的属性
		attrs: {}, // 组件的attrs 代表的是没有接收的属性
		proxy: null, // 代理对象
	}

	return instance
}

function initProps(instance, rawProps) {
	const props = {}
	const attrs = {}
	const options = instance.propsOptions
	if (rawProps) {
		for (const key in rawProps) {
			const value = rawProps[key] // 拿到对应的值

			// 这里应该校验值的内心 是否符合 props的类型
			if (key in options) {
				props[key] = value
			} else {
				attrs[key] = value
			}
		}
	}
	// instance.props = shallowReactive(props)  // 内部用的是浅响应式
	instance.props = reactive(props) // 稍后更新props，应该可以达到重新渲染的效果
	instance.attrs = attrs // 默认是非响应式的
}

const publicProperties = {
	// 公开的一些属性
	$attrs: instance => instance.attrs,
}

const instanceProxy = {
	get(target, key, receiver) {
		const { data, props } = target
		if (data && hasOwn(data, key)) {
			return data[key]
		} else if (props && hasOwn(props, key)) {
			return props[key]
		}
		let getter = publicProperties[key]
		if (getter) {
			return getter(target)
		}
	},
	set(target, key, value, receiver) {
		const { data, props } = target
		if (data && hasOwn(data, key)) {
			data[key] = value
		} else if (props && hasOwn(props, key)) {
			console.warn(
				`Attempting to set prop '${key}' to '${value}' on a Vue instance that is not a Vue component.`
			)
			return false
		}
		return true
	},
}

export function setupComponent(instance) {
	// type就是用户传入的组件类型
	let { type, props, children } = instance.vnode
	// console.log(type)
	let { data, render } = type
	initProps(instance, props)

	instance.proxy = new Proxy(instance, instanceProxy)

	if (data) {
		if (!isFunction(data)) {
			return console.warn('this data is not a function')
		}
		instance.data = reactive(data.call({})) // 给实例赋予data属性
	}
	instance.render = render
}

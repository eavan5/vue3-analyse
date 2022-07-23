import { hasOwn, isFunction, isObject } from '@vue/shared'
import { proxyRefs, reactive } from '@vue/reactivity'
import { ShapeFlags } from './createVNode'

export let instance = null

export const getCurrentInstance = () => instance
export const setCurrentInstance = i => (instance = i)

export function createComponentInstance(vnode, parent) {
	instance = {
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
		setupState: {}, // setup如果返回的是对象，那么就要给这个对象赋值
		slots: {}, // 插槽
		exposed: {}, // 暴露给父组件的属性
		parent, // 标记当前组件的父
		provides: parent ? parent.provides : Object.create(null), // 父 => 子 => 孙 用的都是一个对象
		// 这里如果子在provide中提供属性 会影响父亲
		// 所以在用户使用provide的时候 将父亲的provide拷贝一份
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

			// 这里应该校验值的类型 是否符合 props的类型
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
	$slots: instance => instance.slots,
}

const instanceProxy = {
	get(target, key, receiver) {
		const { data, props, setupState } = target
		if (data && hasOwn(data, key)) {
			return data[key]
		} else if (setupState && hasOwn(setupState, key)) {
			return setupState[key]
		} else if (props && hasOwn(props, key)) {
			return props[key]
		}
		let getter = publicProperties[key]
		if (getter) {
			return getter(target)
		}
	},
	set(target, key, value, receiver) {
		const { data, props, setupState } = target
		if (data && hasOwn(data, key)) {
			data[key] = value
		} else if (setupState && hasOwn(setupState, key)) {
			setupState[key] = value
		} else if (props && hasOwn(props, key)) {
			console.warn(
				`Attempting to set prop '${key}' to '${value}' on a Vue instance that is not a Vue component.`
			)
			return false
		}
		return true
	},
}

function initSlots(instance, children) {
	if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
		// 如果是插槽
		instance.slots = children // 将用户的children映射到实例上
	}
}

export function setupComponent(instance) {
	// type就是用户传入的组件类型
	let { type, props, children } = instance.vnode
	let { data, render, setup } = type
	initProps(instance, props)
	initSlots(instance, children) // 映射表 名字对应的虚拟节点

	instance.proxy = new Proxy(instance, instanceProxy)

	if (data) {
		if (!isFunction(data)) {
			return console.warn('this data is not a function')
		}
		instance.data = reactive(data.call({})) // 给实例赋予data属性
	}
	if (setup) {
		const context = {
			emit(eventName, ...args) {
				const name = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`

				// 用户绑定的属性，包括事件
				let invoker = instance.vnode.props[name]

				// 调用组件绑定的事件
				invoker && invoker(...args)
			},
			attrs: instance.attrs,
			// slot 插槽
			slots: instance.slots,
			expose: exposed => {
				instance.exposed = exposed
			},
		}

		setCurrentInstance(instance) // 2-设置暴露的全局实例
		// setup在执行的时候有两个参数
		const setupResult = setup(instance.props, context)
		setCurrentInstance(null) // 2-调用完之后清空 所以 getCurrentInstance() 只能在setup中获取

		if (isFunction(setupResult)) {
			// 如果setup返回的是render 那么就采用这个render
			instance.render = setupResult
		} else if (isObject(setupResult)) {
			// 是数据data
			instance.setupState = proxyRefs(setupResult) // 取值的时候 可以自动解包 .value // 代理取值
		}
	}
	if (!instance.render) {
		if (render) {
			instance.render = render
		} else {
			// 去模版编译
		}
	}
}

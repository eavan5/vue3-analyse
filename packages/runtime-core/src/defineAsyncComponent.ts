import { Fragment } from './createVNode'
import { ref } from '@vue/reactivity'
import { h } from './h'

export function defineAsyncComponent(loader) {
	// 我们默认加载一个空 后面再加载对应的组件 并且把组件返回 Fragment
	let Component = null
	return {
		setup() {
			const loaded = ref(false)
			loader().then(componentV => {
				loaded.value = true
				Component = componentV
			})

			return () => {
				return loaded.value ? h(Component) : h(Fragment)
			}
		},
	}
}

import { Fragment } from './createVNode'
import { ref } from '@vue/reactivity'
import { h } from './h'

export function defineAsyncComponent(loaderOrOptions) {
	if (typeof loaderOrOptions === 'function') {
		// 全部处理成对象
		loaderOrOptions = {
			loader: loaderOrOptions,
		}
	}

	// 我们默认加载一个空 后面再加载对应的组件 并且把组件返回 Fragment
	let Component = null
	return {
		setup() {
			const { loader, timeout, errorComponent, delay, loadingComponent, onError } = loaderOrOptions
			const loaded = ref(false)
			const error = ref(false)
			const loading = ref(!!delay)

			if (timeout) {
				// 超时处理 这应该要去清除定时器
				setTimeout(() => {
					error.value = true
				}, timeout)
			}
			if (delay) {
				// 延时loading
				setTimeout(() => {
					loading.value = false
				}, delay)
			} else {
				loading.value = false // 没有延迟显示
			}

			// 通过Promise链来实现重试加载
			function load() {
				return loader().catch(err => {
					if (onError) {
						return new Promise((resolve, reject) => {
							const retry = () => resolve(load())
							const fail = () => reject()
							onError(retry, fail)
						})
					} else {
						throw err
					}
				})
			}

			load()
				.then(componentV => {
					loaded.value = true
					Component = componentV
				})
				.catch(err => {
					error.value = true
				})
				.finally(() => {
					loading.value = false
				})

			return () => {
				if (loaded.value) {
					return h(Component)
				} else if (error.value && errorComponent) {
					return h(errorComponent)
				} else if (!loading.value && loadingComponent) {
					return h(loadingComponent)
				} else {
					// 当刚开始渲染的是错误组件=》正确的组件
					return h(Fragment, [])
				}
			}
		},
	}
}

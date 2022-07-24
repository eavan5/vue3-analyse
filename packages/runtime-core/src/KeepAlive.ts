import { onMounted, onUpdated } from './lifecycle'
import { ShapeFlags } from './createVNode'
import { getCurrentInstance, instance } from './components'

function resetFlag(vnode) {
	if (vnode.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
		vnode.shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE
	}
	if (vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
		vnode.shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
	}
}

export const KeepAlive = {
	__isKeepAlive: true, // 自定义用来标识keep-alive组件
	props: {
		max: {},
	},
	setup(props, { slots }) {
		// props = { max: 2 }
		const keys = new Set() // 缓存组件的key
		const cache = new Map() // 缓存组件的映射关系

		const instance = getCurrentInstance()
		// dom操作都在这里instance.ctx.renderer上
		const { createElement, move, unmount } = instance.ctx.renderer

		const pruneCacheEntry = vnode => {
			const subTree = cache.get(vnode) // 获取缓存的子树
			resetFlag(subTree)
			unmount(subTree)
			cache.delete(vnode)
			keys.delete(vnode)
		}

		let storageContainer = createElement('div') // 缓存组件的容器

		instance.ctx.active = (n2, container, anchor) => {
			move(n2, container, anchor)
		}

		instance.ctx.deactivate = n1 => {
			// 组件卸载的时候会将虚拟节点对应的真实节点移动到容器中
			move(n1, storageContainer)
			// console.log(storageContainer)
		}

		let paddingCacheKey = null
		console.log('初始化')

		const cacheSubtree = () => {
			// console.log('mounted')
			// vnode是组件的虚拟节点 虚拟节点上有el subTree对应渲染的子节点
			//subTree就是当前组件的虚拟节点
			paddingCacheKey !== null && cache.set(paddingCacheKey, instance.subTree)
		}
		onMounted(cacheSubtree)
		onUpdated(cacheSubtree)

		return () => {
			let vnode = slots.default?.()

			// 不是组件就不用缓存了
			if (!(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT)) {
				return vnode
			}
			const comp = vnode.type
			let key = vnode.key == null ? comp : vnode.key
			// console.log(vnode)
			paddingCacheKey = key

			let cacheVnode = cache.get(key)
			console.log('key:', key)

			if (cacheVnode) {
				console.log('有缓存,缓存的是：', cacheVnode)
				vnode.component = cacheVnode.component // 复用组件
				vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE // 让组件走缓存的时候不需要初始化
			} else {
				keys.add(key)
				// LRU缓存算法
				if (props.max && keys.size > props.max) {
					pruneCacheEntry(keys.values().next().value)
				}
			}
			vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

			// 获取到虚拟节点

			return vnode
		}
	},
}

// keep-alive中的插槽变化了 需要重新渲染，重新渲染的时候看一下之前的有没有缓存过

// 缓存策略  LRU算法，最近使用的放到最后，最近没有使用的放到最前面

// 1.默认渲染keep-alive组件的时候，检查插槽中是不是组件
// 2.如果是组件就把组件和对应的key缓存起来，做成一个映射表
// 3. 标记组件卸载的时候不用真的卸载
// 4. 卸载组件挂载新的组件，此时会命中插槽的更新，卸载老的组件的时候不是真的卸载，而是缓存dom到内存中，加载新的组件
// 5. 下次访问的时候继续访问已经访问过的组件时，这时候会复用组件的实例，并且不要再初始化组件
// 6. 初始化的时候，会再去缓存中将dom拉去到容器中（缓存的是dom）
// 7. 缓存策略可以采用LRU算法，最近使用的放到最后，最近没有使用的放到最前面

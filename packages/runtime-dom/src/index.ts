import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = { patchProp, ...nodeOps }

// vue内置的渲染器 我们也可以通过createRenderer方法来创建自己的渲染器
export function render(vnode, container) {
	let { render } = createRenderer(renderOptions)
	return render(vnode, container)
}

export * from '@vue/runtime-core'

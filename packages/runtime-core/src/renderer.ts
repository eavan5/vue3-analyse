import { isNumber, isString } from '@vue/shared'
import { createVNode, ShapeFlags, Text } from './createVNode'

export function createRenderer(options) {
	//用户可以调用此方法传入对应的渲染选项

	let {
		createElement: hostCreateElement,
		createTextNode: hostCreateTextNode,
		insert: hostInsert,
		remove: hostRemove,
		querySelector: hostQuerySelector,
		parentNode: hostParentNode,
		nextSibling: hostNextSibling,
		setText: hostSetText,
		setElementText: hostSetElementText,
		patchProp: hostPatchProp,
	} = options

	function normalizeVNode(children, i) {
		console.log(children[i])

		if (isString(children[i]) || isNumber(children[i])) {
			// 给文本加标识，不能给字符串加，所以只能给对象加
			children[i] = createVNode(Text, null, children[i]) // 需要换掉以前存的内容
		}
		return children[i]
	}

	function mountChildren(children, container) {
		// debugger
		for (let i = 0; i < children.length; i++) {
			let child = normalizeVNode(children, i)
			// child 可能是文本内容，我们需要把文本也变成虚拟节点

			patch(null, child, container) // 递归渲染子节点
		}
  }
  
  function patchProps (oldProps, newProps, el) {
    oldProps = oldProps || {}
    newProps = newProps || {}
    for(let key in newProps) { // 循环新的覆盖老的
        hostPatchProp(el,key,oldProps[key],newProps[key])
    }

    for(let key in oldProps) { // 老得没有需要删除
        if(newProps[key]==null) {
            hostPatchProp(el,key,oldProps[key],null)
        }
      
    }
    
  }

	function mountElement(vnode, container) {
		// console.log(vnode, container)

		let { type, props, children, shapeFlag } = vnode
		// console.log(type, props, children, shapeFlag)
		// 因为我们后续需要比对虚拟节点的差异更新页面，所以需要保留对应的真实节点
    let el = (vnode.el = hostCreateElement(type))
    
    if (props) { // 如果有属性 就去更新属性 {a:1, b:2} => {c:3}
      patchProps(null, props,el)
    }

		// children不是数组就是文本
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			hostSetElementText(el, children)
		}
		if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(children, el)
		}
		hostInsert(el, container)
	}

	function ProcessText(n1, n2, container) {
		if (n1 === null) {
			hostInsert((n2.el = hostCreateTextNode(n2.children)), container)
		}
	}
	function processElement(n1, n2, container) {
		if (n1 === null) {
			mountElement(n2, container)
		}
	}

	function patch(n1, n2, container) {
		// 看n1是null 说明没有之前的虚拟节点
		// 如果n1有值 说明要走diff算法

		const { type, shapeFlag } = n2
		switch (type) {
			case Text:
				ProcessText(n1, n2, container)
				break

			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container)
					break
				}
		}
	}

	function render(vnode, container) {
		if (vnode == null) {
			// 卸载元素
			return
		} else {
			// 更新
			patch(container._vnode || null, vnode, container)
		}

		container._vnode = vnode // 第一次渲染的时候会把vnode挂载到container上
	}
	return {
		render,
	}
}

// 创建元素节点 创建文本节点  节点的增删改查 获取父子关系

export const nodeOps = {
	createElement(tagName) {
		return document.createElement(tagName)
	},
	createTextNode(text) {
		return document.createTextNode(text)
	},
	insert(element, container, anchor = null) {
		container.insertBefore(element, anchor) // 如果anchor是null 相当于appendChild
	},
	remove(child) {
		const parent = child.parentNode
		if (parent) {
			parent.removeChild(child)
		}
	},
	querySelector(selectors) {
		return document.querySelector(selectors)
	},
	parentNode(child) {
		return child.parentNode
	},
	nextSibling(child) {
		return child.nextSibling
	},
	setText(element, text) {
		element.nodeValue = text // 这边是设置文本节点的内容
	},
	setElementText(element, text) {
		element.textContent = text // 这边是设置元素节点的内容 类似innerHTML
	},
	PatchProp(element, key, value) {
		element[key] = value
	},
}

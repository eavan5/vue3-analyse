export function isObject(value) {
	return typeof value === 'object' && value !== null
}

export const isFunction = value => typeof value === 'function'

export const isString = value => typeof value === 'string'

export const isArray = Array.isArray

export const isNumber = value => typeof value === 'number'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

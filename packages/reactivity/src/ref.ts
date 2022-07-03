import { isObject } from "@vue/shared"
import { trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

export function ref (value) {
  return new RefImpl(value)
}

export function toRefs (object) {
  const res = {}
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      res[key] = toRef(object, key)
    }
  }
  return res
}

export function toRef (object, key) {
  return new ObjectRefImpl(object, key)
}

export function toReactive (value) {
  return isObject(value) ? reactive(value) : value
}


class ObjectRefImpl {
  constructor(public object, public key) {

  }
  get value () {
    return this.object[this.key]
  }
  set value (newValue) {
    this.object[this.key] = newValue
  }
}

class RefImpl {
  private _value
  private dep
  constructor(public rawValue) {
    // rawValue可能是一个对象，我们需要把对象也转换成响应式
    this._value = toReactive(rawValue)
  }
  get value () {
    //这里取值，需要做依赖收集
    trackEffects(this.dep || (this.dep = new Set))

    return this._value
  }
  set value (newValue) {
    if (newValue !== this.rawValue) {
      this._value = toReactive(newValue)
      this.rawValue = newValue
      triggerEffects(this.dep)
    }
  }
}
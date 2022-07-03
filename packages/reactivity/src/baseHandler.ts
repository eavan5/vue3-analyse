import { isObject } from '@vue/shared'
import { reactive } from './reactive';
import { track, trigger } from "./effect";

export const enum ReflectFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function isReactive (value) {
  return value?.[ReflectFlags.IS_REACTIVE]

}

export const baseHandler = {
  get (target, key, receiver) {
    if (key === ReflectFlags.IS_REACTIVE) { // 1.这边是为了防止一个代理属性被多次代理
      return true
    }
    // debugger
    // 让当前的key和effect去进行关联
    track(target, key)

    let res = Reflect.get(target, key, receiver)

    // lazy proxy // vue2跟vue3不一样，vue2是上来直接通过递归去做依赖收集
    if (isObject(res)) {
      return reactive(res)
    }

    // 这里可以记录这个属性使用了effect
    return res
  },
  set (target, key, value, receiver) {
    // 数据变化之后，要根据属性找到对应的effect列表然后依次执行
    let oldValue = target[key]
    if (oldValue !== value) {
      let result = Reflect.set(target, key, value, receiver)
      trigger(target, key, value)
      return result
    }
    return
  }
}
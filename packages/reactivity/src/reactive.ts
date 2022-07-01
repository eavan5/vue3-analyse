import { baseHandler, ReflectFlags } from './baseHandler'
import { isObject } from "@vue/shared";
import { track } from "./effect";
// import { activeEffect } from "./effect";

const reactiveMap = new WeakMap() // key必须是对象，弱引用

// const enum ReflectFlags {
//   IS_REACTIVE = '__v_isReactive'
// }

export function reactive (target) {
  if (!isObject(target)) {
    return target
  }

  if (target[ReflectFlags.IS_REACTIVE]) { // 1.这边是为了防止一个代理属性被多次代理，当又被代理的时候返回原本的代理对象
    return target
  }

  const existing = reactiveMap.get(target)
  if (existing) return existing

  const proxy = new Proxy(target, baseHandler)
  reactiveMap.set(target, proxy)
  return proxy
}

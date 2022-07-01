import { isObject } from "@vue/shared";

const reactiveMap = new WeakMap() // key必须是对象，弱引用

const enum ReflectFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive (target) {
  if (!isObject(target)) {
    return target
  }

  if (target[ReflectFlags.IS_REACTIVE]) { // 1.这边是为了防止一个代理属性被多次代理，当又被代理的时候返回原本的代理对象
    return target
  }

  const existing = reactiveMap.get(target)
  if (existing) return existing

  const proxy = new Proxy(target, {
    get (target, key, reactive) {
      if (key === ReflectFlags.IS_REACTIVE) { // 1.这边是为了防止一个代理属性被多次代理
        return true
      }
      // 这里可以记录这个属性使用了effect
      return Reflect.get(target, key, reactive)
    },
    set (target, key, value, reactive) {
      console.log('这里可以通知effect来执行');
      Reflect.set(target, key, value, reactive)
      return true
    }
  })
  reactiveMap.set(target, proxy)
  return proxy
}

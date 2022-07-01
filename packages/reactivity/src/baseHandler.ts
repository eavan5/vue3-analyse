import { track, trigger } from "./effect";

export const enum ReflectFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const baseHandler = {
  get (target, key, reactive) {
    if (key === ReflectFlags.IS_REACTIVE) { // 1.这边是为了防止一个代理属性被多次代理
      return true
    }
    // debugger
    // 让当前的key和effect去进行关联
    track(target, key)

    // 这里可以记录这个属性使用了effect
    return Reflect.get(target, key, reactive)
  },
  set (target, key, value, reactive) {
    // 数据变化之后，要根据属性找到对应的effect列表然后依次执行
    let oldValue = target[key]
    if (oldValue !== value) {
      let result = Reflect.set(target, key, value, reactive)
      trigger(target, key, value)
      return result
    }
    return
  }
}
import { isFunction } from "@vue/shared";
import { activeEffect, ReactiveEffect, trackEffects, triggerEffects } from "./effect";

export function computed (getterOrOptions) {
  let isGetter = isFunction(getterOrOptions)
  let getter, setter
  const fn = () => console.warn('computed is readonly')
  if (isGetter) {
    getter = getterOrOptions
    setter = fn
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set || fn
  }

  return new ComputedRefImpl(getter, setter)

}

class ComputedRefImpl {
  private _value;
  private _dirty = true;
  public effect
  public deps
  private __v_isRef = true
  constructor(getter, public setter) {
    // new ReactiveEffect的时候会执行getter，会让getter对应的依赖项去收集当前的计算属性的effect
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // 通知自己收集的effect去执行
        triggerEffects(this.deps)
      }
    }) // 拿到effect实例让函数执行
  }
  get value () {
    if (activeEffect) {
      // 让计算属性去做依赖收集当前的渲染effect
      trackEffects(this.deps || (this.deps = new Set()))
    }

    if (this._dirty) {  // 只有当dirty为真才会执行
      this._dirty = false
      this._value = this.effect.run() // 当run的时候会让里面的属性effect被计算属性effect给收集，下次触发的时候可以去执行计算属性的effect
    }
    return this._value
  }
  set value (newValues) {
    this.setter(newValues)
  }
}
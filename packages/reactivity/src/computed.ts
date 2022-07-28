import { isFunction } from '@vue/shared'
import { activeEffect, ReactiveEffect, trackEffects, triggerEffects } from './effect'

export function computed(getterOrOptions) {
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
	private _value
	private _dirty = true
	public effect
	public deps
	private __v_isRef = true
	constructor(getter, public setter) {
		// new ReactiveEffect的时候会执行getter，会让getter对应的依赖项去收集当前的计算属性的effect
    this.effect = new ReactiveEffect(getter, () => {
      // 调度器是在该computed里面的依赖项发生变化的时候触发的（会重新走到set）
			if (!this._dirty) {
				this._dirty = true
				// 当有值修改时去触发对应的effect
				triggerEffects(this.deps)
			}
		}) // 拿到effect实例让函数执行
	}
	get value() {
		if (activeEffect) {
			// 让计算属性去做依赖收集当前的渲染effect
			trackEffects(this.deps || (this.deps = new Set()))
		}

		if (this._dirty) {
			// 只有当dirty为真才会执行 当计算属性的值发生变化时会调用上面的调度器，并且把dirty打开，然后重新执行getter获取新的值
			this._dirty = false
			this._value = this.effect.run() // 当run的时候会让里面的属性effect把计算属性的effect给收集，下次触发的时候可以去执行计算属性的effect
		}
		return this._value
	}
	set value(newValues) {
		this.setter(newValues)
	}
}

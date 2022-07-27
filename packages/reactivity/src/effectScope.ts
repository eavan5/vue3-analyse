export let activeEffectScope

/**
 * 
 * @param effect 传入的副作用函数，用来记录effect的成绩包含关系
 */
export function recordEffectScope(effect) {
	if (activeEffectScope && activeEffectScope.active) {
		activeEffectScope.effects.push(effect)
	}
}

// effectScope 收集子的scope
class EffectScope {
	public effects = [] // 存放effect的列表
	public parent
	public active = true
	public scopes = [] // 用来存储作用域
	constructor(detached) {
		if (!detached && activeEffectScope) {
			activeEffectScope.scopes.push(this)
		}
	}
	run(fn) {
		if (this.active) {
			try {
				this.parent = activeEffectScope // 解决嵌套问题
				activeEffectScope = this
				return fn() // 相当于scope.run  相当于里面的函数的返回值
			} finally {
				activeEffectScope = this.parent
			}
		}
	}
	stop() {
		if (this.active) {
			this.active = false
			this.effects.forEach(effect => effect.stop())
		}
		if (this.scopes) {
			this.scopes.forEach(scopeEffect => scopeEffect.stop())
		}
	}
}

export function effectScope(detached = false) {
	return new EffectScope(detached)
}

// 这边又实现了一遍effect， 让effectScope可以记录effect

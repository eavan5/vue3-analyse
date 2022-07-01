
export class ReactiveEffect {
  public active = true
  // constructor(public fn) {
  //   this.fn = fn
  // }
  constructor(public fn) { }  // 等价上面

  run () {
    this.fn()
  }
}

export function effect (fn) {
  // 将用户传递的函数变成响应式的effect
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
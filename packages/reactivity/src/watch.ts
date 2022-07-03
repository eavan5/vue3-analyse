import { isReactive } from "./baseHandler";
import { ReactiveEffect } from "./effect";

export function watch (source, cb) {
  let get
  if (isReactive(source)) { // 判断是否是响应式对象
    // 创建一个effect，让effect收集source的所有属性
    get = () => source

  }
  const job = () => {
    let newValue = effect.run() // 数据变化之后重新调用effect.run函数会获得最新的值
    cb(newValue, oldValue)
  }
  const effect = new ReactiveEffect(get, job)

  // 默认调用run方法会执行get方法，此时source作为第一次的老值
  let oldValue = effect.run()// 默认执行一次,拿到老值

}
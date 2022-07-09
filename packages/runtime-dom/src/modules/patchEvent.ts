
function createInvoker (preValue) {
  const invoker = (e) => { invoker.value(e) }
  invoker.value = preValue // 后续只需要修改value的引用 就可以达到调用不同的逻辑保证自己不变
  return invoker
}

export function patchEvent (el, eventName, nextValue) {
  // click ()=> fn1()   ->  ()=>fn2()  // 因为如果直接卸载事件很消耗性能，所以这个需要保留原本的事件内存地址不变 更改他返回的函数即可
  const invokers = el._vei || (el._vei = {})
  // vue event invoke

  const existingInvoker = invokers[eventName]

  if (existingInvoker && nextValue) { // 进行换绑
    existingInvoker.value = nextValue
  } else {
    // 不存在缓存的情况 addEventListener('click')
    const eName = eventName.slice(2).toLowerCase()
    if (nextValue) {
      const invoker = createInvoker(nextValue) // 默认会将第一次的函数绑定到invoker的函数上
      invokers[eventName] = invoker // 缓存invoker
      el.addEventListener(eName, invoker)
    } else if (existingInvoker) {
      // 没有新的值但是之前绑定过，需要删除老的
      el.removeEventListener(eName, existingInvoker)
      invokers[eventName] = null // 缓存清空
    }
  }
}

export function patchStyle (el, preValue, nextValue) {
  // 对比两个对象
  const style = el.style
  for (const key in nextValue) {
    style[key] = nextValue[key];
  }
  if (preValue) {
    for (const key in preValue) {
      if (nextValue[key] === null) { // 如果老的有 新的没有 则需要删除老的
        style[key] = null
      }
    }
  }
}

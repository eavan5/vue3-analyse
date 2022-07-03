// 给属性打补丁

import { patchAttr } from "./modules/patchAttr"
import { patchClass } from "./modules/patchClass"
import { patchEvent } from "./modules/patchEvent"
import { patchStyle } from "./modules/patchStyle"

// 处理class 
// 行内样式
// 事件
// 其他属性...

export const patchProp = (el, key, preValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
    patchStyle(el, preValue, nextValue)
  } else if (/on[^a-z]/.test(key)) { // onClick onChange
    patchEvent(el, key, nextValue)
  } else {
    //其他
    patchAttr(el, key, nextValue)
  }
}


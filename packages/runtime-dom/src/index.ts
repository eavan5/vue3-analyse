import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

export * from '@vue/runtime-core'

const renderOptions = { patchProp, ...nodeOps }

console.log(renderOptions)

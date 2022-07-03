import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = { patchProp, ...nodeOps }

console.log(renderOptions);

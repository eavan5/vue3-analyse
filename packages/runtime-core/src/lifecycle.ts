import { instance, setCurrentInstance } from "./components"

export const enum LifecycleHook { 
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
  DEACTIVATED = 'da',
  ACTIVATED = 'a',
  ERROR_CAPTURED = 'ec'
}

// 借助函数柯里化，把LifecycleHook的枚举值转换成对应的函数
function createInvoker (type) {
  // currentInstance 就是当前调用onMount 所在的组件的实例 后续instance改变了也不影响currentInstance
  return function (hook,currentInstance = instance) {
    if(currentInstance) {
      const lifeCycles = currentInstance[type] || (currentInstance[type] = [])
      const wrapHook = () => {
        // console.log(currentInstance); // 这里面的instance可以取到 是因为这里面是闭包里面的，但是hook这个回调函数里面是取不到的 ，所以我们再设置一次currentInstance
        // AOP
        setCurrentInstance(currentInstance)
        hook.call(currentInstance)
        setCurrentInstance(null)
      }
      lifeCycles.push(wrapHook)
    }
  }
}


export const onBeforeMount = createInvoker(LifecycleHook.BEFORE_MOUNT)
export const onMounted = createInvoker(LifecycleHook.MOUNTED)
export const onUpdated = createInvoker(LifecycleHook.UPDATED)
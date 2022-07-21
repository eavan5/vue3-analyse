var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragment: () => Fragment,
    LifecycleHook: () => LifecycleHook,
    ReactiveEffect: () => ReactiveEffect,
    ShapeFlags: () => ShapeFlags,
    Text: () => Text,
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    effect: () => effect,
    getCurrentInstance: () => getCurrentInstance,
    h: () => h,
    inject: () => inject,
    isSameVNode: () => isSameVNode,
    isVNode: () => isVNode,
    onBeforeMount: () => onBeforeMount,
    onMounted: () => onMounted,
    onUpdated: () => onUpdated,
    provide: () => provide,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    ref: () => ref,
    render: () => render,
    setCurrentInstance: () => setCurrentInstance,
    toReactive: () => toReactive,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/shared/src/index.ts
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  var isFunction = (value) => typeof value === "function";
  var isString = (value) => typeof value === "string";
  var isArray = Array.isArray;
  var isNumber = (value) => typeof value === "number";
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (obj, key) => hasOwnProperty.call(obj, key);
  function invokerFns(fns) {
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }
  }

  // packages/runtime-core/src/createVNode.ts
  var Text = Symbol("Text");
  var Fragment = Symbol("Fragment");
  function isVNode(val) {
    return !!(val == null ? void 0 : val.__v_isVNode);
  }
  function isSameVNode(v1, v2) {
    return v1.type === v2.type && v1.key === v2.key;
  }
  function createVNode(type, props = null, children = null) {
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
    const vnode = {
      __v_isVNode: true,
      type,
      props,
      children,
      key: props && props.key,
      el: null,
      shapeFlag
    };
    if (children !== void 0) {
      let temp = 0;
      if (isArray(children)) {
        temp = ShapeFlags.ARRAY_CHILDREN;
      } else if (isObject(children)) {
        temp = ShapeFlags.SLOTS_CHILDREN;
      } else {
        children = String(children);
        temp = ShapeFlags.TEXT_CHILDREN;
      }
      vnode.shapeFlag = temp | shapeFlag;
    }
    return vnode;
  }
  var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
    ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags2[ShapeFlags2["FUNCTIONAL_COMPONENT"] = 2] = "FUNCTIONAL_COMPONENT";
    ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags2[ShapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
    ShapeFlags2[ShapeFlags2["TELEPORT"] = 64] = "TELEPORT";
    ShapeFlags2[ShapeFlags2["SUSPENSE"] = 128] = "SUSPENSE";
    ShapeFlags2[ShapeFlags2["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT_KEPT_ALIVE"] = 512] = "COMPONENT_KEPT_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT"] = 6] = "COMPONENT";
    return ShapeFlags2;
  })(ShapeFlags || {});

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function clearEffect(effect2) {
    const { deps } = effect2;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        return this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          clearEffect(this);
          return this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = null;
        }
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        clearEffect(this);
      }
    }
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    triggerEffects(effects);
  }
  function triggerEffects(effects) {
    if (effects) {
      effects = new Set(effects);
      effects && effects.forEach((effect2) => {
        if (effect2 !== activeEffect) {
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      });
    }
  }
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffects(deps);
    }
  }
  function trackEffects(deps) {
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack && activeEffect) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }

  // packages/reactivity/src/baseHandler.ts
  function isReactive(value) {
    return value["__v_isReactive" /* IS_REACTIVE */];
  }
  var baseHandler = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, key);
      let res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue !== value) {
        let result = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return result;
      }
      return value;
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing)
      return existing;
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/computed.ts
  function computed(getterOrOptions) {
    let isGetter = isFunction(getterOrOptions);
    let getter, setter;
    const fn = () => console.warn("computed is readonly");
    if (isGetter) {
      getter = getterOrOptions;
      setter = fn;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set || fn;
    }
    return new ComputedRefImpl(getter, setter);
  }
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this._dirty = true;
      this.__v_isRef = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this.deps);
        }
      });
    }
    get value() {
      if (activeEffect) {
        trackEffects(this.deps || (this.deps = /* @__PURE__ */ new Set()));
      }
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(newValues) {
      this.setter(newValues);
    }
  };

  // packages/reactivity/src/watch.ts
  function watch(getter, cb) {
    if (isReactive(getter)) {
      getter = () => getter;
    }
    let oldValue;
    const job = () => {
      let newValue = effect2.run();
      cb(newValue, oldValue);
      oldValue = newValue;
    };
    const effect2 = new ReactiveEffect(getter, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function ref(value) {
    return new RefImpl(value);
  }
  function toRefs(object) {
    const res = {};
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        res[key] = toRef(object, key);
      }
    }
    return res;
  }
  function toRef(object, key) {
    return new ObjectRefImpl(object, key);
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, receiver) {
        let r = Reflect.get(target, key, receiver);
        return r.__v_isRef ? r.value : r;
      },
      set(target, key, value, receiver) {
        if (target[key].__v_isRef) {
          target[key].value = value;
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      }
    });
  }
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }
  var ObjectRefImpl = class {
    constructor(object, key) {
      this.object = object;
      this.key = key;
      this.__v_isRef = true;
    }
    get value() {
      return this.object[this.key];
    }
    set value(newValue) {
      this.object[this.key] = newValue;
    }
  };
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this.__v_isRef = true;
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffects(this.dep || (this.dep = /* @__PURE__ */ new Set()));
      return this._value;
    }
    set value(newValue) {
      if (newValue !== this.rawValue) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
        triggerEffects(this.dep);
      }
    }
  };

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-core/src/components.ts
  var instance = null;
  var getCurrentInstance = () => instance;
  var setCurrentInstance = (i) => instance = i;
  function createComponentInstance(vnode, parent) {
    instance = {
      data: null,
      vnode,
      subTree: null,
      isMounted: false,
      update: null,
      render: null,
      propsOptions: vnode.type.props || {},
      props: {},
      attrs: {},
      proxy: null,
      setupState: {},
      slots: {},
      exposed: {},
      parent,
      provides: parent ? parent.provides : /* @__PURE__ */ Object.create(null)
    };
    return instance;
  }
  function initProps(instance2, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance2.propsOptions;
    if (rawProps) {
      for (const key in rawProps) {
        const value = rawProps[key];
        if (key in options) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance2.props = reactive(props);
    instance2.attrs = attrs;
  }
  var publicProperties = {
    $attrs: (instance2) => instance2.attrs,
    $slots: (instance2) => instance2.slots
  };
  var instanceProxy = {
    get(target, key, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      }
      let getter = publicProperties[key];
      if (getter) {
        return getter(target);
      }
    },
    set(target, key, value, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn(`Attempting to set prop '${key}' to '${value}' on a Vue instance that is not a Vue component.`);
        return false;
      }
      return true;
    }
  };
  function initSlots(instance2, children) {
    if (instance2.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
      instance2.slots = children;
    }
  }
  function setupComponent(instance2) {
    let { type, props, children } = instance2.vnode;
    let { data, render: render2, setup } = type;
    initProps(instance2, props);
    initSlots(instance2, children);
    instance2.proxy = new Proxy(instance2, instanceProxy);
    if (data) {
      if (!isFunction(data)) {
        return console.warn("this data is not a function");
      }
      instance2.data = reactive(data.call({}));
    }
    if (setup) {
      const context = {
        emit(eventName, ...args) {
          const name = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
          let invoker = instance2.vnode.props[name];
          invoker && invoker(...args);
        },
        attrs: instance2.attrs,
        slots: instance2.slots,
        expose: (exposed) => {
          instance2.exposed = exposed;
        }
      };
      setCurrentInstance(instance2);
      const setupResult = setup(instance2.props, context);
      setCurrentInstance(null);
      if (isFunction(setupResult)) {
        instance2.render = setupResult;
      } else if (isObject(setupResult)) {
        instance2.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance2.render) {
      if (render2) {
        instance2.render = render2;
      } else {
      }
    }
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var isFlushing = false;
  var resolvePromise = Promise.resolve();
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlushing) {
      isFlushing = true;
      resolvePromise.then(() => {
        isFlushing = false;
        const copyQueue = queue.slice();
        queue.length = 0;
        for (let i = 0; i < copyQueue.length; i++) {
          let job2 = copyQueue[i];
          job2();
        }
        copyQueue.length = 0;
      });
    }
  }

  // packages/runtime-core/src/renderer.ts
  function getSequence(arr) {
    let len = arr.length;
    let result = [0];
    const p = Array(len).fill(0);
    let lastIndex;
    let start, end, middle;
    for (let i2 = 0; i2 < len; i2++) {
      const arrI = arr[i2];
      if (arrI !== 0) {
        lastIndex = result.at(-1);
        if (arr[lastIndex] < arrI) {
          p[i2] = lastIndex;
          result.push(i2);
          continue;
        }
        start = 0;
        end = result.length - 1;
        while (start < end) {
          middle = Math.floor((start + end) / 2);
          if (arr[result[middle]] < arrI) {
            start = middle + 1;
          } else {
            end = middle;
          }
        }
        if (arrI < arr[result[end]]) {
          p[i2] = result[end - 1];
          result[end] = i2;
        }
      }
    }
    console.log(p);
    let i = result.length;
    let last = result[i - 1];
    while (i--) {
      result[i] = last;
      last = p[last];
    }
    return result;
  }
  function createRenderer(options) {
    let {
      createElement: hostCreateElement,
      createTextNode: hostCreateTextNode,
      insert: hostInsert,
      remove: hostRemove,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setText: hostSetText,
      setElementText: hostSetElementText,
      patchProp: hostPatchProp
    } = options;
    function normalizeVNode(children, i) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVNode(Text, null, children[i]);
      }
      return children[i];
    }
    function mountChildren(children, container, parent) {
      for (let i = 0; i < children.length; i++) {
        let child = normalizeVNode(children, i);
        patch(null, child, container, parent);
      }
    }
    function patchProps(oldProps, newProps, el) {
      oldProps = oldProps || {};
      newProps = newProps || {};
      for (let key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (newProps[key] == null) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
    function mountElement(vnode, container, anchor, parent) {
      let { type, props, children, shapeFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        patchProps(null, props, el);
      }
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      }
      if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el, parent);
      }
      hostInsert(el, container, anchor);
    }
    function ProcessText(n1, n2, container) {
      if (n1 === null) {
        hostInsert(n2.el = hostCreateTextNode(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    }
    function unmountChildren(children) {
      children.forEach((child) => {
        unmount(child);
      });
    }
    function patchKeyedChildren(c1, c2, el) {
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = c2.length - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          while (i <= e2) {
            const nextPos = e2 + 1;
            let anchor = c2.length <= nextPos ? null : c2[nextPos].el;
            patch(null, c2[i], el, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            unmount(c1[i]);
            i++;
          }
        }
      } else {
        let s1 = i;
        let s2 = i;
        let toBePatched = e2 - s2 + 1;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (let i2 = 0; i2 <= e2; i2++) {
          keyToNewIndexMap.set(c2[i2].key, i2);
        }
        const seq = new Array(toBePatched).fill(0);
        for (let i2 = s1; i2 <= e1; i2++) {
          const oldVnode = c1[i2];
          const newIndex = keyToNewIndexMap.get(oldVnode.key);
          if (newIndex == null) {
            unmount(oldVnode);
          } else {
            seq[newIndex - s2] = i2 + 1;
            patch(oldVnode, c2[newIndex], el);
          }
        }
        let increase = getSequence(seq);
        console.log(increase);
        let j = increase.length - 1;
        for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
          const currentIndex = s2 + i2;
          const child = c2[currentIndex];
          const anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
          if (seq[i2] === 0) {
            patch(null, child, el, anchor);
          } else {
            if (i2 !== increase[j]) {
              hostInsert(child.el, el, anchor);
            } else {
              j--;
            }
          }
        }
      }
    }
    function patchChildren(n1, n2, el, parent) {
      let c1 = n1.children;
      let c2 = n2.children;
      const prevShapeFlag = n1.shapeFlag;
      const nextShapeFlag = n2.shapeFlag;
      if (nextShapeFlag & 8 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          if (nextShapeFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(c1, c2, el);
          } else {
            unmountChildren(c1);
          }
        } else {
          if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (nextShapeFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el, null);
          }
        }
      }
    }
    function patchElement(n1, n2, parent) {
      let el = n2.el = n1.el;
      let oldProps = n1.props;
      let newProps = n2.props;
      patchProps(oldProps, newProps, el);
      patchChildren(n1, n2, el, parent);
    }
    function processElement(n1, n2, container, anchor, parent) {
      if (n1 === null) {
        mountElement(n2, container, anchor, parent);
      } else {
        patchElement(n1, n2, parent);
      }
    }
    function updateComponentPreRender(instance2, next) {
      instance2.next = null;
      instance2.vnode = next;
      updateProps(instance2, next, next.props);
    }
    function ProcessFragment(n1, n2, container, parent) {
      if (n1 === null) {
        mountChildren(n2.children, container, parent);
      } else {
        patchChildren(n1, n2, container, parent);
      }
    }
    function setupRenderEffect(instance2, container, anchor) {
      const componentUpdate = () => {
        if (!instance2.isUnmounted) {
          let { render: render3, data } = instance2;
          if (!instance2.isMounted) {
            const { bm, m } = instance2;
            if (bm) {
              invokerFns(bm);
            }
            const subTree = render3.call(instance2.proxy);
            patch(null, subTree, container, anchor, instance2);
            instance2.subTree = subTree;
            if (m) {
              invokerFns(m);
            }
            instance2.isMounted = true;
          } else {
            const { u } = instance2;
            let next = instance2.next;
            if (next) {
              updateComponentPreRender(instance2, next);
            }
            const subTree = render3.call(instance2.proxy);
            patch(instance2.subTree, subTree, container, anchor, instance2);
            if (u) {
              invokerFns(u);
            }
            instance2.subTree = subTree;
          }
        }
      };
      const effect2 = new ReactiveEffect(componentUpdate, () => queueJob(instance2.update));
      let update = instance2.update = effect2.run.bind(effect2);
      update();
    }
    function mountComponent(vnode, container, anchor, parent) {
      const instance2 = vnode.component = createComponentInstance(vnode, parent);
      setupComponent(instance2);
      setupRenderEffect(instance2, container, anchor);
    }
    function hasChange(prevProps, nextProps) {
      for (let key in prevProps) {
        if (nextProps[key] !== prevProps[key]) {
          return true;
        }
      }
      return false;
    }
    function updateProps(instance2, prevProps, nextProps) {
      for (let key in nextProps) {
        instance2.props[key] = nextProps[key];
      }
      for (let key in instance2.props) {
        if (!(key in nextProps)) {
          delete instance2.props[key];
        }
      }
    }
    function shouldComponentUpdate(n1, n2) {
      const prevProps = n1.props;
      const nextProps = n2.props;
      return hasChange(prevProps, nextProps);
    }
    function updateComponent(n1, n2) {
      const instance2 = n2.component = n1.component;
      if (shouldComponentUpdate(n1, n2)) {
        instance2.next = n2;
        instance2.update();
      }
    }
    function processComponent(n1, n2, container, anchor, parent) {
      if (n1 === null) {
        mountComponent(n2, container, anchor, parent);
      } else {
        updateComponent(n1, n2);
      }
    }
    function unmount(vnode) {
      if (vnode === Fragment) {
        return unmountChildren(vnode.children);
      }
      hostRemove(vnode.el);
    }
    function patch(n1, n2, container, anchor = null, parent = null) {
      if (n1 && !isSameVNode(n1, n2)) {
        unmount(n1);
        n1 = null;
      }
      const { type, shapeFlag } = n2;
      switch (type) {
        case Text:
          ProcessText(n1, n2, container);
          break;
        case Fragment:
          ProcessFragment(n1, n2, container, parent);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor, parent);
            break;
          } else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
            processComponent(n1, n2, container, anchor, parent);
          }
      }
    }
    function render2(vnode, container) {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    }
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/lifecycle.ts
  var LifecycleHook = /* @__PURE__ */ ((LifecycleHook2) => {
    LifecycleHook2["BEFORE_CREATE"] = "bc";
    LifecycleHook2["CREATED"] = "c";
    LifecycleHook2["BEFORE_MOUNT"] = "bm";
    LifecycleHook2["MOUNTED"] = "m";
    LifecycleHook2["BEFORE_UPDATE"] = "bu";
    LifecycleHook2["UPDATED"] = "u";
    LifecycleHook2["BEFORE_UNMOUNT"] = "bum";
    LifecycleHook2["UNMOUNTED"] = "um";
    LifecycleHook2["DEACTIVATED"] = "da";
    LifecycleHook2["ACTIVATED"] = "a";
    LifecycleHook2["ERROR_CAPTURED"] = "ec";
    return LifecycleHook2;
  })(LifecycleHook || {});
  function createInvoker(type) {
    return function(hook, currentInstance = instance) {
      if (currentInstance) {
        const lifeCycles = currentInstance[type] || (currentInstance[type] = []);
        const wrapHook = () => {
          setCurrentInstance(currentInstance);
          hook.call(currentInstance);
          setCurrentInstance(null);
        };
        lifeCycles.push(wrapHook);
      }
    };
  }
  var onBeforeMount = createInvoker("bm" /* BEFORE_MOUNT */);
  var onMounted = createInvoker("m" /* MOUNTED */);
  var onUpdated = createInvoker("u" /* UPDATED */);

  // packages/runtime-core/src/apiInject.ts
  function provide(key, value) {
    if (!instance)
      return;
    let parentProvides = instance.parent && instance.parent.provide;
    let currentProvides = instance.provides;
    if (currentProvides === parentProvides) {
      currentProvides = instance.provides = Object.create(parentProvides);
    }
    currentProvides[key] = value;
  }
  function inject(key, defaultValue) {
    if (!instance)
      return;
    const provides = instance.parent && instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else {
      return defaultValue;
    }
  }

  // packages/runtime-dom/src/modules/patchAttr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }

  // packages/runtime-dom/src/modules/patchClass.ts
  function patchClass(el, nextValue) {
    if (nextValue === "null") {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/patchEvent.ts
  function createInvoker2(preValue) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = preValue;
    return invoker;
  }
  function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[eventName];
    if (existingInvoker && nextValue) {
      existingInvoker.value = nextValue;
    } else {
      const eName = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = createInvoker2(nextValue);
        invokers[eventName] = invoker;
        el.addEventListener(eName, invoker);
      } else if (existingInvoker) {
        el.removeEventListener(eName, existingInvoker);
        invokers[eventName] = null;
      }
    }
  }

  // packages/runtime-dom/src/modules/patchStyle.ts
  function patchStyle(el, preValue, nextValue) {
    if (preValue == null)
      preValue = {};
    if (nextValue == null)
      nextValue = {};
    const style = el.style;
    for (const key in nextValue) {
      style[key] = nextValue[key];
    }
    if (preValue) {
      for (const key in preValue) {
        if (nextValue[key] === null) {
          style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    insert(element, container, anchor = null) {
      container.insertBefore(element, anchor);
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    querySelector(selectors) {
      return document.querySelector(selectors);
    },
    parentNode(child) {
      return child.parentNode;
    },
    nextSibling(child) {
      return child.nextSibling;
    },
    setText(element, text) {
      element.nodeValue = text;
    },
    setElementText(element, text) {
      element.textContent = text;
    },
    patchProp
  };

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadValues({ patchProp }, nodeOps);
  function render(vnode, container) {
    let { render: render2 } = createRenderer(renderOptions);
    return render2(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map

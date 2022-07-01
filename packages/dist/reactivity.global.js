var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
    }
    run() {
      this.fn();
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }

  // packages/shared/src/index.ts
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }

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
    const proxy = new Proxy(target, {
      get(target2, key, reactive2) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        return Reflect.get(target2, key, reactive2);
      },
      set(target2, key, value, reactive2) {
        console.log("\u8FD9\u91CC\u53EF\u4EE5\u901A\u77E5effect\u6765\u6267\u884C");
        Reflect.set(target2, key, value, reactive2);
        return true;
      }
    });
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map

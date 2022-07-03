var VueRuntimeDom = (() => {
  var __defProp = Object.defineProperty;
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
    }
  };

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
  function createInvoker(preValue) {
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
      const eName = eventName.slice(2).toLowCase();
      if (nextValue) {
        const invoker = createInvoker(nextValue);
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

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadValues({ patchProp }, nodeOps);
  console.log(renderOptions);
})();
//# sourceMappingURL=runtime-dom.global.js.map

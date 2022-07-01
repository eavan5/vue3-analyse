(() => {
  // packages/shared/src/index.ts
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }

  // packages/reactivity/src/index.ts
  console.log(isObject(11));
})();
//# sourceMappingURL=reactivity.global.js.map

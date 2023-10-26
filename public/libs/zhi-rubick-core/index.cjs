"use strict";

// ../zhi-lib-base/dist/index.js
var w = (n, $, p) => {
  const s = $ ?? "zhi", i = (t) => {
    const e = t.getFullYear(), o = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0"), S = String(t.getHours()).padStart(2, "0"), u = String(t.getMinutes()).padStart(2, "0"), d = String(t.getSeconds()).padStart(2, "0");
    return `${e}-${o}-${r} ${S}:${u}:${d}`;
  }, c = (t, e) => {
    const o = i(/* @__PURE__ */ new Date()), r = typeof e == "boolean" ? String(e) : e;
    r ? console.log(`[${s}] [${o}] [DEBUG] [${n}] ${t}`, r) : console.log(`[${s}] [${o}] [DEBUG] [${n}] ${t}`);
  }, l = (t, e) => {
    const o = i(/* @__PURE__ */ new Date()), r = typeof e == "boolean" ? String(e) : e;
    r ? console.info(`[${s}] [${o}] [INFO] [${n}] ${t}`, r) : console.info(`[${s}] [${o}] [INFO] [${n}] ${t}`);
  }, f = (t, e) => {
    const o = i(/* @__PURE__ */ new Date()), r = typeof e == "boolean" ? String(e) : e;
    r ? console.warn(`[${s}] [${o}] [WARN] [${n}] ${t}`, r) : console.warn(`[${s}] [${o}] [WARN] [${n}] ${t}`);
  }, g = (t, e) => {
    const o = i(/* @__PURE__ */ new Date());
    e ? console.error(`[${s}] [${o}] [ERROR] [${n}] ${t.toString()}`, e) : console.error(`[${s}] [${o}] [ERROR] [${n}] ${t.toString()}`);
  };
  return {
    debug: (t, e) => {
      p && (e ? c(t, e) : c(t));
    },
    info: (t, e) => {
      e ? l(t, e) : l(t);
    },
    warn: (t, e) => {
      e ? f(t, e) : f(t);
    },
    error: (t, e) => {
      e ? g(t, e) : g(t);
    }
  };
};

// src/index.ts
var logger = w("zi-rubick-core", "zhi", false);
var main = async (args) => {
  return "ok";
};
(async () => {
  const result = await main([]);
  console.log(result);
})();

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // dist/js/vendors.9e84cbaa.js
  function l(e5, t3) {
    for (var n4 = 0; n4 < t3.length; n4++) {
      const r4 = t3[n4];
      if ("string" !== typeof r4 && !Array.isArray(r4)) {
        for (const t4 in r4) if ("default" !== t4 && !(t4 in e5)) {
          const n5 = Object.getOwnPropertyDescriptor(r4, t4);
          n5 && Object.defineProperty(e5, t4, n5.get ? n5 : { enumerable: true, get: () => r4[t4] });
        }
      }
    }
    return Object.freeze(Object.defineProperty(e5, Symbol.toStringTag, { value: "Module" }));
  }
  function y(e5) {
    return `'${e5}'`;
  }
  function _(e5) {
    return "undefined" === typeof e5;
  }
  function C(e5) {
    return null !== e5 && "object" === typeof e5;
  }
  function P(e5) {
    return "function" === typeof e5;
  }
  function R(e5, t3) {
    return { type: e5, initial: t3 || null };
  }
  function I(e5, t3) {
    if (!e5) throw new Error(t3);
  }
  function ae(e5, t3, n4, r4) {
    function a4(e6) {
      return e6 instanceof n4 ? e6 : new n4(function(t4) {
        t4(e6);
      });
    }
    return new (n4 || (n4 = Promise))(function(n5, o3) {
      function i4(e6) {
        try {
          s4(r4.next(e6));
        } catch (t4) {
          o3(t4);
        }
      }
      function l4(e6) {
        try {
          s4(r4["throw"](e6));
        } catch (t4) {
          o3(t4);
        }
      }
      function s4(e6) {
        e6.done ? n5(e6.value) : a4(e6.value).then(i4, l4);
      }
      s4((r4 = r4.apply(e5, t3 || [])).next());
    });
  }
  function oe(e5, t3, n4, r4) {
    if ("a" === n4 && !r4) throw new TypeError("Private accessor was defined without a getter");
    if ("function" === typeof t3 ? e5 !== t3 || !r4 : !t3.has(e5)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return "m" === n4 ? r4 : "a" === n4 ? r4.call(e5) : r4 ? r4.value : t3.get(e5);
  }
  function ge(e5, t3) {
    var n4;
    while (e5 = (null === e5 || void 0 === e5 ? void 0 : e5.parentElement) || null) {
      if (!e5 || e5.nodeName === j || "root-portal" === e5.nodeName) return false;
      if (null === (n4 = e5.__handlers[t3]) || void 0 === n4 ? void 0 : n4.length) return true;
    }
    return false;
  }
  function ye(e5, t3) {
    if ("string" === typeof e5) return new ve(e5, { bubbles: true, cancelable: true });
    const n4 = new ve(e5.type, { bubbles: true, cancelable: true }, e5);
    for (const r4 in e5) r4 !== W && r4 !== H && r4 !== V && r4 !== q && (n4[r4] = e5[r4]);
    return n4.type === Q && (null === t3 || void 0 === t3 ? void 0 : t3.nodeName) === U && (n4[Y] = 13), n4;
  }
  function we(e5) {
    const t3 = e5[ee];
    return _(t3) || delete e5[ee], t3;
  }
  function Se(e5) {
    var t3, n4;
    void 0 === e5.type && Object.defineProperty(e5, "type", { value: e5._type }), void 0 === e5.detail && Object.defineProperty(e5, "detail", { value: e5._detail || Object.assign({}, e5) }), e5.currentTarget = e5.currentTarget || e5.target || Object.assign({}, e5), M.call("modifyMpEventImpl", e5);
    const r4 = e5.currentTarget, a4 = (null === (t3 = r4.dataset) || void 0 === t3 ? void 0 : t3.sid) || r4.id || (null === (n4 = e5.detail) || void 0 === n4 ? void 0 : n4.id) || "", o3 = re.document.getElementById(a4);
    if (o3) {
      const t4 = () => {
        const t5 = ye(e5, o3);
        M.call("modifyTaroEvent", t5, o3), M.call("dispatchTaroEvent", t5, o3), M.call("dispatchTaroEventFinish", t5, o3);
      };
      if (!M.isExist("batchedEventUpdates")) return t4(), we(e5);
      {
        const n5 = e5.type;
        if (!M.call("isBubbleEvents", n5) || !ge(o3, n5) || n5 === G && o3.props.catchMove) return M.call("batchedEventUpdates", () => {
          be[n5] && (be[n5].forEach((e6) => e6()), delete be[n5]), t4();
        }), we(e5);
        (be[n5] || (be[n5] = [])).push(t4);
      }
    }
  }
  function ke(e5, t3 = 250, n4) {
    let r4;
    return function(...a4) {
      const o3 = n4 || this;
      clearTimeout(r4), r4 = setTimeout(function() {
        e5.apply(o3, a4);
      }, t3);
    };
  }
  function Ie(e5, t3) {
    M.call("mergePageInstance", Me.get(t3), e5), Me.set(t3, e5);
  }
  function De(e5) {
    return Me.get(e5);
  }
  function Fe(e5, t3, ...n4) {
    const r4 = Me.get(e5);
    if (null == r4) return;
    const a4 = M.call("getLifecycle", r4, t3);
    if (T(a4)) {
      const e6 = a4.map((e7) => e7.apply(r4, n4));
      return e6[0];
    }
    return P(a4) ? a4.apply(r4, n4) : void 0;
  }
  function Ae(e5) {
    if (null == e5) return "";
    const t3 = Object.keys(e5).map((t4) => t4 + "=" + e5[t4]).join("&");
    return "" === t3 ? t3 : "?" + t3;
  }
  function je(e5, t3) {
    const n4 = e5.indexOf("?");
    return `${n4 > -1 ? e5.substring(0, n4) : e5}${Ae((null === t3 || void 0 === t3 ? void 0 : t3.stamp) ? { stamp: t3.stamp } : {})}`;
  }
  function Be(e5) {
    return e5 + "." + X;
  }
  function Ue(e5) {
    return e5 + "." + Z;
  }
  function He(e5) {
    return e5 + "." + J;
  }
  function We(e5, t3, n4, r4) {
    const a4 = null !== t3 && void 0 !== t3 ? t3 : `taro_page_${ze()}`, [o3, i4, l4, s4, u3, c4, d3] = M.call("getMiniLifecycleImpl").page;
    let f3, p4, h4 = null, g4 = false, m4 = [];
    function v3(e6) {
      const t4 = e6.$taroPath;
      ie.router = { params: e6.$taroParams, path: Pe(t4), $taroPath: e6.$taroPath, onReady: Be(a4), onShow: Ue(a4), onHide: He(a4) }, _(e6.exitState) || (ie.router.exitState = e6.exitState);
    }
    const y3 = { [o3](t4 = {}, n5) {
      p4 = new Promise((e6) => {
        f3 = e6;
      }), _e.start(A), ie.page = this, this.config = r4 || {};
      const o4 = Object.assign({}, t4, { $taroTimestamp: Date.now() }), i5 = this.$taroPath = je(a4, o4);
      y3.path = i5, null == this.$taroParams && (this.$taroParams = o4), v3(this);
      const l5 = () => {
        ie.app.mount(e5, i5, () => {
          h4 = re.document.getElementById(i5), I(null !== h4, "\u6CA1\u6709\u627E\u5230\u9875\u9762\u5B9E\u4F8B\u3002"), Fe(i5, K, this.$taroParams), f3(), P(n5) && n5();
        });
      };
      g4 ? m4.push(l5) : l5();
    }, [i4]() {
      const e6 = this.$taroPath;
      Fe(e6, i4), g4 = true, ie.app.unmount(e6, () => {
        g4 = false, Me.delete(e6), h4 && (h4.ctx = null, h4 = null), m4.length && (m4.forEach((e7) => e7()), m4 = []);
      });
    }, [l4]() {
      p4.then(() => {
        Fe(this.$taroPath, X), de(() => ne.trigger(Be(a4))), this.onReady.called = true;
      });
    }, [s4](e6 = {}) {
      p4.then(() => {
        ie.page = this, v3(this), Fe(this.$taroPath, Z, e6), de(() => ne.trigger(Ue(a4)));
      });
    }, [u3]() {
      ie.page === this && (ie.page = null, ie.router = null), Fe(this.$taroPath, J), ne.trigger(He(a4));
    }, getOpenerEventChannel: () => $.pageChannel };
    return c4.forEach((e6) => {
      let t4 = false, n5 = false;
      e6 = e6.replace(/^defer:/, () => (t4 = true, "")), e6 = e6.replace(/^events:/, () => (n5 = true, "")), y3[e6] = function() {
        const n6 = () => Fe(this.$taroPath, e6, ...arguments);
        if (!t4) return n6();
        p4.then(n6);
      };
    }), d3.forEach((t4) => {
      var n5;
      (e5[t4] || (null === (n5 = e5.prototype) || void 0 === n5 ? void 0 : n5[t4]) || e5[t4.replace(/^on/, "enable")] || (null === r4 || void 0 === r4 ? void 0 : r4[t4.replace(/^on/, "enable")])) && (y3[t4] = function(...e6) {
        var n6;
        const r5 = null === (n6 = e6[0]) || void 0 === n6 ? void 0 : n6.target;
        if (null === r5 || void 0 === r5 ? void 0 : r5.id) {
          const e7 = r5.id, t5 = re.document.getElementById(e7);
          t5 && (r5.dataset = t5.dataset);
        }
        return Fe(this.$taroPath, t4, ...e6);
      });
    }), y3.eh = Se, _(n4) || (y3.data = n4), M.call("modifyPageObject", y3), y3;
  }
  function Ge(e5, t3) {
    var n4;
    const r4 = t3.prototype;
    return !(null === (n4 = t3.displayName) || void 0 === n4 ? void 0 : n4.includes("Connect")) && (P(t3.render) || !!(null === r4 || void 0 === r4 ? void 0 : r4.isReactComponent) || r4 instanceof e5.Component);
  }
  function Ke(e5) {
    return T(e5) ? e5 : e5 ? [e5] : [];
  }
  function Xe(e5) {
    return e5.writable = true, e5.enumerable = true, e5;
  }
  function Ze(e5) {
    ie.router = Object.assign({ params: null === e5 || void 0 === e5 ? void 0 : e5.query }, e5);
  }
  function Tt(e5) {
    M.tap("getLifecycle", function(e6, t3) {
      return t3 = t3.replace(/^on(Show|Hide)$/, "componentDid$1"), e6[t3];
    }), M.tap("modifyMpEvent", function(e6) {
      Object.defineProperty(e6, "type", { value: e6.type.replace(/-/g, "") });
    }), M.tap("batchedEventUpdates", function(t3) {
      null === e5 || void 0 === e5 || e5.unstable_batchedUpdates(t3);
    }), M.tap("mergePageInstance", function(e6, t3) {
      e6 && t3 && ("constructor" in e6 || Object.keys(e6).forEach((n4) => {
        const r4 = e6[n4], a4 = Ke(t3[n4]);
        t3[n4] = a4.concat(r4);
      }));
    }), M.tap("createPullDownComponent", (e6, t3, n4, r4) => {
      const a4 = Ge(n4, e6);
      return n4.forwardRef((t4, n5) => {
        const o3 = Object.assign({}, t4), i4 = a4 ? { ref: n5 } : { forwardedRef: n5, reactReduxForwardedRef: n5 };
        return $t(r4 || "taro-pull-to-refresh-core", null, $t(e6, Object.assign(Object.assign({}, o3), i4)));
      });
    }), M.tap("getDOMNode", (e6) => {
      if (!e6) return Ce;
      if (e6 instanceof HTMLElement) return e6;
      if (e6.$taroPath) {
        const t3 = Ce.getElementById(e6.$taroPath);
        return null !== t3 && void 0 !== t3 ? t3 : Ce;
      }
    });
  }
  function Nt(e5, t3) {
    return (n4) => {
      const r4 = Ge(e5, n4), a4 = (e6) => e6 && Ie(e6, t3), o3 = r4 ? { ref: a4 } : { forwardedRef: a4, reactReduxForwardedRef: a4 };
      return qe.PageContext === z && (qe.PageContext = e5.createContext("")), class extends e5.Component {
        constructor() {
          super(...arguments), this.state = { hasError: false };
        }
        static getDerivedStateFromError(e6) {
          var t4, n5;
          return null === (n5 = null === (t4 = ie.app) || void 0 === t4 ? void 0 : t4.onError) || void 0 === n5 || n5.call(t4, e6.message + e6.stack), { hasError: true };
        }
        componentDidCatch(e6, t4) {
        }
        render() {
          const e6 = this.state.hasError ? [] : $t(qe.PageContext.Provider, { value: t3 }, $t(n4, Object.assign(Object.assign({}, this.props), o3)));
          return $t("div", { id: t3, className: "taro_page" }, e6);
        }
      };
    };
  }
  function Lt(e5, t3, n4, r4) {
    qe.R = t3, $t = t3.createElement, _t = n4, Ct = t3.Fragment;
    const a4 = t3.createRef(), o3 = Ge(t3, e5);
    let i4, l4;
    const s4 = new Promise((e6) => l4 = e6);
    function u3() {
      return a4.current;
    }
    function c4(e6) {
      s4.then(() => e6());
    }
    function d3() {
      var e6, n5;
      const a5 = (null === r4 || void 0 === r4 ? void 0 : r4.appId) || "app";
      let o4 = Ce.getElementById(a5);
      if (null == o4) {
        const e7 = Ce.getElementById(B);
        o4 = Ce.createElement(a5), o4.id = a5, null === e7 || void 0 === e7 || e7.appendChild(o4);
      }
      if ((t3.version || "").startsWith("18")) {
        const t4 = _t.createRoot(o4);
        null === (e6 = t4.render) || void 0 === e6 || e6.call(t4, $t(f3));
      } else null === (n5 = _t.render) || void 0 === n5 || n5.call(_t, $t(f3), o4);
    }
    Tt(_t);
    class f3 extends t3.Component {
      constructor(e6) {
        super(e6), this.pages = [], this.elements = [], i4 = this, l4(this);
      }
      mount(e6, n5, r5) {
        const a5 = Nt(t3, n5)(e6), o4 = n5 + Pt(), i5 = () => $t(a5, { key: o4, tid: n5 });
        this.pages.push(i5), this.forceUpdate((...e7) => (_e.stop(A), r5(...e7)));
      }
      unmount(e6, t4) {
        const n5 = this.elements, r5 = n5.findIndex((t5) => t5.props.tid === e6);
        n5.splice(r5, 1), this.forceUpdate(t4);
      }
      render() {
        const { pages: t4, elements: n5 } = this;
        while (t4.length > 0) {
          const e6 = t4.pop();
          n5.push(e6());
        }
        let r5 = null;
        return o3 && (r5 = { ref: a4 }), $t(e5, r5, $t(null !== Ct && void 0 !== Ct ? Ct : "div", null, n5.slice()));
      }
    }
    const [p4, h4, g4] = M.call("getMiniLifecycleImpl").app, m4 = Object.create({ render(e6) {
      i4.forceUpdate(e6);
    }, mount(e6, t4, n5) {
      i4 ? i4.mount(e6, t4, n5) : s4.then((r5) => r5.mount(e6, t4, n5));
    }, unmount(e6, t4) {
      i4 ? i4.unmount(e6, t4) : s4.then((n5) => n5.unmount(e6, t4));
    } }, { config: Xe({ configurable: true, value: r4 }), [p4]: Xe({ value(e6) {
      Ze(e6), d3();
      const t4 = () => {
        var t5;
        const n5 = u3();
        if (this.$app = n5, n5) {
          if (n5.taroGlobalData) {
            const e7 = n5.taroGlobalData, t6 = Object.keys(e7), r5 = Object.getOwnPropertyDescriptors(e7);
            t6.forEach((t7) => {
              Object.defineProperty(this, t7, { configurable: true, enumerable: true, get() {
                return e7[t7];
              }, set(n6) {
                e7[t7] = n6;
              } });
            }), Object.defineProperties(this, r5);
          }
          null === (t5 = n5.onLaunch) || void 0 === t5 || t5.call(n5, e6);
        }
        v3("onLaunch", e6);
      };
      c4(t4);
    } }), [h4]: Xe({ value(e6) {
      Ze(e6);
      const t4 = () => {
        var t5;
        const n5 = u3();
        null === (t5 = null === n5 || void 0 === n5 ? void 0 : n5.componentDidShow) || void 0 === t5 || t5.call(n5, e6), v3("onShow", e6);
      };
      c4(t4);
    } }), [g4]: Xe({ value() {
      const e6 = () => {
        var e7;
        const t4 = u3();
        null === (e7 = null === t4 || void 0 === t4 ? void 0 : t4.componentDidHide) || void 0 === e7 || e7.call(t4), v3("onHide");
      };
      c4(e6);
    } }), onError: Xe({ value(e6) {
      const t4 = () => {
        var t5;
        const n5 = u3();
        null === (t5 = null === n5 || void 0 === n5 ? void 0 : n5.onError) || void 0 === t5 || t5.call(n5, e6), v3("onError", e6);
      };
      c4(t4);
    } }), onUnhandledRejection: Xe({ value(e6) {
      const t4 = () => {
        var t5;
        const n5 = u3();
        null === (t5 = null === n5 || void 0 === n5 ? void 0 : n5.onUnhandledRejection) || void 0 === t5 || t5.call(n5, e6), v3("onUnhandledRejection", e6);
      };
      c4(t4);
    } }), onPageNotFound: Xe({ value(e6) {
      const t4 = () => {
        var t5;
        const n5 = u3();
        null === (t5 = null === n5 || void 0 === n5 ? void 0 : n5.onPageNotFound) || void 0 === t5 || t5.call(n5, e6), v3("onPageNotFound", e6);
      };
      c4(t4);
    } }) });
    function v3(e6, ...t4) {
      const n5 = De(Ye);
      if (n5) {
        const r5 = u3(), a5 = M.call("getLifecycle", n5, e6);
        Array.isArray(a5) && a5.forEach((e7) => e7.apply(r5, t4));
      }
    }
    return ie.app = m4, m4;
  }
  function Rt(e5) {
    return e5 && e5.__esModule && Object.prototype.hasOwnProperty.call(e5, "default") ? e5["default"] : e5;
  }
  function Mt() {
    return Ot.WEB;
  }
  function Dt(e5) {
    return new It(function(t3) {
      return e5(t3.requestParams);
    });
  }
  function Ft(e5) {
    const t3 = e5.requestParams;
    let n4;
    const r4 = new Promise((r5, a4) => {
      const o3 = setTimeout(() => {
        clearTimeout(o3), a4(new Error("\u7F51\u7EDC\u94FE\u63A5\u8D85\u65F6,\u8BF7\u7A0D\u540E\u518D\u8BD5\uFF01"));
      }, t3 && t3.timeout || 6e4);
      n4 = e5.proceed(t3), n4.then((e6) => {
        o3 && (clearTimeout(o3), r5(e6));
      }).catch((e6) => {
        o3 && clearTimeout(o3), a4(e6);
      });
    });
    return !_(n4) && P(n4.abort) && (r4.abort = n4.abort), r4;
  }
  function At(e5) {
    const t3 = e5.requestParams, { method: n4, data: r4, url: a4 } = t3;
    console.log(`http ${n4 || "GET"} --> ${a4} data: `, r4);
    const o3 = e5.proceed(t3), i4 = o3.then((e6) => (console.log(`http <-- ${a4} result:`, e6), e6));
    return P(o3.abort) && (i4.abort = o3.abort), i4;
  }
  function Bt(e5) {
    return e5;
  }
  function Ut(e5) {
    return function(t3, n4) {
      e5.preloadData = C(t3) ? t3 : { [t3]: n4 };
    };
  }
  function Yt(e5) {
    return function(t3) {
      const { designWidth: n4 = Ht, deviceRatio: r4 = Wt, baseFontSize: a4 = Vt, targetUnit: o3 = qt, unitPrecision: i4 = Qt } = t3;
      e5.config = e5.config || {}, e5.config.designWidth = n4, e5.config.deviceRatio = r4, e5.config.baseFontSize = a4, e5.config.targetUnit = o3, e5.config.unitPrecision = i4;
    };
  }
  function Gt(e5, t3) {
    return function(t4) {
      const n4 = e5.config || {}, r4 = n4.baseFontSize, a4 = n4.deviceRatio || Wt, o3 = ((e6 = 0) => P(n4.designWidth) ? n4.designWidth(e6) : n4.designWidth || Ht)(t4);
      if (!(o3 in a4)) throw new Error(`deviceRatio \u914D\u7F6E\u4E2D\u4E0D\u5B58\u5728 ${o3} \u7684\u8BBE\u7F6E\uFF01`);
      const i4 = n4.targetUnit || qt, l4 = n4.unitPrecision || Qt, s4 = ~~t4;
      let u3 = 1 / a4[o3];
      switch (i4) {
        case "rem":
          u3 *= 2 * r4;
          break;
        case "px":
          u3 *= 2;
          break;
      }
      let c4 = s4 / u3;
      return l4 >= 0 && l4 <= 100 && (c4 = Number(c4.toFixed(l4))), c4 + i4;
    };
  }
  function Xt(e5 = 300) {
    const t3 = `
body {
  /* \u9632\u6B62 iOS \u9875\u9762\u6EDA\u52A8 */
  overflow: hidden;
}
.taro_router > .taro_page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transform: translate(100%, 0);
  transition: transform ${e5}ms;
  z-index: 0;
}

.taro_router > .taro_page.taro_tabbar_page,
.taro_router > .taro_page.taro_page_show.taro_page_stationed {
  transform: none;
  transition: none;
}

.taro_router > .taro_page.taro_page_show {
  transform: translate(0, 0);
}
`;
    en(t3);
  }
  function Zt(e5, t3, n4) {
    const r4 = `
  .taro_router {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .taro_page {
    width: 100%;
    height: 100%;
${t3 ? "" : "\n    overflow-x: hidden;\n    overflow-y: scroll;\n    max-height: 100vh;\n"}
  }
${e5 ? "\n  .taro-tabbar__container {\n      height:100%;\n  }\n  .taro-tabbar__panel {\n      height: 100%;\n  }\n  .taro-tabbar__container > .taro-tabbar__panel {\n    overflow: hidden;\n  }\n\n  .taro-tabbar__container > .taro-tabbar__panel > .taro_page.taro_tabbar_page {\n    max-height: calc(100vh - var(--taro-tabbar-height) - constant(safe-area-inset-bottom));\n    max-height: calc(100vh - var(--taro-tabbar-height) - env(safe-area-inset-bottom));\n  }\n\n" : ""}
${n4 ? ".taro_page_shade:has(+.taro_page_stationed),\n  .taro_page_shade.taro_tabbar_page,\n  .taro_router > .taro_page.taro_page_show.taro_page_stationed:not(.taro_page_shade):not(.taro_tabbar_page):not(:last-child):has(+.taro_page_stationed) {\n    display: none;\n  }" : " .taro_page_shade,\n  .taro_router > .taro_page.taro_page_show.taro_page_stationed:not(.taro_page_shade):not(.taro_tabbar_page):not(:last-child) {\n    display: none;\n  }"}
`;
    en(r4);
  }
  function Jt() {
    const e5 = "\n  .taro-navigation-bar-show {\n    display: flex;\n    background: white;\n    position: sticky;\n    z-index: 500;\n    top: 0;\n    padding-bottom: 8px;\n    padding-top: calc(env(safe-area-inset-top) + 8px);\n    justify-content: center;\n    align-items: center;\n  }\n\n  .taro-navigation-bar-hide {\n    display: none;\n  }\n\n  .taro-navigation-bar-title-wrap {\n    display: flex;\n    height: 24px;\n  }\n\n  .taro-navigation-bar-title-wrap > .taro-navigation-bar-loading {\n    display: none;\n    animation: loading 2s linear infinite;\n  }\n\n  .taro-navigation-bar-title-wrap .taro-navigation-bar-loading.taro-navigation-bar-loading-show {\n    display: flex;\n  }\n\n  .taro-navigation-bar-title-wrap > .taro-navigation-bar-title {\n    font-size: 24px;\n    height: 24px;\n    line-height: 24px;\n    max-width: 100px;\n    white-space: nowrap;\n    overflow: hidden;\n    line-height: 24px;\n    text-overflow: ellipsis;\n  }\n\n  @keyframes loading {\n    from {\n      transform: rotate(0deg);\n    }\n    to {\n      transform: rotate(360deg);\n    }\n  }\n\n  @keyframes loading {\n    from {\n      transform: rotate(0deg);\n    }\n    to {\n      transform: rotate(360deg);\n    }\n  }\n\n  .taro-navigation-bar-no-icon > .taro-navigation-bar-home {\n    display: none;\n  }\n\n  .taro-navigation-bar-no-icon > .taro-navigation-bar-back {\n    display: none;\n  }\n\n  .taro-navigation-bar-home-icon > .taro-navigation-bar-home {\n    display: flex;\n    left: 8px;\n    position: absolute;\n    width: 24px;\n    height: 24px;\n  }\n\n  .taro-navigation-bar-back-icon > .taro-navigation-bar-back {\n    display: flex;\n    left: 8px;\n    position: absolute;\n    width: 24px;\n    height: 24px;\n  }\n";
    en(e5);
  }
  function en(e5) {
    if (!e5) return;
    const t3 = document.createElement("style");
    t3.innerHTML = e5, document.getElementsByTagName("head")[0].appendChild(t3);
  }
  function an(e5, t3) {
    if ("multi" === e5.router.mode) return;
    const n4 = document.createElement("div");
    n4.classList.add("taro-navigation-bar-no-icon");
    const r4 = document.createElement("div");
    r4.classList.add("taro-navigation-bar-back");
    const a4 = document.createElement("div");
    a4.classList.add("taro-navigation-bar-home"), r4.innerHTML = nn, a4.innerHTML = tn;
    const o3 = document.createElement("div");
    o3.classList.add("taro-navigation-bar-title-wrap");
    const i4 = document.createElement("div");
    i4.classList.add("taro-navigation-bar-loading"), i4.innerHTML = rn;
    const l4 = document.createElement("div");
    l4.classList.add("taro-navigation-bar-title"), o3.appendChild(i4), o3.appendChild(l4), n4.appendChild(a4), n4.appendChild(r4), n4.appendChild(o3), n4.id = "taro-navigation-bar", t3.insertBefore(n4, t3.firstChild), Jt();
  }
  function En(e5) {
    var t3, n4, r4;
    return null !== (r4 = null === (n4 = null === (t3 = e5.head) || void 0 === t3 ? void 0 : t3.querySelector('meta[name="csp-nonce"]')) || void 0 === n4 ? void 0 : n4.getAttribute("content")) && void 0 !== r4 ? r4 : void 0;
  }
  function Yr(e5, t3, n4) {
    return n4 = { path: t3, exports: {}, require: function(e6, t4) {
      return Gr();
    } }, e5(n4, n4.exports), n4.exports;
  }
  function Gr() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
  }
  function Zr(e5, t3) {
    e5.transform = t3, e5.webkitTransform = t3, e5.MozTransform = t3;
  }
  function aa() {
    if ("undefined" === typeof customElements) return;
    const e5 = ["taro-pull-to-refresh-core"];
    e5.forEach((e6) => {
      switch (e6) {
        case "taro-pull-to-refresh-core":
          customElements.get(e6) || customElements.define(e6, ra);
          break;
      }
    });
  }
  function ia() {
    return ia = Object.assign ? Object.assign.bind() : function(e5) {
      for (var t3 = 1; t3 < arguments.length; t3++) {
        var n4 = arguments[t3];
        for (var r4 in n4) ({}).hasOwnProperty.call(n4, r4) && (e5[r4] = n4[r4]);
      }
      return e5;
    }, ia.apply(null, arguments);
  }
  function fa(e5) {
    void 0 === e5 && (e5 = {});
    var t3 = e5, n4 = t3.window, r4 = void 0 === n4 ? document.defaultView : n4, a4 = r4.history;
    function o3() {
      var e6 = va(r4.location.hash.substr(1)), t4 = e6.pathname, n5 = void 0 === t4 ? "/" : t4, o4 = e6.search, i5 = void 0 === o4 ? "" : o4, l5 = e6.hash, s5 = void 0 === l5 ? "" : l5, u4 = a4.state || {};
      return [u4.idx, sa({ pathname: n5, search: i5, hash: s5, state: u4.usr || null, key: u4.key || "default" })];
    }
    var i4 = null;
    function l4() {
      if (i4) p4.call(i4), i4 = null;
      else {
        var e6 = la.Pop, t4 = o3(), n5 = t4[0], r5 = t4[1];
        if (p4.length) {
          if (null != n5) {
            var a5 = c4 - n5;
            a5 && (i4 = { action: e6, location: r5, retry: function() {
              k3(-1 * a5);
            } }, k3(a5));
          }
        } else b3(e6);
      }
    }
    r4.addEventListener(da, l4), r4.addEventListener(ca, function() {
      var e6 = o3(), t4 = e6[1];
      ma(t4) !== ma(d3) && l4();
    });
    var s4 = la.Pop, u3 = o3(), c4 = u3[0], d3 = u3[1], f3 = ha(), p4 = ha();
    function h4() {
      var e6 = document.querySelector("base"), t4 = "";
      if (e6 && e6.getAttribute("href")) {
        var n5 = r4.location.href, a5 = n5.indexOf("#");
        t4 = -1 === a5 ? n5 : n5.slice(0, a5);
      }
      return t4;
    }
    function g4(e6) {
      return h4() + "#" + ("string" === typeof e6 ? e6 : ma(e6));
    }
    function m4(e6, t4) {
      return void 0 === t4 && (t4 = null), sa(ia({ pathname: d3.pathname, hash: "", search: "" }, "string" === typeof e6 ? va(e6) : e6, { state: t4, key: ga() }));
    }
    function v3(e6, t4) {
      return [{ usr: e6.state, key: e6.key, idx: t4 }, g4(e6)];
    }
    function y3(e6, t4, n5) {
      return !p4.length || (p4.call({ action: e6, location: t4, retry: n5 }), false);
    }
    function b3(e6) {
      s4 = e6;
      var t4 = o3();
      c4 = t4[0], d3 = t4[1], f3.call({ action: s4, location: d3 });
    }
    function w3(e6, t4) {
      var n5 = la.Push, o4 = m4(e6, t4);
      function i5() {
        w3(e6, t4);
      }
      if (y3(n5, o4, i5)) {
        var l5 = v3(o4, c4 + 1), s5 = l5[0], u4 = l5[1];
        try {
          a4.pushState(s5, "", u4);
        } catch (d4) {
          r4.location.assign(u4);
        }
        b3(n5);
      }
    }
    function S3(e6, t4) {
      var n5 = la.Replace, r5 = m4(e6, t4);
      function o4() {
        S3(e6, t4);
      }
      if (y3(n5, r5, o4)) {
        var i5 = v3(r5, c4), l5 = i5[0], s5 = i5[1];
        a4.replaceState(l5, "", s5), b3(n5);
      }
    }
    function k3(e6) {
      a4.go(e6);
    }
    null == c4 && (c4 = 0, a4.replaceState(ia({}, a4.state, { idx: c4 }), ""));
    var E3 = { get action() {
      return s4;
    }, get location() {
      return d3;
    }, createHref: g4, push: w3, replace: S3, go: k3, back: function() {
      k3(-1);
    }, forward: function() {
      k3(1);
    }, listen: function(e6) {
      return f3.push(e6);
    }, block: function(e6) {
      var t4 = p4.push(e6);
      return 1 === p4.length && r4.addEventListener(ua, pa), function() {
        t4(), p4.length || r4.removeEventListener(ua, pa);
      };
    } };
    return E3;
  }
  function pa(e5) {
    e5.preventDefault(), e5.returnValue = "";
  }
  function ha() {
    var e5 = [];
    return { get length() {
      return e5.length;
    }, push: function(t3) {
      return e5.push(t3), function() {
        e5 = e5.filter(function(e6) {
          return e6 !== t3;
        });
      };
    }, call: function(t3) {
      e5.forEach(function(e6) {
        return e6 && e6(t3);
      });
    } };
  }
  function ga() {
    return Math.random().toString(36).substr(2, 8);
  }
  function ma(e5) {
    var t3 = e5.pathname, n4 = void 0 === t3 ? "/" : t3, r4 = e5.search, a4 = void 0 === r4 ? "" : r4, o3 = e5.hash, i4 = void 0 === o3 ? "" : o3;
    return a4 && "?" !== a4 && (n4 += "?" === a4.charAt(0) ? a4 : "?" + a4), i4 && "#" !== i4 && (n4 += "#" === i4.charAt(0) ? i4 : "#" + i4), n4;
  }
  function va(e5) {
    var t3 = {};
    if (e5) {
      var n4 = e5.indexOf("#");
      n4 >= 0 && (t3.hash = e5.substr(n4), e5 = e5.substr(0, n4));
      var r4 = e5.indexOf("?");
      r4 >= 0 && (t3.search = e5.substr(r4), e5 = e5.substr(0, r4)), e5 && (t3.pathname = e5);
    }
    return t3;
  }
  function Sa(e5, t3 = "/") {
    ba = e5, wa = t3;
  }
  function ka(e5 = "") {
    return wa.replace(/\/$/, "") + "/" + e5.replace(/^\//, "");
  }
  function Pa(e5) {
    var t3;
    const n4 = va(e5.url);
    if (null === (t3 = n4.pathname) || void 0 === t3 ? void 0 : t3.includes("./")) {
      const e6 = _a.getOrigin(ba.location.pathname).split("/");
      e6.pop(), n4.pathname.split("/").forEach((t4) => {
        "." !== t4 && (".." === t4 ? e6.pop() : e6.push(t4));
      }), n4.pathname = e6.join("/");
    }
    return n4.pathname = Pe(n4.pathname), n4.pathname = _a.getAlias(Pe(n4.pathname)), n4.pathname = ka(n4.pathname), n4.search || (n4.search = ""), n4;
  }
  function Ta(e5, t3) {
    return ae(this, void 0, void 0, function* () {
      return new Promise((n4, r4) => {
        xa.method = t3;
        const { success: a4, complete: o3, fail: i4 } = e5, l4 = ba.listen(() => {
          const r5 = { errMsg: `${t3}:ok` };
          "navigateTo" === t3 && (r5.eventChannel = Ca, Ca.addEvents(e5.events)), null === a4 || void 0 === a4 || a4(r5), null === o3 || void 0 === o3 || o3(r5), n4(r5), l4();
        });
        try {
          if ("url" in e5) {
            const n5 = Pa(e5), r5 = { timestamp: Date.now() };
            "navigateTo" === t3 ? ba.push(n5, r5) : "redirectTo" === t3 || "switchTab" === t3 ? ba.replace(n5, r5) : "reLaunch" === t3 && (xa.delta = xa.length, ba.replace(n5, r5));
          } else "navigateBack" === t3 && (xa.delta = e5.delta, xa.length > e5.delta ? ba.go(-e5.delta) : ba.go(1 - xa.length));
        } catch (s4) {
          const e6 = { errMsg: `${t3}:fail ${s4.message || s4}` };
          return null === i4 || void 0 === i4 || i4(e6), null === o3 || void 0 === o3 || o3(e6), i4 || o3 ? n4(e6) : r4(e6);
        }
      });
    });
  }
  function Na(e5) {
    return Ta(e5, "navigateTo");
  }
  function La(e5) {
    return Ta(e5, "redirectTo");
  }
  function Ra(e5 = { delta: 1 }) {
    return (!e5.delta || e5.delta < 1) && (e5.delta = 1), Ta(e5, "navigateBack");
  }
  function Oa(e5) {
    return Ta(e5, "switchTab");
  }
  function Ma(e5) {
    return Ta(e5, "reLaunch");
  }
  function za() {
    const e5 = xa.get();
    return e5.map((e6) => {
      var t3;
      return Object.assign(Object.assign({}, e6), { route: (null === (t3 = e6.path) || void 0 === t3 ? void 0 : t3.replace(/\?.*/g, "")) || "" });
    });
  }
  function Aa(e5, t3) {
    if (37 !== e5.codePointAt(t3) || t3 + 3 > e5.length) return;
    const n4 = e5.slice(t3 + 1, t3 + 3);
    return Fa.test(n4) ? { byte: Number.parseInt(n4, 16), next: t3 + 3 } : void 0;
  }
  function ja(e5) {
    return e5 <= 127 ? 1 : e5 >= 194 && e5 <= 223 ? 2 : e5 >= 224 && e5 <= 239 ? 3 : e5 >= 240 && e5 <= 244 ? 4 : 0;
  }
  function Ba(e5) {
    return e5 >= 128 && e5 <= 191;
  }
  function Ua(e5) {
    try {
      return decodeURIComponent(e5);
    } catch (ub) {
      let r4 = "", a4 = 0;
      while (a4 < e5.length) {
        if (37 !== e5.codePointAt(a4)) {
          r4 += e5.charAt(a4), a4++;
          continue;
        }
        const n4 = Aa(e5, a4);
        if (!n4) {
          r4 += e5.charAt(a4), a4++;
          continue;
        }
        const o3 = ja(n4.byte);
        if (0 === o3) {
          const t3 = e5.slice(a4, a4 + 6);
          if ("%FE%FF" === t3 || "%FF%FE" === t3) {
            r4 += "\uFFFD\uFFFD", a4 += 6;
            continue;
          }
          r4 += e5.slice(a4, a4 + 3), a4 += 3;
          continue;
        }
        let i4 = n4.next, l4 = true;
        for (let t3 = 1; t3 < o3; t3++) {
          const t4 = Aa(e5, i4);
          if (!t4 || !Ba(t4.byte)) {
            l4 = false;
            break;
          }
          i4 = t4.next;
        }
        if (l4) {
          const n5 = e5.slice(a4, i4);
          try {
            r4 += decodeURIComponent(n5), a4 = i4;
            continue;
          } catch (t3) {
          }
        }
        const s4 = e5.slice(a4, a4 + 3);
        r4 += "%C2" === s4 ? "\uFFFD" : s4, a4 += 3;
      }
      return r4;
    }
  }
  function Ha(e5) {
    return e5.replace(Da, (e6) => Ua(e6));
  }
  function Wa(e5) {
    if ("string" !== typeof e5) throw new TypeError(`Expected \`encodedURI\` to be of type \`string\`, got \`${typeof e5}\``);
    try {
      return decodeURIComponent(e5);
    } catch (ub) {
      return Ha(e5);
    }
  }
  function Va(e5, t3) {
    const n4 = {};
    if (Array.isArray(t3)) for (const r4 of t3) {
      const t4 = Object.getOwnPropertyDescriptor(e5, r4);
      (null == t4 ? void 0 : t4.enumerable) && Object.defineProperty(n4, r4, t4);
    }
    else for (const r4 of Reflect.ownKeys(e5)) {
      const a4 = Object.getOwnPropertyDescriptor(e5, r4);
      if (a4.enumerable) {
        const o3 = e5[r4];
        t3(r4, o3, e5) && Object.defineProperty(n4, r4, a4);
      }
    }
    return n4;
  }
  function Qa(e5, t3) {
    if ("string" !== typeof e5 || "string" !== typeof t3) throw new TypeError("Expected the arguments to be of type `string`");
    if ("" === e5 || "" === t3) return [];
    const n4 = e5.indexOf(t3);
    return -1 === n4 ? [] : [e5.slice(0, n4), e5.slice(n4 + t3.length)];
  }
  function Ka(e5) {
    switch (e5.arrayFormat) {
      case "index":
        return (t3) => (n4, r4) => {
          const a4 = n4.length;
          return void 0 === r4 || e5.skipNull && null === r4 || e5.skipEmptyString && "" === r4 ? n4 : null === r4 ? (n4.push([Ja(t3, e5), "[", a4, "]"].join("")), n4) : (n4.push([Ja(t3, e5), "[", Ja(a4, e5), "]=", Ja(r4, e5)].join("")), n4);
        };
      case "bracket":
        return (t3) => (n4, r4) => void 0 === r4 || e5.skipNull && null === r4 || e5.skipEmptyString && "" === r4 ? n4 : null === r4 ? (n4.push([Ja(t3, e5), "[]"].join("")), n4) : (n4.push([Ja(t3, e5), "[]=", Ja(r4, e5)].join("")), n4);
      case "colon-list-separator":
        return (t3) => (n4, r4) => void 0 === r4 || e5.skipNull && null === r4 || e5.skipEmptyString && "" === r4 ? n4 : null === r4 ? (n4.push([Ja(t3, e5), ":list="].join("")), n4) : (n4.push([Ja(t3, e5), ":list=", Ja(r4, e5)].join("")), n4);
      case "comma":
      case "separator":
      case "bracket-separator": {
        const t3 = "bracket-separator" === e5.arrayFormat ? "[]=" : "=";
        return (n4) => (r4, a4) => void 0 === a4 || e5.skipNull && null === a4 || e5.skipEmptyString && "" === a4 ? r4 : (a4 = null === a4 ? "" : a4, 0 === r4.length ? (r4.push([Ja(n4, e5), t3, Ja(a4, e5)].join("")), r4) : (r4.push(Ja(a4, e5)), r4));
      }
      default:
        return (t3) => (n4, r4) => void 0 === r4 || e5.skipNull && null === r4 || e5.skipEmptyString && "" === r4 ? n4 : null === r4 ? (n4.push(Ja(t3, e5)), n4) : (n4.push([Ja(t3, e5), "=", Ja(r4, e5)].join("")), n4);
    }
  }
  function Xa(e5) {
    let t3;
    switch (e5.arrayFormat) {
      case "index":
        return (e6, n4, r4) => {
          t3 = /\[(\d*)]$/.exec(e6), e6 = e6.replace(/\[\d*]$/, ""), t3 ? (void 0 === r4[e6] && (r4[e6] = {}), r4[e6][t3[1]] = n4) : r4[e6] = n4;
        };
      case "bracket":
        return (e6, n4, r4) => {
          t3 = /(\[])$/.exec(e6), e6 = e6.replace(/\[]$/, ""), t3 ? void 0 !== r4[e6] ? Array.isArray(r4[e6]) ? r4[e6].push(n4) : r4[e6] = [r4[e6], n4] : r4[e6] = [n4] : r4[e6] = n4;
        };
      case "colon-list-separator":
        return (e6, n4, r4) => {
          t3 = /(:list)$/.exec(e6), e6 = e6.replace(/:list$/, ""), t3 ? void 0 !== r4[e6] ? Array.isArray(r4[e6]) ? r4[e6].push(n4) : r4[e6] = [r4[e6], n4] : r4[e6] = [n4] : r4[e6] = n4;
        };
      case "comma":
      case "separator":
        return (t4, n4, r4) => {
          const a4 = "string" === typeof n4 && n4.includes(e5.arrayFormatSeparator), o3 = a4 ? n4.split(e5.arrayFormatSeparator).map((t5) => eo(t5, e5)) : null === n4 ? n4 : eo(n4, e5);
          r4[t4] = o3;
        };
      case "bracket-separator":
        return (t4, n4, r4) => {
          const a4 = /(\[])$/.test(t4);
          if (t4 = t4.replace(/\[]$/, ""), !a4) return void (r4[t4] = n4 ? eo(n4, e5) : n4);
          const o3 = null === n4 ? [] : eo(n4, e5).split(e5.arrayFormatSeparator);
          if (void 0 !== r4[t4]) {
            Array.isArray(r4[t4]) || (r4[t4] = [r4[t4]]);
            for (const e6 of o3) r4[t4].push(e6);
          } else r4[t4] = o3;
        };
      default:
        return (e6, t4, n4) => {
          void 0 !== n4[e6] ? Array.isArray(n4[e6]) ? n4[e6].push(t4) : n4[e6] = [n4[e6], t4] : n4[e6] = t4;
        };
    }
  }
  function Za(e5) {
    if ("string" !== typeof e5 || 1 !== e5.length) throw new TypeError("arrayFormatSeparator must be single character string");
  }
  function Ja(e5, t3) {
    return t3.encode ? t3.strict ? Ya(e5) : encodeURIComponent(e5) : e5;
  }
  function eo(e5, t3) {
    return t3.decode ? Wa(e5) : e5;
  }
  function to(e5) {
    return Array.isArray(e5) ? e5.sort() : "object" === typeof e5 ? to(Object.keys(e5)).sort((e6, t3) => Number(e6) - Number(t3)).map((t3) => e5[t3]) : e5;
  }
  function no(e5) {
    const t3 = e5.indexOf("#");
    return -1 !== t3 && (e5 = e5.slice(0, t3)), e5;
  }
  function ro(e5) {
    let t3 = "";
    const n4 = e5.indexOf("#");
    return -1 !== n4 && (t3 = e5.slice(n4)), t3;
  }
  function ao(e5) {
    const t3 = e5.indexOf("?");
    return -1 === t3 ? e5 : e5.slice(0, t3);
  }
  function oo(e5, t3, n4) {
    return "string" === n4 && "string" === typeof e5 ? e5 : "function" === typeof n4 && "string" === typeof e5 ? n4(e5) : "boolean" === n4 && null === e5 || ("boolean" !== n4 || null === e5 || "true" !== e5.toLowerCase() && "false" !== e5.toLowerCase() ? "boolean" !== n4 || null === e5 || "1" !== e5.toLowerCase() && "0" !== e5.toLowerCase() ? "string[]" === n4 && "none" !== t3.arrayFormat && "string" === typeof e5 ? [e5] : "number[]" !== n4 || "none" === t3.arrayFormat || Number.isNaN(Number(e5)) || "string" !== typeof e5 || "" === e5.trim() ? "number" !== n4 || Number.isNaN(Number(e5)) || "string" !== typeof e5 || "" === e5.trim() ? !t3.parseBooleans || null === e5 || "true" !== e5.toLowerCase() && "false" !== e5.toLowerCase() ? t3.parseNumbers && !Number.isNaN(Number(e5)) && "string" === typeof e5 && "" !== e5.trim() ? Number(e5) : e5 : "true" === e5.toLowerCase() : Number(e5) : [Number(e5)] : "1" === e5.toLowerCase() : "true" === e5.toLowerCase());
  }
  function io(e5) {
    e5 = no(e5);
    const t3 = e5.indexOf("?");
    return -1 === t3 ? "" : e5.slice(t3 + 1);
  }
  function lo(e5, t3) {
    t3 = o({ decode: true, sort: true, arrayFormat: "none", arrayFormatSeparator: ",", parseNumbers: false, parseBooleans: false, types: /* @__PURE__ */ Object.create(null) }, t3), Za(t3.arrayFormatSeparator);
    const n4 = Xa(t3), r4 = /* @__PURE__ */ Object.create(null);
    if ("string" !== typeof e5) return r4;
    if (e5 = e5.trim().replace(/^[?#&]/, ""), !e5) return r4;
    if (/^&+$/.test(e5)) return r4;
    let a4 = 0, i4 = e5.indexOf("&");
    -1 === i4 && (i4 = e5.length);
    for (let o3 = i4; o3 <= e5.length; o3++) {
      if (o3 < e5.length && "&" !== e5[o3]) continue;
      if (o3 === a4) {
        a4 = o3 + 1;
        continue;
      }
      const i5 = e5.slice(a4, o3), l4 = t3.decode ? i5.replaceAll("+", " ") : i5;
      let [s4, u3] = Qa(l4, "=");
      void 0 === s4 && (s4 = l4), u3 = void 0 === u3 ? null : ["comma", "separator", "bracket-separator"].includes(t3.arrayFormat) ? u3 : eo(u3, t3), n4(eo(s4, t3), u3, r4), a4 = o3 + 1;
    }
    for (const [o3, l4] of Object.entries(r4)) if ("object" === typeof l4 && null !== l4 && "string" !== t3.types[o3]) for (const [e6, n5] of Object.entries(l4)) {
      const r5 = t3.types[o3], a5 = "function" === typeof r5 ? r5 : r5 ? r5.replace("[]", "") : void 0;
      l4[e6] = oo(n5, t3, a5);
    }
    else "object" === typeof l4 && null !== l4 && "string" === t3.types[o3] ? r4[o3] = Object.values(l4).join(t3.arrayFormatSeparator) : r4[o3] = oo(l4, t3, t3.types[o3]);
    return false === t3.sort ? r4 : (true === t3.sort ? Object.keys(r4).sort() : Object.keys(r4).sort(t3.sort)).reduce((e6, t4) => {
      const n5 = r4[t4];
      return e6[t4] = Boolean(n5) && "object" === typeof n5 && !Array.isArray(n5) ? to(n5) : n5, e6;
    }, /* @__PURE__ */ Object.create(null));
  }
  function so(e5, t3) {
    if (!e5) return "";
    t3 = o({ encode: true, strict: true, arrayFormat: "none", arrayFormatSeparator: "," }, t3), Za(t3.arrayFormatSeparator);
    const n4 = (n5) => t3.skipNull && qa(e5[n5]) || t3.skipEmptyString && "" === e5[n5], r4 = Ka(t3), a4 = {};
    for (const [o3, l4] of Object.entries(e5)) n4(o3) || (a4[o3] = l4);
    const i4 = Object.keys(a4);
    return false !== t3.sort && i4.sort(t3.sort), i4.map((n5) => {
      let a5 = e5[n5];
      if (t3.replacer && (a5 = t3.replacer(n5, a5), void 0 === a5)) return "";
      if (void 0 === a5) return "";
      if (null === a5) return Ja(n5, t3);
      if (Array.isArray(a5)) {
        if (0 === a5.length && "bracket-separator" === t3.arrayFormat) return Ja(n5, t3) + "[]";
        let e6 = a5;
        t3.replacer && (e6 = a5.map((e7, r5) => t3.replacer(`${n5}[${r5}]`, e7)).filter((e7) => void 0 !== e7));
        const o3 = e6.reduce(r4(n5), []), i5 = ["comma", "separator", "bracket-separator"].includes(t3.arrayFormat) ? t3.arrayFormatSeparator : "&";
        return o3.join(i5);
      }
      return Ja(n5, t3) + "=" + Ja(a5, t3);
    }).filter((e6) => e6.length > 0).join("&");
  }
  function uo(e5, t3) {
    t3 = o({ decode: true }, t3);
    let [n4, r4] = Qa(e5, "#");
    return void 0 === n4 && (n4 = e5), o({ url: ao(null != n4 ? n4 : ""), query: lo(io(e5), t3) }, t3 && t3.parseFragmentIdentifier && r4 ? { fragmentIdentifier: eo(r4, t3) } : {});
  }
  function co(e5, t3) {
    t3 = o({ encode: true, strict: true, [Ga]: true }, t3);
    const n4 = ao(no(e5.url)) || "", r4 = io(e5.url), a4 = o(o({}, lo(r4, o({ sort: false }, t3))), e5.query);
    let i4 = so(a4, t3);
    i4 && (i4 = `?${i4}`);
    let l4 = ro(e5.url);
    if ("string" === typeof e5.fragmentIdentifier && (l4 = `#${e5.fragmentIdentifier}`, t3[Ga])) {
      const e6 = new URL("https://query-string.invalid");
      e6.hash = l4, l4 = e6.hash;
    }
    return `${n4}${i4}${l4}`;
  }
  function fo(e5, t3, n4) {
    n4 = o({ parseFragmentIdentifier: true, [Ga]: false }, n4);
    const { url: r4, query: a4, fragmentIdentifier: i4 } = uo(e5, n4);
    return co({ url: r4, query: Va(a4, t3), fragmentIdentifier: i4 }, n4);
  }
  function po(e5, t3, n4) {
    if (Array.isArray(t3)) {
      const r4 = new Set(t3);
      return fo(e5, (e6) => !r4.has(e6), n4);
    }
    return fo(e5, (e6, n5) => !t3(e6, n5), n4);
  }
  function mo(e5) {
    go && window.removeEventListener("resize", go), go = function() {
      if (e5.onResize) {
        const t3 = window.matchMedia("(orientation: portrait)");
        e5.onResize({ deviceOrientation: t3.matches ? "portrait" : "landscape", size: { windowHeight: window.innerHeight, windowWidth: window.innerWidth, screenHeight: window.screen.height, screenWidth: window.screen.width } });
      }
    }, window.addEventListener("resize", go, false);
  }
  function yo(e5, t3, n4 = 50) {
    var r4;
    const a4 = e5 ? null === e5 || void 0 === e5 ? void 0 : e5.path : null === (r4 = ie.router) || void 0 === r4 ? void 0 : r4.path, o3 = vo.get(a4);
    null === o3 || void 0 === o3 || o3.target.removeEventListener("scroll", o3.listener);
    let i4 = false;
    const l4 = function() {
      var r5;
      null === (r5 = e5.onPageScroll) || void 0 === r5 || r5.call(e5, { scrollTop: t3 instanceof Window ? t3.scrollY : t3.scrollTop }), i4 && bo(t3) > n4 && (i4 = false), e5.onReachBottom && !i4 && bo(t3) < n4 && (i4 = true, e5.onReachBottom());
    };
    vo.set(a4, { target: t3, listener: l4 }), t3.addEventListener("scroll", l4, false);
  }
  function bo(e5) {
    return e5 instanceof Window ? e5.document.documentElement.scrollHeight - e5.scrollY - e5.innerHeight : e5.scrollHeight - e5.scrollTop - e5.clientHeight;
  }
  function So(e5) {
    var t3 = [], n4 = 0;
    while (n4 < e5.length) {
      var r4 = e5[n4];
      if ("*" !== r4 && "+" !== r4 && "?" !== r4) if ("\\" !== r4) if ("{" !== r4) if ("}" !== r4) if (":" !== r4) if ("(" !== r4) t3.push({ type: "CHAR", index: n4, value: e5[n4++] });
      else {
        var a4 = 1, o3 = "";
        l4 = n4 + 1;
        if ("?" === e5[l4]) throw new TypeError('Pattern cannot start with "?" at '.concat(l4));
        while (l4 < e5.length) if ("\\" !== e5[l4]) {
          if (")" === e5[l4]) {
            if (a4--, 0 === a4) {
              l4++;
              break;
            }
          } else if ("(" === e5[l4] && (a4++, "?" !== e5[l4 + 1])) throw new TypeError("Capturing groups are not allowed at ".concat(l4));
          o3 += e5[l4++];
        } else o3 += e5[l4++] + e5[l4++];
        if (a4) throw new TypeError("Unbalanced pattern at ".concat(n4));
        if (!o3) throw new TypeError("Missing pattern at ".concat(n4));
        t3.push({ type: "PATTERN", index: n4, value: o3 }), n4 = l4;
      }
      else {
        var i4 = "", l4 = n4 + 1;
        while (l4 < e5.length) {
          var s4 = e5.charCodeAt(l4);
          if (!(s4 >= 48 && s4 <= 57 || s4 >= 65 && s4 <= 90 || s4 >= 97 && s4 <= 122 || 95 === s4)) break;
          i4 += e5[l4++];
        }
        if (!i4) throw new TypeError("Missing parameter name at ".concat(n4));
        t3.push({ type: "NAME", index: n4, value: i4 }), n4 = l4;
      }
      else t3.push({ type: "CLOSE", index: n4, value: e5[n4++] });
      else t3.push({ type: "OPEN", index: n4, value: e5[n4++] });
      else t3.push({ type: "ESCAPED_CHAR", index: n4++, value: e5[n4++] });
      else t3.push({ type: "MODIFIER", index: n4, value: e5[n4++] });
    }
    return t3.push({ type: "END", index: n4, value: "" }), t3;
  }
  function ko(e5, t3) {
    void 0 === t3 && (t3 = {});
    var n4 = So(e5), r4 = t3.prefixes, a4 = void 0 === r4 ? "./" : r4, o3 = t3.delimiter, i4 = void 0 === o3 ? "/#?" : o3, l4 = [], s4 = 0, u3 = 0, c4 = "", d3 = function(e6) {
      if (u3 < n4.length && n4[u3].type === e6) return n4[u3++].value;
    }, f3 = function(e6) {
      var t4 = d3(e6);
      if (void 0 !== t4) return t4;
      var r5 = n4[u3], a5 = r5.type, o4 = r5.index;
      throw new TypeError("Unexpected ".concat(a5, " at ").concat(o4, ", expected ").concat(e6));
    }, p4 = function() {
      var e6, t4 = "";
      while (e6 = d3("CHAR") || d3("ESCAPED_CHAR")) t4 += e6;
      return t4;
    }, h4 = function(e6) {
      for (var t4 = 0, n5 = i4; t4 < n5.length; t4++) {
        var r5 = n5[t4];
        if (e6.indexOf(r5) > -1) return true;
      }
      return false;
    }, g4 = function(e6) {
      var t4 = l4[l4.length - 1], n5 = e6 || (t4 && "string" === typeof t4 ? t4 : "");
      if (t4 && !n5) throw new TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
      return !n5 || h4(n5) ? "[^".concat($o(i4), "]+?") : "(?:(?!".concat($o(n5), ")[^").concat($o(i4), "])+?");
    };
    while (u3 < n4.length) {
      var m4 = d3("CHAR"), v3 = d3("NAME"), y3 = d3("PATTERN");
      if (v3 || y3) {
        var b3 = m4 || "";
        -1 === a4.indexOf(b3) && (c4 += b3, b3 = ""), c4 && (l4.push(c4), c4 = ""), l4.push({ name: v3 || s4++, prefix: b3, suffix: "", pattern: y3 || g4(b3), modifier: d3("MODIFIER") || "" });
      } else {
        var w3 = m4 || d3("ESCAPED_CHAR");
        if (w3) c4 += w3;
        else {
          c4 && (l4.push(c4), c4 = "");
          var S3 = d3("OPEN");
          if (S3) {
            b3 = p4();
            var k3 = d3("NAME") || "", E3 = d3("PATTERN") || "", x3 = p4();
            f3("CLOSE"), l4.push({ name: k3 || (E3 ? s4++ : ""), pattern: k3 && !E3 ? g4(b3) : E3, prefix: b3, suffix: x3, modifier: d3("MODIFIER") || "" });
          } else f3("END");
        }
      }
    }
    return l4;
  }
  function Eo(e5, t3) {
    var n4 = [], r4 = Lo(e5, n4, t3);
    return xo(r4, n4, t3);
  }
  function xo(e5, t3, n4) {
    void 0 === n4 && (n4 = {});
    var r4 = n4.decode, a4 = void 0 === r4 ? function(e6) {
      return e6;
    } : r4;
    return function(n5) {
      var r5 = e5.exec(n5);
      if (!r5) return false;
      for (var o3 = r5[0], i4 = r5.index, l4 = /* @__PURE__ */ Object.create(null), s4 = function(e6) {
        if (void 0 === r5[e6]) return "continue";
        var n6 = t3[e6 - 1];
        "*" === n6.modifier || "+" === n6.modifier ? l4[n6.name] = r5[e6].split(n6.prefix + n6.suffix).map(function(e7) {
          return a4(e7, n6);
        }) : l4[n6.name] = a4(r5[e6], n6);
      }, u3 = 1; u3 < r5.length; u3++) s4(u3);
      return { path: o3, index: i4, params: l4 };
    };
  }
  function $o(e5) {
    return e5.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  function _o(e5) {
    return e5 && e5.sensitive ? "" : "i";
  }
  function Co(e5, t3) {
    if (!t3) return e5;
    var n4 = /\((?:\?<(.*?)>)?(?!\?)/g, r4 = 0, a4 = n4.exec(e5.source);
    while (a4) t3.push({ name: a4[1] || r4++, prefix: "", suffix: "", modifier: "", pattern: "" }), a4 = n4.exec(e5.source);
    return e5;
  }
  function Po(e5, t3, n4) {
    var r4 = e5.map(function(e6) {
      return Lo(e6, t3, n4).source;
    });
    return new RegExp("(?:".concat(r4.join("|"), ")"), _o(n4));
  }
  function To(e5, t3, n4) {
    return No(ko(e5, n4), t3, n4);
  }
  function No(e5, t3, n4) {
    void 0 === n4 && (n4 = {});
    for (var r4 = n4.strict, a4 = void 0 !== r4 && r4, o3 = n4.start, i4 = void 0 === o3 || o3, l4 = n4.end, s4 = void 0 === l4 || l4, u3 = n4.encode, c4 = void 0 === u3 ? function(e6) {
      return e6;
    } : u3, d3 = n4.delimiter, f3 = void 0 === d3 ? "/#?" : d3, p4 = n4.endsWith, h4 = void 0 === p4 ? "" : p4, g4 = "[".concat($o(h4), "]|$"), m4 = "[".concat($o(f3), "]"), v3 = i4 ? "^" : "", y3 = 0, b3 = e5; y3 < b3.length; y3++) {
      var w3 = b3[y3];
      if ("string" === typeof w3) v3 += $o(c4(w3));
      else {
        var S3 = $o(c4(w3.prefix)), k3 = $o(c4(w3.suffix));
        if (w3.pattern) if (t3 && t3.push(w3), S3 || k3) if ("+" === w3.modifier || "*" === w3.modifier) {
          var E3 = "*" === w3.modifier ? "?" : "";
          v3 += "(?:".concat(S3, "((?:").concat(w3.pattern, ")(?:").concat(k3).concat(S3, "(?:").concat(w3.pattern, "))*)").concat(k3, ")").concat(E3);
        } else v3 += "(?:".concat(S3, "(").concat(w3.pattern, ")").concat(k3, ")").concat(w3.modifier);
        else {
          if ("+" === w3.modifier || "*" === w3.modifier) throw new TypeError('Can not repeat "'.concat(w3.name, '" without a prefix and suffix'));
          v3 += "(".concat(w3.pattern, ")").concat(w3.modifier);
        }
        else v3 += "(?:".concat(S3).concat(k3, ")").concat(w3.modifier);
      }
    }
    if (s4) a4 || (v3 += "".concat(m4, "?")), v3 += n4.endsWith ? "(?=".concat(g4, ")") : "$";
    else {
      var x3 = e5[e5.length - 1], $3 = "string" === typeof x3 ? m4.indexOf(x3[x3.length - 1]) > -1 : void 0 === x3;
      a4 || (v3 += "(?:".concat(m4, "(?=").concat(g4, "))?")), $3 || (v3 += "(?=".concat(m4, "|").concat(g4, ")"));
    }
    return new RegExp(v3, _o(n4));
  }
  function Lo(e5, t3, n4) {
    return e5 instanceof RegExp ? Co(e5, t3) : Array.isArray(e5) ? Po(e5, t3, n4) : To(e5, t3, n4);
  }
  function Ro(e5) {
    try {
      return decodeURIComponent(e5);
    } catch (t3) {
      return e5;
    }
  }
  function Oo(e5, t3, n4, r4, a4) {
    var o3, i4, l4 = 0;
    return { next: function(s4) {
      if (e5 === s4) return { done: true, value: false };
      if (!o3) {
        var u3 = e5, c4 = !u3.children;
        if (u3.match || (u3.match = Eo(u3.path || "", Object.assign({ end: c4 }, n4))), o3 = u3.match(r4), o3) {
          var d3 = o3, f3 = d3.path;
          return o3.path = c4 || "/" !== f3.charAt(f3.length - 1) ? f3 : f3.substr(1), o3.params = Object.assign({}, a4, o3.params), { done: false, value: { route: e5, baseUrl: t3, path: o3.path, params: o3.params } };
        }
      }
      if (o3 && e5.children) while (l4 < e5.children.length) {
        if (!i4) {
          var p4 = e5.children[l4];
          p4.parent = e5, i4 = Oo(p4, t3 + o3.path, n4, r4.substr(o3.path.length), o3.params);
        }
        var h4 = i4.next(s4);
        if (!h4.done) return { done: false, value: h4.value };
        i4 = null, l4++;
      }
      return { done: true, value: false };
    } };
  }
  function Mo(e5, t3) {
    if ("function" === typeof e5.route.action) return e5.route.action(e5, t3);
  }
  function zo(e5, t3) {
    var n4 = t3;
    while (n4) if (n4 = n4.parent, n4 === e5) return true;
    return false;
  }
  function Bo(e5, t3, n4, r4) {
    var a4, o3;
    "function" === typeof t3.onUnhandledRejection && window.addEventListener("unhandledrejection", t3.onUnhandledRejection), ya.config = n4;
    const i4 = new Fo(n4, e5), l4 = {};
    _a.set(i4.router.customRoutes);
    const s4 = i4.router.basename, u3 = i4.routes.map((e6) => {
      const t4 = Pe(e6.path), n5 = _a.getAll(t4);
      return { path: n5.length < 1 ? t4 : n5, action: e6.load };
    }), c4 = new Io(u3, { baseUrl: s4 || "" }), d3 = { path: i4.currentPage, query: i4.getQuery(jo), scene: 0, shareTicket: "", referrerInfo: {} };
    ne.trigger("__taroRouterLaunch", d3), null === (a4 = t3.onLaunch) || void 0 === a4 || a4.call(t3, d3), t3.onError && window.addEventListener("error", (e6) => {
      var n5;
      return null === (n5 = t3.onError) || void 0 === n5 ? void 0 : n5.call(t3, e6.message);
    });
    const f3 = (e6) => ae(this, [e6], void 0, function* ({ location: e7, action: a5 }) {
      var o4, s5, u4, d4, f4, p5, h4, g4;
      const m4 = decodeURI(e7.pathname);
      let v3, y3, b3;
      (null === (o4 = window.__taroAppConfig) || void 0 === o4 ? void 0 : o4.usingWindowScroll) && window.scrollTo(0, 0), ne.trigger("__taroRouterChange", { toLocation: { path: m4 } });
      const w3 = i4.router.forcePath || m4;
      l4[w3] = "number" === typeof l4[w3] ? l4[w3] + 1 : 1;
      const S3 = l4[w3];
      let k3;
      try {
        const e8 = yield c4.resolve(w3);
        [v3, y3, b3] = yield Promise.all(e8), k3 = l4[w3];
      } catch (O3) {
        if (404 === O3.status) {
          const e8 = { isEntryPage: 0 === xa.length, path: m4, query: i4.getQuery(Ao()) };
          null === (s5 = t3.onPageNotFound) || void 0 === s5 || s5.call(t3, e8), ne.trigger("__taroRouterNotFound", e8);
        } else {
          if (!/Loading hot update .* failed./.test(O3.message)) throw O3;
          window.location.reload();
        }
      }
      if (!v3 || S3 !== k3) return;
      i4.pathname = y3.pathname;
      const { pathname: E3, pageConfig: x3 } = i4;
      let $3 = (null === (u4 = null === n4 || void 0 === n4 ? void 0 : n4.window) || void 0 === u4 ? void 0 : u4.enablePullDownRefresh) || false, _3 = (null === (d4 = null === n4 || void 0 === n4 ? void 0 : n4.window) || void 0 === d4 ? void 0 : d4.navigationStyle) || "default", C3 = (null === (f4 = null === n4 || void 0 === n4 ? void 0 : n4.window) || void 0 === f4 ? void 0 : f4.navigationBarTextStyle) || "white", P3 = (null === (p5 = null === n4 || void 0 === n4 ? void 0 : n4.window) || void 0 === p5 ? void 0 : p5.navigationBarBackgroundColor) || "#000000";
      x3 && ("boolean" === typeof x3.enablePullDownRefresh && ($3 = x3.enablePullDownRefresh), "string" === typeof x3.navigationStyle && (_3 = x3.navigationStyle), "string" === typeof x3.navigationBarTextStyle && (C3 = x3.navigationBarTextStyle), "string" === typeof x3.navigationBarBackgroundColor && (P3 = x3.navigationBarBackgroundColor)), ne.trigger("__taroSetNavigationStyle", _3, C3, P3);
      const T3 = ie.page, N3 = null !== (h4 = xa.method) && void 0 !== h4 ? h4 : "", L3 = xa.getTabs();
      let R3 = false;
      if (xa.method = "", "reLaunch" === N3) {
        i4.unload(T3, xa.length);
        for (const e8 in L3) L3[e8] && (i4.unload(L3[e8]), xa.removeTab(e8));
        R3 = true;
      } else if (T3 && i4.isTabBar(E3)) {
        if (i4.isSamePage(T3)) return;
        if (i4.isTabBar(T3.path)) i4.hide(T3), xa.pushTab(T3.path.split("?")[0]);
        else if (xa.length > 0) {
          const e8 = xa.getItem(0);
          i4.isTabBar(e8.path) ? (i4.unload(T3, xa.length - 1, true), xa.pushTab(e8.path.split("?")[0])) : i4.unload(T3, xa.length, true);
        }
        if (L3[E3]) return xa.popTab(E3), i4.show(xa.getItem(0), x3, 0);
        R3 = true;
      } else if ("POP" === a5) {
        const e8 = xa.getPrevIndex(E3), t4 = xa.getDelta(E3);
        T3 !== xa.getItem(e8) && (i4.unload(T3, t4, e8 > -1), e8 > -1 ? ne.once("__taroPageOnShowAfterDestroyed", () => {
          i4.show(xa.getItem(e8), x3, e8);
        }) : R3 = true);
      } else if ("REPLACE" === a5) {
        const e8 = xa.getDelta(E3);
        i4.unload(T3, e8), R3 = true;
      } else "PUSH" === a5 && (i4.hide(T3, true), R3 = true);
      if (R3 || xa.length < 1) {
        const e8 = null !== (g4 = v3.default) && void 0 !== g4 ? g4 : v3, t4 = Object.assign({}, x3), n5 = xa.length;
        delete t4["path"], delete t4["load"];
        let a6 = "";
        jo ? (a6 = jo, jo = "") : a6 = Ao();
        const o5 = We($3 ? M.call("createPullDownComponent", e8, E3, r4, i4.PullDownRefresh, a6) : e8, E3 + Ae(i4.getQuery(a6)), {}, t4);
        b3 && (o5.options = b3), i4.load(o5, x3, a6, n5);
      }
    }), p4 = Pe(Ne(e5.location.pathname, i4.basename));
    return "/" === p4 && e5.replace(ka(i4.homePage + e5.location.search)), f3({ location: e5.location, action: la.Push }), null === (o3 = t3.onShow) || void 0 === o3 || o3.call(t3, d3), window.addEventListener("visibilitychange", () => {
      var e6, n5, r5, a5, o4, i5, l5;
      const s5 = (null === (e6 = ie.page) || void 0 === e6 ? void 0 : e6.path) || "", u4 = s5.substring(0, s5.indexOf("?")), c5 = {};
      Object.assign(c5, d3, { path: u4 }), "visible" === document.visibilityState ? (null === (n5 = t3.onShow) || void 0 === n5 || n5.call(t3, c5), null === (a5 = null === (r5 = ie.page) || void 0 === r5 ? void 0 : r5.onShow) || void 0 === a5 || a5.call(r5)) : ((null === (o4 = ie.page) || void 0 === o4 ? void 0 : o4.path) && Fe(null === (i5 = ie.page) || void 0 === i5 ? void 0 : i5.path, "onHide"), null === (l5 = t3.onHide) || void 0 === l5 || l5.call(t3, c5));
    }), e5.listen(f3);
  }
  function Uo(e5, t3, n4 = e5.appId || "app") {
    let r4 = document.getElementById(n4), a4 = true;
    r4 || (r4 = document.createElement("div"), r4.id = n4, a4 = false);
    const o3 = (null === r4 || void 0 === r4 ? void 0 : r4.parentNode) || (null === r4 || void 0 === r4 ? void 0 : r4.parentElement) || document.body;
    r4.classList.add("taro_router"), a4 || o3.appendChild(r4), an(e5, o3);
  }
  function Wo(e5 = "") {
    return (t3 = {}, ...n4) => {
      const { success: r4, fail: a4, complete: o3 } = t3, i4 = new Ho({ name: e5, success: r4, fail: a4, complete: o3 }), l4 = "\u6682\u65F6\u4E0D\u652F\u6301 API";
      return Kt.eventCenter.trigger("__taroNotSupport", { name: e5, args: [t3, ...n4], type: "method", category: "temporarily" }), console.warn(l4), i4.success({ errMsg: l4 });
    };
  }
  function Vo(e5 = "") {
    return (t3 = {}, ...n4) => {
      const { success: r4, fail: a4, complete: o3 } = t3, i4 = new Ho({ name: e5, success: r4, fail: a4, complete: o3 }), l4 = "\u4E0D\u652F\u6301 API";
      return Kt.eventCenter.trigger("__taroNotSupport", { name: e5, args: [t3, ...n4], type: "method", category: "permanently" }), console.warn(l4), i4.success({ errMsg: l4 });
    };
  }
  function pi() {
    var e5;
    return (null === this || void 0 === this ? void 0 : this.pxTransformConfig) ? this.pxTransformConfig : (e5 = di).config || (e5.config = {});
  }
  function Fi(e5) {
    return null === e5 || "object" !== typeof e5 ? null : (e5 = Di && e5[Di] || e5["@@iterator"], "function" === typeof e5 ? e5 : null);
  }
  function Ui(e5, t3, n4) {
    this.props = e5, this.context = t3, this.refs = Bi, this.updater = n4 || Ai;
  }
  function Hi() {
  }
  function Wi(e5, t3, n4) {
    this.props = e5, this.context = t3, this.refs = Bi, this.updater = n4 || Ai;
  }
  function Ki(e5, t3, n4) {
    var r4, a4 = {}, o3 = null, i4 = null;
    if (null != t3) for (r4 in void 0 !== t3.ref && (i4 = t3.ref), void 0 !== t3.key && (o3 = "" + t3.key), t3) qi.call(t3, r4) && !Gi.hasOwnProperty(r4) && (a4[r4] = t3[r4]);
    var l4 = arguments.length - 2;
    if (1 === l4) a4.children = n4;
    else if (1 < l4) {
      for (var s4 = Array(l4), u3 = 0; u3 < l4; u3++) s4[u3] = arguments[u3 + 2];
      a4.children = s4;
    }
    if (e5 && e5.defaultProps) for (r4 in l4 = e5.defaultProps, l4) void 0 === a4[r4] && (a4[r4] = l4[r4]);
    return { $$typeof: _i, type: e5, key: o3, ref: i4, props: a4, _owner: Yi.current };
  }
  function Xi(e5, t3) {
    return { $$typeof: _i, type: e5.type, key: t3, ref: e5.ref, props: e5.props, _owner: e5._owner };
  }
  function Zi(e5) {
    return "object" === typeof e5 && null !== e5 && e5.$$typeof === _i;
  }
  function Ji(e5) {
    var t3 = { "=": "=0", ":": "=2" };
    return "$" + e5.replace(/[=:]/g, function(e6) {
      return t3[e6];
    });
  }
  function tl(e5, t3) {
    return "object" === typeof e5 && null !== e5 && null != e5.key ? Ji("" + e5.key) : t3.toString(36);
  }
  function nl(e5, t3, n4, r4, a4) {
    var o3 = typeof e5;
    "undefined" !== o3 && "boolean" !== o3 || (e5 = null);
    var i4 = false;
    if (null === e5) i4 = true;
    else switch (o3) {
      case "string":
      case "number":
        i4 = true;
        break;
      case "object":
        switch (e5.$$typeof) {
          case _i:
          case Ci:
            i4 = true;
        }
    }
    if (i4) return i4 = e5, a4 = a4(i4), e5 = "" === r4 ? "." + tl(i4, 0) : r4, Qi(a4) ? (n4 = "", null != e5 && (n4 = e5.replace(el, "$&/") + "/"), nl(a4, t3, n4, "", function(e6) {
      return e6;
    })) : null != a4 && (Zi(a4) && (a4 = Xi(a4, n4 + (!a4.key || i4 && i4.key === a4.key ? "" : ("" + a4.key).replace(el, "$&/") + "/") + e5)), t3.push(a4)), 1;
    if (i4 = 0, r4 = "" === r4 ? "." : r4 + ":", Qi(e5)) for (var l4 = 0; l4 < e5.length; l4++) {
      o3 = e5[l4];
      var s4 = r4 + tl(o3, l4);
      i4 += nl(o3, t3, n4, s4, a4);
    }
    else if (s4 = Fi(e5), "function" === typeof s4) for (e5 = s4.call(e5), l4 = 0; !(o3 = e5.next()).done; ) o3 = o3.value, s4 = r4 + tl(o3, l4++), i4 += nl(o3, t3, n4, s4, a4);
    else if ("object" === o3) throw t3 = String(e5), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t3 ? "object with keys {" + Object.keys(e5).join(", ") + "}" : t3) + "). If you meant to render a collection of children, use an array instead.");
    return i4;
  }
  function rl(e5, t3, n4) {
    if (null == e5) return e5;
    var r4 = [], a4 = 0;
    return nl(e5, r4, "", "", function(e6) {
      return t3.call(n4, e6, a4++);
    }), r4;
  }
  function al(e5) {
    if (-1 === e5._status) {
      var t3 = e5._result;
      t3 = t3(), t3.then(function(t4) {
        0 !== e5._status && -1 !== e5._status || (e5._status = 1, e5._result = t4);
      }, function(t4) {
        0 !== e5._status && -1 !== e5._status || (e5._status = 2, e5._result = t4);
      }), -1 === e5._status && (e5._status = 0, e5._result = t3);
    }
    if (1 === e5._status) return e5._result.default;
    throw e5._result;
  }
  function sl() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  function wl(e5) {
    for (var t3 = "https://reactjs.org/docs/error-decoder.html?invariant=" + e5, n4 = 1; n4 < arguments.length; n4++) t3 += "&args[]=" + encodeURIComponent(arguments[n4]);
    return "Minified React error #" + e5 + "; visit " + t3 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function El(e5, t3) {
    xl(e5, t3), xl(e5 + "Capture", t3);
  }
  function xl(e5, t3) {
    for (kl[e5] = t3, e5 = 0; e5 < t3.length; e5++) Sl.add(t3[e5]);
  }
  function Nl(e5) {
    return !!_l.call(Tl, e5) || !_l.call(Pl, e5) && (Cl.test(e5) ? Tl[e5] = true : (Pl[e5] = true, false));
  }
  function Ll(e5, t3, n4, r4) {
    if (null !== n4 && 0 === n4.type) return false;
    switch (typeof t3) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        return !r4 && (null !== n4 ? !n4.acceptsBooleans : (e5 = e5.toLowerCase().slice(0, 5), "data-" !== e5 && "aria-" !== e5));
      default:
        return false;
    }
  }
  function Rl(e5, t3, n4, r4) {
    if (null === t3 || "undefined" === typeof t3 || Ll(e5, t3, n4, r4)) return true;
    if (r4) return false;
    if (null !== n4) switch (n4.type) {
      case 3:
        return !t3;
      case 4:
        return false === t3;
      case 5:
        return isNaN(t3);
      case 6:
        return isNaN(t3) || 1 > t3;
    }
    return false;
  }
  function Ol(e5, t3, n4, r4, a4, o3, i4) {
    this.acceptsBooleans = 2 === t3 || 3 === t3 || 4 === t3, this.attributeName = r4, this.attributeNamespace = a4, this.mustUseProperty = n4, this.propertyName = e5, this.type = t3, this.sanitizeURL = o3, this.removeEmptyString = i4;
  }
  function Il(e5) {
    return e5[1].toUpperCase();
  }
  function Dl(e5, t3, n4, r4) {
    var a4 = Ml.hasOwnProperty(t3) ? Ml[t3] : null;
    (null !== a4 ? 0 !== a4.type : r4 || !(2 < t3.length) || "o" !== t3[0] && "O" !== t3[0] || "n" !== t3[1] && "N" !== t3[1]) && (Rl(t3, n4, a4, r4) && (n4 = null), r4 || null === a4 ? Nl(t3) && (null === n4 ? e5.removeAttribute(t3) : e5.setAttribute(t3, "" + n4)) : a4.mustUseProperty ? e5[a4.propertyName] = null === n4 ? 3 !== a4.type && "" : n4 : (t3 = a4.attributeName, r4 = a4.attributeNamespace, null === n4 ? e5.removeAttribute(t3) : (a4 = a4.type, n4 = 3 === a4 || 4 === a4 && true === n4 ? "" : "" + n4, r4 ? e5.setAttributeNS(r4, t3, n4) : e5.setAttribute(t3, n4))));
  }
  function Jl(e5) {
    return null === e5 || "object" !== typeof e5 ? null : (e5 = Zl && e5[Zl] || e5["@@iterator"], "function" === typeof e5 ? e5 : null);
  }
  function ns(e5) {
    if (void 0 === es) try {
      throw Error();
    } catch (n4) {
      var t3 = n4.stack.trim().match(/\n( *(at )?)/);
      es = t3 && t3[1] || "";
    }
    return "\n" + es + e5;
  }
  function as(e5, t3) {
    if (!e5 || rs) return "";
    rs = true;
    var n4 = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t3) if (t3 = function() {
        throw Error();
      }, Object.defineProperty(t3.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(t3, []);
        } catch (u3) {
          var r4 = u3;
        }
        Reflect.construct(e5, [], t3);
      } else {
        try {
          t3.call();
        } catch (u3) {
          r4 = u3;
        }
        e5.call(t3.prototype);
      }
      else {
        try {
          throw Error();
        } catch (u3) {
          r4 = u3;
        }
        e5();
      }
    } catch (u3) {
      if (u3 && r4 && "string" === typeof u3.stack) {
        for (var a4 = u3.stack.split("\n"), o3 = r4.stack.split("\n"), i4 = a4.length - 1, l4 = o3.length - 1; 1 <= i4 && 0 <= l4 && a4[i4] !== o3[l4]; ) l4--;
        for (; 1 <= i4 && 0 <= l4; i4--, l4--) if (a4[i4] !== o3[l4]) {
          if (1 !== i4 || 1 !== l4) do {
            if (i4--, l4--, 0 > l4 || a4[i4] !== o3[l4]) {
              var s4 = "\n" + a4[i4].replace(" at new ", " at ");
              return e5.displayName && s4.includes("<anonymous>") && (s4 = s4.replace("<anonymous>", e5.displayName)), s4;
            }
          } while (1 <= i4 && 0 <= l4);
          break;
        }
      }
    } finally {
      rs = false, Error.prepareStackTrace = n4;
    }
    return (e5 = e5 ? e5.displayName || e5.name : "") ? ns(e5) : "";
  }
  function os(e5) {
    switch (e5.tag) {
      case 5:
        return ns(e5.type);
      case 16:
        return ns("Lazy");
      case 13:
        return ns("Suspense");
      case 19:
        return ns("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e5 = as(e5.type, false), e5;
      case 11:
        return e5 = as(e5.type.render, false), e5;
      case 1:
        return e5 = as(e5.type, true), e5;
      default:
        return "";
    }
  }
  function is(e5) {
    if (null == e5) return null;
    if ("function" === typeof e5) return e5.displayName || e5.name || null;
    if ("string" === typeof e5) return e5;
    switch (e5) {
      case Bl:
        return "Fragment";
      case jl:
        return "Portal";
      case Hl:
        return "Profiler";
      case Ul:
        return "StrictMode";
      case ql:
        return "Suspense";
      case Yl:
        return "SuspenseList";
    }
    if ("object" === typeof e5) switch (e5.$$typeof) {
      case Vl:
        return (e5.displayName || "Context") + ".Consumer";
      case Wl:
        return (e5._context.displayName || "Context") + ".Provider";
      case Ql:
        var t3 = e5.render;
        return e5 = e5.displayName, e5 || (e5 = t3.displayName || t3.name || "", e5 = "" !== e5 ? "ForwardRef(" + e5 + ")" : "ForwardRef"), e5;
      case Gl:
        return t3 = e5.displayName || null, null !== t3 ? t3 : is(e5.type) || "Memo";
      case Kl:
        t3 = e5._payload, e5 = e5._init;
        try {
          return is(e5(t3));
        } catch (n4) {
        }
    }
    return null;
  }
  function ls(e5) {
    var t3 = e5.type;
    switch (e5.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t3.displayName || "Context") + ".Consumer";
      case 10:
        return (t3._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e5 = t3.render, e5 = e5.displayName || e5.name || "", t3.displayName || ("" !== e5 ? "ForwardRef(" + e5 + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t3;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return is(t3);
      case 8:
        return t3 === Ul ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof t3) return t3.displayName || t3.name || null;
        if ("string" === typeof t3) return t3;
    }
    return null;
  }
  function ss(e5) {
    switch (typeof e5) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e5;
      case "object":
        return e5;
      default:
        return "";
    }
  }
  function us(e5) {
    var t3 = e5.type;
    return (e5 = e5.nodeName) && "input" === e5.toLowerCase() && ("checkbox" === t3 || "radio" === t3);
  }
  function cs(e5) {
    var t3 = us(e5) ? "checked" : "value", n4 = Object.getOwnPropertyDescriptor(e5.constructor.prototype, t3), r4 = "" + e5[t3];
    if (!e5.hasOwnProperty(t3) && "undefined" !== typeof n4 && "function" === typeof n4.get && "function" === typeof n4.set) {
      var a4 = n4.get, o3 = n4.set;
      return Object.defineProperty(e5, t3, { configurable: true, get: function() {
        return a4.call(this);
      }, set: function(e6) {
        r4 = "" + e6, o3.call(this, e6);
      } }), Object.defineProperty(e5, t3, { enumerable: n4.enumerable }), { getValue: function() {
        return r4;
      }, setValue: function(e6) {
        r4 = "" + e6;
      }, stopTracking: function() {
        e5._valueTracker = null, delete e5[t3];
      } };
    }
  }
  function ds(e5) {
    e5._valueTracker || (e5._valueTracker = cs(e5));
  }
  function fs(e5) {
    if (!e5) return false;
    var t3 = e5._valueTracker;
    if (!t3) return true;
    var n4 = t3.getValue(), r4 = "";
    return e5 && (r4 = us(e5) ? e5.checked ? "true" : "false" : e5.value), e5 = r4, e5 !== n4 && (t3.setValue(e5), true);
  }
  function ps(e5) {
    if (e5 = e5 || ("undefined" !== typeof document ? document : void 0), "undefined" === typeof e5) return null;
    try {
      return e5.activeElement || e5.body;
    } catch (t3) {
      return e5.body;
    }
  }
  function hs(e5, t3) {
    var n4 = t3.checked;
    return ts({}, t3, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != n4 ? n4 : e5._wrapperState.initialChecked });
  }
  function gs(e5, t3) {
    var n4 = null == t3.defaultValue ? "" : t3.defaultValue, r4 = null != t3.checked ? t3.checked : t3.defaultChecked;
    n4 = ss(null != t3.value ? t3.value : n4), e5._wrapperState = { initialChecked: r4, initialValue: n4, controlled: "checkbox" === t3.type || "radio" === t3.type ? null != t3.checked : null != t3.value };
  }
  function ms(e5, t3) {
    t3 = t3.checked, null != t3 && Dl(e5, "checked", t3, false);
  }
  function vs(e5, t3) {
    ms(e5, t3);
    var n4 = ss(t3.value), r4 = t3.type;
    if (null != n4) "number" === r4 ? (0 === n4 && "" === e5.value || e5.value != n4) && (e5.value = "" + n4) : e5.value !== "" + n4 && (e5.value = "" + n4);
    else if ("submit" === r4 || "reset" === r4) return void e5.removeAttribute("value");
    t3.hasOwnProperty("value") ? bs(e5, t3.type, n4) : t3.hasOwnProperty("defaultValue") && bs(e5, t3.type, ss(t3.defaultValue)), null == t3.checked && null != t3.defaultChecked && (e5.defaultChecked = !!t3.defaultChecked);
  }
  function ys(e5, t3, n4) {
    if (t3.hasOwnProperty("value") || t3.hasOwnProperty("defaultValue")) {
      var r4 = t3.type;
      if (!("submit" !== r4 && "reset" !== r4 || void 0 !== t3.value && null !== t3.value)) return;
      t3 = "" + e5._wrapperState.initialValue, n4 || t3 === e5.value || (e5.value = t3), e5.defaultValue = t3;
    }
    n4 = e5.name, "" !== n4 && (e5.name = ""), e5.defaultChecked = !!e5._wrapperState.initialChecked, "" !== n4 && (e5.name = n4);
  }
  function bs(e5, t3, n4) {
    "number" === t3 && ps(e5.ownerDocument) === e5 || (null == n4 ? e5.defaultValue = "" + e5._wrapperState.initialValue : e5.defaultValue !== "" + n4 && (e5.defaultValue = "" + n4));
  }
  function Ss(e5, t3, n4, r4) {
    if (e5 = e5.options, t3) {
      t3 = {};
      for (var a4 = 0; a4 < n4.length; a4++) t3["$" + n4[a4]] = true;
      for (n4 = 0; n4 < e5.length; n4++) a4 = t3.hasOwnProperty("$" + e5[n4].value), e5[n4].selected !== a4 && (e5[n4].selected = a4), a4 && r4 && (e5[n4].defaultSelected = true);
    } else {
      for (n4 = "" + ss(n4), t3 = null, a4 = 0; a4 < e5.length; a4++) {
        if (e5[a4].value === n4) return e5[a4].selected = true, void (r4 && (e5[a4].defaultSelected = true));
        null !== t3 || e5[a4].disabled || (t3 = e5[a4]);
      }
      null !== t3 && (t3.selected = true);
    }
  }
  function ks(e5, t3) {
    if (null != t3.dangerouslySetInnerHTML) throw Error(wl(91));
    return ts({}, t3, { value: void 0, defaultValue: void 0, children: "" + e5._wrapperState.initialValue });
  }
  function Es(e5, t3) {
    var n4 = t3.value;
    if (null == n4) {
      if (n4 = t3.children, t3 = t3.defaultValue, null != n4) {
        if (null != t3) throw Error(wl(92));
        if (ws(n4)) {
          if (1 < n4.length) throw Error(wl(93));
          n4 = n4[0];
        }
        t3 = n4;
      }
      null == t3 && (t3 = ""), n4 = t3;
    }
    e5._wrapperState = { initialValue: ss(n4) };
  }
  function xs(e5, t3) {
    var n4 = ss(t3.value), r4 = ss(t3.defaultValue);
    null != n4 && (n4 = "" + n4, n4 !== e5.value && (e5.value = n4), null == t3.defaultValue && e5.defaultValue !== n4 && (e5.defaultValue = n4)), null != r4 && (e5.defaultValue = "" + r4);
  }
  function $s(e5) {
    var t3 = e5.textContent;
    t3 === e5._wrapperState.initialValue && "" !== t3 && null !== t3 && (e5.value = t3);
  }
  function _s(e5) {
    switch (e5) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Cs(e5, t3) {
    return null == e5 || "http://www.w3.org/1999/xhtml" === e5 ? _s(t3) : "http://www.w3.org/2000/svg" === e5 && "foreignObject" === t3 ? "http://www.w3.org/1999/xhtml" : e5;
  }
  function Ns(e5, t3) {
    if (t3) {
      var n4 = e5.firstChild;
      if (n4 && n4 === e5.lastChild && 3 === n4.nodeType) return void (n4.nodeValue = t3);
    }
    e5.textContent = t3;
  }
  function Os(e5, t3, n4) {
    return null == t3 || "boolean" === typeof t3 || "" === t3 ? "" : n4 || "number" !== typeof t3 || 0 === t3 || Ls.hasOwnProperty(e5) && Ls[e5] ? ("" + t3).trim() : t3 + "px";
  }
  function Ms(e5, t3) {
    for (var n4 in e5 = e5.style, t3) if (t3.hasOwnProperty(n4)) {
      var r4 = 0 === n4.indexOf("--"), a4 = Os(n4, t3[n4], r4);
      "float" === n4 && (n4 = "cssFloat"), r4 ? e5.setProperty(n4, a4) : e5[n4] = a4;
    }
  }
  function Is(e5, t3) {
    if (t3) {
      if (zs[e5] && (null != t3.children || null != t3.dangerouslySetInnerHTML)) throw Error(wl(137, e5));
      if (null != t3.dangerouslySetInnerHTML) {
        if (null != t3.children) throw Error(wl(60));
        if ("object" !== typeof t3.dangerouslySetInnerHTML || !("__html" in t3.dangerouslySetInnerHTML)) throw Error(wl(61));
      }
      if (null != t3.style && "object" !== typeof t3.style) throw Error(wl(62));
    }
  }
  function Ds(e5, t3) {
    if (-1 === e5.indexOf("-")) return "string" === typeof t3.is;
    switch (e5) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  function As(e5) {
    return e5 = e5.target || e5.srcElement || window, e5.correspondingUseElement && (e5 = e5.correspondingUseElement), 3 === e5.nodeType ? e5.parentNode : e5;
  }
  function Hs(e5) {
    if (e5 = np(e5)) {
      if ("function" !== typeof js) throw Error(wl(280));
      var t3 = e5.stateNode;
      t3 && (t3 = ap(t3), js(e5.stateNode, e5.type, t3));
    }
  }
  function Ws(e5) {
    Bs ? Us ? Us.push(e5) : Us = [e5] : Bs = e5;
  }
  function Vs() {
    if (Bs) {
      var e5 = Bs, t3 = Us;
      if (Us = Bs = null, Hs(e5), t3) for (e5 = 0; e5 < t3.length; e5++) Hs(t3[e5]);
    }
  }
  function Qs(e5, t3) {
    return e5(t3);
  }
  function qs() {
  }
  function Gs(e5, t3, n4) {
    if (Ys) return e5(t3, n4);
    Ys = true;
    try {
      return Qs(e5, t3, n4);
    } finally {
      Ys = false, (null !== Bs || null !== Us) && (qs(), Vs());
    }
  }
  function Ks(e5, t3) {
    var n4 = e5.stateNode;
    if (null === n4) return null;
    var r4 = ap(n4);
    if (null === r4) return null;
    n4 = r4[t3];
    e: switch (t3) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (r4 = !r4.disabled) || (e5 = e5.type, r4 = !("button" === e5 || "input" === e5 || "select" === e5 || "textarea" === e5)), e5 = !r4;
        break e;
      default:
        e5 = false;
    }
    if (e5) return null;
    if (n4 && "function" !== typeof n4) throw Error(wl(231, t3, typeof n4));
    return n4;
  }
  function Js(e5, t3, n4, r4, a4, o3, i4, l4, s4) {
    var u3 = Array.prototype.slice.call(arguments, 3);
    try {
      t3.apply(n4, u3);
    } catch (c4) {
      this.onError(c4);
    }
  }
  function ou(e5, t3, n4, r4, a4, o3, i4, l4, s4) {
    eu = false, tu = null, Js.apply(au, arguments);
  }
  function iu(e5, t3, n4, r4, a4, o3, i4, l4, s4) {
    if (ou.apply(this, arguments), eu) {
      if (!eu) throw Error(wl(198));
      var u3 = tu;
      eu = false, tu = null, nu || (nu = true, ru = u3);
    }
  }
  function lu(e5) {
    var t3 = e5, n4 = e5;
    if (e5.alternate) for (; t3.return; ) t3 = t3.return;
    else {
      e5 = t3;
      do {
        t3 = e5, 0 !== (4098 & t3.flags) && (n4 = t3.return), e5 = t3.return;
      } while (e5);
    }
    return 3 === t3.tag ? n4 : null;
  }
  function su(e5) {
    if (13 === e5.tag) {
      var t3 = e5.memoizedState;
      if (null === t3 && (e5 = e5.alternate, null !== e5 && (t3 = e5.memoizedState)), null !== t3) return t3.dehydrated;
    }
    return null;
  }
  function uu(e5) {
    if (lu(e5) !== e5) throw Error(wl(188));
  }
  function cu(e5) {
    var t3 = e5.alternate;
    if (!t3) {
      if (t3 = lu(e5), null === t3) throw Error(wl(188));
      return t3 !== e5 ? null : e5;
    }
    for (var n4 = e5, r4 = t3; ; ) {
      var a4 = n4.return;
      if (null === a4) break;
      var o3 = a4.alternate;
      if (null === o3) {
        if (r4 = a4.return, null !== r4) {
          n4 = r4;
          continue;
        }
        break;
      }
      if (a4.child === o3.child) {
        for (o3 = a4.child; o3; ) {
          if (o3 === n4) return uu(a4), e5;
          if (o3 === r4) return uu(a4), t3;
          o3 = o3.sibling;
        }
        throw Error(wl(188));
      }
      if (n4.return !== r4.return) n4 = a4, r4 = o3;
      else {
        for (var i4 = false, l4 = a4.child; l4; ) {
          if (l4 === n4) {
            i4 = true, n4 = a4, r4 = o3;
            break;
          }
          if (l4 === r4) {
            i4 = true, r4 = a4, n4 = o3;
            break;
          }
          l4 = l4.sibling;
        }
        if (!i4) {
          for (l4 = o3.child; l4; ) {
            if (l4 === n4) {
              i4 = true, n4 = o3, r4 = a4;
              break;
            }
            if (l4 === r4) {
              i4 = true, r4 = o3, n4 = a4;
              break;
            }
            l4 = l4.sibling;
          }
          if (!i4) throw Error(wl(189));
        }
      }
      if (n4.alternate !== r4) throw Error(wl(190));
    }
    if (3 !== n4.tag) throw Error(wl(188));
    return n4.stateNode.current === n4 ? e5 : t3;
  }
  function du(e5) {
    return e5 = cu(e5), null !== e5 ? fu(e5) : null;
  }
  function fu(e5) {
    if (5 === e5.tag || 6 === e5.tag) return e5;
    for (e5 = e5.child; null !== e5; ) {
      var t3 = fu(e5);
      if (null !== t3) return t3;
      e5 = e5.sibling;
    }
    return null;
  }
  function _u(e5) {
    if ($u && "function" === typeof $u.onCommitFiberRoot) try {
      $u.onCommitFiberRoot(xu, e5, void 0, 128 === (128 & e5.current.flags));
    } catch (t3) {
    }
  }
  function Nu(e5) {
    return e5 >>>= 0, 0 === e5 ? 32 : 31 - (Pu(e5) / Tu | 0) | 0;
  }
  function Ou(e5) {
    switch (e5 & -e5) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return 4194240 & e5;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return 130023424 & e5;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e5;
    }
  }
  function Mu(e5, t3) {
    var n4 = e5.pendingLanes;
    if (0 === n4) return 0;
    var r4 = 0, a4 = e5.suspendedLanes, o3 = e5.pingedLanes, i4 = 268435455 & n4;
    if (0 !== i4) {
      var l4 = i4 & ~a4;
      0 !== l4 ? r4 = Ou(l4) : (o3 &= i4, 0 !== o3 && (r4 = Ou(o3)));
    } else i4 = n4 & ~a4, 0 !== i4 ? r4 = Ou(i4) : 0 !== o3 && (r4 = Ou(o3));
    if (0 === r4) return 0;
    if (0 !== t3 && t3 !== r4 && 0 === (t3 & a4) && (a4 = r4 & -r4, o3 = t3 & -t3, a4 >= o3 || 16 === a4 && 0 !== (4194240 & o3))) return t3;
    if (0 !== (4 & r4) && (r4 |= 16 & n4), t3 = e5.entangledLanes, 0 !== t3) for (e5 = e5.entanglements, t3 &= r4; 0 < t3; ) n4 = 31 - Cu(t3), a4 = 1 << n4, r4 |= e5[n4], t3 &= ~a4;
    return r4;
  }
  function zu(e5, t3) {
    switch (e5) {
      case 1:
      case 2:
      case 4:
        return t3 + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t3 + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Iu(e5, t3) {
    for (var n4 = e5.suspendedLanes, r4 = e5.pingedLanes, a4 = e5.expirationTimes, o3 = e5.pendingLanes; 0 < o3; ) {
      var i4 = 31 - Cu(o3), l4 = 1 << i4, s4 = a4[i4];
      -1 === s4 ? 0 !== (l4 & n4) && 0 === (l4 & r4) || (a4[i4] = zu(l4, t3)) : s4 <= t3 && (e5.expiredLanes |= l4), o3 &= ~l4;
    }
  }
  function Du(e5) {
    return e5 = -1073741825 & e5.pendingLanes, 0 !== e5 ? e5 : 1073741824 & e5 ? 1073741824 : 0;
  }
  function Fu() {
    var e5 = Lu;
    return Lu <<= 1, 0 === (4194240 & Lu) && (Lu = 64), e5;
  }
  function Au(e5) {
    for (var t3 = [], n4 = 0; 31 > n4; n4++) t3.push(e5);
    return t3;
  }
  function ju(e5, t3, n4) {
    e5.pendingLanes |= t3, 536870912 !== t3 && (e5.suspendedLanes = 0, e5.pingedLanes = 0), e5 = e5.eventTimes, t3 = 31 - Cu(t3), e5[t3] = n4;
  }
  function Bu(e5, t3) {
    var n4 = e5.pendingLanes & ~t3;
    e5.pendingLanes = t3, e5.suspendedLanes = 0, e5.pingedLanes = 0, e5.expiredLanes &= t3, e5.mutableReadLanes &= t3, e5.entangledLanes &= t3, t3 = e5.entanglements;
    var r4 = e5.eventTimes;
    for (e5 = e5.expirationTimes; 0 < n4; ) {
      var a4 = 31 - Cu(n4), o3 = 1 << a4;
      t3[a4] = 0, r4[a4] = -1, e5[a4] = -1, n4 &= ~o3;
    }
  }
  function Uu(e5, t3) {
    var n4 = e5.entangledLanes |= t3;
    for (e5 = e5.entanglements; n4; ) {
      var r4 = 31 - Cu(n4), a4 = 1 << r4;
      a4 & t3 | e5[r4] & t3 && (e5[r4] |= t3), n4 &= ~a4;
    }
  }
  function Wu(e5) {
    return e5 &= -e5, 1 < e5 ? 4 < e5 ? 0 !== (268435455 & e5) ? 16 : 536870912 : 4 : 1;
  }
  function oc(e5, t3) {
    switch (e5) {
      case "focusin":
      case "focusout":
        Zu = null;
        break;
      case "dragenter":
      case "dragleave":
        Ju = null;
        break;
      case "mouseover":
      case "mouseout":
        ec = null;
        break;
      case "pointerover":
      case "pointerout":
        tc.delete(t3.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        nc.delete(t3.pointerId);
    }
  }
  function ic(e5, t3, n4, r4, a4, o3) {
    return null === e5 || e5.nativeEvent !== o3 ? (e5 = { blockedOn: t3, domEventName: n4, eventSystemFlags: r4, nativeEvent: o3, targetContainers: [a4] }, null !== t3 && (t3 = np(t3), null !== t3 && Qu(t3)), e5) : (e5.eventSystemFlags |= r4, t3 = e5.targetContainers, null !== a4 && -1 === t3.indexOf(a4) && t3.push(a4), e5);
  }
  function lc(e5, t3, n4, r4, a4) {
    switch (t3) {
      case "focusin":
        return Zu = ic(Zu, e5, t3, n4, r4, a4), true;
      case "dragenter":
        return Ju = ic(Ju, e5, t3, n4, r4, a4), true;
      case "mouseover":
        return ec = ic(ec, e5, t3, n4, r4, a4), true;
      case "pointerover":
        var o3 = a4.pointerId;
        return tc.set(o3, ic(tc.get(o3) || null, e5, t3, n4, r4, a4)), true;
      case "gotpointercapture":
        return o3 = a4.pointerId, nc.set(o3, ic(nc.get(o3) || null, e5, t3, n4, r4, a4)), true;
    }
    return false;
  }
  function sc(e5) {
    var t3 = tp(e5.target);
    if (null !== t3) {
      var n4 = lu(t3);
      if (null !== n4) {
        if (t3 = n4.tag, 13 === t3) {
          if (t3 = su(n4), null !== t3) return e5.blockedOn = t3, void Gu(e5.priority, function() {
            qu(n4);
          });
        } else if (3 === t3 && n4.stateNode.current.memoizedState.isDehydrated) return void (e5.blockedOn = 3 === n4.tag ? n4.stateNode.containerInfo : null);
      }
    }
    e5.blockedOn = null;
  }
  function uc(e5) {
    if (null !== e5.blockedOn) return false;
    for (var t3 = e5.targetContainers; 0 < t3.length; ) {
      var n4 = wc(e5.domEventName, e5.eventSystemFlags, t3[0], e5.nativeEvent);
      if (null !== n4) return t3 = np(n4), null !== t3 && Qu(t3), e5.blockedOn = n4, false;
      n4 = e5.nativeEvent;
      var r4 = new n4.constructor(n4.type, n4);
      Fs = r4, n4.target.dispatchEvent(r4), Fs = null, t3.shift();
    }
    return true;
  }
  function cc(e5, t3, n4) {
    uc(e5) && n4.delete(t3);
  }
  function dc() {
    Ku = false, null !== Zu && uc(Zu) && (Zu = null), null !== Ju && uc(Ju) && (Ju = null), null !== ec && uc(ec) && (ec = null), tc.forEach(cc), nc.forEach(cc);
  }
  function fc(e5, t3) {
    e5.blockedOn === t3 && (e5.blockedOn = null, Ku || (Ku = true, bl.unstable_scheduleCallback(bl.unstable_NormalPriority, dc)));
  }
  function pc(e5) {
    function t3(t4) {
      return fc(t4, e5);
    }
    if (0 < Xu.length) {
      fc(Xu[0], e5);
      for (var n4 = 1; n4 < Xu.length; n4++) {
        var r4 = Xu[n4];
        r4.blockedOn === e5 && (r4.blockedOn = null);
      }
    }
    for (null !== Zu && fc(Zu, e5), null !== Ju && fc(Ju, e5), null !== ec && fc(ec, e5), tc.forEach(t3), nc.forEach(t3), n4 = 0; n4 < rc.length; n4++) r4 = rc[n4], r4.blockedOn === e5 && (r4.blockedOn = null);
    for (; 0 < rc.length && (n4 = rc[0], null === n4.blockedOn); ) sc(n4), null === n4.blockedOn && rc.shift();
  }
  function mc(e5, t3, n4, r4) {
    var a4 = Hu, o3 = hc.transition;
    hc.transition = null;
    try {
      Hu = 1, yc(e5, t3, n4, r4);
    } finally {
      Hu = a4, hc.transition = o3;
    }
  }
  function vc(e5, t3, n4, r4) {
    var a4 = Hu, o3 = hc.transition;
    hc.transition = null;
    try {
      Hu = 4, yc(e5, t3, n4, r4);
    } finally {
      Hu = a4, hc.transition = o3;
    }
  }
  function yc(e5, t3, n4, r4) {
    if (gc) {
      var a4 = wc(e5, t3, n4, r4);
      if (null === a4) Cf(e5, t3, r4, bc, n4), oc(e5, r4);
      else if (lc(a4, e5, t3, n4, r4)) r4.stopPropagation();
      else if (oc(e5, r4), 4 & t3 && -1 < ac.indexOf(e5)) {
        for (; null !== a4; ) {
          var o3 = np(a4);
          if (null !== o3 && Vu(o3), o3 = wc(e5, t3, n4, r4), null === o3 && Cf(e5, t3, r4, bc, n4), o3 === a4) break;
          a4 = o3;
        }
        null !== a4 && r4.stopPropagation();
      } else Cf(e5, t3, r4, null, n4);
    }
  }
  function wc(e5, t3, n4, r4) {
    if (bc = null, e5 = As(r4), e5 = tp(e5), null !== e5) if (t3 = lu(e5), null === t3) e5 = null;
    else if (n4 = t3.tag, 13 === n4) {
      if (e5 = su(t3), null !== e5) return e5;
      e5 = null;
    } else if (3 === n4) {
      if (t3.stateNode.current.memoizedState.isDehydrated) return 3 === t3.tag ? t3.stateNode.containerInfo : null;
      e5 = null;
    } else t3 !== e5 && (e5 = null);
    return bc = e5, null;
  }
  function Sc(e5) {
    switch (e5) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (yu()) {
          case bu:
            return 1;
          case wu:
            return 4;
          case Su:
          case ku:
            return 16;
          case Eu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  function $c() {
    if (xc) return xc;
    var e5, t3, n4 = Ec, r4 = n4.length, a4 = "value" in kc ? kc.value : kc.textContent, o3 = a4.length;
    for (e5 = 0; e5 < r4 && n4[e5] === a4[e5]; e5++) ;
    var i4 = r4 - e5;
    for (t3 = 1; t3 <= i4 && n4[r4 - t3] === a4[o3 - t3]; t3++) ;
    return xc = a4.slice(e5, 1 < t3 ? 1 - t3 : void 0);
  }
  function _c(e5) {
    var t3 = e5.keyCode;
    return "charCode" in e5 ? (e5 = e5.charCode, 0 === e5 && 13 === t3 && (e5 = 13)) : e5 = t3, 10 === e5 && (e5 = 13), 32 <= e5 || 13 === e5 ? e5 : 0;
  }
  function Cc() {
    return true;
  }
  function Pc() {
    return false;
  }
  function Tc(e5) {
    function t3(t4, n4, r4, a4, o3) {
      for (var i4 in this._reactName = t4, this._targetInst = r4, this.type = n4, this.nativeEvent = a4, this.target = o3, this.currentTarget = null, e5) e5.hasOwnProperty(i4) && (t4 = e5[i4], this[i4] = t4 ? t4(a4) : a4[i4]);
      return this.isDefaultPrevented = (null != a4.defaultPrevented ? a4.defaultPrevented : false === a4.returnValue) ? Cc : Pc, this.isPropagationStopped = Pc, this;
    }
    return ts(t3.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var e6 = this.nativeEvent;
      e6 && (e6.preventDefault ? e6.preventDefault() : "unknown" !== typeof e6.returnValue && (e6.returnValue = false), this.isDefaultPrevented = Cc);
    }, stopPropagation: function() {
      var e6 = this.nativeEvent;
      e6 && (e6.stopPropagation ? e6.stopPropagation() : "unknown" !== typeof e6.cancelBubble && (e6.cancelBubble = true), this.isPropagationStopped = Cc);
    }, persist: function() {
    }, isPersistent: Cc }), t3;
  }
  function Zc(e5) {
    var t3 = this.nativeEvent;
    return t3.getModifierState ? t3.getModifierState(e5) : !!(e5 = Xc[e5]) && !!t3[e5];
  }
  function Jc() {
    return Zc;
  }
  function vd(e5, t3) {
    switch (e5) {
      case "keyup":
        return -1 !== cd.indexOf(t3.keyCode);
      case "keydown":
        return 229 !== t3.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function yd(e5) {
    return e5 = e5.detail, "object" === typeof e5 && "data" in e5 ? e5.data : null;
  }
  function wd(e5, t3) {
    switch (e5) {
      case "compositionend":
        return yd(t3);
      case "keypress":
        return 32 !== t3.which ? null : (md = true, gd);
      case "textInput":
        return e5 = t3.data, e5 === gd && md ? null : e5;
      default:
        return null;
    }
  }
  function Sd(e5, t3) {
    if (bd) return "compositionend" === e5 || !dd && vd(e5, t3) ? (e5 = $c(), xc = Ec = kc = null, bd = false, e5) : null;
    switch (e5) {
      case "paste":
        return null;
      case "keypress":
        if (!(t3.ctrlKey || t3.altKey || t3.metaKey) || t3.ctrlKey && t3.altKey) {
          if (t3.char && 1 < t3.char.length) return t3.char;
          if (t3.which) return String.fromCharCode(t3.which);
        }
        return null;
      case "compositionend":
        return hd && "ko" !== t3.locale ? null : t3.data;
      default:
        return null;
    }
  }
  function Ed(e5) {
    var t3 = e5 && e5.nodeName && e5.nodeName.toLowerCase();
    return "input" === t3 ? !!kd[e5.type] : "textarea" === t3;
  }
  function xd(e5, t3, n4, r4) {
    Ws(r4), t3 = Tf(t3, "onChange"), 0 < t3.length && (n4 = new Mc("onChange", "change", null, n4, r4), e5.push({ event: n4, listeners: t3 }));
  }
  function Cd(e5) {
    Sf(e5, 0);
  }
  function Pd(e5) {
    var t3 = rp(e5);
    if (fs(t3)) return e5;
  }
  function Td(e5, t3) {
    if ("change" === e5) return t3;
  }
  function Md() {
    $d && ($d.detachEvent("onpropertychange", zd), _d = $d = null);
  }
  function zd(e5) {
    if ("value" === e5.propertyName && Pd(_d)) {
      var t3 = [];
      xd(t3, _d, e5, As(e5)), Gs(Cd, t3);
    }
  }
  function Id(e5, t3, n4) {
    "focusin" === e5 ? (Md(), $d = t3, _d = n4, $d.attachEvent("onpropertychange", zd)) : "focusout" === e5 && Md();
  }
  function Dd(e5) {
    if ("selectionchange" === e5 || "keyup" === e5 || "keydown" === e5) return Pd(_d);
  }
  function Fd(e5, t3) {
    if ("click" === e5) return Pd(t3);
  }
  function Ad(e5, t3) {
    if ("input" === e5 || "change" === e5) return Pd(t3);
  }
  function jd(e5, t3) {
    return e5 === t3 && (0 !== e5 || 1 / e5 === 1 / t3) || e5 !== e5 && t3 !== t3;
  }
  function Ud(e5, t3) {
    if (Bd(e5, t3)) return true;
    if ("object" !== typeof e5 || null === e5 || "object" !== typeof t3 || null === t3) return false;
    var n4 = Object.keys(e5), r4 = Object.keys(t3);
    if (n4.length !== r4.length) return false;
    for (r4 = 0; r4 < n4.length; r4++) {
      var a4 = n4[r4];
      if (!_l.call(t3, a4) || !Bd(e5[a4], t3[a4])) return false;
    }
    return true;
  }
  function Hd(e5) {
    for (; e5 && e5.firstChild; ) e5 = e5.firstChild;
    return e5;
  }
  function Wd(e5, t3) {
    var n4, r4 = Hd(e5);
    for (e5 = 0; r4; ) {
      if (3 === r4.nodeType) {
        if (n4 = e5 + r4.textContent.length, e5 <= t3 && n4 >= t3) return { node: r4, offset: t3 - e5 };
        e5 = n4;
      }
      e: {
        for (; r4; ) {
          if (r4.nextSibling) {
            r4 = r4.nextSibling;
            break e;
          }
          r4 = r4.parentNode;
        }
        r4 = void 0;
      }
      r4 = Hd(r4);
    }
  }
  function Vd(e5, t3) {
    return !(!e5 || !t3) && (e5 === t3 || (!e5 || 3 !== e5.nodeType) && (t3 && 3 === t3.nodeType ? Vd(e5, t3.parentNode) : "contains" in e5 ? e5.contains(t3) : !!e5.compareDocumentPosition && !!(16 & e5.compareDocumentPosition(t3))));
  }
  function Qd() {
    for (var e5 = window, t3 = ps(); t3 instanceof e5.HTMLIFrameElement; ) {
      try {
        var n4 = "string" === typeof t3.contentWindow.location.href;
      } catch (r4) {
        n4 = false;
      }
      if (!n4) break;
      e5 = t3.contentWindow, t3 = ps(e5.document);
    }
    return t3;
  }
  function qd(e5) {
    var t3 = e5 && e5.nodeName && e5.nodeName.toLowerCase();
    return t3 && ("input" === t3 && ("text" === e5.type || "search" === e5.type || "tel" === e5.type || "url" === e5.type || "password" === e5.type) || "textarea" === t3 || "true" === e5.contentEditable);
  }
  function Yd(e5) {
    var t3 = Qd(), n4 = e5.focusedElem, r4 = e5.selectionRange;
    if (t3 !== n4 && n4 && n4.ownerDocument && Vd(n4.ownerDocument.documentElement, n4)) {
      if (null !== r4 && qd(n4)) {
        if (t3 = r4.start, e5 = r4.end, void 0 === e5 && (e5 = t3), "selectionStart" in n4) n4.selectionStart = t3, n4.selectionEnd = Math.min(e5, n4.value.length);
        else if (e5 = (t3 = n4.ownerDocument || document) && t3.defaultView || window, e5.getSelection) {
          e5 = e5.getSelection();
          var a4 = n4.textContent.length, o3 = Math.min(r4.start, a4);
          r4 = void 0 === r4.end ? o3 : Math.min(r4.end, a4), !e5.extend && o3 > r4 && (a4 = r4, r4 = o3, o3 = a4), a4 = Wd(n4, o3);
          var i4 = Wd(n4, r4);
          a4 && i4 && (1 !== e5.rangeCount || e5.anchorNode !== a4.node || e5.anchorOffset !== a4.offset || e5.focusNode !== i4.node || e5.focusOffset !== i4.offset) && (t3 = t3.createRange(), t3.setStart(a4.node, a4.offset), e5.removeAllRanges(), o3 > r4 ? (e5.addRange(t3), e5.extend(i4.node, i4.offset)) : (t3.setEnd(i4.node, i4.offset), e5.addRange(t3)));
        }
      }
      for (t3 = [], e5 = n4; e5 = e5.parentNode; ) 1 === e5.nodeType && t3.push({ element: e5, left: e5.scrollLeft, top: e5.scrollTop });
      for ("function" === typeof n4.focus && n4.focus(), n4 = 0; n4 < t3.length; n4++) e5 = t3[n4], e5.element.scrollLeft = e5.left, e5.element.scrollTop = e5.top;
    }
  }
  function ef(e5, t3, n4) {
    var r4 = n4.window === n4 ? n4.document : 9 === n4.nodeType ? n4 : n4.ownerDocument;
    Jd || null == Kd || Kd !== ps(r4) || (r4 = Kd, "selectionStart" in r4 && qd(r4) ? r4 = { start: r4.selectionStart, end: r4.selectionEnd } : (r4 = (r4.ownerDocument && r4.ownerDocument.defaultView || window).getSelection(), r4 = { anchorNode: r4.anchorNode, anchorOffset: r4.anchorOffset, focusNode: r4.focusNode, focusOffset: r4.focusOffset }), Zd && Ud(Zd, r4) || (Zd = r4, r4 = Tf(Xd, "onSelect"), 0 < r4.length && (t3 = new Mc("onSelect", "select", null, t3, n4), e5.push({ event: t3, listeners: r4 }), t3.target = Kd)));
  }
  function tf(e5, t3) {
    var n4 = {};
    return n4[e5.toLowerCase()] = t3.toLowerCase(), n4["Webkit" + e5] = "webkit" + t3, n4["Moz" + e5] = "moz" + t3, n4;
  }
  function of(e5) {
    if (rf[e5]) return rf[e5];
    if (!nf[e5]) return e5;
    var t3, n4 = nf[e5];
    for (t3 in n4) if (n4.hasOwnProperty(t3) && t3 in af) return rf[e5] = n4[t3];
    return e5;
  }
  function pf(e5, t3) {
    df.set(e5, t3), El(t3, [e5]);
  }
  function wf(e5, t3, n4) {
    var r4 = e5.type || "unknown-event";
    e5.currentTarget = n4, iu(r4, t3, void 0, e5), e5.currentTarget = null;
  }
  function Sf(e5, t3) {
    t3 = 0 !== (4 & t3);
    for (var n4 = 0; n4 < e5.length; n4++) {
      var r4 = e5[n4], a4 = r4.event;
      r4 = r4.listeners;
      e: {
        var o3 = void 0;
        if (t3) for (var i4 = r4.length - 1; 0 <= i4; i4--) {
          var l4 = r4[i4], s4 = l4.instance, u3 = l4.currentTarget;
          if (l4 = l4.listener, s4 !== o3 && a4.isPropagationStopped()) break e;
          wf(a4, l4, u3), o3 = s4;
        }
        else for (i4 = 0; i4 < r4.length; i4++) {
          if (l4 = r4[i4], s4 = l4.instance, u3 = l4.currentTarget, l4 = l4.listener, s4 !== o3 && a4.isPropagationStopped()) break e;
          wf(a4, l4, u3), o3 = s4;
        }
      }
    }
    if (nu) throw e5 = ru, nu = false, ru = null, e5;
  }
  function kf(e5, t3) {
    var n4 = t3[Zf];
    void 0 === n4 && (n4 = t3[Zf] = /* @__PURE__ */ new Set());
    var r4 = e5 + "__bubble";
    n4.has(r4) || (_f(t3, e5, 2, false), n4.add(r4));
  }
  function Ef(e5, t3, n4) {
    var r4 = 0;
    t3 && (r4 |= 4), _f(n4, e5, r4, t3);
  }
  function $f(e5) {
    if (!e5[xf]) {
      e5[xf] = true, Sl.forEach(function(t4) {
        "selectionchange" !== t4 && (bf.has(t4) || Ef(t4, false, e5), Ef(t4, true, e5));
      });
      var t3 = 9 === e5.nodeType ? e5 : e5.ownerDocument;
      null === t3 || t3[xf] || (t3[xf] = true, Ef("selectionchange", false, t3));
    }
  }
  function _f(e5, t3, n4, r4) {
    switch (Sc(t3)) {
      case 1:
        var a4 = mc;
        break;
      case 4:
        a4 = vc;
        break;
      default:
        a4 = yc;
    }
    n4 = a4.bind(null, t3, n4, e5), a4 = void 0, !Xs || "touchstart" !== t3 && "touchmove" !== t3 && "wheel" !== t3 || (a4 = true), r4 ? void 0 !== a4 ? e5.addEventListener(t3, n4, { capture: true, passive: a4 }) : e5.addEventListener(t3, n4, true) : void 0 !== a4 ? e5.addEventListener(t3, n4, { passive: a4 }) : e5.addEventListener(t3, n4, false);
  }
  function Cf(e5, t3, n4, r4, a4) {
    var o3 = r4;
    if (0 === (1 & t3) && 0 === (2 & t3) && null !== r4) e: for (; ; ) {
      if (null === r4) return;
      var i4 = r4.tag;
      if (3 === i4 || 4 === i4) {
        var l4 = r4.stateNode.containerInfo;
        if (l4 === a4 || 8 === l4.nodeType && l4.parentNode === a4) break;
        if (4 === i4) for (i4 = r4.return; null !== i4; ) {
          var s4 = i4.tag;
          if ((3 === s4 || 4 === s4) && (s4 = i4.stateNode.containerInfo, s4 === a4 || 8 === s4.nodeType && s4.parentNode === a4)) return;
          i4 = i4.return;
        }
        for (; null !== l4; ) {
          if (i4 = tp(l4), null === i4) return;
          if (s4 = i4.tag, 5 === s4 || 6 === s4) {
            r4 = o3 = i4;
            continue e;
          }
          l4 = l4.parentNode;
        }
      }
      r4 = r4.return;
    }
    Gs(function() {
      var r5 = o3, a5 = As(n4), i5 = [];
      e: {
        var l5 = df.get(e5);
        if (void 0 !== l5) {
          var s5 = Mc, u3 = e5;
          switch (e5) {
            case "keypress":
              if (0 === _c(n4)) break e;
            case "keydown":
            case "keyup":
              s5 = td;
              break;
            case "focusin":
              u3 = "focus", s5 = Uc;
              break;
            case "focusout":
              u3 = "blur", s5 = Uc;
              break;
            case "beforeblur":
            case "afterblur":
              s5 = Uc;
              break;
            case "click":
              if (2 === n4.button) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              s5 = Fc;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              s5 = jc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              s5 = od;
              break;
            case lf:
            case sf:
            case uf:
              s5 = Wc;
              break;
            case cf:
              s5 = ld;
              break;
            case "scroll":
              s5 = Ic;
              break;
            case "wheel":
              s5 = ud;
              break;
            case "copy":
            case "cut":
            case "paste":
              s5 = Qc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              s5 = rd;
          }
          var c4 = 0 !== (4 & t3), d3 = !c4 && "scroll" === e5, f3 = c4 ? null !== l5 ? l5 + "Capture" : null : l5;
          c4 = [];
          for (var p4, h4 = r5; null !== h4; ) {
            p4 = h4;
            var g4 = p4.stateNode;
            if (5 === p4.tag && null !== g4 && (p4 = g4, null !== f3 && (g4 = Ks(h4, f3), null != g4 && c4.push(Pf(h4, g4, p4)))), d3) break;
            h4 = h4.return;
          }
          0 < c4.length && (l5 = new s5(l5, u3, null, n4, a5), i5.push({ event: l5, listeners: c4 }));
        }
      }
      if (0 === (7 & t3)) {
        if (l5 = "mouseover" === e5 || "pointerover" === e5, s5 = "mouseout" === e5 || "pointerout" === e5, (!l5 || n4 === Fs || !(u3 = n4.relatedTarget || n4.fromElement) || !tp(u3) && !u3[Xf]) && (s5 || l5) && (l5 = a5.window === a5 ? a5 : (l5 = a5.ownerDocument) ? l5.defaultView || l5.parentWindow : window, s5 ? (u3 = n4.relatedTarget || n4.toElement, s5 = r5, u3 = u3 ? tp(u3) : null, null !== u3 && (d3 = lu(u3), u3 !== d3 || 5 !== u3.tag && 6 !== u3.tag) && (u3 = null)) : (s5 = null, u3 = r5), s5 !== u3)) {
          if (c4 = Fc, g4 = "onMouseLeave", f3 = "onMouseEnter", h4 = "mouse", "pointerout" !== e5 && "pointerover" !== e5 || (c4 = rd, g4 = "onPointerLeave", f3 = "onPointerEnter", h4 = "pointer"), d3 = null == s5 ? l5 : rp(s5), p4 = null == u3 ? l5 : rp(u3), l5 = new c4(g4, h4 + "leave", s5, n4, a5), l5.target = d3, l5.relatedTarget = p4, g4 = null, tp(a5) === r5 && (c4 = new c4(f3, h4 + "enter", u3, n4, a5), c4.target = p4, c4.relatedTarget = d3, g4 = c4), d3 = g4, s5 && u3) e: {
            for (c4 = s5, f3 = u3, h4 = 0, p4 = c4; p4; p4 = Nf(p4)) h4++;
            for (p4 = 0, g4 = f3; g4; g4 = Nf(g4)) p4++;
            for (; 0 < h4 - p4; ) c4 = Nf(c4), h4--;
            for (; 0 < p4 - h4; ) f3 = Nf(f3), p4--;
            for (; h4--; ) {
              if (c4 === f3 || null !== f3 && c4 === f3.alternate) break e;
              c4 = Nf(c4), f3 = Nf(f3);
            }
            c4 = null;
          }
          else c4 = null;
          null !== s5 && Lf(i5, l5, s5, c4, false), null !== u3 && null !== d3 && Lf(i5, d3, u3, c4, true);
        }
        if (l5 = r5 ? rp(r5) : window, s5 = l5.nodeName && l5.nodeName.toLowerCase(), "select" === s5 || "input" === s5 && "file" === l5.type) var m4 = Td;
        else if (Ed(l5)) if (Nd) m4 = Ad;
        else {
          m4 = Dd;
          var v3 = Id;
        }
        else (s5 = l5.nodeName) && "input" === s5.toLowerCase() && ("checkbox" === l5.type || "radio" === l5.type) && (m4 = Fd);
        switch (m4 && (m4 = m4(e5, r5)) ? xd(i5, m4, n4, a5) : (v3 && v3(e5, l5, r5), "focusout" === e5 && (v3 = l5._wrapperState) && v3.controlled && "number" === l5.type && bs(l5, "number", l5.value)), v3 = r5 ? rp(r5) : window, e5) {
          case "focusin":
            (Ed(v3) || "true" === v3.contentEditable) && (Kd = v3, Xd = r5, Zd = null);
            break;
          case "focusout":
            Zd = Xd = Kd = null;
            break;
          case "mousedown":
            Jd = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Jd = false, ef(i5, n4, a5);
            break;
          case "selectionchange":
            if (Gd) break;
          case "keydown":
          case "keyup":
            ef(i5, n4, a5);
        }
        var y3;
        if (dd) e: {
          switch (e5) {
            case "compositionstart":
              var b3 = "onCompositionStart";
              break e;
            case "compositionend":
              b3 = "onCompositionEnd";
              break e;
            case "compositionupdate":
              b3 = "onCompositionUpdate";
              break e;
          }
          b3 = void 0;
        }
        else bd ? vd(e5, n4) && (b3 = "onCompositionEnd") : "keydown" === e5 && 229 === n4.keyCode && (b3 = "onCompositionStart");
        b3 && (hd && "ko" !== n4.locale && (bd || "onCompositionStart" !== b3 ? "onCompositionEnd" === b3 && bd && (y3 = $c()) : (kc = a5, Ec = "value" in kc ? kc.value : kc.textContent, bd = true)), v3 = Tf(r5, b3), 0 < v3.length && (b3 = new Yc(b3, e5, null, n4, a5), i5.push({ event: b3, listeners: v3 }), y3 ? b3.data = y3 : (y3 = yd(n4), null !== y3 && (b3.data = y3)))), (y3 = pd ? wd(e5, n4) : Sd(e5, n4)) && (r5 = Tf(r5, "onBeforeInput"), 0 < r5.length && (a5 = new Yc("onBeforeInput", "beforeinput", null, n4, a5), i5.push({ event: a5, listeners: r5 }), a5.data = y3));
      }
      Sf(i5, t3);
    });
  }
  function Pf(e5, t3, n4) {
    return { instance: e5, listener: t3, currentTarget: n4 };
  }
  function Tf(e5, t3) {
    for (var n4 = t3 + "Capture", r4 = []; null !== e5; ) {
      var a4 = e5, o3 = a4.stateNode;
      5 === a4.tag && null !== o3 && (a4 = o3, o3 = Ks(e5, n4), null != o3 && r4.unshift(Pf(e5, o3, a4)), o3 = Ks(e5, t3), null != o3 && r4.push(Pf(e5, o3, a4))), e5 = e5.return;
    }
    return r4;
  }
  function Nf(e5) {
    if (null === e5) return null;
    do {
      e5 = e5.return;
    } while (e5 && 5 !== e5.tag);
    return e5 || null;
  }
  function Lf(e5, t3, n4, r4, a4) {
    for (var o3 = t3._reactName, i4 = []; null !== n4 && n4 !== r4; ) {
      var l4 = n4, s4 = l4.alternate, u3 = l4.stateNode;
      if (null !== s4 && s4 === r4) break;
      5 === l4.tag && null !== u3 && (l4 = u3, a4 ? (s4 = Ks(n4, o3), null != s4 && i4.unshift(Pf(n4, s4, l4))) : a4 || (s4 = Ks(n4, o3), null != s4 && i4.push(Pf(n4, s4, l4)))), n4 = n4.return;
    }
    0 !== i4.length && e5.push({ event: t3, listeners: i4 });
  }
  function Mf(e5) {
    return ("string" === typeof e5 ? e5 : "" + e5).replace(Rf, "\n").replace(Of, "");
  }
  function zf(e5, t3, n4) {
    if (t3 = Mf(t3), Mf(e5) !== t3 && n4) throw Error(wl(425));
  }
  function If() {
  }
  function Af(e5, t3) {
    return "textarea" === e5 || "noscript" === e5 || "string" === typeof t3.children || "number" === typeof t3.children || "object" === typeof t3.dangerouslySetInnerHTML && null !== t3.dangerouslySetInnerHTML && null != t3.dangerouslySetInnerHTML.__html;
  }
  function Wf(e5) {
    setTimeout(function() {
      throw e5;
    });
  }
  function Vf(e5, t3) {
    var n4 = t3, r4 = 0;
    do {
      var a4 = n4.nextSibling;
      if (e5.removeChild(n4), a4 && 8 === a4.nodeType) if (n4 = a4.data, "/$" === n4) {
        if (0 === r4) return e5.removeChild(a4), void pc(t3);
        r4--;
      } else "$" !== n4 && "$?" !== n4 && "$!" !== n4 || r4++;
      n4 = a4;
    } while (n4);
    pc(t3);
  }
  function Qf(e5) {
    for (; null != e5; e5 = e5.nextSibling) {
      var t3 = e5.nodeType;
      if (1 === t3 || 3 === t3) break;
      if (8 === t3) {
        if (t3 = e5.data, "$" === t3 || "$!" === t3 || "$?" === t3) break;
        if ("/$" === t3) return null;
      }
    }
    return e5;
  }
  function qf(e5) {
    e5 = e5.previousSibling;
    for (var t3 = 0; e5; ) {
      if (8 === e5.nodeType) {
        var n4 = e5.data;
        if ("$" === n4 || "$!" === n4 || "$?" === n4) {
          if (0 === t3) return e5;
          t3--;
        } else "/$" === n4 && t3++;
      }
      e5 = e5.previousSibling;
    }
    return null;
  }
  function tp(e5) {
    var t3 = e5[Gf];
    if (t3) return t3;
    for (var n4 = e5.parentNode; n4; ) {
      if (t3 = n4[Xf] || n4[Gf]) {
        if (n4 = t3.alternate, null !== t3.child || null !== n4 && null !== n4.child) for (e5 = qf(e5); null !== e5; ) {
          if (n4 = e5[Gf]) return n4;
          e5 = qf(e5);
        }
        return t3;
      }
      e5 = n4, n4 = e5.parentNode;
    }
    return null;
  }
  function np(e5) {
    return e5 = e5[Gf] || e5[Xf], !e5 || 5 !== e5.tag && 6 !== e5.tag && 13 !== e5.tag && 3 !== e5.tag ? null : e5;
  }
  function rp(e5) {
    if (5 === e5.tag || 6 === e5.tag) return e5.stateNode;
    throw Error(wl(33));
  }
  function ap(e5) {
    return e5[Kf] || null;
  }
  function lp(e5) {
    return { current: e5 };
  }
  function sp(e5) {
    0 > ip || (e5.current = op[ip], op[ip] = null, ip--);
  }
  function up(e5, t3) {
    ip++, op[ip] = e5.current, e5.current = t3;
  }
  function hp(e5, t3) {
    var n4 = e5.type.contextTypes;
    if (!n4) return cp;
    var r4 = e5.stateNode;
    if (r4 && r4.__reactInternalMemoizedUnmaskedChildContext === t3) return r4.__reactInternalMemoizedMaskedChildContext;
    var a4, o3 = {};
    for (a4 in n4) o3[a4] = t3[a4];
    return r4 && (e5 = e5.stateNode, e5.__reactInternalMemoizedUnmaskedChildContext = t3, e5.__reactInternalMemoizedMaskedChildContext = o3), o3;
  }
  function gp(e5) {
    return e5 = e5.childContextTypes, null !== e5 && void 0 !== e5;
  }
  function mp() {
    sp(fp), sp(dp);
  }
  function vp(e5, t3, n4) {
    if (dp.current !== cp) throw Error(wl(168));
    up(dp, t3), up(fp, n4);
  }
  function yp(e5, t3, n4) {
    var r4 = e5.stateNode;
    if (t3 = t3.childContextTypes, "function" !== typeof r4.getChildContext) return n4;
    for (var a4 in r4 = r4.getChildContext(), r4) if (!(a4 in t3)) throw Error(wl(108, ls(e5) || "Unknown", a4));
    return ts({}, n4, r4);
  }
  function bp(e5) {
    return e5 = (e5 = e5.stateNode) && e5.__reactInternalMemoizedMergedChildContext || cp, pp = dp.current, up(dp, e5), up(fp, fp.current), true;
  }
  function wp(e5, t3, n4) {
    var r4 = e5.stateNode;
    if (!r4) throw Error(wl(169));
    n4 ? (e5 = yp(e5, t3, pp), r4.__reactInternalMemoizedMergedChildContext = e5, sp(fp), sp(dp), up(dp, e5)) : sp(fp), up(fp, n4);
  }
  function xp(e5) {
    null === Sp ? Sp = [e5] : Sp.push(e5);
  }
  function $p(e5) {
    kp = true, xp(e5);
  }
  function _p() {
    if (!Ep && null !== Sp) {
      Ep = true;
      var e5 = 0, t3 = Hu;
      try {
        var n4 = Sp;
        for (Hu = 1; e5 < n4.length; e5++) {
          var r4 = n4[e5];
          do {
            r4 = r4(true);
          } while (null !== r4);
        }
        Sp = null, kp = false;
      } catch (ub) {
        throw null !== Sp && (Sp = Sp.slice(e5 + 1)), pu(bu, _p), ub;
      } finally {
        Hu = t3, Ep = false;
      }
    }
    return null;
  }
  function Ip(e5, t3) {
    Cp[Pp++] = Np, Cp[Pp++] = Tp, Tp = e5, Np = t3;
  }
  function Dp(e5, t3, n4) {
    Lp[Rp++] = Mp, Lp[Rp++] = zp, Lp[Rp++] = Op, Op = e5;
    var r4 = Mp;
    e5 = zp;
    var a4 = 32 - Cu(r4) - 1;
    r4 &= ~(1 << a4), n4 += 1;
    var o3 = 32 - Cu(t3) + a4;
    if (30 < o3) {
      var i4 = a4 - a4 % 5;
      o3 = (r4 & (1 << i4) - 1).toString(32), r4 >>= i4, a4 -= i4, Mp = 1 << 32 - Cu(t3) + a4 | n4 << a4 | r4, zp = o3 + e5;
    } else Mp = 1 << o3 | n4 << a4 | r4, zp = e5;
  }
  function Fp(e5) {
    null !== e5.return && (Ip(e5, 1), Dp(e5, 1, 0));
  }
  function Ap(e5) {
    for (; e5 === Tp; ) Tp = Cp[--Pp], Cp[Pp] = null, Np = Cp[--Pp], Cp[Pp] = null;
    for (; e5 === Op; ) Op = Lp[--Rp], Lp[Rp] = null, zp = Lp[--Rp], Lp[Rp] = null, Mp = Lp[--Rp], Lp[Rp] = null;
  }
  function Wp(e5, t3) {
    var n4 = by(5, null, null, 0);
    n4.elementType = "DELETED", n4.stateNode = t3, n4.return = e5, t3 = e5.deletions, null === t3 ? (e5.deletions = [n4], e5.flags |= 16) : t3.push(n4);
  }
  function Vp(e5, t3) {
    switch (e5.tag) {
      case 5:
        var n4 = e5.type;
        return t3 = 1 !== t3.nodeType || n4.toLowerCase() !== t3.nodeName.toLowerCase() ? null : t3, null !== t3 && (e5.stateNode = t3, jp = e5, Bp = Qf(t3.firstChild), true);
      case 6:
        return t3 = "" === e5.pendingProps || 3 !== t3.nodeType ? null : t3, null !== t3 && (e5.stateNode = t3, jp = e5, Bp = null, true);
      case 13:
        return t3 = 8 !== t3.nodeType ? null : t3, null !== t3 && (n4 = null !== Op ? { id: Mp, overflow: zp } : null, e5.memoizedState = { dehydrated: t3, treeContext: n4, retryLane: 1073741824 }, n4 = by(18, null, null, 0), n4.stateNode = t3, n4.return = e5, e5.child = n4, jp = e5, Bp = null, true);
      default:
        return false;
    }
  }
  function Qp(e5) {
    return 0 !== (1 & e5.mode) && 0 === (128 & e5.flags);
  }
  function qp(e5) {
    if (Up) {
      var t3 = Bp;
      if (t3) {
        var n4 = t3;
        if (!Vp(e5, t3)) {
          if (Qp(e5)) throw Error(wl(418));
          t3 = Qf(n4.nextSibling);
          var r4 = jp;
          t3 && Vp(e5, t3) ? Wp(r4, n4) : (e5.flags = -4097 & e5.flags | 2, Up = false, jp = e5);
        }
      } else {
        if (Qp(e5)) throw Error(wl(418));
        e5.flags = -4097 & e5.flags | 2, Up = false, jp = e5;
      }
    }
  }
  function Yp(e5) {
    for (e5 = e5.return; null !== e5 && 5 !== e5.tag && 3 !== e5.tag && 13 !== e5.tag; ) e5 = e5.return;
    jp = e5;
  }
  function Gp(e5) {
    if (e5 !== jp) return false;
    if (!Up) return Yp(e5), Up = true, false;
    var t3;
    if ((t3 = 3 !== e5.tag) && !(t3 = 5 !== e5.tag) && (t3 = e5.type, t3 = "head" !== t3 && "body" !== t3 && !Af(e5.type, e5.memoizedProps)), t3 && (t3 = Bp)) {
      if (Qp(e5)) throw Kp(), Error(wl(418));
      for (; t3; ) Wp(e5, t3), t3 = Qf(t3.nextSibling);
    }
    if (Yp(e5), 13 === e5.tag) {
      if (e5 = e5.memoizedState, e5 = null !== e5 ? e5.dehydrated : null, !e5) throw Error(wl(317));
      e: {
        for (e5 = e5.nextSibling, t3 = 0; e5; ) {
          if (8 === e5.nodeType) {
            var n4 = e5.data;
            if ("/$" === n4) {
              if (0 === t3) {
                Bp = Qf(e5.nextSibling);
                break e;
              }
              t3--;
            } else "$" !== n4 && "$!" !== n4 && "$?" !== n4 || t3++;
          }
          e5 = e5.nextSibling;
        }
        Bp = null;
      }
    } else Bp = jp ? Qf(e5.stateNode.nextSibling) : null;
    return true;
  }
  function Kp() {
    for (var e5 = Bp; e5; ) e5 = Qf(e5.nextSibling);
  }
  function Xp() {
    Bp = jp = null, Up = false;
  }
  function Zp(e5) {
    null === Hp ? Hp = [e5] : Hp.push(e5);
  }
  function eh(e5, t3, n4) {
    if (e5 = n4.ref, null !== e5 && "function" !== typeof e5 && "object" !== typeof e5) {
      if (n4._owner) {
        if (n4 = n4._owner, n4) {
          if (1 !== n4.tag) throw Error(wl(309));
          var r4 = n4.stateNode;
        }
        if (!r4) throw Error(wl(147, e5));
        var a4 = r4, o3 = "" + e5;
        return null !== t3 && null !== t3.ref && "function" === typeof t3.ref && t3.ref._stringRef === o3 ? t3.ref : (t3 = function(e6) {
          var t4 = a4.refs;
          null === e6 ? delete t4[o3] : t4[o3] = e6;
        }, t3._stringRef = o3, t3);
      }
      if ("string" !== typeof e5) throw Error(wl(284));
      if (!n4._owner) throw Error(wl(290, e5));
    }
    return e5;
  }
  function th(e5, t3) {
    throw e5 = Object.prototype.toString.call(t3), Error(wl(31, "[object Object]" === e5 ? "object with keys {" + Object.keys(t3).join(", ") + "}" : e5));
  }
  function nh(e5) {
    var t3 = e5._init;
    return t3(e5._payload);
  }
  function rh(e5) {
    function t3(t4, n5) {
      if (e5) {
        var r5 = t4.deletions;
        null === r5 ? (t4.deletions = [n5], t4.flags |= 16) : r5.push(n5);
      }
    }
    function n4(n5, r5) {
      if (!e5) return null;
      for (; null !== r5; ) t3(n5, r5), r5 = r5.sibling;
      return null;
    }
    function r4(e6, t4) {
      for (e6 = /* @__PURE__ */ new Map(); null !== t4; ) null !== t4.key ? e6.set(t4.key, t4) : e6.set(t4.index, t4), t4 = t4.sibling;
      return e6;
    }
    function a4(e6, t4) {
      return e6 = ky(e6, t4), e6.index = 0, e6.sibling = null, e6;
    }
    function o3(t4, n5, r5) {
      return t4.index = r5, e5 ? (r5 = t4.alternate, null !== r5 ? (r5 = r5.index, r5 < n5 ? (t4.flags |= 2, n5) : r5) : (t4.flags |= 2, n5)) : (t4.flags |= 1048576, n5);
    }
    function i4(t4) {
      return e5 && null === t4.alternate && (t4.flags |= 2), t4;
    }
    function l4(e6, t4, n5, r5) {
      return null === t4 || 6 !== t4.tag ? (t4 = _y(n5, e6.mode, r5), t4.return = e6, t4) : (t4 = a4(t4, n5), t4.return = e6, t4);
    }
    function s4(e6, t4, n5, r5) {
      var o4 = n5.type;
      return o4 === Bl ? c4(e6, t4, n5.props.children, r5, n5.key) : null !== t4 && (t4.elementType === o4 || "object" === typeof o4 && null !== o4 && o4.$$typeof === Kl && nh(o4) === t4.type) ? (r5 = a4(t4, n5.props), r5.ref = eh(e6, t4, n5), r5.return = e6, r5) : (r5 = Ey(n5.type, n5.key, n5.props, null, e6.mode, r5), r5.ref = eh(e6, t4, n5), r5.return = e6, r5);
    }
    function u3(e6, t4, n5, r5) {
      return null === t4 || 4 !== t4.tag || t4.stateNode.containerInfo !== n5.containerInfo || t4.stateNode.implementation !== n5.implementation ? (t4 = Cy(n5, e6.mode, r5), t4.return = e6, t4) : (t4 = a4(t4, n5.children || []), t4.return = e6, t4);
    }
    function c4(e6, t4, n5, r5, o4) {
      return null === t4 || 7 !== t4.tag ? (t4 = xy(n5, e6.mode, r5, o4), t4.return = e6, t4) : (t4 = a4(t4, n5), t4.return = e6, t4);
    }
    function d3(e6, t4, n5) {
      if ("string" === typeof t4 && "" !== t4 || "number" === typeof t4) return t4 = _y("" + t4, e6.mode, n5), t4.return = e6, t4;
      if ("object" === typeof t4 && null !== t4) {
        switch (t4.$$typeof) {
          case Al:
            return n5 = Ey(t4.type, t4.key, t4.props, null, e6.mode, n5), n5.ref = eh(e6, null, t4), n5.return = e6, n5;
          case jl:
            return t4 = Cy(t4, e6.mode, n5), t4.return = e6, t4;
          case Kl:
            var r5 = t4._init;
            return d3(e6, r5(t4._payload), n5);
        }
        if (ws(t4) || Jl(t4)) return t4 = xy(t4, e6.mode, n5, null), t4.return = e6, t4;
        th(e6, t4);
      }
      return null;
    }
    function f3(e6, t4, n5, r5) {
      var a5 = null !== t4 ? t4.key : null;
      if ("string" === typeof n5 && "" !== n5 || "number" === typeof n5) return null !== a5 ? null : l4(e6, t4, "" + n5, r5);
      if ("object" === typeof n5 && null !== n5) {
        switch (n5.$$typeof) {
          case Al:
            return n5.key === a5 ? s4(e6, t4, n5, r5) : null;
          case jl:
            return n5.key === a5 ? u3(e6, t4, n5, r5) : null;
          case Kl:
            return a5 = n5._init, f3(e6, t4, a5(n5._payload), r5);
        }
        if (ws(n5) || Jl(n5)) return null !== a5 ? null : c4(e6, t4, n5, r5, null);
        th(e6, n5);
      }
      return null;
    }
    function p4(e6, t4, n5, r5, a5) {
      if ("string" === typeof r5 && "" !== r5 || "number" === typeof r5) return e6 = e6.get(n5) || null, l4(t4, e6, "" + r5, a5);
      if ("object" === typeof r5 && null !== r5) {
        switch (r5.$$typeof) {
          case Al:
            return e6 = e6.get(null === r5.key ? n5 : r5.key) || null, s4(t4, e6, r5, a5);
          case jl:
            return e6 = e6.get(null === r5.key ? n5 : r5.key) || null, u3(t4, e6, r5, a5);
          case Kl:
            var o4 = r5._init;
            return p4(e6, t4, n5, o4(r5._payload), a5);
        }
        if (ws(r5) || Jl(r5)) return e6 = e6.get(n5) || null, c4(t4, e6, r5, a5, null);
        th(t4, r5);
      }
      return null;
    }
    function h4(a5, i5, l5, s5) {
      for (var u4 = null, c5 = null, h5 = i5, g5 = i5 = 0, m5 = null; null !== h5 && g5 < l5.length; g5++) {
        h5.index > g5 ? (m5 = h5, h5 = null) : m5 = h5.sibling;
        var v3 = f3(a5, h5, l5[g5], s5);
        if (null === v3) {
          null === h5 && (h5 = m5);
          break;
        }
        e5 && h5 && null === v3.alternate && t3(a5, h5), i5 = o3(v3, i5, g5), null === c5 ? u4 = v3 : c5.sibling = v3, c5 = v3, h5 = m5;
      }
      if (g5 === l5.length) return n4(a5, h5), Up && Ip(a5, g5), u4;
      if (null === h5) {
        for (; g5 < l5.length; g5++) h5 = d3(a5, l5[g5], s5), null !== h5 && (i5 = o3(h5, i5, g5), null === c5 ? u4 = h5 : c5.sibling = h5, c5 = h5);
        return Up && Ip(a5, g5), u4;
      }
      for (h5 = r4(a5, h5); g5 < l5.length; g5++) m5 = p4(h5, a5, g5, l5[g5], s5), null !== m5 && (e5 && null !== m5.alternate && h5.delete(null === m5.key ? g5 : m5.key), i5 = o3(m5, i5, g5), null === c5 ? u4 = m5 : c5.sibling = m5, c5 = m5);
      return e5 && h5.forEach(function(e6) {
        return t3(a5, e6);
      }), Up && Ip(a5, g5), u4;
    }
    function g4(a5, i5, l5, s5) {
      var u4 = Jl(l5);
      if ("function" !== typeof u4) throw Error(wl(150));
      if (l5 = u4.call(l5), null == l5) throw Error(wl(151));
      for (var c5 = u4 = null, h5 = i5, g5 = i5 = 0, m5 = null, v3 = l5.next(); null !== h5 && !v3.done; g5++, v3 = l5.next()) {
        h5.index > g5 ? (m5 = h5, h5 = null) : m5 = h5.sibling;
        var y3 = f3(a5, h5, v3.value, s5);
        if (null === y3) {
          null === h5 && (h5 = m5);
          break;
        }
        e5 && h5 && null === y3.alternate && t3(a5, h5), i5 = o3(y3, i5, g5), null === c5 ? u4 = y3 : c5.sibling = y3, c5 = y3, h5 = m5;
      }
      if (v3.done) return n4(a5, h5), Up && Ip(a5, g5), u4;
      if (null === h5) {
        for (; !v3.done; g5++, v3 = l5.next()) v3 = d3(a5, v3.value, s5), null !== v3 && (i5 = o3(v3, i5, g5), null === c5 ? u4 = v3 : c5.sibling = v3, c5 = v3);
        return Up && Ip(a5, g5), u4;
      }
      for (h5 = r4(a5, h5); !v3.done; g5++, v3 = l5.next()) v3 = p4(h5, a5, g5, v3.value, s5), null !== v3 && (e5 && null !== v3.alternate && h5.delete(null === v3.key ? g5 : v3.key), i5 = o3(v3, i5, g5), null === c5 ? u4 = v3 : c5.sibling = v3, c5 = v3);
      return e5 && h5.forEach(function(e6) {
        return t3(a5, e6);
      }), Up && Ip(a5, g5), u4;
    }
    function m4(e6, r5, o4, l5) {
      if ("object" === typeof o4 && null !== o4 && o4.type === Bl && null === o4.key && (o4 = o4.props.children), "object" === typeof o4 && null !== o4) {
        switch (o4.$$typeof) {
          case Al:
            e: {
              for (var s5 = o4.key, u4 = r5; null !== u4; ) {
                if (u4.key === s5) {
                  if (s5 = o4.type, s5 === Bl) {
                    if (7 === u4.tag) {
                      n4(e6, u4.sibling), r5 = a4(u4, o4.props.children), r5.return = e6, e6 = r5;
                      break e;
                    }
                  } else if (u4.elementType === s5 || "object" === typeof s5 && null !== s5 && s5.$$typeof === Kl && nh(s5) === u4.type) {
                    n4(e6, u4.sibling), r5 = a4(u4, o4.props), r5.ref = eh(e6, u4, o4), r5.return = e6, e6 = r5;
                    break e;
                  }
                  n4(e6, u4);
                  break;
                }
                t3(e6, u4), u4 = u4.sibling;
              }
              o4.type === Bl ? (r5 = xy(o4.props.children, e6.mode, l5, o4.key), r5.return = e6, e6 = r5) : (l5 = Ey(o4.type, o4.key, o4.props, null, e6.mode, l5), l5.ref = eh(e6, r5, o4), l5.return = e6, e6 = l5);
            }
            return i4(e6);
          case jl:
            e: {
              for (u4 = o4.key; null !== r5; ) {
                if (r5.key === u4) {
                  if (4 === r5.tag && r5.stateNode.containerInfo === o4.containerInfo && r5.stateNode.implementation === o4.implementation) {
                    n4(e6, r5.sibling), r5 = a4(r5, o4.children || []), r5.return = e6, e6 = r5;
                    break e;
                  }
                  n4(e6, r5);
                  break;
                }
                t3(e6, r5), r5 = r5.sibling;
              }
              r5 = Cy(o4, e6.mode, l5), r5.return = e6, e6 = r5;
            }
            return i4(e6);
          case Kl:
            return u4 = o4._init, m4(e6, r5, u4(o4._payload), l5);
        }
        if (ws(o4)) return h4(e6, r5, o4, l5);
        if (Jl(o4)) return g4(e6, r5, o4, l5);
        th(e6, o4);
      }
      return "string" === typeof o4 && "" !== o4 || "number" === typeof o4 ? (o4 = "" + o4, null !== r5 && 6 === r5.tag ? (n4(e6, r5.sibling), r5 = a4(r5, o4), r5.return = e6, e6 = r5) : (n4(e6, r5), r5 = _y(o4, e6.mode, l5), r5.return = e6, e6 = r5), i4(e6)) : n4(e6, r5);
    }
    return m4;
  }
  function ch() {
    uh = sh = lh = null;
  }
  function dh(e5) {
    var t3 = ih.current;
    sp(ih), e5._currentValue = t3;
  }
  function fh(e5, t3, n4) {
    for (; null !== e5; ) {
      var r4 = e5.alternate;
      if ((e5.childLanes & t3) !== t3 ? (e5.childLanes |= t3, null !== r4 && (r4.childLanes |= t3)) : null !== r4 && (r4.childLanes & t3) !== t3 && (r4.childLanes |= t3), e5 === n4) break;
      e5 = e5.return;
    }
  }
  function ph(e5, t3) {
    lh = e5, uh = sh = null, e5 = e5.dependencies, null !== e5 && null !== e5.firstContext && (0 !== (e5.lanes & t3) && (nm = true), e5.firstContext = null);
  }
  function hh(e5) {
    var t3 = e5._currentValue;
    if (uh !== e5) if (e5 = { context: e5, memoizedValue: t3, next: null }, null === sh) {
      if (null === lh) throw Error(wl(308));
      sh = e5, lh.dependencies = { lanes: 0, firstContext: e5 };
    } else sh = sh.next = e5;
    return t3;
  }
  function mh(e5) {
    null === gh ? gh = [e5] : gh.push(e5);
  }
  function vh(e5, t3, n4, r4) {
    var a4 = t3.interleaved;
    return null === a4 ? (n4.next = n4, mh(t3)) : (n4.next = a4.next, a4.next = n4), t3.interleaved = n4, yh(e5, r4);
  }
  function yh(e5, t3) {
    e5.lanes |= t3;
    var n4 = e5.alternate;
    for (null !== n4 && (n4.lanes |= t3), n4 = e5, e5 = e5.return; null !== e5; ) e5.childLanes |= t3, n4 = e5.alternate, null !== n4 && (n4.childLanes |= t3), n4 = e5, e5 = e5.return;
    return 3 === n4.tag ? n4.stateNode : null;
  }
  function wh(e5) {
    e5.updateQueue = { baseState: e5.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Sh(e5, t3) {
    e5 = e5.updateQueue, t3.updateQueue === e5 && (t3.updateQueue = { baseState: e5.baseState, firstBaseUpdate: e5.firstBaseUpdate, lastBaseUpdate: e5.lastBaseUpdate, shared: e5.shared, effects: e5.effects });
  }
  function kh(e5, t3) {
    return { eventTime: e5, lane: t3, tag: 0, payload: null, callback: null, next: null };
  }
  function Eh(e5, t3, n4) {
    var r4 = e5.updateQueue;
    if (null === r4) return null;
    if (r4 = r4.shared, 0 !== (2 & hv)) {
      var a4 = r4.pending;
      return null === a4 ? t3.next = t3 : (t3.next = a4.next, a4.next = t3), r4.pending = t3, yh(e5, n4);
    }
    return a4 = r4.interleaved, null === a4 ? (t3.next = t3, mh(r4)) : (t3.next = a4.next, a4.next = t3), r4.interleaved = t3, yh(e5, n4);
  }
  function xh(e5, t3, n4) {
    if (t3 = t3.updateQueue, null !== t3 && (t3 = t3.shared, 0 !== (4194240 & n4))) {
      var r4 = t3.lanes;
      r4 &= e5.pendingLanes, n4 |= r4, t3.lanes = n4, Uu(e5, n4);
    }
  }
  function $h(e5, t3) {
    var n4 = e5.updateQueue, r4 = e5.alternate;
    if (null !== r4 && (r4 = r4.updateQueue, n4 === r4)) {
      var a4 = null, o3 = null;
      if (n4 = n4.firstBaseUpdate, null !== n4) {
        do {
          var i4 = { eventTime: n4.eventTime, lane: n4.lane, tag: n4.tag, payload: n4.payload, callback: n4.callback, next: null };
          null === o3 ? a4 = o3 = i4 : o3 = o3.next = i4, n4 = n4.next;
        } while (null !== n4);
        null === o3 ? a4 = o3 = t3 : o3 = o3.next = t3;
      } else a4 = o3 = t3;
      return n4 = { baseState: r4.baseState, firstBaseUpdate: a4, lastBaseUpdate: o3, shared: r4.shared, effects: r4.effects }, void (e5.updateQueue = n4);
    }
    e5 = n4.lastBaseUpdate, null === e5 ? n4.firstBaseUpdate = t3 : e5.next = t3, n4.lastBaseUpdate = t3;
  }
  function _h(e5, t3, n4, r4) {
    var a4 = e5.updateQueue;
    bh = false;
    var o3 = a4.firstBaseUpdate, i4 = a4.lastBaseUpdate, l4 = a4.shared.pending;
    if (null !== l4) {
      a4.shared.pending = null;
      var s4 = l4, u3 = s4.next;
      s4.next = null, null === i4 ? o3 = u3 : i4.next = u3, i4 = s4;
      var c4 = e5.alternate;
      null !== c4 && (c4 = c4.updateQueue, l4 = c4.lastBaseUpdate, l4 !== i4 && (null === l4 ? c4.firstBaseUpdate = u3 : l4.next = u3, c4.lastBaseUpdate = s4));
    }
    if (null !== o3) {
      var d3 = a4.baseState;
      i4 = 0, c4 = u3 = s4 = null, l4 = o3;
      do {
        var f3 = l4.lane, p4 = l4.eventTime;
        if ((r4 & f3) === f3) {
          null !== c4 && (c4 = c4.next = { eventTime: p4, lane: 0, tag: l4.tag, payload: l4.payload, callback: l4.callback, next: null });
          e: {
            var h4 = e5, g4 = l4;
            switch (f3 = t3, p4 = n4, g4.tag) {
              case 1:
                if (h4 = g4.payload, "function" === typeof h4) {
                  d3 = h4.call(p4, d3, f3);
                  break e;
                }
                d3 = h4;
                break e;
              case 3:
                h4.flags = -65537 & h4.flags | 128;
              case 0:
                if (h4 = g4.payload, f3 = "function" === typeof h4 ? h4.call(p4, d3, f3) : h4, null === f3 || void 0 === f3) break e;
                d3 = ts({}, d3, f3);
                break e;
              case 2:
                bh = true;
            }
          }
          null !== l4.callback && 0 !== l4.lane && (e5.flags |= 64, f3 = a4.effects, null === f3 ? a4.effects = [l4] : f3.push(l4));
        } else p4 = { eventTime: p4, lane: f3, tag: l4.tag, payload: l4.payload, callback: l4.callback, next: null }, null === c4 ? (u3 = c4 = p4, s4 = d3) : c4 = c4.next = p4, i4 |= f3;
        if (l4 = l4.next, null === l4) {
          if (l4 = a4.shared.pending, null === l4) break;
          f3 = l4, l4 = f3.next, f3.next = null, a4.lastBaseUpdate = f3, a4.shared.pending = null;
        }
      } while (1);
      if (null === c4 && (s4 = d3), a4.baseState = s4, a4.firstBaseUpdate = u3, a4.lastBaseUpdate = c4, t3 = a4.shared.interleaved, null !== t3) {
        a4 = t3;
        do {
          i4 |= a4.lane, a4 = a4.next;
        } while (a4 !== t3);
      } else null === o3 && (a4.shared.lanes = 0);
      kv |= i4, e5.lanes = i4, e5.memoizedState = d3;
    }
  }
  function Ch(e5, t3, n4) {
    if (e5 = t3.effects, t3.effects = null, null !== e5) for (t3 = 0; t3 < e5.length; t3++) {
      var r4 = e5[t3], a4 = r4.callback;
      if (null !== a4) {
        if (r4.callback = null, r4 = n4, "function" !== typeof a4) throw Error(wl(191, a4));
        a4.call(r4);
      }
    }
  }
  function Rh(e5) {
    if (e5 === Ph) throw Error(wl(174));
    return e5;
  }
  function Oh(e5, t3) {
    switch (up(Lh, t3), up(Nh, e5), up(Th, Ph), e5 = t3.nodeType, e5) {
      case 9:
      case 11:
        t3 = (t3 = t3.documentElement) ? t3.namespaceURI : Cs(null, "");
        break;
      default:
        e5 = 8 === e5 ? t3.parentNode : t3, t3 = e5.namespaceURI || null, e5 = e5.tagName, t3 = Cs(t3, e5);
    }
    sp(Th), up(Th, t3);
  }
  function Mh() {
    sp(Th), sp(Nh), sp(Lh);
  }
  function zh(e5) {
    Rh(Lh.current);
    var t3 = Rh(Th.current), n4 = Cs(t3, e5.type);
    t3 !== n4 && (up(Nh, e5), up(Th, n4));
  }
  function Ih(e5) {
    Nh.current === e5 && (sp(Th), sp(Nh));
  }
  function Fh(e5) {
    for (var t3 = e5; null !== t3; ) {
      if (13 === t3.tag) {
        var n4 = t3.memoizedState;
        if (null !== n4 && (n4 = n4.dehydrated, null === n4 || "$?" === n4.data || "$!" === n4.data)) return t3;
      } else if (19 === t3.tag && void 0 !== t3.memoizedProps.revealOrder) {
        if (0 !== (128 & t3.flags)) return t3;
      } else if (null !== t3.child) {
        t3.child.return = t3, t3 = t3.child;
        continue;
      }
      if (t3 === e5) break;
      for (; null === t3.sibling; ) {
        if (null === t3.return || t3.return === e5) return null;
        t3 = t3.return;
      }
      t3.sibling.return = t3.return, t3 = t3.sibling;
    }
    return null;
  }
  function jh() {
    for (var e5 = 0; e5 < Ah.length; e5++) Ah[e5]._workInProgressVersionPrimary = null;
    Ah.length = 0;
  }
  function Xh() {
    throw Error(wl(321));
  }
  function Zh(e5, t3) {
    if (null === t3) return false;
    for (var n4 = 0; n4 < t3.length && n4 < e5.length; n4++) if (!Bd(e5[n4], t3[n4])) return false;
    return true;
  }
  function Jh(e5, t3, n4, r4, a4, o3) {
    if (Hh = o3, Wh = t3, t3.memoizedState = null, t3.updateQueue = null, t3.lanes = 0, Bh.current = null === e5 || null === e5.memoizedState ? Ig : Dg, e5 = n4(r4, a4), Yh) {
      o3 = 0;
      do {
        if (Yh = false, Gh = 0, 25 <= o3) throw Error(wl(301));
        o3 += 1, Qh = Vh = null, t3.updateQueue = null, Bh.current = Fg, e5 = n4(r4, a4);
      } while (Yh);
    }
    if (Bh.current = zg, t3 = null !== Vh && null !== Vh.next, Hh = 0, Qh = Vh = Wh = null, qh = false, t3) throw Error(wl(300));
    return e5;
  }
  function eg() {
    var e5 = 0 !== Gh;
    return Gh = 0, e5;
  }
  function tg() {
    var e5 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return null === Qh ? Wh.memoizedState = Qh = e5 : Qh = Qh.next = e5, Qh;
  }
  function ng() {
    if (null === Vh) {
      var e5 = Wh.alternate;
      e5 = null !== e5 ? e5.memoizedState : null;
    } else e5 = Vh.next;
    var t3 = null === Qh ? Wh.memoizedState : Qh.next;
    if (null !== t3) Qh = t3, Vh = e5;
    else {
      if (null === e5) throw Error(wl(310));
      Vh = e5, e5 = { memoizedState: Vh.memoizedState, baseState: Vh.baseState, baseQueue: Vh.baseQueue, queue: Vh.queue, next: null }, null === Qh ? Wh.memoizedState = Qh = e5 : Qh = Qh.next = e5;
    }
    return Qh;
  }
  function rg(e5, t3) {
    return "function" === typeof t3 ? t3(e5) : t3;
  }
  function ag(e5) {
    var t3 = ng(), n4 = t3.queue;
    if (null === n4) throw Error(wl(311));
    n4.lastRenderedReducer = e5;
    var r4 = Vh, a4 = r4.baseQueue, o3 = n4.pending;
    if (null !== o3) {
      if (null !== a4) {
        var i4 = a4.next;
        a4.next = o3.next, o3.next = i4;
      }
      r4.baseQueue = a4 = o3, n4.pending = null;
    }
    if (null !== a4) {
      o3 = a4.next, r4 = r4.baseState;
      var l4 = i4 = null, s4 = null, u3 = o3;
      do {
        var c4 = u3.lane;
        if ((Hh & c4) === c4) null !== s4 && (s4 = s4.next = { lane: 0, action: u3.action, hasEagerState: u3.hasEagerState, eagerState: u3.eagerState, next: null }), r4 = u3.hasEagerState ? u3.eagerState : e5(r4, u3.action);
        else {
          var d3 = { lane: c4, action: u3.action, hasEagerState: u3.hasEagerState, eagerState: u3.eagerState, next: null };
          null === s4 ? (l4 = s4 = d3, i4 = r4) : s4 = s4.next = d3, Wh.lanes |= c4, kv |= c4;
        }
        u3 = u3.next;
      } while (null !== u3 && u3 !== o3);
      null === s4 ? i4 = r4 : s4.next = l4, Bd(r4, t3.memoizedState) || (nm = true), t3.memoizedState = r4, t3.baseState = i4, t3.baseQueue = s4, n4.lastRenderedState = r4;
    }
    if (e5 = n4.interleaved, null !== e5) {
      a4 = e5;
      do {
        o3 = a4.lane, Wh.lanes |= o3, kv |= o3, a4 = a4.next;
      } while (a4 !== e5);
    } else null === a4 && (n4.lanes = 0);
    return [t3.memoizedState, n4.dispatch];
  }
  function og(e5) {
    var t3 = ng(), n4 = t3.queue;
    if (null === n4) throw Error(wl(311));
    n4.lastRenderedReducer = e5;
    var r4 = n4.dispatch, a4 = n4.pending, o3 = t3.memoizedState;
    if (null !== a4) {
      n4.pending = null;
      var i4 = a4 = a4.next;
      do {
        o3 = e5(o3, i4.action), i4 = i4.next;
      } while (i4 !== a4);
      Bd(o3, t3.memoizedState) || (nm = true), t3.memoizedState = o3, null === t3.baseQueue && (t3.baseState = o3), n4.lastRenderedState = o3;
    }
    return [o3, r4];
  }
  function ig() {
  }
  function lg(e5, t3) {
    var n4 = Wh, r4 = ng(), a4 = t3(), o3 = !Bd(r4.memoizedState, a4);
    if (o3 && (r4.memoizedState = a4, nm = true), r4 = r4.queue, bg(cg.bind(null, n4, r4, e5), [e5]), r4.getSnapshot !== t3 || o3 || null !== Qh && 1 & Qh.memoizedState.tag) {
      if (n4.flags |= 2048, hg(9, ug.bind(null, n4, r4, a4, t3), void 0, null), null === gv) throw Error(wl(349));
      0 !== (30 & Hh) || sg(n4, t3, a4);
    }
    return a4;
  }
  function sg(e5, t3, n4) {
    e5.flags |= 16384, e5 = { getSnapshot: t3, value: n4 }, t3 = Wh.updateQueue, null === t3 ? (t3 = { lastEffect: null, stores: null }, Wh.updateQueue = t3, t3.stores = [e5]) : (n4 = t3.stores, null === n4 ? t3.stores = [e5] : n4.push(e5));
  }
  function ug(e5, t3, n4, r4) {
    t3.value = n4, t3.getSnapshot = r4, dg(t3) && fg(e5);
  }
  function cg(e5, t3, n4) {
    return n4(function() {
      dg(t3) && fg(e5);
    });
  }
  function dg(e5) {
    var t3 = e5.getSnapshot;
    e5 = e5.value;
    try {
      var n4 = t3();
      return !Bd(e5, n4);
    } catch (r4) {
      return true;
    }
  }
  function fg(e5) {
    var t3 = yh(e5, 1);
    null !== t3 && Uv(t3, e5, 1, -1);
  }
  function pg(e5) {
    var t3 = tg();
    return "function" === typeof e5 && (e5 = e5()), t3.memoizedState = t3.baseState = e5, e5 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: rg, lastRenderedState: e5 }, t3.queue = e5, e5 = e5.dispatch = Lg.bind(null, Wh, e5), [t3.memoizedState, e5];
  }
  function hg(e5, t3, n4, r4) {
    return e5 = { tag: e5, create: t3, destroy: n4, deps: r4, next: null }, t3 = Wh.updateQueue, null === t3 ? (t3 = { lastEffect: null, stores: null }, Wh.updateQueue = t3, t3.lastEffect = e5.next = e5) : (n4 = t3.lastEffect, null === n4 ? t3.lastEffect = e5.next = e5 : (r4 = n4.next, n4.next = e5, e5.next = r4, t3.lastEffect = e5)), e5;
  }
  function gg() {
    return ng().memoizedState;
  }
  function mg(e5, t3, n4, r4) {
    var a4 = tg();
    Wh.flags |= e5, a4.memoizedState = hg(1 | t3, n4, void 0, void 0 === r4 ? null : r4);
  }
  function vg(e5, t3, n4, r4) {
    var a4 = ng();
    r4 = void 0 === r4 ? null : r4;
    var o3 = void 0;
    if (null !== Vh) {
      var i4 = Vh.memoizedState;
      if (o3 = i4.destroy, null !== r4 && Zh(r4, i4.deps)) return void (a4.memoizedState = hg(t3, n4, o3, r4));
    }
    Wh.flags |= e5, a4.memoizedState = hg(1 | t3, n4, o3, r4);
  }
  function yg(e5, t3) {
    return mg(8390656, 8, e5, t3);
  }
  function bg(e5, t3) {
    return vg(2048, 8, e5, t3);
  }
  function wg(e5, t3) {
    return vg(4, 2, e5, t3);
  }
  function Sg(e5, t3) {
    return vg(4, 4, e5, t3);
  }
  function kg(e5, t3) {
    return "function" === typeof t3 ? (e5 = e5(), t3(e5), function() {
      t3(null);
    }) : null !== t3 && void 0 !== t3 ? (e5 = e5(), t3.current = e5, function() {
      t3.current = null;
    }) : void 0;
  }
  function Eg(e5, t3, n4) {
    return n4 = null !== n4 && void 0 !== n4 ? n4.concat([e5]) : null, vg(4, 4, kg.bind(null, t3, e5), n4);
  }
  function xg() {
  }
  function $g(e5, t3) {
    var n4 = ng();
    t3 = void 0 === t3 ? null : t3;
    var r4 = n4.memoizedState;
    return null !== r4 && null !== t3 && Zh(t3, r4[1]) ? r4[0] : (n4.memoizedState = [e5, t3], e5);
  }
  function _g(e5, t3) {
    var n4 = ng();
    t3 = void 0 === t3 ? null : t3;
    var r4 = n4.memoizedState;
    return null !== r4 && null !== t3 && Zh(t3, r4[1]) ? r4[0] : (e5 = e5(), n4.memoizedState = [e5, t3], e5);
  }
  function Cg(e5, t3, n4) {
    return 0 === (21 & Hh) ? (e5.baseState && (e5.baseState = false, nm = true), e5.memoizedState = n4) : (Bd(n4, t3) || (n4 = Fu(), Wh.lanes |= n4, kv |= n4, e5.baseState = true), t3);
  }
  function Pg(e5, t3) {
    var n4 = Hu;
    Hu = 0 !== n4 && 4 > n4 ? n4 : 4, e5(true);
    var r4 = Uh.transition;
    Uh.transition = {};
    try {
      e5(false), t3();
    } finally {
      Hu = n4, Uh.transition = r4;
    }
  }
  function Tg() {
    return ng().memoizedState;
  }
  function Ng(e5, t3, n4) {
    var r4 = Bv(e5);
    if (n4 = { lane: r4, action: n4, hasEagerState: false, eagerState: null, next: null }, Rg(e5)) Og(t3, n4);
    else if (n4 = vh(e5, t3, n4, r4), null !== n4) {
      var a4 = jv();
      Uv(n4, e5, r4, a4), Mg(n4, t3, r4);
    }
  }
  function Lg(e5, t3, n4) {
    var r4 = Bv(e5), a4 = { lane: r4, action: n4, hasEagerState: false, eagerState: null, next: null };
    if (Rg(e5)) Og(t3, a4);
    else {
      var o3 = e5.alternate;
      if (0 === e5.lanes && (null === o3 || 0 === o3.lanes) && (o3 = t3.lastRenderedReducer, null !== o3)) try {
        var i4 = t3.lastRenderedState, l4 = o3(i4, n4);
        if (a4.hasEagerState = true, a4.eagerState = l4, Bd(l4, i4)) {
          var s4 = t3.interleaved;
          return null === s4 ? (a4.next = a4, mh(t3)) : (a4.next = s4.next, s4.next = a4), void (t3.interleaved = a4);
        }
      } catch (u3) {
      }
      n4 = vh(e5, t3, a4, r4), null !== n4 && (a4 = jv(), Uv(n4, e5, r4, a4), Mg(n4, t3, r4));
    }
  }
  function Rg(e5) {
    var t3 = e5.alternate;
    return e5 === Wh || null !== t3 && t3 === Wh;
  }
  function Og(e5, t3) {
    Yh = qh = true;
    var n4 = e5.pending;
    null === n4 ? t3.next = t3 : (t3.next = n4.next, n4.next = t3), e5.pending = t3;
  }
  function Mg(e5, t3, n4) {
    if (0 !== (4194240 & n4)) {
      var r4 = t3.lanes;
      r4 &= e5.pendingLanes, n4 |= r4, t3.lanes = n4, Uu(e5, n4);
    }
  }
  function Ag(e5, t3) {
    if (e5 && e5.defaultProps) {
      for (var n4 in t3 = ts({}, t3), e5 = e5.defaultProps, e5) void 0 === t3[n4] && (t3[n4] = e5[n4]);
      return t3;
    }
    return t3;
  }
  function jg(e5, t3, n4, r4) {
    t3 = e5.memoizedState, n4 = n4(r4, t3), n4 = null === n4 || void 0 === n4 ? t3 : ts({}, t3, n4), e5.memoizedState = n4, 0 === e5.lanes && (e5.updateQueue.baseState = n4);
  }
  function Ug(e5, t3, n4, r4, a4, o3, i4) {
    return e5 = e5.stateNode, "function" === typeof e5.shouldComponentUpdate ? e5.shouldComponentUpdate(r4, o3, i4) : !t3.prototype || !t3.prototype.isPureReactComponent || (!Ud(n4, r4) || !Ud(a4, o3));
  }
  function Hg(e5, t3, n4) {
    var r4 = false, a4 = cp, o3 = t3.contextType;
    return "object" === typeof o3 && null !== o3 ? o3 = hh(o3) : (a4 = gp(t3) ? pp : dp.current, r4 = t3.contextTypes, o3 = (r4 = null !== r4 && void 0 !== r4) ? hp(e5, a4) : cp), t3 = new t3(n4, o3), e5.memoizedState = null !== t3.state && void 0 !== t3.state ? t3.state : null, t3.updater = Bg, e5.stateNode = t3, t3._reactInternals = e5, r4 && (e5 = e5.stateNode, e5.__reactInternalMemoizedUnmaskedChildContext = a4, e5.__reactInternalMemoizedMaskedChildContext = o3), t3;
  }
  function Wg(e5, t3, n4, r4) {
    e5 = t3.state, "function" === typeof t3.componentWillReceiveProps && t3.componentWillReceiveProps(n4, r4), "function" === typeof t3.UNSAFE_componentWillReceiveProps && t3.UNSAFE_componentWillReceiveProps(n4, r4), t3.state !== e5 && Bg.enqueueReplaceState(t3, t3.state, null);
  }
  function Vg(e5, t3, n4, r4) {
    var a4 = e5.stateNode;
    a4.props = n4, a4.state = e5.memoizedState, a4.refs = {}, wh(e5);
    var o3 = t3.contextType;
    "object" === typeof o3 && null !== o3 ? a4.context = hh(o3) : (o3 = gp(t3) ? pp : dp.current, a4.context = hp(e5, o3)), a4.state = e5.memoizedState, o3 = t3.getDerivedStateFromProps, "function" === typeof o3 && (jg(e5, t3, o3, n4), a4.state = e5.memoizedState), "function" === typeof t3.getDerivedStateFromProps || "function" === typeof a4.getSnapshotBeforeUpdate || "function" !== typeof a4.UNSAFE_componentWillMount && "function" !== typeof a4.componentWillMount || (t3 = a4.state, "function" === typeof a4.componentWillMount && a4.componentWillMount(), "function" === typeof a4.UNSAFE_componentWillMount && a4.UNSAFE_componentWillMount(), t3 !== a4.state && Bg.enqueueReplaceState(a4, a4.state, null), _h(e5, n4, a4, r4), a4.state = e5.memoizedState), "function" === typeof a4.componentDidMount && (e5.flags |= 4194308);
  }
  function Qg(e5, t3) {
    try {
      var n4 = "", r4 = t3;
      do {
        n4 += os(r4), r4 = r4.return;
      } while (r4);
      var a4 = n4;
    } catch (o3) {
      a4 = "\nError generating stack: " + o3.message + "\n" + o3.stack;
    }
    return { value: e5, source: t3, stack: a4, digest: null };
  }
  function qg(e5, t3, n4) {
    return { value: e5, source: null, stack: null != n4 ? n4 : null, digest: null != t3 ? t3 : null };
  }
  function Yg(e5, t3) {
    try {
      console.error(t3.value);
    } catch (n4) {
      setTimeout(function() {
        throw n4;
      });
    }
  }
  function Kg(e5, t3, n4) {
    n4 = kh(-1, n4), n4.tag = 3, n4.payload = { element: null };
    var r4 = t3.value;
    return n4.callback = function() {
      Nv || (Nv = true, Lv = r4), Yg(e5, t3);
    }, n4;
  }
  function Xg(e5, t3, n4) {
    n4 = kh(-1, n4), n4.tag = 3;
    var r4 = e5.type.getDerivedStateFromError;
    if ("function" === typeof r4) {
      var a4 = t3.value;
      n4.payload = function() {
        return r4(a4);
      }, n4.callback = function() {
        Yg(e5, t3);
      };
    }
    var o3 = e5.stateNode;
    return null !== o3 && "function" === typeof o3.componentDidCatch && (n4.callback = function() {
      Yg(e5, t3), "function" !== typeof r4 && (null === Rv ? Rv = /* @__PURE__ */ new Set([this]) : Rv.add(this));
      var n5 = t3.stack;
      this.componentDidCatch(t3.value, { componentStack: null !== n5 ? n5 : "" });
    }), n4;
  }
  function Zg(e5, t3, n4) {
    var r4 = e5.pingCache;
    if (null === r4) {
      r4 = e5.pingCache = new Gg();
      var a4 = /* @__PURE__ */ new Set();
      r4.set(t3, a4);
    } else a4 = r4.get(t3), void 0 === a4 && (a4 = /* @__PURE__ */ new Set(), r4.set(t3, a4));
    a4.has(n4) || (a4.add(n4), e5 = py.bind(null, e5, t3, n4), t3.then(e5, e5));
  }
  function Jg(e5) {
    do {
      var t3;
      if ((t3 = 13 === e5.tag) && (t3 = e5.memoizedState, t3 = null === t3 || null !== t3.dehydrated), t3) return e5;
      e5 = e5.return;
    } while (null !== e5);
    return null;
  }
  function em(e5, t3, n4, r4, a4) {
    return 0 === (1 & e5.mode) ? (e5 === t3 ? e5.flags |= 65536 : (e5.flags |= 128, n4.flags |= 131072, n4.flags &= -52805, 1 === n4.tag && (null === n4.alternate ? n4.tag = 17 : (t3 = kh(-1, 1), t3.tag = 2, Eh(n4, t3, 1))), n4.lanes |= 1), e5) : (e5.flags |= 65536, e5.lanes = a4, e5);
  }
  function rm(e5, t3, n4, r4) {
    t3.child = null === e5 ? oh(t3, null, n4, r4) : ah(t3, e5.child, n4, r4);
  }
  function am(e5, t3, n4, r4, a4) {
    n4 = n4.render;
    var o3 = t3.ref;
    return ph(t3, a4), r4 = Jh(e5, t3, n4, r4, o3, a4), n4 = eg(), null === e5 || nm ? (Up && n4 && Fp(t3), t3.flags |= 1, rm(e5, t3, r4, a4), t3.child) : (t3.updateQueue = e5.updateQueue, t3.flags &= -2053, e5.lanes &= ~a4, Pm(e5, t3, a4));
  }
  function om(e5, t3, n4, r4, a4) {
    if (null === e5) {
      var o3 = n4.type;
      return "function" !== typeof o3 || wy(o3) || void 0 !== o3.defaultProps || null !== n4.compare || void 0 !== n4.defaultProps ? (e5 = Ey(n4.type, null, r4, t3, t3.mode, a4), e5.ref = t3.ref, e5.return = t3, t3.child = e5) : (t3.tag = 15, t3.type = o3, im(e5, t3, o3, r4, a4));
    }
    if (o3 = e5.child, 0 === (e5.lanes & a4)) {
      var i4 = o3.memoizedProps;
      if (n4 = n4.compare, n4 = null !== n4 ? n4 : Ud, n4(i4, r4) && e5.ref === t3.ref) return Pm(e5, t3, a4);
    }
    return t3.flags |= 1, e5 = ky(o3, r4), e5.ref = t3.ref, e5.return = t3, t3.child = e5;
  }
  function im(e5, t3, n4, r4, a4) {
    if (null !== e5) {
      var o3 = e5.memoizedProps;
      if (Ud(o3, r4) && e5.ref === t3.ref) {
        if (nm = false, t3.pendingProps = r4 = o3, 0 === (e5.lanes & a4)) return t3.lanes = e5.lanes, Pm(e5, t3, a4);
        0 !== (131072 & e5.flags) && (nm = true);
      }
    }
    return um(e5, t3, n4, r4, a4);
  }
  function lm(e5, t3, n4) {
    var r4 = t3.pendingProps, a4 = r4.children, o3 = null !== e5 ? e5.memoizedState : null;
    if ("hidden" === r4.mode) if (0 === (1 & t3.mode)) t3.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, up(bv, yv), yv |= n4;
    else {
      if (0 === (1073741824 & n4)) return e5 = null !== o3 ? o3.baseLanes | n4 : n4, t3.lanes = t3.childLanes = 1073741824, t3.memoizedState = { baseLanes: e5, cachePool: null, transitions: null }, t3.updateQueue = null, up(bv, yv), yv |= e5, null;
      t3.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r4 = null !== o3 ? o3.baseLanes : n4, up(bv, yv), yv |= r4;
    }
    else null !== o3 ? (r4 = o3.baseLanes | n4, t3.memoizedState = null) : r4 = n4, up(bv, yv), yv |= r4;
    return rm(e5, t3, a4, n4), t3.child;
  }
  function sm(e5, t3) {
    var n4 = t3.ref;
    (null === e5 && null !== n4 || null !== e5 && e5.ref !== n4) && (t3.flags |= 512, t3.flags |= 2097152);
  }
  function um(e5, t3, n4, r4, a4) {
    var o3 = gp(n4) ? pp : dp.current;
    return o3 = hp(t3, o3), ph(t3, a4), n4 = Jh(e5, t3, n4, r4, o3, a4), r4 = eg(), null === e5 || nm ? (Up && r4 && Fp(t3), t3.flags |= 1, rm(e5, t3, n4, a4), t3.child) : (t3.updateQueue = e5.updateQueue, t3.flags &= -2053, e5.lanes &= ~a4, Pm(e5, t3, a4));
  }
  function cm(e5, t3, n4, r4, a4) {
    if (gp(n4)) {
      var o3 = true;
      bp(t3);
    } else o3 = false;
    if (ph(t3, a4), null === t3.stateNode) Cm(e5, t3), Hg(t3, n4, r4), Vg(t3, n4, r4, a4), r4 = true;
    else if (null === e5) {
      var i4 = t3.stateNode, l4 = t3.memoizedProps;
      i4.props = l4;
      var s4 = i4.context, u3 = n4.contextType;
      "object" === typeof u3 && null !== u3 ? u3 = hh(u3) : (u3 = gp(n4) ? pp : dp.current, u3 = hp(t3, u3));
      var c4 = n4.getDerivedStateFromProps, d3 = "function" === typeof c4 || "function" === typeof i4.getSnapshotBeforeUpdate;
      d3 || "function" !== typeof i4.UNSAFE_componentWillReceiveProps && "function" !== typeof i4.componentWillReceiveProps || (l4 !== r4 || s4 !== u3) && Wg(t3, i4, r4, u3), bh = false;
      var f3 = t3.memoizedState;
      i4.state = f3, _h(t3, r4, i4, a4), s4 = t3.memoizedState, l4 !== r4 || f3 !== s4 || fp.current || bh ? ("function" === typeof c4 && (jg(t3, n4, c4, r4), s4 = t3.memoizedState), (l4 = bh || Ug(t3, n4, l4, r4, f3, s4, u3)) ? (d3 || "function" !== typeof i4.UNSAFE_componentWillMount && "function" !== typeof i4.componentWillMount || ("function" === typeof i4.componentWillMount && i4.componentWillMount(), "function" === typeof i4.UNSAFE_componentWillMount && i4.UNSAFE_componentWillMount()), "function" === typeof i4.componentDidMount && (t3.flags |= 4194308)) : ("function" === typeof i4.componentDidMount && (t3.flags |= 4194308), t3.memoizedProps = r4, t3.memoizedState = s4), i4.props = r4, i4.state = s4, i4.context = u3, r4 = l4) : ("function" === typeof i4.componentDidMount && (t3.flags |= 4194308), r4 = false);
    } else {
      i4 = t3.stateNode, Sh(e5, t3), l4 = t3.memoizedProps, u3 = t3.type === t3.elementType ? l4 : Ag(t3.type, l4), i4.props = u3, d3 = t3.pendingProps, f3 = i4.context, s4 = n4.contextType, "object" === typeof s4 && null !== s4 ? s4 = hh(s4) : (s4 = gp(n4) ? pp : dp.current, s4 = hp(t3, s4));
      var p4 = n4.getDerivedStateFromProps;
      (c4 = "function" === typeof p4 || "function" === typeof i4.getSnapshotBeforeUpdate) || "function" !== typeof i4.UNSAFE_componentWillReceiveProps && "function" !== typeof i4.componentWillReceiveProps || (l4 !== d3 || f3 !== s4) && Wg(t3, i4, r4, s4), bh = false, f3 = t3.memoizedState, i4.state = f3, _h(t3, r4, i4, a4);
      var h4 = t3.memoizedState;
      l4 !== d3 || f3 !== h4 || fp.current || bh ? ("function" === typeof p4 && (jg(t3, n4, p4, r4), h4 = t3.memoizedState), (u3 = bh || Ug(t3, n4, u3, r4, f3, h4, s4) || false) ? (c4 || "function" !== typeof i4.UNSAFE_componentWillUpdate && "function" !== typeof i4.componentWillUpdate || ("function" === typeof i4.componentWillUpdate && i4.componentWillUpdate(r4, h4, s4), "function" === typeof i4.UNSAFE_componentWillUpdate && i4.UNSAFE_componentWillUpdate(r4, h4, s4)), "function" === typeof i4.componentDidUpdate && (t3.flags |= 4), "function" === typeof i4.getSnapshotBeforeUpdate && (t3.flags |= 1024)) : ("function" !== typeof i4.componentDidUpdate || l4 === e5.memoizedProps && f3 === e5.memoizedState || (t3.flags |= 4), "function" !== typeof i4.getSnapshotBeforeUpdate || l4 === e5.memoizedProps && f3 === e5.memoizedState || (t3.flags |= 1024), t3.memoizedProps = r4, t3.memoizedState = h4), i4.props = r4, i4.state = h4, i4.context = s4, r4 = u3) : ("function" !== typeof i4.componentDidUpdate || l4 === e5.memoizedProps && f3 === e5.memoizedState || (t3.flags |= 4), "function" !== typeof i4.getSnapshotBeforeUpdate || l4 === e5.memoizedProps && f3 === e5.memoizedState || (t3.flags |= 1024), r4 = false);
    }
    return dm(e5, t3, n4, r4, o3, a4);
  }
  function dm(e5, t3, n4, r4, a4, o3) {
    sm(e5, t3);
    var i4 = 0 !== (128 & t3.flags);
    if (!r4 && !i4) return a4 && wp(t3, n4, false), Pm(e5, t3, o3);
    r4 = t3.stateNode, tm.current = t3;
    var l4 = i4 && "function" !== typeof n4.getDerivedStateFromError ? null : r4.render();
    return t3.flags |= 1, null !== e5 && i4 ? (t3.child = ah(t3, e5.child, null, o3), t3.child = ah(t3, null, l4, o3)) : rm(e5, t3, l4, o3), t3.memoizedState = r4.state, a4 && wp(t3, n4, true), t3.child;
  }
  function fm(e5) {
    var t3 = e5.stateNode;
    t3.pendingContext ? vp(e5, t3.pendingContext, t3.pendingContext !== t3.context) : t3.context && vp(e5, t3.context, false), Oh(e5, t3.containerInfo);
  }
  function pm(e5, t3, n4, r4, a4) {
    return Xp(), Zp(a4), t3.flags |= 256, rm(e5, t3, n4, r4), t3.child;
  }
  function bm(e5) {
    return { baseLanes: e5, cachePool: null, transitions: null };
  }
  function wm(e5, t3, n4) {
    var r4, a4 = t3.pendingProps, o3 = Dh.current, i4 = false, l4 = 0 !== (128 & t3.flags);
    if ((r4 = l4) || (r4 = (null === e5 || null !== e5.memoizedState) && 0 !== (2 & o3)), r4 ? (i4 = true, t3.flags &= -129) : null !== e5 && null === e5.memoizedState || (o3 |= 1), up(Dh, 1 & o3), null === e5) return qp(t3), e5 = t3.memoizedState, null !== e5 && (e5 = e5.dehydrated, null !== e5) ? (0 === (1 & t3.mode) ? t3.lanes = 1 : "$!" === e5.data ? t3.lanes = 8 : t3.lanes = 1073741824, null) : (l4 = a4.children, e5 = a4.fallback, i4 ? (a4 = t3.mode, i4 = t3.child, l4 = { mode: "hidden", children: l4 }, 0 === (1 & a4) && null !== i4 ? (i4.childLanes = 0, i4.pendingProps = l4) : i4 = $y(l4, a4, 0, null), e5 = xy(e5, a4, n4, null), i4.return = t3, e5.return = t3, i4.sibling = e5, t3.child = i4, t3.child.memoizedState = bm(n4), t3.memoizedState = ym, e5) : Sm(t3, l4));
    if (o3 = e5.memoizedState, null !== o3 && (r4 = o3.dehydrated, null !== r4)) return Em(e5, t3, l4, a4, r4, o3, n4);
    if (i4) {
      i4 = a4.fallback, l4 = t3.mode, o3 = e5.child, r4 = o3.sibling;
      var s4 = { mode: "hidden", children: a4.children };
      return 0 === (1 & l4) && t3.child !== o3 ? (a4 = t3.child, a4.childLanes = 0, a4.pendingProps = s4, t3.deletions = null) : (a4 = ky(o3, s4), a4.subtreeFlags = 14680064 & o3.subtreeFlags), null !== r4 ? i4 = ky(r4, i4) : (i4 = xy(i4, l4, n4, null), i4.flags |= 2), i4.return = t3, a4.return = t3, a4.sibling = i4, t3.child = a4, a4 = i4, i4 = t3.child, l4 = e5.child.memoizedState, l4 = null === l4 ? bm(n4) : { baseLanes: l4.baseLanes | n4, cachePool: null, transitions: l4.transitions }, i4.memoizedState = l4, i4.childLanes = e5.childLanes & ~n4, t3.memoizedState = ym, a4;
    }
    return i4 = e5.child, e5 = i4.sibling, a4 = ky(i4, { mode: "visible", children: a4.children }), 0 === (1 & t3.mode) && (a4.lanes = n4), a4.return = t3, a4.sibling = null, null !== e5 && (n4 = t3.deletions, null === n4 ? (t3.deletions = [e5], t3.flags |= 16) : n4.push(e5)), t3.child = a4, t3.memoizedState = null, a4;
  }
  function Sm(e5, t3) {
    return t3 = $y({ mode: "visible", children: t3 }, e5.mode, 0, null), t3.return = e5, e5.child = t3;
  }
  function km(e5, t3, n4, r4) {
    return null !== r4 && Zp(r4), ah(t3, e5.child, null, n4), e5 = Sm(t3, t3.pendingProps.children), e5.flags |= 2, t3.memoizedState = null, e5;
  }
  function Em(e5, t3, n4, r4, a4, o3, i4) {
    if (n4) return 256 & t3.flags ? (t3.flags &= -257, r4 = qg(Error(wl(422))), km(e5, t3, i4, r4)) : null !== t3.memoizedState ? (t3.child = e5.child, t3.flags |= 128, null) : (o3 = r4.fallback, a4 = t3.mode, r4 = $y({ mode: "visible", children: r4.children }, a4, 0, null), o3 = xy(o3, a4, i4, null), o3.flags |= 2, r4.return = t3, o3.return = t3, r4.sibling = o3, t3.child = r4, 0 !== (1 & t3.mode) && ah(t3, e5.child, null, i4), t3.child.memoizedState = bm(i4), t3.memoizedState = ym, o3);
    if (0 === (1 & t3.mode)) return km(e5, t3, i4, null);
    if ("$!" === a4.data) {
      if (r4 = a4.nextSibling && a4.nextSibling.dataset, r4) var l4 = r4.dgst;
      return r4 = l4, o3 = Error(wl(419)), r4 = qg(o3, r4, void 0), km(e5, t3, i4, r4);
    }
    if (l4 = 0 !== (i4 & e5.childLanes), nm || l4) {
      if (r4 = gv, null !== r4) {
        switch (i4 & -i4) {
          case 4:
            a4 = 2;
            break;
          case 16:
            a4 = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            a4 = 32;
            break;
          case 536870912:
            a4 = 268435456;
            break;
          default:
            a4 = 0;
        }
        a4 = 0 !== (a4 & (r4.suspendedLanes | i4)) ? 0 : a4, 0 !== a4 && a4 !== o3.retryLane && (o3.retryLane = a4, yh(e5, a4), Uv(r4, e5, a4, -1));
      }
      return ny(), r4 = qg(Error(wl(421))), km(e5, t3, i4, r4);
    }
    return "$?" === a4.data ? (t3.flags |= 128, t3.child = e5.child, t3 = gy.bind(null, e5), a4._reactRetry = t3, null) : (e5 = o3.treeContext, Bp = Qf(a4.nextSibling), jp = t3, Up = true, Hp = null, null !== e5 && (Lp[Rp++] = Mp, Lp[Rp++] = zp, Lp[Rp++] = Op, Mp = e5.id, zp = e5.overflow, Op = t3), t3 = Sm(t3, r4.children), t3.flags |= 4096, t3);
  }
  function xm(e5, t3, n4) {
    e5.lanes |= t3;
    var r4 = e5.alternate;
    null !== r4 && (r4.lanes |= t3), fh(e5.return, t3, n4);
  }
  function $m(e5, t3, n4, r4, a4) {
    var o3 = e5.memoizedState;
    null === o3 ? e5.memoizedState = { isBackwards: t3, rendering: null, renderingStartTime: 0, last: r4, tail: n4, tailMode: a4 } : (o3.isBackwards = t3, o3.rendering = null, o3.renderingStartTime = 0, o3.last = r4, o3.tail = n4, o3.tailMode = a4);
  }
  function _m(e5, t3, n4) {
    var r4 = t3.pendingProps, a4 = r4.revealOrder, o3 = r4.tail;
    if (rm(e5, t3, r4.children, n4), r4 = Dh.current, 0 !== (2 & r4)) r4 = 1 & r4 | 2, t3.flags |= 128;
    else {
      if (null !== e5 && 0 !== (128 & e5.flags)) e: for (e5 = t3.child; null !== e5; ) {
        if (13 === e5.tag) null !== e5.memoizedState && xm(e5, n4, t3);
        else if (19 === e5.tag) xm(e5, n4, t3);
        else if (null !== e5.child) {
          e5.child.return = e5, e5 = e5.child;
          continue;
        }
        if (e5 === t3) break e;
        for (; null === e5.sibling; ) {
          if (null === e5.return || e5.return === t3) break e;
          e5 = e5.return;
        }
        e5.sibling.return = e5.return, e5 = e5.sibling;
      }
      r4 &= 1;
    }
    if (up(Dh, r4), 0 === (1 & t3.mode)) t3.memoizedState = null;
    else switch (a4) {
      case "forwards":
        for (n4 = t3.child, a4 = null; null !== n4; ) e5 = n4.alternate, null !== e5 && null === Fh(e5) && (a4 = n4), n4 = n4.sibling;
        n4 = a4, null === n4 ? (a4 = t3.child, t3.child = null) : (a4 = n4.sibling, n4.sibling = null), $m(t3, false, a4, n4, o3);
        break;
      case "backwards":
        for (n4 = null, a4 = t3.child, t3.child = null; null !== a4; ) {
          if (e5 = a4.alternate, null !== e5 && null === Fh(e5)) {
            t3.child = a4;
            break;
          }
          e5 = a4.sibling, a4.sibling = n4, n4 = a4, a4 = e5;
        }
        $m(t3, true, n4, null, o3);
        break;
      case "together":
        $m(t3, false, null, null, void 0);
        break;
      default:
        t3.memoizedState = null;
    }
    return t3.child;
  }
  function Cm(e5, t3) {
    0 === (1 & t3.mode) && null !== e5 && (e5.alternate = null, t3.alternate = null, t3.flags |= 2);
  }
  function Pm(e5, t3, n4) {
    if (null !== e5 && (t3.dependencies = e5.dependencies), kv |= t3.lanes, 0 === (n4 & t3.childLanes)) return null;
    if (null !== e5 && t3.child !== e5.child) throw Error(wl(153));
    if (null !== t3.child) {
      for (e5 = t3.child, n4 = ky(e5, e5.pendingProps), t3.child = n4, n4.return = t3; null !== e5.sibling; ) e5 = e5.sibling, n4 = n4.sibling = ky(e5, e5.pendingProps), n4.return = t3;
      n4.sibling = null;
    }
    return t3.child;
  }
  function Tm(e5, t3, n4) {
    switch (t3.tag) {
      case 3:
        fm(t3), Xp();
        break;
      case 5:
        zh(t3);
        break;
      case 1:
        gp(t3.type) && bp(t3);
        break;
      case 4:
        Oh(t3, t3.stateNode.containerInfo);
        break;
      case 10:
        var r4 = t3.type._context, a4 = t3.memoizedProps.value;
        up(ih, r4._currentValue), r4._currentValue = a4;
        break;
      case 13:
        if (r4 = t3.memoizedState, null !== r4) return null !== r4.dehydrated ? (up(Dh, 1 & Dh.current), t3.flags |= 128, null) : 0 !== (n4 & t3.child.childLanes) ? wm(e5, t3, n4) : (up(Dh, 1 & Dh.current), e5 = Pm(e5, t3, n4), null !== e5 ? e5.sibling : null);
        up(Dh, 1 & Dh.current);
        break;
      case 19:
        if (r4 = 0 !== (n4 & t3.childLanes), 0 !== (128 & e5.flags)) {
          if (r4) return _m(e5, t3, n4);
          t3.flags |= 128;
        }
        if (a4 = t3.memoizedState, null !== a4 && (a4.rendering = null, a4.tail = null, a4.lastEffect = null), up(Dh, Dh.current), r4) break;
        return null;
      case 22:
      case 23:
        return t3.lanes = 0, lm(e5, t3, n4);
    }
    return Pm(e5, t3, n4);
  }
  function Nm(e5, t3) {
    if (!Up) switch (e5.tailMode) {
      case "hidden":
        t3 = e5.tail;
        for (var n4 = null; null !== t3; ) null !== t3.alternate && (n4 = t3), t3 = t3.sibling;
        null === n4 ? e5.tail = null : n4.sibling = null;
        break;
      case "collapsed":
        n4 = e5.tail;
        for (var r4 = null; null !== n4; ) null !== n4.alternate && (r4 = n4), n4 = n4.sibling;
        null === r4 ? t3 || null === e5.tail ? e5.tail = null : e5.tail.sibling = null : r4.sibling = null;
    }
  }
  function Lm(e5) {
    var t3 = null !== e5.alternate && e5.alternate.child === e5.child, n4 = 0, r4 = 0;
    if (t3) for (var a4 = e5.child; null !== a4; ) n4 |= a4.lanes | a4.childLanes, r4 |= 14680064 & a4.subtreeFlags, r4 |= 14680064 & a4.flags, a4.return = e5, a4 = a4.sibling;
    else for (a4 = e5.child; null !== a4; ) n4 |= a4.lanes | a4.childLanes, r4 |= a4.subtreeFlags, r4 |= a4.flags, a4.return = e5, a4 = a4.sibling;
    return e5.subtreeFlags |= r4, e5.childLanes = n4, t3;
  }
  function Rm(e5, t3, n4) {
    var r4 = t3.pendingProps;
    switch (Ap(t3), t3.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Lm(t3), null;
      case 1:
        return gp(t3.type) && mp(), Lm(t3), null;
      case 3:
        return r4 = t3.stateNode, Mh(), sp(fp), sp(dp), jh(), r4.pendingContext && (r4.context = r4.pendingContext, r4.pendingContext = null), null !== e5 && null !== e5.child || (Gp(t3) ? t3.flags |= 4 : null === e5 || e5.memoizedState.isDehydrated && 0 === (256 & t3.flags) || (t3.flags |= 1024, null !== Hp && (Qv(Hp), Hp = null))), gm(e5, t3), Lm(t3), null;
      case 5:
        Ih(t3);
        var a4 = Rh(Lh.current);
        if (n4 = t3.type, null !== e5 && null != t3.stateNode) mm(e5, t3, n4, r4, a4), e5.ref !== t3.ref && (t3.flags |= 512, t3.flags |= 2097152);
        else {
          if (!r4) {
            if (null === t3.stateNode) throw Error(wl(166));
            return Lm(t3), null;
          }
          if (e5 = Rh(Th.current), Gp(t3)) {
            r4 = t3.stateNode, n4 = t3.type;
            var o3 = t3.memoizedProps;
            switch (r4[Gf] = t3, r4[Kf] = o3, e5 = 0 !== (1 & t3.mode), n4) {
              case "dialog":
                kf("cancel", r4), kf("close", r4);
                break;
              case "iframe":
              case "object":
              case "embed":
                kf("load", r4);
                break;
              case "video":
              case "audio":
                for (a4 = 0; a4 < yf.length; a4++) kf(yf[a4], r4);
                break;
              case "source":
                kf("error", r4);
                break;
              case "img":
              case "image":
              case "link":
                kf("error", r4), kf("load", r4);
                break;
              case "details":
                kf("toggle", r4);
                break;
              case "input":
                gs(r4, o3), kf("invalid", r4);
                break;
              case "select":
                r4._wrapperState = { wasMultiple: !!o3.multiple }, kf("invalid", r4);
                break;
              case "textarea":
                Es(r4, o3), kf("invalid", r4);
            }
            for (var i4 in Is(n4, o3), a4 = null, o3) if (o3.hasOwnProperty(i4)) {
              var l4 = o3[i4];
              "children" === i4 ? "string" === typeof l4 ? r4.textContent !== l4 && (true !== o3.suppressHydrationWarning && zf(r4.textContent, l4, e5), a4 = ["children", l4]) : "number" === typeof l4 && r4.textContent !== "" + l4 && (true !== o3.suppressHydrationWarning && zf(r4.textContent, l4, e5), a4 = ["children", "" + l4]) : kl.hasOwnProperty(i4) && null != l4 && "onScroll" === i4 && kf("scroll", r4);
            }
            switch (n4) {
              case "input":
                ds(r4), ys(r4, o3, true);
                break;
              case "textarea":
                ds(r4), $s(r4);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof o3.onClick && (r4.onclick = If);
            }
            r4 = a4, t3.updateQueue = r4, null !== r4 && (t3.flags |= 4);
          } else {
            i4 = 9 === a4.nodeType ? a4 : a4.ownerDocument, "http://www.w3.org/1999/xhtml" === e5 && (e5 = _s(n4)), "http://www.w3.org/1999/xhtml" === e5 ? "script" === n4 ? (e5 = i4.createElement("div"), e5.innerHTML = "<script><\/script>", e5 = e5.removeChild(e5.firstChild)) : "string" === typeof r4.is ? e5 = i4.createElement(n4, { is: r4.is }) : (e5 = i4.createElement(n4), "select" === n4 && (i4 = e5, r4.multiple ? i4.multiple = true : r4.size && (i4.size = r4.size))) : e5 = i4.createElementNS(e5, n4), e5[Gf] = t3, e5[Kf] = r4, hm(e5, t3, false, false), t3.stateNode = e5;
            e: {
              switch (i4 = Ds(n4, r4), n4) {
                case "dialog":
                  kf("cancel", e5), kf("close", e5), a4 = r4;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  kf("load", e5), a4 = r4;
                  break;
                case "video":
                case "audio":
                  for (a4 = 0; a4 < yf.length; a4++) kf(yf[a4], e5);
                  a4 = r4;
                  break;
                case "source":
                  kf("error", e5), a4 = r4;
                  break;
                case "img":
                case "image":
                case "link":
                  kf("error", e5), kf("load", e5), a4 = r4;
                  break;
                case "details":
                  kf("toggle", e5), a4 = r4;
                  break;
                case "input":
                  gs(e5, r4), a4 = hs(e5, r4), kf("invalid", e5);
                  break;
                case "option":
                  a4 = r4;
                  break;
                case "select":
                  e5._wrapperState = { wasMultiple: !!r4.multiple }, a4 = ts({}, r4, { value: void 0 }), kf("invalid", e5);
                  break;
                case "textarea":
                  Es(e5, r4), a4 = ks(e5, r4), kf("invalid", e5);
                  break;
                default:
                  a4 = r4;
              }
              for (o3 in Is(n4, a4), l4 = a4, l4) if (l4.hasOwnProperty(o3)) {
                var s4 = l4[o3];
                "style" === o3 ? Ms(e5, s4) : "dangerouslySetInnerHTML" === o3 ? (s4 = s4 ? s4.__html : void 0, null != s4 && Ts(e5, s4)) : "children" === o3 ? "string" === typeof s4 ? ("textarea" !== n4 || "" !== s4) && Ns(e5, s4) : "number" === typeof s4 && Ns(e5, "" + s4) : "suppressContentEditableWarning" !== o3 && "suppressHydrationWarning" !== o3 && "autoFocus" !== o3 && (kl.hasOwnProperty(o3) ? null != s4 && "onScroll" === o3 && kf("scroll", e5) : null != s4 && Dl(e5, o3, s4, i4));
              }
              switch (n4) {
                case "input":
                  ds(e5), ys(e5, r4, false);
                  break;
                case "textarea":
                  ds(e5), $s(e5);
                  break;
                case "option":
                  null != r4.value && e5.setAttribute("value", "" + ss(r4.value));
                  break;
                case "select":
                  e5.multiple = !!r4.multiple, o3 = r4.value, null != o3 ? Ss(e5, !!r4.multiple, o3, false) : null != r4.defaultValue && Ss(e5, !!r4.multiple, r4.defaultValue, true);
                  break;
                default:
                  "function" === typeof a4.onClick && (e5.onclick = If);
              }
              switch (n4) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r4 = !!r4.autoFocus;
                  break e;
                case "img":
                  r4 = true;
                  break e;
                default:
                  r4 = false;
              }
            }
            r4 && (t3.flags |= 4);
          }
          null !== t3.ref && (t3.flags |= 512, t3.flags |= 2097152);
        }
        return Lm(t3), null;
      case 6:
        if (e5 && null != t3.stateNode) vm(e5, t3, e5.memoizedProps, r4);
        else {
          if ("string" !== typeof r4 && null === t3.stateNode) throw Error(wl(166));
          if (n4 = Rh(Lh.current), Rh(Th.current), Gp(t3)) {
            if (r4 = t3.stateNode, n4 = t3.memoizedProps, r4[Gf] = t3, (o3 = r4.nodeValue !== n4) && (e5 = jp, null !== e5)) switch (e5.tag) {
              case 3:
                zf(r4.nodeValue, n4, 0 !== (1 & e5.mode));
                break;
              case 5:
                true !== e5.memoizedProps.suppressHydrationWarning && zf(r4.nodeValue, n4, 0 !== (1 & e5.mode));
            }
            o3 && (t3.flags |= 4);
          } else r4 = (9 === n4.nodeType ? n4 : n4.ownerDocument).createTextNode(r4), r4[Gf] = t3, t3.stateNode = r4;
        }
        return Lm(t3), null;
      case 13:
        if (sp(Dh), r4 = t3.memoizedState, null === e5 || null !== e5.memoizedState && null !== e5.memoizedState.dehydrated) {
          if (Up && null !== Bp && 0 !== (1 & t3.mode) && 0 === (128 & t3.flags)) Kp(), Xp(), t3.flags |= 98560, o3 = false;
          else if (o3 = Gp(t3), null !== r4 && null !== r4.dehydrated) {
            if (null === e5) {
              if (!o3) throw Error(wl(318));
              if (o3 = t3.memoizedState, o3 = null !== o3 ? o3.dehydrated : null, !o3) throw Error(wl(317));
              o3[Gf] = t3;
            } else Xp(), 0 === (128 & t3.flags) && (t3.memoizedState = null), t3.flags |= 4;
            Lm(t3), o3 = false;
          } else null !== Hp && (Qv(Hp), Hp = null), o3 = true;
          if (!o3) return 65536 & t3.flags ? t3 : null;
        }
        return 0 !== (128 & t3.flags) ? (t3.lanes = n4, t3) : (r4 = null !== r4, r4 !== (null !== e5 && null !== e5.memoizedState) && r4 && (t3.child.flags |= 8192, 0 !== (1 & t3.mode) && (null === e5 || 0 !== (1 & Dh.current) ? 0 === wv && (wv = 3) : ny())), null !== t3.updateQueue && (t3.flags |= 4), Lm(t3), null);
      case 4:
        return Mh(), gm(e5, t3), null === e5 && $f(t3.stateNode.containerInfo), Lm(t3), null;
      case 10:
        return dh(t3.type._context), Lm(t3), null;
      case 17:
        return gp(t3.type) && mp(), Lm(t3), null;
      case 19:
        if (sp(Dh), o3 = t3.memoizedState, null === o3) return Lm(t3), null;
        if (r4 = 0 !== (128 & t3.flags), i4 = o3.rendering, null === i4) if (r4) Nm(o3, false);
        else {
          if (0 !== wv || null !== e5 && 0 !== (128 & e5.flags)) for (e5 = t3.child; null !== e5; ) {
            if (i4 = Fh(e5), null !== i4) {
              for (t3.flags |= 128, Nm(o3, false), r4 = i4.updateQueue, null !== r4 && (t3.updateQueue = r4, t3.flags |= 4), t3.subtreeFlags = 0, r4 = n4, n4 = t3.child; null !== n4; ) o3 = n4, e5 = r4, o3.flags &= 14680066, i4 = o3.alternate, null === i4 ? (o3.childLanes = 0, o3.lanes = e5, o3.child = null, o3.subtreeFlags = 0, o3.memoizedProps = null, o3.memoizedState = null, o3.updateQueue = null, o3.dependencies = null, o3.stateNode = null) : (o3.childLanes = i4.childLanes, o3.lanes = i4.lanes, o3.child = i4.child, o3.subtreeFlags = 0, o3.deletions = null, o3.memoizedProps = i4.memoizedProps, o3.memoizedState = i4.memoizedState, o3.updateQueue = i4.updateQueue, o3.type = i4.type, e5 = i4.dependencies, o3.dependencies = null === e5 ? null : { lanes: e5.lanes, firstContext: e5.firstContext }), n4 = n4.sibling;
              return up(Dh, 1 & Dh.current | 2), t3.child;
            }
            e5 = e5.sibling;
          }
          null !== o3.tail && vu() > Pv && (t3.flags |= 128, r4 = true, Nm(o3, false), t3.lanes = 4194304);
        }
        else {
          if (!r4) if (e5 = Fh(i4), null !== e5) {
            if (t3.flags |= 128, r4 = true, n4 = e5.updateQueue, null !== n4 && (t3.updateQueue = n4, t3.flags |= 4), Nm(o3, true), null === o3.tail && "hidden" === o3.tailMode && !i4.alternate && !Up) return Lm(t3), null;
          } else 2 * vu() - o3.renderingStartTime > Pv && 1073741824 !== n4 && (t3.flags |= 128, r4 = true, Nm(o3, false), t3.lanes = 4194304);
          o3.isBackwards ? (i4.sibling = t3.child, t3.child = i4) : (n4 = o3.last, null !== n4 ? n4.sibling = i4 : t3.child = i4, o3.last = i4);
        }
        return null !== o3.tail ? (t3 = o3.tail, o3.rendering = t3, o3.tail = t3.sibling, o3.renderingStartTime = vu(), t3.sibling = null, n4 = Dh.current, up(Dh, r4 ? 1 & n4 | 2 : 1 & n4), t3) : (Lm(t3), null);
      case 22:
      case 23:
        return Zv(), r4 = null !== t3.memoizedState, null !== e5 && null !== e5.memoizedState !== r4 && (t3.flags |= 8192), r4 && 0 !== (1 & t3.mode) ? 0 !== (1073741824 & yv) && (Lm(t3), 6 & t3.subtreeFlags && (t3.flags |= 8192)) : Lm(t3), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(wl(156, t3.tag));
  }
  function Om(e5, t3) {
    switch (Ap(t3), t3.tag) {
      case 1:
        return gp(t3.type) && mp(), e5 = t3.flags, 65536 & e5 ? (t3.flags = -65537 & e5 | 128, t3) : null;
      case 3:
        return Mh(), sp(fp), sp(dp), jh(), e5 = t3.flags, 0 !== (65536 & e5) && 0 === (128 & e5) ? (t3.flags = -65537 & e5 | 128, t3) : null;
      case 5:
        return Ih(t3), null;
      case 13:
        if (sp(Dh), e5 = t3.memoizedState, null !== e5 && null !== e5.dehydrated) {
          if (null === t3.alternate) throw Error(wl(340));
          Xp();
        }
        return e5 = t3.flags, 65536 & e5 ? (t3.flags = -65537 & e5 | 128, t3) : null;
      case 19:
        return sp(Dh), null;
      case 4:
        return Mh(), null;
      case 10:
        return dh(t3.type._context), null;
      case 22:
      case 23:
        return Zv(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  function Fm(e5, t3) {
    var n4 = e5.ref;
    if (null !== n4) if ("function" === typeof n4) try {
      n4(null);
    } catch (r4) {
      fy(e5, t3, r4);
    }
    else n4.current = null;
  }
  function Am(e5, t3, n4) {
    try {
      n4();
    } catch (r4) {
      fy(e5, t3, r4);
    }
  }
  function Bm(e5, t3) {
    if (Df = gc, e5 = Qd(), qd(e5)) {
      if ("selectionStart" in e5) var n4 = { start: e5.selectionStart, end: e5.selectionEnd };
      else e: {
        n4 = (n4 = e5.ownerDocument) && n4.defaultView || window;
        var r4 = n4.getSelection && n4.getSelection();
        if (r4 && 0 !== r4.rangeCount) {
          n4 = r4.anchorNode;
          var a4 = r4.anchorOffset, o3 = r4.focusNode;
          r4 = r4.focusOffset;
          try {
            n4.nodeType, o3.nodeType;
          } catch (w3) {
            n4 = null;
            break e;
          }
          var i4 = 0, l4 = -1, s4 = -1, u3 = 0, c4 = 0, d3 = e5, f3 = null;
          t: for (; ; ) {
            for (var p4; ; ) {
              if (d3 !== n4 || 0 !== a4 && 3 !== d3.nodeType || (l4 = i4 + a4), d3 !== o3 || 0 !== r4 && 3 !== d3.nodeType || (s4 = i4 + r4), 3 === d3.nodeType && (i4 += d3.nodeValue.length), null === (p4 = d3.firstChild)) break;
              f3 = d3, d3 = p4;
            }
            for (; ; ) {
              if (d3 === e5) break t;
              if (f3 === n4 && ++u3 === a4 && (l4 = i4), f3 === o3 && ++c4 === r4 && (s4 = i4), null !== (p4 = d3.nextSibling)) break;
              d3 = f3, f3 = d3.parentNode;
            }
            d3 = p4;
          }
          n4 = -1 === l4 || -1 === s4 ? null : { start: l4, end: s4 };
        } else n4 = null;
      }
      n4 = n4 || { start: 0, end: 0 };
    } else n4 = null;
    for (Ff = { focusedElem: e5, selectionRange: n4 }, gc = false, Dm = t3; null !== Dm; ) if (t3 = Dm, e5 = t3.child, 0 !== (1028 & t3.subtreeFlags) && null !== e5) e5.return = t3, Dm = e5;
    else for (; null !== Dm; ) {
      t3 = Dm;
      try {
        var h4 = t3.alternate;
        if (0 !== (1024 & t3.flags)) switch (t3.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== h4) {
              var g4 = h4.memoizedProps, m4 = h4.memoizedState, v3 = t3.stateNode, y3 = v3.getSnapshotBeforeUpdate(t3.elementType === t3.type ? g4 : Ag(t3.type, g4), m4);
              v3.__reactInternalSnapshotBeforeUpdate = y3;
            }
            break;
          case 3:
            var b3 = t3.stateNode.containerInfo;
            1 === b3.nodeType ? b3.textContent = "" : 9 === b3.nodeType && b3.documentElement && b3.removeChild(b3.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(wl(163));
        }
      } catch (w3) {
        fy(t3, t3.return, w3);
      }
      if (e5 = t3.sibling, null !== e5) {
        e5.return = t3.return, Dm = e5;
        break;
      }
      Dm = t3.return;
    }
    return h4 = jm, jm = false, h4;
  }
  function Um(e5, t3, n4) {
    var r4 = t3.updateQueue;
    if (r4 = null !== r4 ? r4.lastEffect : null, null !== r4) {
      var a4 = r4 = r4.next;
      do {
        if ((a4.tag & e5) === e5) {
          var o3 = a4.destroy;
          a4.destroy = void 0, void 0 !== o3 && Am(t3, n4, o3);
        }
        a4 = a4.next;
      } while (a4 !== r4);
    }
  }
  function Hm(e5, t3) {
    if (t3 = t3.updateQueue, t3 = null !== t3 ? t3.lastEffect : null, null !== t3) {
      var n4 = t3 = t3.next;
      do {
        if ((n4.tag & e5) === e5) {
          var r4 = n4.create;
          n4.destroy = r4();
        }
        n4 = n4.next;
      } while (n4 !== t3);
    }
  }
  function Wm(e5) {
    var t3 = e5.ref;
    if (null !== t3) {
      var n4 = e5.stateNode;
      switch (e5.tag) {
        case 5:
          e5 = n4;
          break;
        default:
          e5 = n4;
      }
      "function" === typeof t3 ? t3(e5) : t3.current = e5;
    }
  }
  function Vm(e5) {
    var t3 = e5.alternate;
    null !== t3 && (e5.alternate = null, Vm(t3)), e5.child = null, e5.deletions = null, e5.sibling = null, 5 === e5.tag && (t3 = e5.stateNode, null !== t3 && (delete t3[Gf], delete t3[Kf], delete t3[Zf], delete t3[Jf], delete t3[ep])), e5.stateNode = null, e5.return = null, e5.dependencies = null, e5.memoizedProps = null, e5.memoizedState = null, e5.pendingProps = null, e5.stateNode = null, e5.updateQueue = null;
  }
  function Qm(e5) {
    return 5 === e5.tag || 3 === e5.tag || 4 === e5.tag;
  }
  function qm(e5) {
    e: for (; ; ) {
      for (; null === e5.sibling; ) {
        if (null === e5.return || Qm(e5.return)) return null;
        e5 = e5.return;
      }
      for (e5.sibling.return = e5.return, e5 = e5.sibling; 5 !== e5.tag && 6 !== e5.tag && 18 !== e5.tag; ) {
        if (2 & e5.flags) continue e;
        if (null === e5.child || 4 === e5.tag) continue e;
        e5.child.return = e5, e5 = e5.child;
      }
      if (!(2 & e5.flags)) return e5.stateNode;
    }
  }
  function Ym(e5, t3, n4) {
    var r4 = e5.tag;
    if (5 === r4 || 6 === r4) e5 = e5.stateNode, t3 ? 8 === n4.nodeType ? n4.parentNode.insertBefore(e5, t3) : n4.insertBefore(e5, t3) : (8 === n4.nodeType ? (t3 = n4.parentNode, t3.insertBefore(e5, n4)) : (t3 = n4, t3.appendChild(e5)), n4 = n4._reactRootContainer, null !== n4 && void 0 !== n4 || null !== t3.onclick || (t3.onclick = If));
    else if (4 !== r4 && (e5 = e5.child, null !== e5)) for (Ym(e5, t3, n4), e5 = e5.sibling; null !== e5; ) Ym(e5, t3, n4), e5 = e5.sibling;
  }
  function Gm(e5, t3, n4) {
    var r4 = e5.tag;
    if (5 === r4 || 6 === r4) e5 = e5.stateNode, t3 ? n4.insertBefore(e5, t3) : n4.appendChild(e5);
    else if (4 !== r4 && (e5 = e5.child, null !== e5)) for (Gm(e5, t3, n4), e5 = e5.sibling; null !== e5; ) Gm(e5, t3, n4), e5 = e5.sibling;
  }
  function Zm(e5, t3, n4) {
    for (n4 = n4.child; null !== n4; ) Jm(e5, t3, n4), n4 = n4.sibling;
  }
  function Jm(e5, t3, n4) {
    if ($u && "function" === typeof $u.onCommitFiberUnmount) try {
      $u.onCommitFiberUnmount(xu, n4);
    } catch (l4) {
    }
    switch (n4.tag) {
      case 5:
        zm || Fm(n4, t3);
      case 6:
        var r4 = Km, a4 = Xm;
        Km = null, Zm(e5, t3, n4), Km = r4, Xm = a4, null !== Km && (Xm ? (e5 = Km, n4 = n4.stateNode, 8 === e5.nodeType ? e5.parentNode.removeChild(n4) : e5.removeChild(n4)) : Km.removeChild(n4.stateNode));
        break;
      case 18:
        null !== Km && (Xm ? (e5 = Km, n4 = n4.stateNode, 8 === e5.nodeType ? Vf(e5.parentNode, n4) : 1 === e5.nodeType && Vf(e5, n4), pc(e5)) : Vf(Km, n4.stateNode));
        break;
      case 4:
        r4 = Km, a4 = Xm, Km = n4.stateNode.containerInfo, Xm = true, Zm(e5, t3, n4), Km = r4, Xm = a4;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!zm && (r4 = n4.updateQueue, null !== r4 && (r4 = r4.lastEffect, null !== r4))) {
          a4 = r4 = r4.next;
          do {
            var o3 = a4, i4 = o3.destroy;
            o3 = o3.tag, void 0 !== i4 && (0 !== (2 & o3) || 0 !== (4 & o3)) && Am(n4, t3, i4), a4 = a4.next;
          } while (a4 !== r4);
        }
        Zm(e5, t3, n4);
        break;
      case 1:
        if (!zm && (Fm(n4, t3), r4 = n4.stateNode, "function" === typeof r4.componentWillUnmount)) try {
          r4.props = n4.memoizedProps, r4.state = n4.memoizedState, r4.componentWillUnmount();
        } catch (l4) {
          fy(n4, t3, l4);
        }
        Zm(e5, t3, n4);
        break;
      case 21:
        Zm(e5, t3, n4);
        break;
      case 22:
        1 & n4.mode ? (zm = (r4 = zm) || null !== n4.memoizedState, Zm(e5, t3, n4), zm = r4) : Zm(e5, t3, n4);
        break;
      default:
        Zm(e5, t3, n4);
    }
  }
  function ev(e5) {
    var t3 = e5.updateQueue;
    if (null !== t3) {
      e5.updateQueue = null;
      var n4 = e5.stateNode;
      null === n4 && (n4 = e5.stateNode = new Im()), t3.forEach(function(t4) {
        var r4 = my.bind(null, e5, t4);
        n4.has(t4) || (n4.add(t4), t4.then(r4, r4));
      });
    }
  }
  function tv(e5, t3) {
    var n4 = t3.deletions;
    if (null !== n4) for (var r4 = 0; r4 < n4.length; r4++) {
      var a4 = n4[r4];
      try {
        var o3 = e5, i4 = t3, l4 = i4;
        e: for (; null !== l4; ) {
          switch (l4.tag) {
            case 5:
              Km = l4.stateNode, Xm = false;
              break e;
            case 3:
              Km = l4.stateNode.containerInfo, Xm = true;
              break e;
            case 4:
              Km = l4.stateNode.containerInfo, Xm = true;
              break e;
          }
          l4 = l4.return;
        }
        if (null === Km) throw Error(wl(160));
        Jm(o3, i4, a4), Km = null, Xm = false;
        var s4 = a4.alternate;
        null !== s4 && (s4.return = null), a4.return = null;
      } catch (u3) {
        fy(a4, t3, u3);
      }
    }
    if (12854 & t3.subtreeFlags) for (t3 = t3.child; null !== t3; ) nv(t3, e5), t3 = t3.sibling;
  }
  function nv(e5, t3) {
    var n4 = e5.alternate, r4 = e5.flags;
    switch (e5.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (tv(t3, e5), rv(e5), 4 & r4) {
          try {
            Um(3, e5, e5.return), Hm(3, e5);
          } catch (g4) {
            fy(e5, e5.return, g4);
          }
          try {
            Um(5, e5, e5.return);
          } catch (g4) {
            fy(e5, e5.return, g4);
          }
        }
        break;
      case 1:
        tv(t3, e5), rv(e5), 512 & r4 && null !== n4 && Fm(n4, n4.return);
        break;
      case 5:
        if (tv(t3, e5), rv(e5), 512 & r4 && null !== n4 && Fm(n4, n4.return), 32 & e5.flags) {
          var a4 = e5.stateNode;
          try {
            Ns(a4, "");
          } catch (g4) {
            fy(e5, e5.return, g4);
          }
        }
        if (4 & r4 && (a4 = e5.stateNode, null != a4)) {
          var o3 = e5.memoizedProps, i4 = null !== n4 ? n4.memoizedProps : o3, l4 = e5.type, s4 = e5.updateQueue;
          if (e5.updateQueue = null, null !== s4) try {
            "input" === l4 && "radio" === o3.type && null != o3.name && ms(a4, o3), Ds(l4, i4);
            var u3 = Ds(l4, o3);
            for (i4 = 0; i4 < s4.length; i4 += 2) {
              var c4 = s4[i4], d3 = s4[i4 + 1];
              "style" === c4 ? Ms(a4, d3) : "dangerouslySetInnerHTML" === c4 ? Ts(a4, d3) : "children" === c4 ? Ns(a4, d3) : Dl(a4, c4, d3, u3);
            }
            switch (l4) {
              case "input":
                vs(a4, o3);
                break;
              case "textarea":
                xs(a4, o3);
                break;
              case "select":
                var f3 = a4._wrapperState.wasMultiple;
                a4._wrapperState.wasMultiple = !!o3.multiple;
                var p4 = o3.value;
                null != p4 ? Ss(a4, !!o3.multiple, p4, false) : f3 !== !!o3.multiple && (null != o3.defaultValue ? Ss(a4, !!o3.multiple, o3.defaultValue, true) : Ss(a4, !!o3.multiple, o3.multiple ? [] : "", false));
            }
            a4[Kf] = o3;
          } catch (g4) {
            fy(e5, e5.return, g4);
          }
        }
        break;
      case 6:
        if (tv(t3, e5), rv(e5), 4 & r4) {
          if (null === e5.stateNode) throw Error(wl(162));
          a4 = e5.stateNode, o3 = e5.memoizedProps;
          try {
            a4.nodeValue = o3;
          } catch (g4) {
            fy(e5, e5.return, g4);
          }
        }
        break;
      case 3:
        if (tv(t3, e5), rv(e5), 4 & r4 && null !== n4 && n4.memoizedState.isDehydrated) try {
          pc(t3.containerInfo);
        } catch (g4) {
          fy(e5, e5.return, g4);
        }
        break;
      case 4:
        tv(t3, e5), rv(e5);
        break;
      case 13:
        tv(t3, e5), rv(e5), a4 = e5.child, 8192 & a4.flags && (o3 = null !== a4.memoizedState, a4.stateNode.isHidden = o3, !o3 || null !== a4.alternate && null !== a4.alternate.memoizedState || (Cv = vu())), 4 & r4 && ev(e5);
        break;
      case 22:
        if (c4 = null !== n4 && null !== n4.memoizedState, 1 & e5.mode ? (zm = (u3 = zm) || c4, tv(t3, e5), zm = u3) : tv(t3, e5), rv(e5), 8192 & r4) {
          if (u3 = null !== e5.memoizedState, (e5.stateNode.isHidden = u3) && !c4 && 0 !== (1 & e5.mode)) for (Dm = e5, c4 = e5.child; null !== c4; ) {
            for (d3 = Dm = c4; null !== Dm; ) {
              switch (f3 = Dm, p4 = f3.child, f3.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Um(4, f3, f3.return);
                  break;
                case 1:
                  Fm(f3, f3.return);
                  var h4 = f3.stateNode;
                  if ("function" === typeof h4.componentWillUnmount) {
                    r4 = f3, n4 = f3.return;
                    try {
                      t3 = r4, h4.props = t3.memoizedProps, h4.state = t3.memoizedState, h4.componentWillUnmount();
                    } catch (g4) {
                      fy(r4, n4, g4);
                    }
                  }
                  break;
                case 5:
                  Fm(f3, f3.return);
                  break;
                case 22:
                  if (null !== f3.memoizedState) {
                    lv(d3);
                    continue;
                  }
              }
              null !== p4 ? (p4.return = f3, Dm = p4) : lv(d3);
            }
            c4 = c4.sibling;
          }
          e: for (c4 = null, d3 = e5; ; ) {
            if (5 === d3.tag) {
              if (null === c4) {
                c4 = d3;
                try {
                  a4 = d3.stateNode, u3 ? (o3 = a4.style, "function" === typeof o3.setProperty ? o3.setProperty("display", "none", "important") : o3.display = "none") : (l4 = d3.stateNode, s4 = d3.memoizedProps.style, i4 = void 0 !== s4 && null !== s4 && s4.hasOwnProperty("display") ? s4.display : null, l4.style.display = Os("display", i4));
                } catch (g4) {
                  fy(e5, e5.return, g4);
                }
              }
            } else if (6 === d3.tag) {
              if (null === c4) try {
                d3.stateNode.nodeValue = u3 ? "" : d3.memoizedProps;
              } catch (g4) {
                fy(e5, e5.return, g4);
              }
            } else if ((22 !== d3.tag && 23 !== d3.tag || null === d3.memoizedState || d3 === e5) && null !== d3.child) {
              d3.child.return = d3, d3 = d3.child;
              continue;
            }
            if (d3 === e5) break e;
            for (; null === d3.sibling; ) {
              if (null === d3.return || d3.return === e5) break e;
              c4 === d3 && (c4 = null), d3 = d3.return;
            }
            c4 === d3 && (c4 = null), d3.sibling.return = d3.return, d3 = d3.sibling;
          }
        }
        break;
      case 19:
        tv(t3, e5), rv(e5), 4 & r4 && ev(e5);
        break;
      case 21:
        break;
      default:
        tv(t3, e5), rv(e5);
    }
  }
  function rv(e5) {
    var t3 = e5.flags;
    if (2 & t3) {
      try {
        e: {
          for (var n4 = e5.return; null !== n4; ) {
            if (Qm(n4)) {
              var r4 = n4;
              break e;
            }
            n4 = n4.return;
          }
          throw Error(wl(160));
        }
        switch (r4.tag) {
          case 5:
            var a4 = r4.stateNode;
            32 & r4.flags && (Ns(a4, ""), r4.flags &= -33);
            var o3 = qm(e5);
            Gm(e5, o3, a4);
            break;
          case 3:
          case 4:
            var i4 = r4.stateNode.containerInfo, l4 = qm(e5);
            Ym(e5, l4, i4);
            break;
          default:
            throw Error(wl(161));
        }
      } catch (s4) {
        fy(e5, e5.return, s4);
      }
      e5.flags &= -3;
    }
    4096 & t3 && (e5.flags &= -4097);
  }
  function av(e5, t3, n4) {
    Dm = e5, ov(e5);
  }
  function ov(e5, t3, n4) {
    for (var r4 = 0 !== (1 & e5.mode); null !== Dm; ) {
      var a4 = Dm, o3 = a4.child;
      if (22 === a4.tag && r4) {
        var i4 = null !== a4.memoizedState || Mm;
        if (!i4) {
          var l4 = a4.alternate, s4 = null !== l4 && null !== l4.memoizedState || zm;
          l4 = Mm;
          var u3 = zm;
          if (Mm = i4, (zm = s4) && !u3) for (Dm = a4; null !== Dm; ) i4 = Dm, s4 = i4.child, 22 === i4.tag && null !== i4.memoizedState ? sv(a4) : null !== s4 ? (s4.return = i4, Dm = s4) : sv(a4);
          for (; null !== o3; ) Dm = o3, ov(o3), o3 = o3.sibling;
          Dm = a4, Mm = l4, zm = u3;
        }
        iv(e5);
      } else 0 !== (8772 & a4.subtreeFlags) && null !== o3 ? (o3.return = a4, Dm = o3) : iv(e5);
    }
  }
  function iv(e5) {
    for (; null !== Dm; ) {
      var t3 = Dm;
      if (0 !== (8772 & t3.flags)) {
        var n4 = t3.alternate;
        try {
          if (0 !== (8772 & t3.flags)) switch (t3.tag) {
            case 0:
            case 11:
            case 15:
              zm || Hm(5, t3);
              break;
            case 1:
              var r4 = t3.stateNode;
              if (4 & t3.flags && !zm) if (null === n4) r4.componentDidMount();
              else {
                var a4 = t3.elementType === t3.type ? n4.memoizedProps : Ag(t3.type, n4.memoizedProps);
                r4.componentDidUpdate(a4, n4.memoizedState, r4.__reactInternalSnapshotBeforeUpdate);
              }
              var o3 = t3.updateQueue;
              null !== o3 && Ch(t3, o3, r4);
              break;
            case 3:
              var i4 = t3.updateQueue;
              if (null !== i4) {
                if (n4 = null, null !== t3.child) switch (t3.child.tag) {
                  case 5:
                    n4 = t3.child.stateNode;
                    break;
                  case 1:
                    n4 = t3.child.stateNode;
                }
                Ch(t3, i4, n4);
              }
              break;
            case 5:
              var l4 = t3.stateNode;
              if (null === n4 && 4 & t3.flags) {
                n4 = l4;
                var s4 = t3.memoizedProps;
                switch (t3.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s4.autoFocus && n4.focus();
                    break;
                  case "img":
                    s4.src && (n4.src = s4.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === t3.memoizedState) {
                var u3 = t3.alternate;
                if (null !== u3) {
                  var c4 = u3.memoizedState;
                  if (null !== c4) {
                    var d3 = c4.dehydrated;
                    null !== d3 && pc(d3);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(wl(163));
          }
          zm || 512 & t3.flags && Wm(t3);
        } catch (f3) {
          fy(t3, t3.return, f3);
        }
      }
      if (t3 === e5) {
        Dm = null;
        break;
      }
      if (n4 = t3.sibling, null !== n4) {
        n4.return = t3.return, Dm = n4;
        break;
      }
      Dm = t3.return;
    }
  }
  function lv(e5) {
    for (; null !== Dm; ) {
      var t3 = Dm;
      if (t3 === e5) {
        Dm = null;
        break;
      }
      var n4 = t3.sibling;
      if (null !== n4) {
        n4.return = t3.return, Dm = n4;
        break;
      }
      Dm = t3.return;
    }
  }
  function sv(e5) {
    for (; null !== Dm; ) {
      var t3 = Dm;
      try {
        switch (t3.tag) {
          case 0:
          case 11:
          case 15:
            var n4 = t3.return;
            try {
              Hm(4, t3);
            } catch (s4) {
              fy(t3, n4, s4);
            }
            break;
          case 1:
            var r4 = t3.stateNode;
            if ("function" === typeof r4.componentDidMount) {
              var a4 = t3.return;
              try {
                r4.componentDidMount();
              } catch (s4) {
                fy(t3, a4, s4);
              }
            }
            var o3 = t3.return;
            try {
              Wm(t3);
            } catch (s4) {
              fy(t3, o3, s4);
            }
            break;
          case 5:
            var i4 = t3.return;
            try {
              Wm(t3);
            } catch (s4) {
              fy(t3, i4, s4);
            }
        }
      } catch (s4) {
        fy(t3, t3.return, s4);
      }
      if (t3 === e5) {
        Dm = null;
        break;
      }
      var l4 = t3.sibling;
      if (null !== l4) {
        l4.return = t3.return, Dm = l4;
        break;
      }
      Dm = t3.return;
    }
  }
  function jv() {
    return 0 !== (6 & hv) ? vu() : -1 !== Fv ? Fv : Fv = vu();
  }
  function Bv(e5) {
    return 0 === (1 & e5.mode) ? 1 : 0 !== (2 & hv) && 0 !== vv ? vv & -vv : null !== Jp.transition ? (0 === Av && (Av = Fu()), Av) : (e5 = Hu, 0 !== e5 || (e5 = window.event, e5 = void 0 === e5 ? 16 : Sc(e5.type)), e5);
  }
  function Uv(e5, t3, n4, r4) {
    if (50 < Iv) throw Iv = 0, Dv = null, Error(wl(185));
    ju(e5, n4, r4), 0 !== (2 & hv) && e5 === gv || (e5 === gv && (0 === (2 & hv) && (Ev |= n4), 4 === wv && Yv(e5, vv)), Hv(e5, r4), 1 === n4 && 0 === hv && 0 === (1 & t3.mode) && (Pv = vu() + 500, kp && _p()));
  }
  function Hv(e5, t3) {
    var n4 = e5.callbackNode;
    Iu(e5, t3);
    var r4 = Mu(e5, e5 === gv ? vv : 0);
    if (0 === r4) null !== n4 && hu(n4), e5.callbackNode = null, e5.callbackPriority = 0;
    else if (t3 = r4 & -r4, e5.callbackPriority !== t3) {
      if (null != n4 && hu(n4), 1 === t3) 0 === e5.tag ? $p(Gv.bind(null, e5)) : xp(Gv.bind(null, e5)), Hf(function() {
        0 === (6 & hv) && _p();
      }), n4 = null;
      else {
        switch (Wu(r4)) {
          case 1:
            n4 = bu;
            break;
          case 4:
            n4 = wu;
            break;
          case 16:
            n4 = Su;
            break;
          case 536870912:
            n4 = Eu;
            break;
          default:
            n4 = Su;
        }
        n4 = vy(n4, Wv.bind(null, e5));
      }
      e5.callbackPriority = t3, e5.callbackNode = n4;
    }
  }
  function Wv(e5, t3) {
    if (Fv = -1, Av = 0, 0 !== (6 & hv)) throw Error(wl(327));
    var n4 = e5.callbackNode;
    if (cy() && e5.callbackNode !== n4) return null;
    var r4 = Mu(e5, e5 === gv ? vv : 0);
    if (0 === r4) return null;
    if (0 !== (30 & r4) || 0 !== (r4 & e5.expiredLanes) || t3) t3 = ry(e5, r4);
    else {
      t3 = r4;
      var a4 = hv;
      hv |= 2;
      var o3 = ty();
      gv === e5 && vv === t3 || (Tv = null, Pv = vu() + 500, Jv(e5, t3));
      do {
        try {
          oy();
          break;
        } catch (l4) {
          ey(e5, l4);
        }
      } while (1);
      ch(), dv.current = o3, hv = a4, null !== mv ? t3 = 0 : (gv = null, vv = 0, t3 = wv);
    }
    if (0 !== t3) {
      if (2 === t3 && (a4 = Du(e5), 0 !== a4 && (r4 = a4, t3 = Vv(e5, a4))), 1 === t3) throw n4 = Sv, Jv(e5, 0), Yv(e5, r4), Hv(e5, vu()), n4;
      if (6 === t3) Yv(e5, r4);
      else {
        if (a4 = e5.current.alternate, 0 === (30 & r4) && !qv(a4) && (t3 = ry(e5, r4), 2 === t3 && (o3 = Du(e5), 0 !== o3 && (r4 = o3, t3 = Vv(e5, o3))), 1 === t3)) throw n4 = Sv, Jv(e5, 0), Yv(e5, r4), Hv(e5, vu()), n4;
        switch (e5.finishedWork = a4, e5.finishedLanes = r4, t3) {
          case 0:
          case 1:
            throw Error(wl(345));
          case 2:
            sy(e5, _v, Tv);
            break;
          case 3:
            if (Yv(e5, r4), (130023424 & r4) === r4 && (t3 = Cv + 500 - vu(), 10 < t3)) {
              if (0 !== Mu(e5, 0)) break;
              if (a4 = e5.suspendedLanes, (a4 & r4) !== r4) {
                jv(), e5.pingedLanes |= e5.suspendedLanes & a4;
                break;
              }
              e5.timeoutHandle = jf(sy.bind(null, e5, _v, Tv), t3);
              break;
            }
            sy(e5, _v, Tv);
            break;
          case 4:
            if (Yv(e5, r4), (4194240 & r4) === r4) break;
            for (t3 = e5.eventTimes, a4 = -1; 0 < r4; ) {
              var i4 = 31 - Cu(r4);
              o3 = 1 << i4, i4 = t3[i4], i4 > a4 && (a4 = i4), r4 &= ~o3;
            }
            if (r4 = a4, r4 = vu() - r4, r4 = (120 > r4 ? 120 : 480 > r4 ? 480 : 1080 > r4 ? 1080 : 1920 > r4 ? 1920 : 3e3 > r4 ? 3e3 : 4320 > r4 ? 4320 : 1960 * cv(r4 / 1960)) - r4, 10 < r4) {
              e5.timeoutHandle = jf(sy.bind(null, e5, _v, Tv), r4);
              break;
            }
            sy(e5, _v, Tv);
            break;
          case 5:
            sy(e5, _v, Tv);
            break;
          default:
            throw Error(wl(329));
        }
      }
    }
    return Hv(e5, vu()), e5.callbackNode === n4 ? Wv.bind(null, e5) : null;
  }
  function Vv(e5, t3) {
    var n4 = $v;
    return e5.current.memoizedState.isDehydrated && (Jv(e5, t3).flags |= 256), e5 = ry(e5, t3), 2 !== e5 && (t3 = _v, _v = n4, null !== t3 && Qv(t3)), e5;
  }
  function Qv(e5) {
    null === _v ? _v = e5 : _v.push.apply(_v, e5);
  }
  function qv(e5) {
    for (var t3 = e5; ; ) {
      if (16384 & t3.flags) {
        var n4 = t3.updateQueue;
        if (null !== n4 && (n4 = n4.stores, null !== n4)) for (var r4 = 0; r4 < n4.length; r4++) {
          var a4 = n4[r4], o3 = a4.getSnapshot;
          a4 = a4.value;
          try {
            if (!Bd(o3(), a4)) return false;
          } catch (i4) {
            return false;
          }
        }
      }
      if (n4 = t3.child, 16384 & t3.subtreeFlags && null !== n4) n4.return = t3, t3 = n4;
      else {
        if (t3 === e5) break;
        for (; null === t3.sibling; ) {
          if (null === t3.return || t3.return === e5) return true;
          t3 = t3.return;
        }
        t3.sibling.return = t3.return, t3 = t3.sibling;
      }
    }
    return true;
  }
  function Yv(e5, t3) {
    for (t3 &= ~xv, t3 &= ~Ev, e5.suspendedLanes |= t3, e5.pingedLanes &= ~t3, e5 = e5.expirationTimes; 0 < t3; ) {
      var n4 = 31 - Cu(t3), r4 = 1 << n4;
      e5[n4] = -1, t3 &= ~r4;
    }
  }
  function Gv(e5) {
    if (0 !== (6 & hv)) throw Error(wl(327));
    cy();
    var t3 = Mu(e5, 0);
    if (0 === (1 & t3)) return Hv(e5, vu()), null;
    var n4 = ry(e5, t3);
    if (0 !== e5.tag && 2 === n4) {
      var r4 = Du(e5);
      0 !== r4 && (t3 = r4, n4 = Vv(e5, r4));
    }
    if (1 === n4) throw n4 = Sv, Jv(e5, 0), Yv(e5, t3), Hv(e5, vu()), n4;
    if (6 === n4) throw Error(wl(345));
    return e5.finishedWork = e5.current.alternate, e5.finishedLanes = t3, sy(e5, _v, Tv), Hv(e5, vu()), null;
  }
  function Kv(e5, t3) {
    var n4 = hv;
    hv |= 1;
    try {
      return e5(t3);
    } finally {
      hv = n4, 0 === hv && (Pv = vu() + 500, kp && _p());
    }
  }
  function Xv(e5) {
    null !== Mv && 0 === Mv.tag && 0 === (6 & hv) && cy();
    var t3 = hv;
    hv |= 1;
    var n4 = pv.transition, r4 = Hu;
    try {
      if (pv.transition = null, Hu = 1, e5) return e5();
    } finally {
      Hu = r4, pv.transition = n4, hv = t3, 0 === (6 & hv) && _p();
    }
  }
  function Zv() {
    yv = bv.current, sp(bv);
  }
  function Jv(e5, t3) {
    e5.finishedWork = null, e5.finishedLanes = 0;
    var n4 = e5.timeoutHandle;
    if (-1 !== n4 && (e5.timeoutHandle = -1, Bf(n4)), null !== mv) for (n4 = mv.return; null !== n4; ) {
      var r4 = n4;
      switch (Ap(r4), r4.tag) {
        case 1:
          r4 = r4.type.childContextTypes, null !== r4 && void 0 !== r4 && mp();
          break;
        case 3:
          Mh(), sp(fp), sp(dp), jh();
          break;
        case 5:
          Ih(r4);
          break;
        case 4:
          Mh();
          break;
        case 13:
          sp(Dh);
          break;
        case 19:
          sp(Dh);
          break;
        case 10:
          dh(r4.type._context);
          break;
        case 22:
        case 23:
          Zv();
      }
      n4 = n4.return;
    }
    if (gv = e5, mv = e5 = ky(e5.current, null), vv = yv = t3, wv = 0, Sv = null, xv = Ev = kv = 0, _v = $v = null, null !== gh) {
      for (t3 = 0; t3 < gh.length; t3++) if (n4 = gh[t3], r4 = n4.interleaved, null !== r4) {
        n4.interleaved = null;
        var a4 = r4.next, o3 = n4.pending;
        if (null !== o3) {
          var i4 = o3.next;
          o3.next = a4, r4.next = i4;
        }
        n4.pending = r4;
      }
      gh = null;
    }
    return e5;
  }
  function ey(e5, t3) {
    do {
      var n4 = mv;
      try {
        if (ch(), Bh.current = zg, qh) {
          for (var r4 = Wh.memoizedState; null !== r4; ) {
            var a4 = r4.queue;
            null !== a4 && (a4.pending = null), r4 = r4.next;
          }
          qh = false;
        }
        if (Hh = 0, Qh = Vh = Wh = null, Yh = false, Gh = 0, fv.current = null, null === n4 || null === n4.return) {
          wv = 1, Sv = t3, mv = null;
          break;
        }
        e: {
          var o3 = e5, i4 = n4.return, l4 = n4, s4 = t3;
          if (t3 = vv, l4.flags |= 32768, null !== s4 && "object" === typeof s4 && "function" === typeof s4.then) {
            var u3 = s4, c4 = l4, d3 = c4.tag;
            if (0 === (1 & c4.mode) && (0 === d3 || 11 === d3 || 15 === d3)) {
              var f3 = c4.alternate;
              f3 ? (c4.updateQueue = f3.updateQueue, c4.memoizedState = f3.memoizedState, c4.lanes = f3.lanes) : (c4.updateQueue = null, c4.memoizedState = null);
            }
            var p4 = Jg(i4);
            if (null !== p4) {
              p4.flags &= -257, em(p4, i4, l4, o3, t3), 1 & p4.mode && Zg(o3, u3, t3), t3 = p4, s4 = u3;
              var h4 = t3.updateQueue;
              if (null === h4) {
                var g4 = /* @__PURE__ */ new Set();
                g4.add(s4), t3.updateQueue = g4;
              } else h4.add(s4);
              break e;
            }
            if (0 === (1 & t3)) {
              Zg(o3, u3, t3), ny();
              break e;
            }
            s4 = Error(wl(426));
          } else if (Up && 1 & l4.mode) {
            var m4 = Jg(i4);
            if (null !== m4) {
              0 === (65536 & m4.flags) && (m4.flags |= 256), em(m4, i4, l4, o3, t3), Zp(Qg(s4, l4));
              break e;
            }
          }
          o3 = s4 = Qg(s4, l4), 4 !== wv && (wv = 2), null === $v ? $v = [o3] : $v.push(o3), o3 = i4;
          do {
            switch (o3.tag) {
              case 3:
                o3.flags |= 65536, t3 &= -t3, o3.lanes |= t3;
                var v3 = Kg(o3, s4, t3);
                $h(o3, v3);
                break e;
              case 1:
                l4 = s4;
                var y3 = o3.type, b3 = o3.stateNode;
                if (0 === (128 & o3.flags) && ("function" === typeof y3.getDerivedStateFromError || null !== b3 && "function" === typeof b3.componentDidCatch && (null === Rv || !Rv.has(b3)))) {
                  o3.flags |= 65536, t3 &= -t3, o3.lanes |= t3;
                  var w3 = Xg(o3, l4, t3);
                  $h(o3, w3);
                  break e;
                }
            }
            o3 = o3.return;
          } while (null !== o3);
        }
        ly(n4);
      } catch (S3) {
        t3 = S3, mv === n4 && null !== n4 && (mv = n4 = n4.return);
        continue;
      }
      break;
    } while (1);
  }
  function ty() {
    var e5 = dv.current;
    return dv.current = zg, null === e5 ? zg : e5;
  }
  function ny() {
    0 !== wv && 3 !== wv && 2 !== wv || (wv = 4), null === gv || 0 === (268435455 & kv) && 0 === (268435455 & Ev) || Yv(gv, vv);
  }
  function ry(e5, t3) {
    var n4 = hv;
    hv |= 2;
    var r4 = ty();
    gv === e5 && vv === t3 || (Tv = null, Jv(e5, t3));
    do {
      try {
        ay();
        break;
      } catch (ub) {
        ey(e5, ub);
      }
    } while (1);
    if (ch(), hv = n4, dv.current = r4, null !== mv) throw Error(wl(261));
    return gv = null, vv = 0, wv;
  }
  function ay() {
    for (; null !== mv; ) iy(mv);
  }
  function oy() {
    for (; null !== mv && !gu(); ) iy(mv);
  }
  function iy(e5) {
    var t3 = uv(e5.alternate, e5, yv);
    e5.memoizedProps = e5.pendingProps, null === t3 ? ly(e5) : mv = t3, fv.current = null;
  }
  function ly(e5) {
    var t3 = e5;
    do {
      var n4 = t3.alternate;
      if (e5 = t3.return, 0 === (32768 & t3.flags)) {
        if (n4 = Rm(n4, t3, yv), null !== n4) return void (mv = n4);
      } else {
        if (n4 = Om(n4, t3), null !== n4) return n4.flags &= 32767, void (mv = n4);
        if (null === e5) return wv = 6, void (mv = null);
        e5.flags |= 32768, e5.subtreeFlags = 0, e5.deletions = null;
      }
      if (t3 = t3.sibling, null !== t3) return void (mv = t3);
      mv = t3 = e5;
    } while (null !== t3);
    0 === wv && (wv = 5);
  }
  function sy(e5, t3, n4) {
    var r4 = Hu, a4 = pv.transition;
    try {
      pv.transition = null, Hu = 1, uy(e5, t3, n4, r4);
    } finally {
      pv.transition = a4, Hu = r4;
    }
    return null;
  }
  function uy(e5, t3, n4, r4) {
    do {
      cy();
    } while (null !== Mv);
    if (0 !== (6 & hv)) throw Error(wl(327));
    n4 = e5.finishedWork;
    var a4 = e5.finishedLanes;
    if (null === n4) return null;
    if (e5.finishedWork = null, e5.finishedLanes = 0, n4 === e5.current) throw Error(wl(177));
    e5.callbackNode = null, e5.callbackPriority = 0;
    var o3 = n4.lanes | n4.childLanes;
    if (Bu(e5, o3), e5 === gv && (mv = gv = null, vv = 0), 0 === (2064 & n4.subtreeFlags) && 0 === (2064 & n4.flags) || Ov || (Ov = true, vy(Su, function() {
      return cy(), null;
    })), o3 = 0 !== (15990 & n4.flags), 0 !== (15990 & n4.subtreeFlags) || o3) {
      o3 = pv.transition, pv.transition = null;
      var i4 = Hu;
      Hu = 1;
      var l4 = hv;
      hv |= 4, fv.current = null, Bm(e5, n4), nv(n4, e5), Yd(Ff), gc = !!Df, Ff = Df = null, e5.current = n4, av(n4), mu(), hv = l4, Hu = i4, pv.transition = o3;
    } else e5.current = n4;
    if (Ov && (Ov = false, Mv = e5, zv = a4), o3 = e5.pendingLanes, 0 === o3 && (Rv = null), _u(n4.stateNode), Hv(e5, vu()), null !== t3) for (r4 = e5.onRecoverableError, n4 = 0; n4 < t3.length; n4++) a4 = t3[n4], r4(a4.value, { componentStack: a4.stack, digest: a4.digest });
    if (Nv) throw Nv = false, e5 = Lv, Lv = null, e5;
    return 0 !== (1 & zv) && 0 !== e5.tag && cy(), o3 = e5.pendingLanes, 0 !== (1 & o3) ? e5 === Dv ? Iv++ : (Iv = 0, Dv = e5) : Iv = 0, _p(), null;
  }
  function cy() {
    if (null !== Mv) {
      var e5 = Wu(zv), t3 = pv.transition, n4 = Hu;
      try {
        if (pv.transition = null, Hu = 16 > e5 ? 16 : e5, null === Mv) var r4 = false;
        else {
          if (e5 = Mv, Mv = null, zv = 0, 0 !== (6 & hv)) throw Error(wl(331));
          var a4 = hv;
          for (hv |= 4, Dm = e5.current; null !== Dm; ) {
            var o3 = Dm, i4 = o3.child;
            if (0 !== (16 & Dm.flags)) {
              var l4 = o3.deletions;
              if (null !== l4) {
                for (var s4 = 0; s4 < l4.length; s4++) {
                  var u3 = l4[s4];
                  for (Dm = u3; null !== Dm; ) {
                    var c4 = Dm;
                    switch (c4.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Um(8, c4, o3);
                    }
                    var d3 = c4.child;
                    if (null !== d3) d3.return = c4, Dm = d3;
                    else for (; null !== Dm; ) {
                      c4 = Dm;
                      var f3 = c4.sibling, p4 = c4.return;
                      if (Vm(c4), c4 === u3) {
                        Dm = null;
                        break;
                      }
                      if (null !== f3) {
                        f3.return = p4, Dm = f3;
                        break;
                      }
                      Dm = p4;
                    }
                  }
                }
                var h4 = o3.alternate;
                if (null !== h4) {
                  var g4 = h4.child;
                  if (null !== g4) {
                    h4.child = null;
                    do {
                      var m4 = g4.sibling;
                      g4.sibling = null, g4 = m4;
                    } while (null !== g4);
                  }
                }
                Dm = o3;
              }
            }
            if (0 !== (2064 & o3.subtreeFlags) && null !== i4) i4.return = o3, Dm = i4;
            else e: for (; null !== Dm; ) {
              if (o3 = Dm, 0 !== (2048 & o3.flags)) switch (o3.tag) {
                case 0:
                case 11:
                case 15:
                  Um(9, o3, o3.return);
              }
              var v3 = o3.sibling;
              if (null !== v3) {
                v3.return = o3.return, Dm = v3;
                break e;
              }
              Dm = o3.return;
            }
          }
          var y3 = e5.current;
          for (Dm = y3; null !== Dm; ) {
            i4 = Dm;
            var b3 = i4.child;
            if (0 !== (2064 & i4.subtreeFlags) && null !== b3) b3.return = i4, Dm = b3;
            else e: for (i4 = y3; null !== Dm; ) {
              if (l4 = Dm, 0 !== (2048 & l4.flags)) try {
                switch (l4.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Hm(9, l4);
                }
              } catch (S3) {
                fy(l4, l4.return, S3);
              }
              if (l4 === i4) {
                Dm = null;
                break e;
              }
              var w3 = l4.sibling;
              if (null !== w3) {
                w3.return = l4.return, Dm = w3;
                break e;
              }
              Dm = l4.return;
            }
          }
          if (hv = a4, _p(), $u && "function" === typeof $u.onPostCommitFiberRoot) try {
            $u.onPostCommitFiberRoot(xu, e5);
          } catch (S3) {
          }
          r4 = true;
        }
        return r4;
      } finally {
        Hu = n4, pv.transition = t3;
      }
    }
    return false;
  }
  function dy(e5, t3, n4) {
    t3 = Qg(n4, t3), t3 = Kg(e5, t3, 1), e5 = Eh(e5, t3, 1), t3 = jv(), null !== e5 && (ju(e5, 1, t3), Hv(e5, t3));
  }
  function fy(e5, t3, n4) {
    if (3 === e5.tag) dy(e5, e5, n4);
    else for (; null !== t3; ) {
      if (3 === t3.tag) {
        dy(t3, e5, n4);
        break;
      }
      if (1 === t3.tag) {
        var r4 = t3.stateNode;
        if ("function" === typeof t3.type.getDerivedStateFromError || "function" === typeof r4.componentDidCatch && (null === Rv || !Rv.has(r4))) {
          e5 = Qg(n4, e5), e5 = Xg(t3, e5, 1), t3 = Eh(t3, e5, 1), e5 = jv(), null !== t3 && (ju(t3, 1, e5), Hv(t3, e5));
          break;
        }
      }
      t3 = t3.return;
    }
  }
  function py(e5, t3, n4) {
    var r4 = e5.pingCache;
    null !== r4 && r4.delete(t3), t3 = jv(), e5.pingedLanes |= e5.suspendedLanes & n4, gv === e5 && (vv & n4) === n4 && (4 === wv || 3 === wv && (130023424 & vv) === vv && 500 > vu() - Cv ? Jv(e5, 0) : xv |= n4), Hv(e5, t3);
  }
  function hy(e5, t3) {
    0 === t3 && (0 === (1 & e5.mode) ? t3 = 1 : (t3 = Ru, Ru <<= 1, 0 === (130023424 & Ru) && (Ru = 4194304)));
    var n4 = jv();
    e5 = yh(e5, t3), null !== e5 && (ju(e5, t3, n4), Hv(e5, n4));
  }
  function gy(e5) {
    var t3 = e5.memoizedState, n4 = 0;
    null !== t3 && (n4 = t3.retryLane), hy(e5, n4);
  }
  function my(e5, t3) {
    var n4 = 0;
    switch (e5.tag) {
      case 13:
        var r4 = e5.stateNode, a4 = e5.memoizedState;
        null !== a4 && (n4 = a4.retryLane);
        break;
      case 19:
        r4 = e5.stateNode;
        break;
      default:
        throw Error(wl(314));
    }
    null !== r4 && r4.delete(t3), hy(e5, n4);
  }
  function vy(e5, t3) {
    return pu(e5, t3);
  }
  function yy(e5, t3, n4, r4) {
    this.tag = e5, this.key = n4, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t3, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r4, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function by(e5, t3, n4, r4) {
    return new yy(e5, t3, n4, r4);
  }
  function wy(e5) {
    return e5 = e5.prototype, !(!e5 || !e5.isReactComponent);
  }
  function Sy(e5) {
    if ("function" === typeof e5) return wy(e5) ? 1 : 0;
    if (void 0 !== e5 && null !== e5) {
      if (e5 = e5.$$typeof, e5 === Ql) return 11;
      if (e5 === Gl) return 14;
    }
    return 2;
  }
  function ky(e5, t3) {
    var n4 = e5.alternate;
    return null === n4 ? (n4 = by(e5.tag, t3, e5.key, e5.mode), n4.elementType = e5.elementType, n4.type = e5.type, n4.stateNode = e5.stateNode, n4.alternate = e5, e5.alternate = n4) : (n4.pendingProps = t3, n4.type = e5.type, n4.flags = 0, n4.subtreeFlags = 0, n4.deletions = null), n4.flags = 14680064 & e5.flags, n4.childLanes = e5.childLanes, n4.lanes = e5.lanes, n4.child = e5.child, n4.memoizedProps = e5.memoizedProps, n4.memoizedState = e5.memoizedState, n4.updateQueue = e5.updateQueue, t3 = e5.dependencies, n4.dependencies = null === t3 ? null : { lanes: t3.lanes, firstContext: t3.firstContext }, n4.sibling = e5.sibling, n4.index = e5.index, n4.ref = e5.ref, n4;
  }
  function Ey(e5, t3, n4, r4, a4, o3) {
    var i4 = 2;
    if (r4 = e5, "function" === typeof e5) wy(e5) && (i4 = 1);
    else if ("string" === typeof e5) i4 = 5;
    else e: switch (e5) {
      case Bl:
        return xy(n4.children, a4, o3, t3);
      case Ul:
        i4 = 8, a4 |= 8;
        break;
      case Hl:
        return e5 = by(12, n4, t3, 2 | a4), e5.elementType = Hl, e5.lanes = o3, e5;
      case ql:
        return e5 = by(13, n4, t3, a4), e5.elementType = ql, e5.lanes = o3, e5;
      case Yl:
        return e5 = by(19, n4, t3, a4), e5.elementType = Yl, e5.lanes = o3, e5;
      case Xl:
        return $y(n4, a4, o3, t3);
      default:
        if ("object" === typeof e5 && null !== e5) switch (e5.$$typeof) {
          case Wl:
            i4 = 10;
            break e;
          case Vl:
            i4 = 9;
            break e;
          case Ql:
            i4 = 11;
            break e;
          case Gl:
            i4 = 14;
            break e;
          case Kl:
            i4 = 16, r4 = null;
            break e;
        }
        throw Error(wl(130, null == e5 ? e5 : typeof e5, ""));
    }
    return t3 = by(i4, n4, t3, a4), t3.elementType = e5, t3.type = r4, t3.lanes = o3, t3;
  }
  function xy(e5, t3, n4, r4) {
    return e5 = by(7, e5, r4, t3), e5.lanes = n4, e5;
  }
  function $y(e5, t3, n4, r4) {
    return e5 = by(22, e5, r4, t3), e5.elementType = Xl, e5.lanes = n4, e5.stateNode = { isHidden: false }, e5;
  }
  function _y(e5, t3, n4) {
    return e5 = by(6, e5, null, t3), e5.lanes = n4, e5;
  }
  function Cy(e5, t3, n4) {
    return t3 = by(4, null !== e5.children ? e5.children : [], e5.key, t3), t3.lanes = n4, t3.stateNode = { containerInfo: e5.containerInfo, pendingChildren: null, implementation: e5.implementation }, t3;
  }
  function Py(e5, t3, n4, r4, a4) {
    this.tag = t3, this.containerInfo = e5, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Au(0), this.expirationTimes = Au(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Au(0), this.identifierPrefix = r4, this.onRecoverableError = a4, this.mutableSourceEagerHydrationData = null;
  }
  function Ty(e5, t3, n4, r4, a4, o3, i4, l4, s4) {
    return e5 = new Py(e5, t3, n4, l4, s4), 1 === t3 ? (t3 = 1, true === o3 && (t3 |= 8)) : t3 = 0, o3 = by(3, null, null, t3), e5.current = o3, o3.stateNode = e5, o3.memoizedState = { element: r4, isDehydrated: n4, cache: null, transitions: null, pendingSuspenseBoundaries: null }, wh(o3), e5;
  }
  function Ny(e5, t3, n4) {
    var r4 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: jl, key: null == r4 ? null : "" + r4, children: e5, containerInfo: t3, implementation: n4 };
  }
  function Ly(e5) {
    if (!e5) return cp;
    e5 = e5._reactInternals;
    e: {
      if (lu(e5) !== e5 || 1 !== e5.tag) throw Error(wl(170));
      var t3 = e5;
      do {
        switch (t3.tag) {
          case 3:
            t3 = t3.stateNode.context;
            break e;
          case 1:
            if (gp(t3.type)) {
              t3 = t3.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t3 = t3.return;
      } while (null !== t3);
      throw Error(wl(171));
    }
    if (1 === e5.tag) {
      var n4 = e5.type;
      if (gp(n4)) return yp(e5, n4, t3);
    }
    return t3;
  }
  function Ry(e5, t3, n4, r4, a4, o3, i4, l4, s4) {
    return e5 = Ty(n4, r4, true, e5, a4, o3, i4, l4, s4), e5.context = Ly(null), n4 = e5.current, r4 = jv(), a4 = Bv(n4), o3 = kh(r4, a4), o3.callback = void 0 !== t3 && null !== t3 ? t3 : null, Eh(n4, o3, a4), e5.current.lanes = a4, ju(e5, a4, r4), Hv(e5, r4), e5;
  }
  function Oy(e5, t3, n4, r4) {
    var a4 = t3.current, o3 = jv(), i4 = Bv(a4);
    return n4 = Ly(n4), null === t3.context ? t3.context = n4 : t3.pendingContext = n4, t3 = kh(o3, i4), t3.payload = { element: e5 }, r4 = void 0 === r4 ? null : r4, null !== r4 && (t3.callback = r4), e5 = Eh(a4, t3, i4), null !== e5 && (Uv(e5, a4, i4, o3), xh(e5, a4, i4)), i4;
  }
  function My(e5) {
    if (e5 = e5.current, !e5.child) return null;
    switch (e5.child.tag) {
      case 5:
        return e5.child.stateNode;
      default:
        return e5.child.stateNode;
    }
  }
  function zy(e5, t3) {
    if (e5 = e5.memoizedState, null !== e5 && null !== e5.dehydrated) {
      var n4 = e5.retryLane;
      e5.retryLane = 0 !== n4 && n4 < t3 ? n4 : t3;
    }
  }
  function Iy(e5, t3) {
    zy(e5, t3), (e5 = e5.alternate) && zy(e5, t3);
  }
  function Dy() {
    return null;
  }
  function Ay(e5) {
    this._internalRoot = e5;
  }
  function jy(e5) {
    this._internalRoot = e5;
  }
  function By(e5) {
    return !(!e5 || 1 !== e5.nodeType && 9 !== e5.nodeType && 11 !== e5.nodeType);
  }
  function Uy(e5) {
    return !(!e5 || 1 !== e5.nodeType && 9 !== e5.nodeType && 11 !== e5.nodeType && (8 !== e5.nodeType || " react-mount-point-unstable " !== e5.nodeValue));
  }
  function Hy() {
  }
  function Wy(e5, t3, n4, r4, a4) {
    if (a4) {
      if ("function" === typeof r4) {
        var o3 = r4;
        r4 = function() {
          var e6 = My(i4);
          o3.call(e6);
        };
      }
      var i4 = Ry(t3, r4, e5, 0, null, false, false, "", Hy);
      return e5._reactRootContainer = i4, e5[Xf] = i4.current, $f(8 === e5.nodeType ? e5.parentNode : e5), Xv(), i4;
    }
    for (; a4 = e5.lastChild; ) e5.removeChild(a4);
    if ("function" === typeof r4) {
      var l4 = r4;
      r4 = function() {
        var e6 = My(s4);
        l4.call(e6);
      };
    }
    var s4 = Ty(e5, 0, false, null, null, false, false, "", Hy);
    return e5._reactRootContainer = s4, e5[Xf] = s4.current, $f(8 === e5.nodeType ? e5.parentNode : e5), Xv(function() {
      Oy(t3, s4, n4, r4);
    }), s4;
  }
  function Vy(e5, t3, n4, r4, a4) {
    var o3 = n4._reactRootContainer;
    if (o3) {
      var i4 = o3;
      if ("function" === typeof a4) {
        var l4 = a4;
        a4 = function() {
          var e6 = My(i4);
          l4.call(e6);
        };
      }
      Oy(t3, i4, e5, a4);
    } else i4 = Wy(n4, t3, e5, a4, r4);
    return My(i4);
  }
  function Ky() {
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ky);
    } catch (e5) {
      console.error(e5);
    }
  }
  function lb(e5, t3, n4) {
    var r4, a4 = {}, o3 = null, i4 = null;
    for (r4 in void 0 !== n4 && (o3 = "" + n4), void 0 !== t3.key && (o3 = "" + t3.key), void 0 !== t3.ref && (i4 = t3.ref), t3) ab.call(t3, r4) && !ib.hasOwnProperty(r4) && (a4[r4] = t3[r4]);
    if (e5 && e5.defaultProps) for (r4 in t3 = e5.defaultProps, t3) void 0 === a4[r4] && (a4[r4] = t3[r4]);
    return { $$typeof: nb, type: e5, key: o3, ref: i4, props: a4, _owner: ob.current };
  }
  var e, t, n, r, a, o, i, s, u, c, d, f, p, h, g, m, v, b, w, S, k, E, x, $, T, N, L, O, M, z, D, F, A, j, B, U, H, W, V, Q, q, Y, G, K, X, Z, J, ee, te, ne, re, ie, le, se, ue, ce, de, fe, pe, he, me, ve, be, Ee, xe, $e, _e, Ce, Pe, Te, Ne, Le, Re, Oe, Me, ze, Ve, Qe, qe, Ye, Je, et, tt, nt, rt, at, ot, it, lt, st, ut, ct, dt, ft, pt, ht, gt, mt, vt, yt, bt, wt, St, kt, Et, xt, $t, _t, Ct, Pt, Ot, zt, It, jt, Ht, Wt, Vt, Qt, qt, Kt, tn, nn, rn, on, ln, sn, un, cn, dn, fn, pn, hn, gn, mn, vn, yn, bn, wn, Sn, kn, xn, $n, _n, Cn, Pn, Tn, Nn, Ln, Rn, On, Mn, zn, In, Dn, Fn, An, jn, Bn, Un, Hn, Wn, Vn, Qn, qn, Yn, Gn, Kn, Xn, Zn, Jn, er, tr, nr, rr, ar, or, ir, lr, sr, ur, cr, dr, fr, pr, hr, gr, mr, vr, yr, br, wr, Sr, kr, Er, xr, $r, _r, Cr, Pr, Tr, Nr, Lr, Rr, Or, Mr, zr, Ir, Dr, Fr, Ar, jr, Br, Ur, Hr, Wr, Vr, Qr, qr, Kr, Xr, Jr, ea, ta, na, ra, oa, la, sa, ua, ca, da, ya, ba, wa, Ea, xa, $a, _a, Ca, Ia, Da, Fa, qa, Ya, Ga, ho, go, vo, wo, Io, Do, Fo, Ao, jo, Ho, Qo, qo, Yo, Go, Ko, Xo, Zo, Jo, ei, ti, ni, ri, ai, oi, ii, li, si, ui, ci, di, fi, hi, gi, mi, vi, yi, bi, wi, Si, ki, Ei, xi, $i, _i, Ci, Pi, Ti, Ni, Li, Ri, Oi, Mi, zi, Ii, Di, Ai, ji, Bi, Vi, Qi, qi, Yi, Gi, el, ol, il, ll, ul, cl, dl, fl, pl, hl, gl, ml, vl, yl, bl, Sl, kl, $l, _l, Cl, Pl, Tl, Ml, zl, Fl, Al, jl, Bl, Ul, Hl, Wl, Vl, Ql, ql, Yl, Gl, Kl, Xl, Zl, es, ts, rs, ws, Ps, Ts, Ls, Rs, zs, Fs, js, Bs, Us, Ys, Xs, Zs, eu, tu, nu, ru, au, pu, hu, gu, mu, vu, yu, bu, wu, Su, ku, Eu, xu, $u, Cu, Pu, Tu, Lu, Ru, Hu, Vu, Qu, qu, Yu, Gu, Ku, Xu, Zu, Ju, ec, tc, nc, rc, ac, hc, gc, bc, kc, Ec, xc, Nc, Lc, Rc, Oc, Mc, zc, Ic, Dc, Fc, Ac, jc, Bc, Uc, Hc, Wc, Vc, Qc, qc, Yc, Gc, Kc, Xc, ed, td, nd, rd, ad, od, id, ld, sd, ud, cd, dd, fd, pd, hd, gd, md, bd, kd, $d, _d, Nd, Ld, Rd, Od, Bd, Gd, Kd, Xd, Zd, Jd, nf, rf, af, lf, sf, uf, cf, df, ff, gf, mf, vf, hf, yf, bf, xf, Rf, Of, Df, Ff, jf, Bf, Uf, Hf, Yf, Gf, Kf, Xf, Zf, Jf, ep, op, ip, cp, dp, fp, pp, Sp, kp, Ep, Cp, Pp, Tp, Np, Lp, Rp, Op, Mp, zp, jp, Bp, Up, Hp, Jp, ah, oh, ih, lh, sh, uh, gh, bh, Ph, Th, Nh, Lh, Dh, Ah, Bh, Uh, Hh, Wh, Vh, Qh, qh, Yh, Gh, Kh, zg, Ig, Dg, Fg, Bg, Gg, tm, nm, hm, gm, mm, vm, ym, Mm, zm, Im, Dm, jm, Km, Xm, uv, cv, dv, fv, pv, hv, gv, mv, vv, yv, bv, wv, Sv, kv, Ev, xv, $v, _v, Cv, Pv, Tv, Nv, Lv, Rv, Ov, Mv, zv, Iv, Dv, Fv, Av, Fy, Qy, qy, Yy, Gy, Xy, Zy, Jy, eb, tb, nb, rb, ab, ob, ib, sb;
  var init_vendors_9e84cbaa = __esm({
    "dist/js/vendors.9e84cbaa.js"() {
      e = Object.defineProperty;
      t = Object.getOwnPropertySymbols;
      n = Object.prototype.hasOwnProperty;
      r = Object.prototype.propertyIsEnumerable;
      a = (t3, n4, r4) => n4 in t3 ? e(t3, n4, { enumerable: true, configurable: true, writable: true, value: r4 }) : t3[n4] = r4;
      o = (e5, o3) => {
        for (var i4 in o3 || (o3 = {})) n.call(o3, i4) && a(e5, i4, o3[i4]);
        if (t) for (var i4 of t(o3)) r.call(o3, i4) && a(e5, i4, o3[i4]);
        return e5;
      };
      i = (e5, t3, n4) => new Promise((r4, a4) => {
        var o3 = (e6) => {
          try {
            l4(n4.next(e6));
          } catch (t4) {
            a4(t4);
          }
        }, i4 = (e6) => {
          try {
            l4(n4.throw(e6));
          } catch (t4) {
            a4(t4);
          }
        }, l4 = (e6) => e6.done ? r4(e6.value) : Promise.resolve(e6.value).then(o3, i4);
        l4((n4 = n4.apply(e5, t3)).next());
      });
      s = "modulepreload";
      u = function(e5, t3) {
        return new URL(e5, t3).href;
      };
      c = {};
      d = function(e5, t3, n4) {
        if (!t3 || 0 === t3.length) return e5();
        const r4 = document.getElementsByTagName("link");
        return Promise.all(t3.map((e6) => {
          if (e6 = u(e6, n4), e6 in c) return;
          c[e6] = true;
          const t4 = e6.endsWith(".css"), a4 = t4 ? '[rel="stylesheet"]' : "", o3 = !!n4;
          if (o3) for (let n5 = r4.length - 1; n5 >= 0; n5--) {
            const a5 = r4[n5];
            if (a5.href === e6 && (!t4 || "stylesheet" === a5.rel)) return;
          }
          else if (document.querySelector(`link[href="${e6}"]${a4}`)) return;
          const i4 = document.createElement("link");
          return i4.rel = t4 ? "stylesheet" : s, t4 || (i4.as = "script", i4.crossOrigin = ""), i4.href = e6, document.head.appendChild(i4), t4 ? new Promise((t5, n5) => {
            i4.addEventListener("load", t5), i4.addEventListener("error", () => n5(new Error(`Unable to preload CSS for ${e6}`)));
          }) : void 0;
        })).then(() => e5()).catch((e6) => {
          const t4 = new Event("vite:preloadError", { cancelable: true });
          if (t4.payload = e6, window.dispatchEvent(t4), !t4.defaultPrevented) throw e6;
        });
      };
      f = "[]";
      p = "";
      h = "!0";
      g = "!1";
      m = { bindTouchStart: p, bindTouchMove: p, bindTouchEnd: p, bindTouchCancel: p, bindLongTap: p };
      v = { animation: p, bindAnimationStart: p, bindAnimationIteration: p, bindAnimationEnd: p, bindTransitionEnd: p };
      Object.assign(Object.assign({ "hover-class": y("none"), "hover-stop-propagation": g, "hover-start-time": "50", "hover-stay-time": "400" }, m), v), Object.assign({ longitude: p, latitude: p, scale: "16", markers: f, covers: p, polyline: f, circles: f, controls: f, "include-points": f, "show-location": p, "layer-style": "1", bindMarkerTap: p, bindControlTap: p, bindCalloutTap: p, bindUpdated: p }, m), Object.assign({ selectable: g, space: p, decode: g }, m), Object.assign({ size: y("default"), type: p, plain: g, disabled: p, loading: g, "form-type": p, "open-type": p, "hover-class": y("button-hover"), "hover-stop-propagation": g, "hover-start-time": "20", "hover-stay-time": "70", name: p, bindagreeprivacyauthorization: p }, m), Object.assign({ for: p, name: p }, m), Object.assign({ "scroll-top": g }, m), Object.assign(Object.assign({ direction: "none", inertia: g, "out-of-bounds": g, x: p, y: p, damping: "20", friction: "2", disabled: p, scale: g, "scale-min": "0.5", "scale-max": "10", "scale-value": "1", bindChange: p, bindScale: p, bindHTouchMove: p, bindVTouchMove: p, width: y("10px"), height: y("10px") }, m), v), Object.assign(Object.assign({ "scroll-x": g, "scroll-y": g, "upper-threshold": "50", "lower-threshold": "50", "scroll-top": p, "scroll-left": p, "scroll-into-view": p, "scroll-with-animation": g, "enable-back-to-top": g, bindScrollToUpper: p, bindScrollToLower: p, bindScroll: p }, m), v), Object.assign({ "indicator-dots": g, "indicator-color": y("rgba(0, 0, 0, .3)"), "indicator-active-color": y("#000000"), autoplay: g, current: "0", interval: "5000", duration: "500", circular: g, vertical: g, "previous-margin": y("0px"), "next-margin": y("0px"), "display-multiple-items": "1", bindChange: p, bindTransition: p, bindAnimationFinish: p }, m), Object.assign({ src: p, mode: y("scaleToFill"), "lazy-load": g, bindError: p, bindLoad: p }, m), Object.assign({ src: p, autoplay: g, muted: g, orientation: y("vertical"), "object-fit": y("contain"), "background-mute": g, "min-cache": "1", "max-cache": "3", bindStateChange: p, bindFullScreenChange: p, bindNetStatus: p }, v), Object.assign({ src: p, duration: p, controls: h, "danmu-list": p, "danmu-btn": p, "enable-danmu": p, autoplay: g, loop: g, muted: g, "initial-time": "0", "page-gesture": g, direction: p, "show-progress": h, "show-fullscreen-btn": h, "show-play-btn": h, "show-center-play-btn": h, "enable-progress-gesture": h, "object-fit": y("contain"), poster: p, "show-mute-btn": g, bindPlay: p, bindPause: p, bindEnded: p, bindTimeUpdate: p, bindFullScreenChange: p, bindWaiting: p, bindError: p }, v), Object.assign({ "canvas-id": p, "disable-scroll": g, bindError: p }, m), function(e5) {
        e5["MINI"] = "mini", e5["ASCF"] = "ascf", e5["WEB"] = "web", e5["RN"] = "rn", e5["HARMONY"] = "harmony", e5["QUICK"] = "quickapp";
      }(b || (b = {})), b.WEB, b.HARMONY, b.ASCF, b.MINI, b.RN, b.QUICK;
      w = class e2 {
        constructor(e5) {
          var t3;
          this.callbacks = null !== (t3 = null === e5 || void 0 === e5 ? void 0 : e5.callbacks) && void 0 !== t3 ? t3 : {};
        }
        on(t3, n4, r4) {
          let a4, o3, i4;
          if (!n4) return this;
          i4 = "symbol" === typeof t3 ? [t3] : t3.split(e2.eventSplitter), this.callbacks || (this.callbacks = {});
          const l4 = this.callbacks;
          while (a4 = i4.shift()) {
            const e5 = l4[a4], t4 = e5 ? e5.tail : {};
            t4.next = o3 = {}, t4.context = r4, t4.callback = n4, l4[a4] = { tail: o3, next: e5 ? e5.next : t4 };
          }
          return this;
        }
        once(e5, t3, n4) {
          let r4 = false;
          const a4 = (...o3) => {
            if (!r4) {
              r4 = true;
              try {
                t3.apply(this, o3);
              } finally {
                this.off(e5, a4, n4);
              }
            }
          };
          return this.on(e5, a4, n4), this;
        }
        off(t3, n4, r4) {
          let a4, o3, i4;
          if (!(o3 = this.callbacks)) return this;
          if (!(t3 || n4 || r4)) return delete this.callbacks, this;
          i4 = "symbol" === typeof t3 ? [t3] : t3 ? t3.split(e2.eventSplitter) : Object.keys(o3);
          while (a4 = i4.shift()) {
            let e5 = o3[a4];
            if (delete o3[a4], !e5 || !n4 && !r4) continue;
            const t4 = e5.tail;
            while ((e5 = e5.next) !== t4) {
              const t5 = e5.callback, o4 = e5.context;
              (n4 && t5 !== n4 || r4 && o4 !== r4) && this.on(a4, t5, o4);
            }
          }
          return this;
        }
        trigger(t3, ...n4) {
          let r4, a4, o3, i4;
          if (!(o3 = this.callbacks)) return this;
          i4 = "symbol" === typeof t3 ? [t3] : t3.split(e2.eventSplitter);
          while (r4 = i4.shift()) if (a4 = o3[r4]) {
            const e5 = a4.tail;
            while ((a4 = a4.next) !== e5) a4.callback.apply(a4.context || this, n4);
          }
          return this;
        }
      };
      w.eventSplitter = ",";
      S = class extends w {
        constructor() {
          super(...arguments), this.exeList = [];
        }
        on(e5, t3) {
          return super.on(e5, t3, this), this.exeList = this.exeList.reduce((t4, n4) => (n4.eventName === e5 ? super.trigger(n4.eventName, n4.data) : t4.push(n4), t4), []), this;
        }
        emit(e5, t3) {
          x.trigger(e5, t3);
        }
      };
      k = new S();
      E = class extends w {
        emit(e5, t3) {
          k.off(e5), k.exeList.push({ eventName: e5, data: t3 });
        }
        addEvents(e5) {
          e5 && "object" === typeof e5 && Object.keys(e5).forEach((t3) => {
            this.off(t3), this.on(t3, e5[t3], this);
          });
        }
      };
      x = new E();
      $ = { pageChannel: k, routeChannel: x };
      T = Array.isArray;
      (function(e5) {
        e5[e5["SINGLE"] = 0] = "SINGLE", e5[e5["MULTI"] = 1] = "MULTI", e5[e5["WATERFALL"] = 2] = "WATERFALL";
      })(N || (N = {}));
      L = { app: ["onLaunch", "onShow", "onHide"], page: ["onLoad", "onUnload", "onReady", "onShow", "onHide", ["onPullDownRefresh", "onReachBottom", "onPageScroll", "onResize", "defer:onTabItemTap", "onTitleClick", "onOptionMenuClick", "events:onKeyboardHeight", "onPopMenuClick", "onPullIntercept", "onAddToFavorites"], ["onShareAppMessage", "onShareTimeline"]], component: ["attached", "detached"] };
      O = class extends w {
        constructor(e5, t3) {
          super(t3), this.hooks = e5;
          for (const n4 in e5) {
            const { initial: t4 } = e5[n4];
            P(t4) && this.on(n4, t4);
          }
        }
        tapOneOrMany(e5, t3) {
          const n4 = P(t3) ? [t3] : t3;
          n4.forEach((t4) => this.on(e5, t4));
        }
        tap(e5, t3) {
          const n4 = this.hooks, { type: r4, initial: a4 } = n4[e5];
          r4 === N.SINGLE ? (this.off(e5), this.on(e5, P(t3) ? t3 : t3[t3.length - 1])) : (a4 && this.off(e5, a4), this.tapOneOrMany(e5, t3));
        }
        call(e5, ...t3) {
          var n4;
          const r4 = this.hooks[e5];
          if (!r4) return;
          const { type: a4 } = r4, o3 = this.callbacks;
          if (!o3) return;
          const i4 = o3[e5];
          if (i4) {
            const e6 = i4.tail;
            let r5, o4 = i4.next, l4 = t3;
            while (o4 !== e6) {
              if (r5 = null === (n4 = o4.callback) || void 0 === n4 ? void 0 : n4.apply(o4.context || this, l4), a4 === N.WATERFALL) {
                const e7 = [r5];
                l4 = e7;
              }
              o4 = o4.next;
            }
            return r5;
          }
        }
        isExist(e5) {
          var t3;
          return Boolean(null === (t3 = this.callbacks) || void 0 === t3 ? void 0 : t3[e5]);
        }
      };
      M = new O({ getMiniLifecycle: R(N.SINGLE, (e5) => e5), getMiniLifecycleImpl: R(N.SINGLE, function() {
        return this.call("getMiniLifecycle", L);
      }), getLifecycle: R(N.SINGLE, (e5, t3) => e5[t3]), modifyRecursiveComponentConfig: R(N.SINGLE, (e5) => e5), getPathIndex: R(N.SINGLE, (e5) => `[${e5}]`), getEventCenter: R(N.SINGLE, (e5) => new e5()), isBubbleEvents: R(N.SINGLE, (e5) => {
        const t3 = /* @__PURE__ */ new Set(["touchstart", "touchmove", "touchcancel", "touchend", "touchforcechange", "tap", "longpress", "longtap", "transitionend", "animationstart", "animationiteration", "animationend"]);
        return t3.has(e5);
      }), getSpecialNodes: R(N.SINGLE, () => ["view", "text", "image"]), onRemoveAttribute: R(N.SINGLE), batchedEventUpdates: R(N.SINGLE), mergePageInstance: R(N.SINGLE), modifyPageObject: R(N.SINGLE), createPullDownComponent: R(N.SINGLE), getDOMNode: R(N.SINGLE), modifyHydrateData: R(N.SINGLE), transferHydrateData: R(N.SINGLE), modifySetAttrPayload: R(N.SINGLE), modifyRmAttrPayload: R(N.SINGLE), onAddEvent: R(N.SINGLE), proxyToRaw: R(N.SINGLE, function(e5) {
        return e5;
      }), modifyMpEvent: R(N.MULTI), modifyMpEventImpl: R(N.SINGLE, function(e5) {
        try {
          this.call("modifyMpEvent", e5);
        } catch (t3) {
          console.warn("[Taro modifyMpEvent hook Error]: " + (null === t3 || void 0 === t3 ? void 0 : t3.message));
        }
      }), injectNewStyleProperties: R(N.SINGLE), modifyTaroEvent: R(N.MULTI), dispatchTaroEvent: R(N.SINGLE, (e5, t3) => {
        t3.dispatchEvent(e5);
      }), dispatchTaroEventFinish: R(N.MULTI), modifyTaroEventReturn: R(N.SINGLE, () => {
      }), modifyDispatchEvent: R(N.MULTI), initNativeApi: R(N.MULTI), patchElement: R(N.MULTI), modifyAddEventListener: R(N.SINGLE), modifyRemoveEventListener: R(N.SINGLE), getMemoryLevel: R(N.SINGLE) });
      z = {};
      (/* @__PURE__ */ new Date()).getTime().toString(), function(e5) {
        e5[e5["V1"] = 1] = "V1", e5[e5["V2"] = 2] = "V2";
      }(D || (D = {})), function(e5) {
        e5["Container"] = "container", e5["Childnodes"] = "cn", e5["Text"] = "v", e5["NodeType"] = "nt", e5["NodeName"] = "nn", e5["Sid"] = "sid", e5["Style"] = "st", e5["Class"] = "cl", e5["Src"] = "src";
      }(F || (F = {}));
      A = "\u9875\u9762\u521D\u59CB\u5316";
      j = "root";
      B = "container";
      U = "input";
      H = "target";
      W = "currentTarget";
      V = "type";
      Q = "confirm";
      q = "timeStamp";
      Y = "keyCode";
      G = "touchmove";
      K = "onLoad";
      X = "onReady";
      Z = "onShow";
      J = "onHide";
      ee = "e_result";
      (function(e5) {
        e5["INIT"] = "0", e5["RESTORE"] = "1", e5["RECOVER"] = "2", e5["DESTROY"] = "3";
      })(te || (te = {}));
      ne = M.call("getEventCenter", w);
      re = { window: "undefined" !== typeof window ? window : z, document: "undefined" !== typeof document ? document : z };
      ie = { app: null, router: null, page: null };
      le = () => ie;
      (function() {
        let e5;
        "undefined" !== typeof performance && null !== performance && performance.now ? se = () => performance.now() : Date.now ? (e5 = Date.now(), se = () => Date.now() - e5) : (e5 = (/* @__PURE__ */ new Date()).getTime(), se = () => (/* @__PURE__ */ new Date()).getTime() - e5);
      })();
      ue = 0;
      ce = "undefined" !== typeof requestAnimationFrame && "undefined" !== typeof cancelAnimationFrame;
      de = ce ? requestAnimationFrame : function(e5) {
        const t3 = se(), n4 = Math.max(ue + 16, t3);
        return setTimeout(function() {
          e5(ue = n4);
        }, n4 - t3);
      };
      fe = re.window;
      pe = fe.location;
      fe.history;
      he = () => {
        const e5 = [];
        for (let r4 = 65; r4 <= 90; r4++) e5.push(r4);
        for (let r4 = 97; r4 <= 122; r4++) e5.push(r4);
        const t3 = e5.length - 1, n4 = [0, 0];
        return () => {
          const r4 = n4.map((t4) => e5[t4]), a4 = String.fromCharCode(...r4);
          let o3 = n4.length - 1;
          n4[o3]++;
          while (n4[o3] > t3) {
            if (n4[o3] = 0, o3 -= 1, o3 < 0) {
              n4.push(0);
              break;
            }
            n4[o3]++;
          }
          return a4;
        };
      };
      me = { prerender: true, debug: false };
      ve = class {
        constructor(e5, t3, n4) {
          this._stop = false, this._end = false, this.defaultPrevented = false, this.button = 0, this.timeStamp = Date.now(), this.type = e5.toLowerCase(), this.mpEvent = n4, this.bubbles = Boolean(t3 && t3.bubbles), this.cancelable = Boolean(t3 && t3.cancelable);
        }
        stopPropagation() {
          this._stop = true;
        }
        stopImmediatePropagation() {
          this._end = this._stop = true;
        }
        preventDefault() {
          this.defaultPrevented = true;
        }
        get target() {
          var e5, t3, n4, r4, a4;
          const o3 = this.cacheTarget;
          if (o3) return o3;
          {
            const o4 = Object.create((null === (e5 = this.mpEvent) || void 0 === e5 ? void 0 : e5.target) || null), i4 = re.document.getElementById((null === (t3 = o4.dataset) || void 0 === t3 ? void 0 : t3.sid) || o4.id || null), l4 = re.document.getElementById((null === (n4 = o4.targetDataset) || void 0 === n4 ? void 0 : n4.sid) || (null === (r4 = o4.dataset) || void 0 === r4 ? void 0 : r4.sid) || o4.id || null);
            o4.dataset = Object.assign(Object.assign({}, null !== i4 ? i4.dataset : o4.dataset || z), null !== l4 ? l4.dataset : o4.targetDataset || z);
            for (const e6 in null === (a4 = this.mpEvent) || void 0 === a4 ? void 0 : a4.detail) o4[e6] = this.mpEvent.detail[e6];
            return this.cacheTarget = o4, o4;
          }
        }
        get currentTarget() {
          var e5, t3, n4, r4, a4, o3, i4, l4;
          const s4 = this.cacheCurrentTarget;
          if (s4) return s4;
          {
            const s5 = re.document, u3 = Object.create((null === (e5 = this.mpEvent) || void 0 === e5 ? void 0 : e5.currentTarget) || null), c4 = s5.getElementById((null === (t3 = u3.dataset) || void 0 === t3 ? void 0 : t3.sid) || u3.id || null), d3 = s5.getElementById((null === (a4 = null === (r4 = null === (n4 = this.mpEvent) || void 0 === n4 ? void 0 : n4.target) || void 0 === r4 ? void 0 : r4.dataset) || void 0 === a4 ? void 0 : a4.sid) || (null === (i4 = null === (o3 = this.mpEvent) || void 0 === o3 ? void 0 : o3.target) || void 0 === i4 ? void 0 : i4.id) || null);
            if (null !== c4 ? c4 === d3 : !this.mpEvent || this.mpEvent.currentTarget === this.mpEvent.target) return this.cacheCurrentTarget = this.target, this.target;
            u3.dataset = null !== c4 ? c4.dataset : u3.dataset || z;
            for (const e6 in null === (l4 = this.mpEvent) || void 0 === l4 ? void 0 : l4.detail) u3[e6] = this.mpEvent.detail[e6];
            return this.cacheCurrentTarget = u3, u3;
          }
        }
      };
      be = {};
      $e = class {
        constructor() {
          Ee.add(this), this.recorder = /* @__PURE__ */ new Map();
        }
        start(e5) {
          me.debug && this.recorder.set(e5, Date.now());
        }
        stop(e5, t3 = Date.now()) {
          if (!me.debug) return;
          const n4 = this.recorder.get(e5);
          if (!(n4 >= 0)) return;
          this.recorder.delete(e5);
          const r4 = t3 - n4;
          console.log(`${e5} \u65F6\u957F\uFF1A ${r4}ms \u5F00\u59CB\u65F6\u95F4\uFF1A${oe(this, Ee, "m", xe).call(this, n4)} \u7ED3\u675F\u65F6\u95F4\uFF1A${oe(this, Ee, "m", xe).call(this, t3)}`);
        }
        delayStop(e5, t3 = 500) {
          if (me.debug) return ke((t4 = Date.now(), n4) => {
            this.stop(e5, t4), null === n4 || void 0 === n4 || n4();
          }, t3);
        }
      };
      Ee = /* @__PURE__ */ new WeakSet(), xe = function(e5) {
        const t3 = new Date(e5);
        return `${t3.getHours()}:${t3.getMinutes()}:${t3.getSeconds()}.${`${t3.getMilliseconds()}`.padStart(3, "0")}`;
      };
      _e = new $e();
      Ce = re.document;
      Pe = (e5 = "") => "/" === e5.charAt(0) ? e5 : "/" + e5;
      Te = (e5 = "", t3 = "") => new RegExp("^" + t3 + "(\\/|\\?|#|$)", "i").test(e5) || e5 === t3;
      Ne = (e5 = "", t3 = "") => Te(e5, t3) ? e5.substring(t3.length) : e5;
      Le = (e5 = "") => e5.replace(/[?#][\s\S]*$/, "");
      Re = (e5 = "", t3 = "", n4 = {}, r4 = "") => {
        var a4;
        const o3 = Pe(Ne(e5, t3)), i4 = (null === (a4 = Object.entries(n4).find(([e6]) => e6 === o3)) || void 0 === a4 ? void 0 : a4[1]) || o3;
        return r4 || ("string" === typeof i4 ? i4 : i4[0]) || t3;
      };
      Oe = (e5 = "hash", t3 = "/") => {
        const n4 = "hash" === e5 ? pe.hash.slice(1).split("?")[0] : pe.pathname;
        return Pe(Ne(n4, t3));
      };
      Me = /* @__PURE__ */ new Map();
      ze = he();
      Ve = 100;
      Qe = (e5, t3) => {
        const n4 = Date.now(), r4 = ie.router, a4 = () => {
          setTimeout(function() {
            t3 ? e5.call(t3) : e5();
          }, 1);
        };
        if (null === r4) return a4();
        const o3 = r4.$taroPath;
        function i4() {
          var e6, t4, r5;
          const l4 = re.document.getElementById(o3);
          (null === l4 || void 0 === l4 ? void 0 : l4.pendingUpdate) ? null !== (r5 = null === (t4 = null === (e6 = l4.firstChild) || void 0 === e6 ? void 0 : e6["componentOnReady"]) || void 0 === t4 ? void 0 : t4.call(e6).then(() => {
            a4();
          })) && void 0 !== r5 || a4() : Date.now() - n4 > Ve ? a4() : setTimeout(() => i4(), 20);
        }
        i4();
      };
      qe = { PageContext: z, R: z };
      Ye = "taro-app";
      Je = (e5) => (t3) => {
        const { R: n4, PageContext: r4 } = qe, a4 = n4.useContext(r4) || Ye, o3 = n4.useRef(), i4 = n4.useRef(t3);
        i4.current !== t3 && (i4.current = t3), n4.useLayoutEffect(() => {
          let t4 = o3.current = De(a4), n5 = false;
          t4 || (n5 = true, o3.current = /* @__PURE__ */ Object.create(null), t4 = o3.current);
          const r5 = (...e6) => i4.current(...e6);
          return P(t4[e5]) ? t4[e5] = [t4[e5], r5] : t4[e5] = [...t4[e5] || [], r5], n5 && Ie(t4, a4), () => {
            const t5 = o3.current;
            if (!t5) return;
            const n6 = t5[e5];
            n6 === r5 ? t5[e5] = void 0 : T(n6) && (t5[e5] = n6.filter((e6) => e6 !== r5)), o3.current = void 0;
          };
        }, []);
      };
      et = Je("componentDidHide");
      tt = Je("componentDidShow");
      nt = Je("onError");
      rt = Je("onUnhandledRejection");
      at = Je("onLaunch");
      ot = Je("onPageNotFound");
      it = Je("onLoad");
      lt = Je("onPageScroll");
      st = Je("onPullDownRefresh");
      ut = Je("onPullIntercept");
      ct = Je("onReachBottom");
      dt = Je("onResize");
      ft = Je("onUnload");
      pt = Je("onAddToFavorites");
      ht = Je("onOptionMenuClick");
      gt = Je("onKeyboardHeight");
      mt = Je("onSaveExitState");
      vt = Je("onShareAppMessage");
      yt = Je("onShareTimeline");
      bt = Je("onTitleClick");
      wt = Je("onReady");
      St = (e5 = false) => {
        const t3 = qe.R;
        return e5 ? ie.router : t3.useMemo(() => ie.router, []);
      };
      kt = Je("onTabItemTap");
      Et = () => {
      };
      xt = Object.freeze({ __proto__: null, useAddToFavorites: pt, useDidHide: et, useDidShow: tt, useError: nt, useKeyboardHeight: gt, useLaunch: at, useLoad: it, useOptionMenuClick: ht, usePageNotFound: ot, usePageScroll: lt, usePullDownRefresh: st, usePullIntercept: ut, useReachBottom: ct, useReady: wt, useResize: dt, useRouter: St, useSaveExitState: mt, useScope: Et, useShareAppMessage: vt, useShareTimeline: yt, useTabItemTap: kt, useTitleClick: bt, useUnhandledRejection: rt, useUnload: ft });
      Pt = he();
      he(), M.tap("initNativeApi", function(e5) {
        for (const t3 in xt) e5[t3] = xt[t3];
      });
      Ot = { ASCF: "ASCF", WEAPP: "WEAPP", SWAN: "SWAN", ALIPAY: "ALIPAY", TT: "TT", QQ: "QQ", JD: "JD", WEB: "WEB", RN: "RN", HARMONY: "HARMONY", QUICKAPP: "QUICKAPP", HARMONYHYBRID: "HARMONYHYBRID" };
      zt = class _zt {
        constructor(e5, t3, n4) {
          this.index = n4 || 0, this.requestParams = e5 || {}, this.interceptors = t3 || [];
        }
        proceed(e5 = {}) {
          if (this.requestParams = e5, this.index >= this.interceptors.length) throw new Error("chain \u53C2\u6570\u9519\u8BEF, \u8BF7\u52FF\u76F4\u63A5\u4FEE\u6539 request.chain");
          const t3 = this._getNextInterceptor(), n4 = this._getNextChain(), r4 = t3(n4), a4 = r4.catch((e6) => Promise.reject(e6));
          return Object.keys(r4).forEach((e6) => P(r4[e6]) && (a4[e6] = r4[e6])), a4;
        }
        _getNextInterceptor() {
          return this.interceptors[this.index];
        }
        _getNextChain() {
          return new _zt(this.requestParams, this.interceptors, this.index + 1);
        }
      };
      It = class {
        constructor(e5) {
          this.taroInterceptor = e5, this.chain = new zt();
        }
        request(e5) {
          const t3 = this.chain, n4 = this.taroInterceptor;
          return t3.interceptors = t3.interceptors.filter((e6) => e6 !== n4).concat(n4), t3.proceed(Object.assign({}, e5));
        }
        addInterceptor(e5) {
          this.chain.interceptors.push(e5);
        }
        cleanInterceptors() {
          this.chain = new zt();
        }
      };
      jt = Object.freeze(Object.defineProperty({ __proto__: null, logInterceptor: At, timeoutInterceptor: Ft }, Symbol.toStringTag, { value: "Module" }));
      Ht = 750;
      Wt = { 640: 1.17, 750: 1, 828: 0.905 };
      Vt = 20;
      Qt = 5;
      qt = "rpx";
      Kt = { Behavior: Bt, getEnv: Mt, ENV_TYPE: Ot, Link: It, interceptors: jt, Current: ie, getCurrentInstance: le, options: me, nextTick: Qe, eventCenter: ne, Events: w, getInitPxTransform: Yt, interceptorify: Dt };
      Kt.initPxTransform = Yt(Kt), Kt.preload = Ut(ie), Kt.pxTransform = Gt(Kt);
      tn = '\n<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M23.8899 12.2737C23.8232 12.3584 23.7237 12.3997 23.6198 12.3974H20.7994V23.5996C20.7994 23.8194 20.6213 24 20.4001 24H14.7994C14.5791 24 14.4002 23.8194 14.4002 23.5996V15.6H9.59963V23.5996C9.59963 23.8194 9.42075 24 9.20033 24H3.59968C3.48981 24 3.38964 23.954 3.31764 23.8811C3.24495 23.8091 3.2004 23.7087 3.2004 23.5996V12.3975H0.398546V12.3967C0.296893 12.396 0.194446 12.3544 0.11579 12.2738C-0.0371146 12.114 -0.0400714 11.864 0.11579 11.7076L11.7201 0.117284C11.8767 -0.0390948 12.1298 -0.0390948 12.2863 0.117284L23.8899 11.7076C24.0465 11.864 24.0265 12.0995 23.8899 12.2737ZM12.0029 0.964625L1.37086 11.5854L3.59968 11.5839V11.5999C3.65537 11.5999 3.70804 11.611 3.75557 11.6307C3.89952 11.692 4.00046 11.8339 4.00046 11.9996V23.1991H8.79955V15.2003C8.79955 14.9789 8.97917 14.8002 9.20033 14.8002H14.7995C15.0207 14.8002 15.2003 14.9789 15.2003 15.2003V23.1991H20.0001V11.9996C20.0001 11.8339 20.1003 11.692 20.2443 11.6307C20.2918 11.611 20.3453 11.5999 20.4001 11.5999V11.5713L22.6193 11.5691L12.0029 0.964625Z" fill="currentColor"/>\n</svg>\n';
      nn = '\n<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M17.8206 22.9016L7.45515 11.8756L17.8206 1.09845C18.0598 0.849741 18.0598 0.435233 17.8206 0.186528C17.5814 -0.0621762 17.1827 -0.0621762 16.9435 0.186528L6.1794 11.4611C5.9402 11.7098 5.9402 12.1244 6.1794 12.3731L16.9435 23.8135C17.1827 24.0622 17.5814 24.0622 17.8206 23.8135C18.0598 23.5648 18.0598 23.1503 17.8206 22.9016Z" fill="currentColor"/>\n</svg>\n';
      rn = '\n<svg t="1709608074670" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4741" width="24" height="24"><path d="M256 529.066667H85.333333a17.066667 17.066667 0 1 1 0-34.133334h170.666667a17.066667 17.066667 0 0 1 0 34.133334z" opacity=".278" p-id="4742"></path><path d="M99.84 640a17.066667 17.066667 0 0 1-4.437333-33.553067l164.693333-44.373333a17.066667 17.066667 0 1 1 8.891733 32.9728l-164.693333 44.373333a17.544533 17.544533 0 0 1-4.4544 0.580267z" opacity=".322" p-id="4743"></path><path d="M264.533333 462.523733a16.896 16.896 0 0 1-4.369066-0.580266l-164.693334-43.52a17.0496 17.0496 0 1 1 8.721067-32.989867l164.693333 43.52a17.066667 17.066667 0 1 1-4.352 33.570133z" opacity=".239" p-id="4744"></path><path d="M384.017067 307.2a17.032533 17.032533 0 0 1-14.7968-8.533333l-85.333334-147.626667a17.066667 17.066667 0 0 1 29.559467-17.083733l85.333333 147.626666A17.066667 17.066667 0 0 1 384.017067 307.2z" opacity=".122" p-id="4745"></path><path d="M639.982933 307.2a17.0496 17.0496 0 0 1-14.762666-25.6l85.333333-147.626667a17.066667 17.066667 0 1 1 29.559467 17.066667l-85.333334 147.626667a17.032533 17.032533 0 0 1-14.7968 8.533333z" opacity=".922" p-id="4746"></path><path d="M692.906667 347.306667a17.066667 17.066667 0 0 1-12.117334-29.098667l120.337067-121.173333a17.066667 17.066667 0 1 1 24.234667 24.046933l-120.337067 121.173333a17.1008 17.1008 0 0 1-12.117333 5.051734z" opacity=".878" p-id="4747"></path><path d="M733.883733 401.066667a17.066667 17.066667 0 0 1-8.5504-31.8464l147.626667-85.333334a17.0496 17.0496 0 1 1 17.066667 29.5424l-147.626667 85.333334a16.776533 16.776533 0 0 1-8.516267 2.304z" opacity=".839" p-id="4748"></path><path d="M512 273.066667a17.066667 17.066667 0 0 1-17.066667-17.066667V85.333333a17.066667 17.066667 0 0 1 34.133334 0v170.666667a17.066667 17.066667 0 0 1-17.066667 17.066667z" p-id="4749"></path><path d="M578.577067 281.6a17.066667 17.066667 0 0 1-16.520534-21.418667l43.52-164.693333a17.066667 17.066667 0 0 1 33.006934 8.721067l-43.52 164.693333a17.066667 17.066667 0 0 1-16.4864 12.6976z" opacity=".961" p-id="4750"></path><path d="M445.44 282.453333a17.066667 17.066667 0 0 1-16.469333-12.629333l-44.373334-164.693333a17.066667 17.066667 0 0 1 32.955734-8.891734l44.373333 164.693334a17.066667 17.066667 0 0 1-16.4864 21.521066z" opacity=".078" p-id="4751"></path><path d="M924.177067 640c-1.4848 0-2.9696-0.187733-4.4544-0.580267l-164.693334-44.373333a17.066667 17.066667 0 0 1 8.874667-32.9728l164.693333 44.373333a17.066667 17.066667 0 0 1-4.420266 33.553067z" opacity=".722" p-id="4752"></path><path d="M881.476267 742.4a17.015467 17.015467 0 0 1-8.482134-2.269867l-148.48-85.333333a17.0496 17.0496 0 1 1 16.9984-29.5936l148.48 85.333333a17.0496 17.0496 0 0 1-8.516266 31.863467z" opacity=".678" p-id="4753"></path><path d="M813.226667 830.293333a17.015467 17.015467 0 0 1-12.066134-5.000533l-120.337066-120.337067a17.0496 17.0496 0 1 1 24.132266-24.132266l120.337067 120.337066a17.0496 17.0496 0 0 1-12.066133 29.1328z" opacity=".639" p-id="4754"></path><path d="M938.666667 529.066667H768a17.066667 17.066667 0 1 1 0-34.133334h170.666667a17.066667 17.066667 0 1 1 0 34.133334z" opacity=".761" p-id="4755"></path><path d="M401.066667 941.226667a17.066667 17.066667 0 0 1-16.4864-21.504l44.373333-164.693334a17.066667 17.066667 0 1 1 32.955733 8.874667l-44.373333 164.693333a17.066667 17.066667 0 0 1-16.469333 12.629334z" opacity=".478" p-id="4756"></path><path d="M298.6496 898.56a17.066667 17.066667 0 0 1-14.779733-25.565867l85.333333-148.48a17.083733 17.083733 0 0 1 29.5936 16.9984l-85.333333 148.48a17.032533 17.032533 0 0 1-14.813867 8.567467z" opacity=".439" p-id="4757"></path><path d="M512 955.733333a17.066667 17.066667 0 0 1-17.066667-17.066666V768a17.066667 17.066667 0 1 1 34.133334 0v170.666667a17.066667 17.066667 0 0 1-17.066667 17.066666z" opacity=".522" p-id="4758"></path><path d="M725.3504 898.56a17.032533 17.032533 0 0 1-14.7968-8.533333l-85.333333-147.626667a17.066667 17.066667 0 0 1 29.559466-17.066667l85.333334 147.626667a17.066667 17.066667 0 0 1-14.762667 25.6z" opacity=".6" p-id="4759"></path><path d="M622.062933 942.08c-7.509333 0-14.421333-5.0176-16.469333-12.629333l-44.3904-164.693334a17.066667 17.066667 0 1 1 32.9728-8.874666l44.3904 164.693333a17.066667 17.066667 0 0 1-16.503467 21.504z" opacity=".561" p-id="4760"></path><path d="M759.4496 463.36a17.083733 17.083733 0 0 1-4.420267-33.553067l164.693334-44.373333a17.066667 17.066667 0 0 1 8.874666 32.955733l-164.693333 44.373334a16.657067 16.657067 0 0 1-4.4544 0.597333z" opacity=".702" p-id="4761"></path><path d="M330.24 347.306667a17.015467 17.015467 0 0 1-12.066133-5.000534l-120.32-120.32a17.0496 17.0496 0 1 1 24.132266-24.132266l120.32 120.32a17.0496 17.0496 0 0 1-12.066133 29.1328z" opacity=".161" p-id="4762"></path><path d="M290.116267 401.066667a17.032533 17.032533 0 0 1-8.533334-2.286934l-147.626666-85.333333a17.066667 17.066667 0 1 1 17.083733-29.5424l147.626667 85.333333a17.066667 17.066667 0 0 1-8.5504 31.829334z" opacity=".2" p-id="4763"></path><path d="M142.523733 742.4a17.066667 17.066667 0 0 1-8.567466-31.8464l147.626666-85.333333a17.066667 17.066667 0 1 1 17.083734 29.559466l-147.626667 85.333334a16.930133 16.930133 0 0 1-8.516267 2.286933z" opacity=".361" p-id="4764"></path><path d="M209.92 830.293333a17.066667 17.066667 0 0 1-12.117333-29.098666l120.32-121.173334a17.066667 17.066667 0 0 1 24.2176 24.029867l-120.32 121.1904a16.896 16.896 0 0 1-12.100267 5.051733z" opacity=".4" p-id="4765"></path></svg>\n';
      on = { allRenderFn: false, cmpDidLoad: true, cmpDidUnload: false, cmpDidUpdate: true, cmpDidRender: true, cmpWillLoad: true, cmpWillUpdate: true, cmpWillRender: true, connectedCallback: true, disconnectedCallback: true, element: true, event: true, hasRenderFn: true, lifecycle: true, hostListener: true, hostListenerTargetWindow: true, hostListenerTargetDocument: true, hostListenerTargetBody: true, hostListenerTargetParent: false, hostListenerTarget: true, member: true, method: true, mode: true, observeAttribute: true, prop: true, propMutable: true, reflect: true, scoped: true, shadowDom: true, slot: true, cssAnnotations: true, state: true, style: true, svg: true, updatable: true, vdomAttribute: true, vdomXlink: true, vdomClass: true, vdomFunctional: true, vdomKey: true, vdomListener: true, vdomRef: true, vdomPropOrAttr: true, vdomRender: true, vdomStyle: true, vdomText: true, watchCallback: true, taskQueue: true, hotModuleReplacement: false, isDebug: false, isDev: false, isTesting: false, hydrateServerSide: false, hydrateClientSide: false, lifecycleDOMEvents: false, lazyLoad: false, profile: false, slotRelocation: true, appendChildSlotFix: false, cloneNodeFix: false, hydratedAttribute: false, hydratedClass: true, safari10: false, scriptDataOpts: false, scopedSlotTextContentFix: false, shadowDomShim: false, slotChildNodesFix: false, invisiblePrehydration: true, propBoolean: true, propNumber: true, propString: true, cssVarShim: false, constructableCSS: true, cmpShouldUpdate: true, devTools: false, dynamicImportShim: false, shadowDelegatesFocus: true, initializeNextTick: false, asyncLoading: false, asyncQueue: false, transformTagName: false, attachStyles: true };
      cn = false;
      dn = false;
      fn = false;
      pn = false;
      hn = null;
      gn = false;
      mn = (e5, t3 = "") => () => {
      };
      vn = "http://www.w3.org/1999/xlink";
      yn = {};
      bn = "http://www.w3.org/2000/svg";
      wn = "http://www.w3.org/1999/xhtml";
      Sn = (e5) => null != e5;
      kn = (e5) => (e5 = typeof e5, "object" === e5 || "function" === e5);
      xn = (e5, t3, ...n4) => {
        let r4 = null, a4 = null, o3 = null, i4 = false, l4 = false;
        const s4 = [], u3 = (t4) => {
          for (let n5 = 0; n5 < t4.length; n5++) r4 = t4[n5], Array.isArray(r4) ? u3(r4) : null != r4 && "boolean" !== typeof r4 && ((i4 = "function" !== typeof e5 && !kn(r4)) && (r4 = String(r4)), i4 && l4 ? s4[s4.length - 1].$text$ += r4 : s4.push(i4 ? $n(null, r4) : r4), l4 = i4);
        };
        if (u3(n4), t3) {
          t3.key && (a4 = t3.key), t3.name && (o3 = t3.name);
          {
            const e6 = t3.className || t3.class;
            e6 && (t3.class = "object" !== typeof e6 ? e6 : Object.keys(e6).filter((t4) => e6[t4]).join(" "));
          }
        }
        if ("function" === typeof e5) return e5(null === t3 ? {} : t3, s4, Pn);
        const c4 = $n(e5, null);
        return c4.$attrs$ = t3, s4.length > 0 && (c4.$children$ = s4), c4.$key$ = a4, c4.$name$ = o3, c4;
      };
      $n = (e5, t3) => {
        const n4 = { $flags$: 0, $tag$: e5, $text$: t3, $elm$: null, $children$: null, $attrs$: null, $key$: null, $name$: null };
        return n4;
      };
      _n = {};
      Cn = (e5) => e5 && e5.$tag$ === _n;
      Pn = { forEach: (e5, t3) => e5.map(Tn).forEach(t3), map: (e5, t3) => e5.map(Tn).map(t3).map(Nn) };
      Tn = (e5) => ({ vattrs: e5.$attrs$, vchildren: e5.$children$, vkey: e5.$key$, vname: e5.$name$, vtag: e5.$tag$, vtext: e5.$text$ });
      Nn = (e5) => {
        if ("function" === typeof e5.vtag) {
          const t4 = Object.assign({}, e5.vattrs);
          return e5.vkey && (t4.key = e5.vkey), e5.vname && (t4.name = e5.vname), xn(e5.vtag, t4, ...e5.vchildren || []);
        }
        const t3 = $n(e5.vtag, e5.vtext);
        return t3.$attrs$ = e5.vattrs, t3.$children$ = e5.vchildren, t3.$key$ = e5.vkey, t3.$name$ = e5.vname, t3;
      };
      Ln = (e5) => Or.map((t3) => t3(e5)).find((e6) => !!e6);
      Rn = (e5, t3) => null == e5 || kn(e5) ? e5 : 4 & t3 ? "false" !== e5 && ("" === e5 || !!e5) : 2 & t3 ? parseFloat(e5) : 1 & t3 ? String(e5) : e5;
      On = (e5) => e5;
      Mn = (e5, t3, n4) => {
        const r4 = On(e5);
        return { emit: (e6) => zn(r4, t3, { bubbles: !!(4 & n4), composed: !!(2 & n4), cancelable: !!(1 & n4), detail: e6 }) };
      };
      zn = (e5, t3, n4) => {
        const r4 = Dr.ce(t3, n4);
        return e5.dispatchEvent(r4), r4;
      };
      In = /* @__PURE__ */ new WeakMap();
      Dn = (e5, t3, n4) => {
        let r4 = Rr.get(e5);
        jr && n4 ? (r4 = r4 || new CSSStyleSheet(), "string" === typeof r4 ? r4 = t3 : r4.replaceSync(t3)) : r4 = t3, Rr.set(e5, r4);
      };
      Fn = (e5, t3, n4, r4) => {
        var a4;
        let o3 = jn(t3, n4);
        const i4 = Rr.get(o3);
        if (e5 = 11 === e5.nodeType ? e5 : zr, i4) if ("string" === typeof i4) {
          e5 = e5.head || e5;
          let t4, n5 = In.get(e5);
          if (n5 || In.set(e5, n5 = /* @__PURE__ */ new Set()), !n5.has(o3)) {
            {
              t4 = zr.createElement("style"), t4.innerHTML = i4;
              const n6 = null !== (a4 = Dr.$nonce$) && void 0 !== a4 ? a4 : En(zr);
              null != n6 && t4.setAttribute("nonce", n6), e5.insertBefore(t4, e5.querySelector("link"));
            }
            n5 && n5.add(o3);
          }
        } else e5.adoptedStyleSheets.includes(i4) || (e5.adoptedStyleSheets = [...e5.adoptedStyleSheets, i4]);
        return o3;
      };
      An = (e5) => {
        const t3 = e5.$cmpMeta$, n4 = e5.$hostElement$, r4 = t3.$flags$, a4 = mn("attachStyles", t3.$tagName$), o3 = Fn(n4.shadowRoot ? n4.shadowRoot : n4.getRootNode(), t3, e5.$modeName$);
        10 & r4 && (n4["s-sc"] = o3, n4.classList.add(o3 + "-h"), 2 & r4 && n4.classList.add(o3 + "-s")), a4();
      };
      jn = (e5, t3) => "sc-" + (t3 && 32 & e5.$flags$ ? e5.$tagName$ + "-" + t3 : e5.$tagName$);
      Bn = (e5, t3, n4, r4, a4, o3) => {
        if (n4 !== r4) {
          let l4 = Nr(e5, t3), s4 = t3.toLowerCase();
          if ("class" === t3) {
            const t4 = e5.classList, a5 = Hn(n4), o4 = Hn(r4);
            t4.remove(...a5.filter((e6) => e6 && !o4.includes(e6))), t4.add(...o4.filter((e6) => e6 && !a5.includes(e6)));
          } else if ("style" === t3) {
            for (const t4 in n4) r4 && null != r4[t4] || (t4.includes("-") ? e5.style.removeProperty(t4) : e5.style[t4] = "");
            for (const t4 in r4) n4 && r4[t4] === n4[t4] || (t4.includes("-") ? e5.style.setProperty(t4, r4[t4]) : e5.style[t4] = r4[t4]);
          } else if ("key" === t3) ;
          else if ("ref" === t3) r4 && r4(e5);
          else if (e5.__lookupSetter__(t3) || "o" !== t3[0] || "n" !== t3[1]) {
            const u3 = kn(r4);
            if ((l4 || u3 && null !== r4) && !a4) try {
              if (e5.tagName.includes("-")) e5[t3] = r4;
              else {
                const a5 = null == r4 ? "" : r4;
                "list" === t3 ? l4 = false : null != n4 && e5[t3] == a5 || (e5[t3] = a5);
              }
            } catch (i4) {
            }
            let c4 = false;
            s4 !== (s4 = s4.replace(/^xlink\:?/, "")) && (t3 = s4, c4 = true), null == r4 || false === r4 ? false === r4 && "" !== e5.getAttribute(t3) || (c4 ? e5.removeAttributeNS(vn, t3) : e5.removeAttribute(t3)) : (!l4 || 4 & o3 || a4) && !u3 && (r4 = true === r4 ? "" : r4, c4 ? e5.setAttributeNS(vn, t3, r4) : e5.setAttribute(t3, r4));
          } else t3 = "-" === t3[2] ? t3.slice(3) : Nr(Mr, s4) ? s4.slice(2) : s4[2] + t3.slice(3), n4 && Dr.rel(e5, t3, n4, false), r4 && Dr.ael(e5, t3, r4, false);
        }
      };
      Un = /\s/;
      Hn = (e5) => e5 ? e5.split(Un) : [];
      Wn = (e5, t3, n4, r4) => {
        const a4 = 11 === t3.$elm$.nodeType && t3.$elm$.host ? t3.$elm$.host : t3.$elm$, o3 = e5 && e5.$attrs$ || yn, i4 = t3.$attrs$ || yn;
        for (r4 in o3) r4 in i4 || Bn(a4, r4, o3[r4], void 0, n4, t3.$flags$);
        for (r4 in i4) Bn(a4, r4, o3[r4], i4[r4], n4, t3.$flags$);
      };
      Vn = (e5, t3, n4, r4) => {
        const a4 = t3.$children$[n4];
        let o3, i4, l4, s4 = 0;
        if (cn || (fn = true, "slot" === a4.$tag$ && (ln && r4.classList.add(ln + "-s"), a4.$flags$ |= a4.$children$ ? 2 : 1)), null !== a4.$text$) o3 = a4.$elm$ = zr.createTextNode(a4.$text$);
        else if (1 & a4.$flags$) o3 = a4.$elm$ = zr.createTextNode("");
        else {
          if (pn || (pn = "svg" === a4.$tag$), o3 = a4.$elm$ = zr.createElementNS(pn ? bn : wn, 2 & a4.$flags$ ? "slot-fb" : a4.$tag$), pn && "foreignObject" === a4.$tag$ && (pn = false), Wn(null, a4, pn), Sn(ln) && o3["s-si"] !== ln && o3.classList.add(o3["s-si"] = ln), a4.$children$) for (s4 = 0; s4 < a4.$children$.length; ++s4) i4 = Vn(e5, a4, s4, o3), i4 && o3.appendChild(i4);
          "svg" === a4.$tag$ ? pn = false : "foreignObject" === o3.tagName && (pn = true);
        }
        return o3["s-hn"] = un, 3 & a4.$flags$ && (o3["s-sr"] = true, o3["s-cr"] = sn, o3["s-sn"] = a4.$name$ || "", l4 = e5 && e5.$children$ && e5.$children$[n4], l4 && l4.$tag$ === a4.$tag$ && e5.$elm$ && Qn(e5.$elm$, false)), o3;
      };
      Qn = (e5, t3) => {
        Dr.$flags$ |= 1;
        const n4 = e5.childNodes;
        for (let r4 = n4.length - 1; r4 >= 0; r4--) {
          const e6 = n4[r4];
          e6["s-hn"] !== un && e6["s-ol"] && (Zn(e6).insertBefore(e6, Xn(e6)), e6["s-ol"].remove(), e6["s-ol"] = void 0, fn = true), t3 && Qn(e6, t3);
        }
        Dr.$flags$ &= -2;
      };
      qn = (e5, t3, n4, r4, a4, o3) => {
        let i4, l4 = e5["s-cr"] && e5["s-cr"].parentNode || e5;
        for (l4.shadowRoot && l4.tagName === un && (l4 = l4.shadowRoot); a4 <= o3; ++a4) r4[a4] && (i4 = Vn(null, n4, a4, e5), i4 && (r4[a4].$elm$ = i4, l4.insertBefore(i4, Xn(t3))));
      };
      Yn = (e5, t3, n4, r4, a4) => {
        for (; t3 <= n4; ++t3) (r4 = e5[t3]) && (a4 = r4.$elm$, ar(r4), dn = true, a4["s-ol"] ? a4["s-ol"].remove() : Qn(a4, true), a4.remove());
      };
      Gn = (e5, t3, n4, r4) => {
        let a4, o3, i4 = 0, l4 = 0, s4 = 0, u3 = 0, c4 = t3.length - 1, d3 = t3[0], f3 = t3[c4], p4 = r4.length - 1, h4 = r4[0], g4 = r4[p4];
        while (i4 <= c4 && l4 <= p4) if (null == d3) d3 = t3[++i4];
        else if (null == f3) f3 = t3[--c4];
        else if (null == h4) h4 = r4[++l4];
        else if (null == g4) g4 = r4[--p4];
        else if (Kn(d3, h4)) Jn(d3, h4), d3 = t3[++i4], h4 = r4[++l4];
        else if (Kn(f3, g4)) Jn(f3, g4), f3 = t3[--c4], g4 = r4[--p4];
        else if (Kn(d3, g4)) "slot" !== d3.$tag$ && "slot" !== g4.$tag$ || Qn(d3.$elm$.parentNode, false), Jn(d3, g4), e5.insertBefore(d3.$elm$, f3.$elm$.nextSibling), d3 = t3[++i4], g4 = r4[--p4];
        else if (Kn(f3, h4)) "slot" !== d3.$tag$ && "slot" !== g4.$tag$ || Qn(f3.$elm$.parentNode, false), Jn(f3, h4), e5.insertBefore(f3.$elm$, d3.$elm$), f3 = t3[--c4], h4 = r4[++l4];
        else {
          for (s4 = -1, u3 = i4; u3 <= c4; ++u3) if (t3[u3] && null !== t3[u3].$key$ && t3[u3].$key$ === h4.$key$) {
            s4 = u3;
            break;
          }
          s4 >= 0 ? (o3 = t3[s4], o3.$tag$ !== h4.$tag$ ? a4 = Vn(t3 && t3[l4], n4, s4, e5) : (Jn(o3, h4), t3[s4] = void 0, a4 = o3.$elm$), h4 = r4[++l4]) : (a4 = Vn(t3 && t3[l4], n4, l4, e5), h4 = r4[++l4]), a4 && Zn(d3.$elm$).insertBefore(a4, Xn(d3.$elm$));
        }
        i4 > c4 ? qn(e5, null == r4[p4 + 1] ? null : r4[p4 + 1].$elm$, n4, r4, l4, p4) : l4 > p4 && Yn(t3, i4, c4);
      };
      Kn = (e5, t3) => e5.$tag$ === t3.$tag$ && ("slot" === e5.$tag$ ? e5.$name$ === t3.$name$ : e5.$key$ === t3.$key$);
      Xn = (e5) => e5 && e5["s-ol"] || e5;
      Zn = (e5) => (e5["s-ol"] ? e5["s-ol"] : e5).parentNode;
      Jn = (e5, t3) => {
        const n4 = t3.$elm$ = e5.$elm$, r4 = e5.$children$, a4 = t3.$children$, o3 = t3.$tag$, i4 = t3.$text$;
        let l4;
        null === i4 ? (pn = "svg" === o3 || "foreignObject" !== o3 && pn, "slot" === o3 || Wn(e5, t3, pn), null !== r4 && null !== a4 ? Gn(n4, r4, t3, a4) : null !== a4 ? (null !== e5.$text$ && (n4.textContent = ""), qn(n4, null, t3, a4, 0, a4.length - 1)) : null !== r4 && Yn(r4, 0, r4.length - 1), pn && "svg" === o3 && (pn = false)) : (l4 = n4["s-cr"]) ? l4.parentNode.textContent = i4 : e5.$text$ !== i4 && (n4.data = i4);
      };
      er = (e5) => {
        const t3 = e5.childNodes;
        let n4, r4, a4, o3, i4, l4;
        for (r4 = 0, a4 = t3.length; r4 < a4; r4++) if (n4 = t3[r4], 1 === n4.nodeType) {
          if (n4["s-sr"]) {
            for (i4 = n4["s-sn"], n4.hidden = false, o3 = 0; o3 < a4; o3++) if (l4 = t3[o3].nodeType, t3[o3]["s-hn"] !== n4["s-hn"] || "" !== i4) {
              if (1 === l4 && i4 === t3[o3].getAttribute("slot")) {
                n4.hidden = true;
                break;
              }
            } else if (1 === l4 || 3 === l4 && "" !== t3[o3].textContent.trim()) {
              n4.hidden = true;
              break;
            }
          }
          er(n4);
        }
      };
      tr = [];
      nr = (e5) => {
        let t3, n4, r4, a4, o3, i4, l4 = 0;
        const s4 = e5.childNodes, u3 = s4.length;
        for (; l4 < u3; l4++) {
          if (t3 = s4[l4], t3["s-sr"] && (n4 = t3["s-cr"]) && n4.parentNode) for (r4 = n4.parentNode.childNodes, a4 = t3["s-sn"], i4 = r4.length - 1; i4 >= 0; i4--) n4 = r4[i4], n4["s-cn"] || n4["s-nr"] || n4["s-hn"] === t3["s-hn"] || (rr(n4, a4) ? (o3 = tr.find((e6) => e6.$nodeToRelocate$ === n4), dn = true, n4["s-sn"] = n4["s-sn"] || a4, o3 ? o3.$slotRefNode$ = t3 : tr.push({ $slotRefNode$: t3, $nodeToRelocate$: n4 }), n4["s-sr"] && tr.map((e6) => {
            rr(e6.$nodeToRelocate$, n4["s-sn"]) && (o3 = tr.find((e7) => e7.$nodeToRelocate$ === n4), o3 && !e6.$slotRefNode$ && (e6.$slotRefNode$ = o3.$slotRefNode$));
          })) : tr.some((e6) => e6.$nodeToRelocate$ === n4) || tr.push({ $nodeToRelocate$: n4 }));
          1 === t3.nodeType && nr(t3);
        }
      };
      rr = (e5, t3) => 1 === e5.nodeType ? null === e5.getAttribute("slot") && "" === t3 || e5.getAttribute("slot") === t3 : e5["s-sn"] === t3 || "" === t3;
      ar = (e5) => {
        e5.$attrs$ && e5.$attrs$.ref && e5.$attrs$.ref(null), e5.$children$ && e5.$children$.map(ar);
      };
      or = (e5, t3) => {
        const n4 = e5.$hostElement$, r4 = e5.$cmpMeta$, a4 = e5.$vnode$ || $n(null, null), o3 = Cn(t3) ? t3 : xn(null, null, t3);
        if (un = n4.tagName, r4.$attrsToReflect$ && (o3.$attrs$ = o3.$attrs$ || {}, r4.$attrsToReflect$.map(([e6, t4]) => o3.$attrs$[t4] = n4[e6])), o3.$tag$ = null, o3.$flags$ |= 4, e5.$vnode$ = o3, o3.$elm$ = a4.$elm$ = n4.shadowRoot || n4, ln = n4["s-sc"], sn = n4["s-cr"], cn = 0 !== (1 & r4.$flags$), dn = false, Jn(a4, o3), Dr.$flags$ |= 1, fn) {
          let e6, t4, n5, r5, a5, i4;
          nr(o3.$elm$);
          let l4 = 0;
          for (; l4 < tr.length; l4++) e6 = tr[l4], t4 = e6.$nodeToRelocate$, t4["s-ol"] || (n5 = zr.createTextNode(""), n5["s-nr"] = t4, t4.parentNode.insertBefore(t4["s-ol"] = n5, t4));
          for (l4 = 0; l4 < tr.length; l4++) if (e6 = tr[l4], t4 = e6.$nodeToRelocate$, e6.$slotRefNode$) {
            r5 = e6.$slotRefNode$.parentNode, a5 = e6.$slotRefNode$.nextSibling, n5 = t4["s-ol"];
            while (n5 = n5.previousSibling) if (i4 = n5["s-nr"], i4 && i4["s-sn"] === t4["s-sn"] && r5 === i4.parentNode && (i4 = i4.nextSibling, !i4 || !i4["s-nr"])) {
              a5 = i4;
              break;
            }
            (!a5 && r5 !== t4.parentNode || t4.nextSibling !== a5) && t4 !== a5 && (!t4["s-hn"] && t4["s-ol"] && (t4["s-hn"] = t4["s-ol"].parentNode.nodeName), r5.insertBefore(t4, a5));
          } else 1 === t4.nodeType && (t4.hidden = true);
        }
        dn && er(o3.$elm$), Dr.$flags$ &= -2, tr.length = 0;
      };
      ir = (e5, t3) => {
      };
      lr = (e5, t3) => {
        e5.$flags$ |= 16, ir(e5, e5.$ancestorComponent$);
        const n4 = () => sr(e5, t3);
        return qr(n4);
      };
      sr = (e5, t3) => {
        const n4 = e5.$hostElement$, r4 = mn("scheduleUpdate", e5.$cmpMeta$.$tagName$), a4 = n4;
        let o3;
        return o3 = fr(a4, t3 ? "componentWillLoad" : "componentWillUpdate"), o3 = pr(o3, () => fr(a4, "componentWillRender")), r4(), pr(o3, () => ur(e5, a4, t3));
      };
      ur = (e5, t3, n4) => i(void 0, null, function* () {
        const r4 = e5.$hostElement$, a4 = mn("update", e5.$cmpMeta$.$tagName$);
        r4["s-rc"], n4 && An(e5);
        const o3 = mn("render", e5.$cmpMeta$.$tagName$);
        cr(e5, t3, r4), o3(), a4(), dr(e5);
      });
      cr = (e5, t3, n4) => {
        const r4 = false, a4 = false, o3 = true, i4 = true;
        try {
          hn = t3, t3 = (r4 || t3.render) && t3.render(), i4 && o3 && (e5.$flags$ &= -17), (i4 || a4) && (e5.$flags$ |= 2), (on.hasRenderFn || on.reflect) && (on.vdomRender || on.reflect) && (on.hydrateServerSide || or(e5, t3));
        } catch (l4) {
          Lr(l4, e5.$hostElement$);
        }
        return hn = null, null;
      };
      dr = (e5) => {
        const t3 = e5.$cmpMeta$.$tagName$, n4 = e5.$hostElement$, r4 = mn("postUpdate", t3), a4 = n4;
        e5.$ancestorComponent$, fr(a4, "componentDidRender"), 64 & e5.$flags$ ? (fr(a4, "componentDidUpdate"), r4()) : (e5.$flags$ |= 64, fr(a4, "componentDidLoad"), r4());
      };
      fr = (e5, t3, n4) => {
        if (e5 && e5[t3]) try {
          return e5[t3](n4);
        } catch (r4) {
          Lr(r4);
        }
      };
      pr = (e5, t3) => e5 && e5.then ? e5.then(t3) : t3();
      hr = (e5, t3) => Pr(e5).$instanceValues$.get(t3);
      gr = (e5, t3, n4, r4) => {
        const a4 = Pr(e5), o3 = e5, i4 = a4.$instanceValues$.get(t3), l4 = a4.$flags$, s4 = o3;
        n4 = Rn(n4, r4.$members$[t3][0]);
        const u3 = Number.isNaN(i4) && Number.isNaN(n4), c4 = n4 !== i4 && !u3;
        if (c4) {
          if (a4.$instanceValues$.set(t3, n4), r4.$watchers$ && 128 & l4) {
            const e6 = r4.$watchers$[t3];
            e6 && e6.map((e7) => {
              try {
                s4[e7](n4, i4, t3);
              } catch (r5) {
                Lr(r5, o3);
              }
            });
          }
          if (2 === (18 & l4)) {
            if (s4.componentShouldUpdate && false === s4.componentShouldUpdate(n4, i4, t3)) return;
            lr(a4, false);
          }
        }
      };
      mr = (e5, t3, n4) => {
        if (t3.$members$) {
          e5.watchers && (t3.$watchers$ = e5.watchers);
          const n5 = Object.entries(t3.$members$), r4 = e5.prototype;
          n5.map(([e6, [n6]]) => {
            (31 & n6 || 32 & n6) && Object.defineProperty(r4, e6, { get() {
              return hr(this, e6);
            }, set(n7) {
              gr(this, e6, n7, t3);
            }, configurable: true, enumerable: true });
          });
          {
            const a4 = /* @__PURE__ */ new Map();
            r4.attributeChangedCallback = function(e6, t4, n6) {
              Dr.jmp(() => {
                const t5 = a4.get(e6);
                if (this.hasOwnProperty(t5)) n6 = this[t5], delete this[t5];
                else if (r4.hasOwnProperty(t5) && "number" === typeof this[t5] && this[t5] == n6) return;
                this[t5] = (null !== n6 || "boolean" !== typeof this[t5]) && n6;
              });
            }, e5.observedAttributes = n5.filter(([e6, t4]) => 15 & t4[0]).map(([e6, n6]) => {
              const r5 = n6[1] || e6;
              return a4.set(r5, e6), 512 & n6[0] && t3.$attrsToReflect$.push([e6, r5]), r5;
            });
          }
        }
        return e5;
      };
      vr = (e5, t3, n4, r4, a4) => i(void 0, null, function* () {
        if (0 === (32 & t3.$flags$) && (a4 = e5.constructor, t3.$flags$ |= 32, customElements.whenDefined(n4.$tagName$).then(() => t3.$flags$ |= 128), a4.style)) {
          let r6 = a4.style;
          "string" !== typeof r6 && (r6 = r6[t3.$modeName$ = Ln(e5)]);
          const o3 = jn(n4, t3.$modeName$);
          if (!Rr.has(o3)) {
            const e6 = mn("registerStyles", n4.$tagName$);
            Dn(o3, r6, !!(1 & n4.$flags$)), e6();
          }
        }
        t3.$ancestorComponent$;
        const r5 = () => lr(t3, true);
        r5();
      });
      yr = (e5) => {
      };
      br = (e5) => {
        if (0 === (1 & Dr.$flags$)) {
          const t3 = Pr(e5), n4 = t3.$cmpMeta$, r4 = mn("connectedCallback", n4.$tagName$);
          1 & t3.$flags$ ? (Er(e5, t3, n4.$listeners$), yr(t3.$lazyInstance$)) : (t3.$flags$ |= 1, 12 & n4.$flags$ && wr(e5), n4.$members$ && Object.entries(n4.$members$).map(([t4, [n5]]) => {
            if (31 & n5 && e5.hasOwnProperty(t4)) {
              const n6 = e5[t4];
              delete e5[t4], e5[t4] = n6;
            }
          }), vr(e5, t3, n4)), r4();
        }
      };
      wr = (e5) => {
        const t3 = e5["s-cr"] = zr.createComment("");
        t3["s-cn"] = true, e5.insertBefore(t3, e5.firstChild);
      };
      Sr = (e5) => {
        if (0 === (1 & Dr.$flags$)) {
          const t3 = Pr(e5);
          t3.$rmListeners$ && (t3.$rmListeners$.map((e6) => e6()), t3.$rmListeners$ = void 0);
        }
      };
      kr = (e5, t3) => {
        const n4 = { $flags$: t3[0], $tagName$: t3[1] };
        n4.$members$ = t3[2], n4.$listeners$ = t3[3], n4.$watchers$ = e5.$watchers$, n4.$attrsToReflect$ = [];
        const r4 = e5.prototype.connectedCallback, a4 = e5.prototype.disconnectedCallback;
        return Object.assign(e5.prototype, { __registerHost() {
          Tr(this, n4);
        }, connectedCallback() {
          br(this), r4 && r4.call(this);
        }, disconnectedCallback() {
          Sr(this), a4 && a4.call(this);
        }, __attachShadow() {
          this.attachShadow({ mode: "open", delegatesFocus: !!(16 & n4.$flags$) });
        } }), e5.is = n4.$tagName$, mr(e5, n4);
      };
      Er = (e5, t3, n4, r4) => {
        n4 && n4.map(([n5, r5, a4]) => {
          const o3 = $r(e5, n5), i4 = xr(t3, a4), l4 = _r(n5);
          Dr.ael(o3, r5, i4, l4), (t3.$rmListeners$ = t3.$rmListeners$ || []).push(() => Dr.rel(o3, r5, i4, l4));
        });
      };
      xr = (e5, t3) => (n4) => {
        try {
          on.lazyLoad || e5.$hostElement$[t3](n4);
        } catch (r4) {
          Lr(r4);
        }
      };
      $r = (e5, t3) => 4 & t3 ? zr : 8 & t3 ? Mr : 16 & t3 ? zr.body : e5;
      _r = (e5) => Fr ? { passive: 0 !== (1 & e5), capture: 0 !== (2 & e5) } : 0 !== (2 & e5);
      Cr = /* @__PURE__ */ new WeakMap();
      Pr = (e5) => Cr.get(e5);
      Tr = (e5, t3) => {
        const n4 = { $flags$: 0, $hostElement$: e5, $cmpMeta$: t3, $instanceValues$: /* @__PURE__ */ new Map() };
        return Er(e5, n4, t3.$listeners$), Cr.set(e5, n4);
      };
      Nr = (e5, t3) => t3 in e5;
      Lr = (e5, t3) => (0, console.error)(e5, t3);
      Rr = /* @__PURE__ */ new Map();
      Or = [];
      Mr = "undefined" !== typeof window ? window : {};
      zr = Mr.document || { head: {} };
      Ir = Mr.HTMLElement || class {
      };
      Dr = { $flags$: 0, $resourcesUrl$: "", jmp: (e5) => e5(), raf: (e5) => requestAnimationFrame(e5), ael: (e5, t3, n4, r4) => e5.addEventListener(t3, n4, r4), rel: (e5, t3, n4, r4) => e5.removeEventListener(t3, n4, r4), ce: (e5, t3) => new CustomEvent(e5, t3) };
      Fr = (() => {
        let e5 = false;
        try {
          zr.addEventListener("e", null, Object.defineProperty({}, "passive", { get() {
            e5 = true;
          } }));
        } catch (t3) {
        }
        return e5;
      })();
      Ar = (e5) => Promise.resolve(e5);
      jr = (() => {
        try {
          return new CSSStyleSheet(), "function" === typeof new CSSStyleSheet().replaceSync;
        } catch (e5) {
        }
        return false;
      })();
      Br = [];
      Ur = [];
      Hr = (e5, t3) => (n4) => {
        e5.push(n4), gn || (gn = true, t3 && 4 & Dr.$flags$ ? Qr(Vr) : Dr.raf(Vr));
      };
      Wr = (e5) => {
        for (let n4 = 0; n4 < e5.length; n4++) try {
          e5[n4](performance.now());
        } catch (t3) {
          Lr(t3);
        }
        e5.length = 0;
      };
      Vr = () => {
        Wr(Br), Wr(Ur), (gn = Br.length > 0) && Dr.raf(Vr);
      };
      Qr = (e5) => Ar().then(e5);
      qr = Hr(Ur, true);
      Kr = Yr(function(e5) {
        (function() {
          var t3 = {}.hasOwnProperty;
          function n4() {
            for (var e6 = "", t4 = 0; t4 < arguments.length; t4++) {
              var n5 = arguments[t4];
              n5 && (e6 = a4(e6, r4(n5)));
            }
            return e6;
          }
          function r4(e6) {
            if ("string" === typeof e6 || "number" === typeof e6) return e6;
            if ("object" !== typeof e6) return "";
            if (Array.isArray(e6)) return n4.apply(null, e6);
            if (e6.toString !== Object.prototype.toString && !e6.toString.toString().includes("[native code]")) return e6.toString();
            var r5 = "";
            for (var o3 in e6) t3.call(e6, o3) && e6[o3] && (r5 = a4(r5, o3));
            return r5;
          }
          function a4(e6, t4) {
            return t4 ? e6 ? e6 + " " + t4 : e6 + t4 : e6;
          }
          e5.exports ? (n4.default = n4, e5.exports = n4) : window.classNames = n4;
        })();
      });
      Xr = ".rmc-pull-to-refresh-content{transform-origin:0 0}.rmc-pull-to-refresh-content-wrapper{min-height:100%}.rmc-pull-to-refresh-transition{transition:transform .3s}@keyframes rmc-pull-to-refresh-indicator{50%{opacity:.2}to{opacity:1}}.rmc-pull-to-refresh-indicator{text-align:center;height:30px;line-height:10px}.rmc-pull-to-refresh-indicator>div{background-color:gray;border-radius:100%;width:6px;height:6px;margin:3px;animation:.5s linear infinite both rmc-pull-to-refresh-indicator;display:inline-block}.rmc-pull-to-refresh-indicator>div:nth-child(0){animation-delay:-.1s!important}.rmc-pull-to-refresh-indicator>div:first-child{animation-delay:-.2s!important}.rmc-pull-to-refresh-indicator>div:nth-child(2){animation-delay:-.3s!important}.rmc-pull-to-refresh-down .rmc-pull-to-refresh-indicator{margin-top:-25px}";
      Jr = "undefined" !== typeof navigator && /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
      ea = { activate: "release", deactivate: "pull", release: "loading", finish: "finish" };
      ta = false;
      try {
        const e5 = Object.defineProperty({}, "passive", { get() {
          ta = true;
        } });
        window.addEventListener("cancel", () => ({}), e5);
      } catch (ub) {
      }
      na = !!ta && { passive: false };
      ra = kr(class extends Ir {
        constructor() {
          super(), this.__registerHost(), this.onRefresh = Mn(this, "refresh", 7), this._ScreenY = 0, this._startScreenY = 0, this._lastScreenY = 0, this._isMounted = false, this.triggerPullDownRefresh = (e5) => {
            !this.dragOnEdge && this._isMounted && (e5 ? (this._lastScreenY = this.distanceToRefresh + 1, this.currSt = "release", this.setContentStyle(this._lastScreenY)) : (this.currSt = "finish", this.reset()));
          }, this.init = () => {
            const e5 = this.scrollContainer, t3 = this.el.querySelector(".rmc-pull-to-refresh-content");
            this.el.appendChild = null === t3 || void 0 === t3 ? void 0 : t3.appendChild.bind(t3), this.el.insertBefore = null === t3 || void 0 === t3 ? void 0 : t3.insertBefore.bind(t3), this.el.replaceChild = null === t3 || void 0 === t3 ? void 0 : t3.replaceChild.bind(t3), this.el.removeChild = null === t3 || void 0 === t3 ? void 0 : t3.removeChild.bind(t3), this._to = { touchstart: this.onTouchStart.bind(this, e5), touchmove: this.onTouchMove.bind(this, e5), touchend: this.onTouchEnd.bind(this, e5), touchcancel: this.onTouchEnd.bind(this, e5) }, Object.keys(this._to).forEach((t4) => {
              e5.addEventListener(t4, this._to[t4], na);
            });
          }, this.destroy = () => {
            if (!this._to) return;
            const e5 = this.scrollContainer;
            Object.keys(this._to).forEach((t3) => {
              e5.removeEventListener(t3, this._to[t3]);
            });
          }, this.onTouchStart = (e5, t3) => {
            this._ScreenY = this._startScreenY = t3.touches[0].screenY, this._lastScreenY = this._lastScreenY || 0;
          }, this.isEdge = (e5) => {
            const t3 = this.scrollContainer;
            if (t3 && t3 === document.body) {
              const e6 = document.scrollingElement ? document.scrollingElement : document.body;
              return e6.scrollTop <= 0;
            }
            return e5.scrollTop <= 0;
          }, this.damp = (e5) => {
            if (Math.abs(this._lastScreenY) > this.damping) return 0;
            const t3 = Math.abs(this._ScreenY - this._startScreenY) / window.screen.height;
            return e5 *= 0.6 * (1 - t3), e5;
          }, this.onTouchMove = (e5, t3) => {
            const n4 = t3.touches[0].screenY;
            if (!(this._startScreenY > n4) && this.isEdge(e5)) {
              this.dragOnEdge || (this._ScreenY = this._startScreenY = t3.touches[0].screenY, this.dragOnEdge = true), t3.cancelable && t3.preventDefault();
              const e6 = Math.round(n4 - this._ScreenY);
              this._ScreenY = n4, this._lastScreenY += this.damp(e6), this.setContentStyle(this._lastScreenY), Math.abs(this._lastScreenY) < this.distanceToRefresh ? "deactivate" !== this.currSt && (this.currSt = "deactivate") : "deactivate" === this.currSt && (this.currSt = "activate"), Jr && t3.changedTouches[0].clientY < 0 && this.onTouchEnd();
            }
          }, this.onTouchEnd = () => {
            this.dragOnEdge && (this.dragOnEdge = false), "activate" === this.currSt ? (this.currSt = "release", this.onRefresh.emit(this), this._lastScreenY = this.distanceToRefresh + 1, this.setContentStyle(this._lastScreenY)) : "release" === this.currSt ? (this._lastScreenY = this.distanceToRefresh + 1, this.setContentStyle(this._lastScreenY)) : this.reset();
          }, this.reset = () => {
            this._lastScreenY = 0, this.setContentStyle(0);
          }, this.setContentStyle = (e5) => {
            this.contentRef && Zr(this.contentRef.style, e5 ? `translate3d(0px,${e5}px,0)` : "");
          }, this.prefixCls = "rmc-pull-to-refresh", this.distanceToRefresh = 50, this.damping = 100, this.indicator = ea, this.currSt = "deactivate", this.dragOnEdge = false;
        }
        get scrollContainer() {
          return this.el.parentElement || this.el.closest(".taro_page_stationed") || document.querySelector(".taro_page_stationed") || document.querySelector(".taro_page") || document.querySelector(".taro_router") || document.querySelector(".taro-tabbar__panel") || document.body;
        }
        statusChange() {
          var e5, t3, n4, r4;
          const a4 = this.scrollContainer;
          switch (this.currSt) {
            case "release":
              null === (t3 = null === (e5 = null === a4 || void 0 === a4 ? void 0 : a4.__page) || void 0 === e5 ? void 0 : e5.onPullDownRefresh) || void 0 === t3 || t3.call(e5);
              break;
            case "deactivate":
              null === (r4 = null === (n4 = null === a4 || void 0 === a4 ? void 0 : a4.__page) || void 0 === n4 ? void 0 : n4.onPullIntercept) || void 0 === r4 || r4.call(n4);
          }
        }
        disconnectedCallback() {
          this.destroy();
        }
        componentDidLoad() {
          this.init(), this._isMounted = true, di.eventCenter.on("__taroStartPullDownRefresh", ({ successHandler: e5, errorHandler: t3 }) => {
            try {
              this.triggerPullDownRefresh(true), e5({ errMsg: "startPullDownRefresh: ok" });
            } catch (ub) {
              t3({ errMsg: "startPullDownRefresh: fail" });
            }
          }), di.eventCenter.on("__taroStopPullDownRefresh", ({ successHandler: e5, errorHandler: t3 }) => {
            setTimeout(() => {
              try {
                this.triggerPullDownRefresh(false), e5({ errMsg: "stopPullDownRefresh: ok" });
              } catch (ub) {
                t3({ errMsg: "stopPullDownRefresh: fail" });
              }
            }, 0);
          });
        }
        render() {
          const e5 = (e6) => {
            const { currSt: t3, dragOnEdge: n4, prefixCls: r4 } = this, a4 = Kr(e6, !n4 && `${r4}-transition`), o3 = "activate" === t3 || "release" === t3;
            return xn("div", { class: `${r4}-content-wrapper` }, xn("div", { class: a4, ref: (e7) => {
              this.contentRef = e7;
            } }, o3 && xn("div", { class: `${r4}-indicator` }, xn("div", null), xn("div", null), xn("div", null)), xn("slot", null)));
          };
          return this.scrollContainer ? e5(`${this.prefixCls}-content ${this.prefixCls}-down`) : xn(_n, { class: Kr(this.prefixCls, `${this.prefixCls}-down`) }, e5(`${this.prefixCls}-content`));
        }
        get el() {
          return this;
        }
        static get watchers() {
          return { currSt: ["statusChange"] };
        }
        static get style() {
          return Xr;
        }
      }, [4, "taro-pull-to-refresh-core", { prefixCls: [1, "prefix-cls"], distanceToRefresh: [2, "distance-to-refresh"], damping: [2], indicator: [16], currSt: [32], dragOnEdge: [32] }]);
      oa = aa;
      (function(e5) {
        e5["Pop"] = "POP", e5["Push"] = "PUSH", e5["Replace"] = "REPLACE";
      })(la || (la = {}));
      sa = function(e5) {
        return e5;
      };
      ua = "beforeunload";
      ca = "hashchange";
      da = "popstate";
      ya = class {
        static set config(e5) {
          this.__config = e5;
        }
        static get config() {
          return this.__config;
        }
        static get pages() {
          return this.config.pages || [];
        }
        static get router() {
          return this.config.router || {};
        }
        static get mode() {
          return this.router.mode || "hash";
        }
        static get customRoutes() {
          return this.router.customRoutes || {};
        }
        static isPage(e5 = "") {
          return -1 !== this.pages.findIndex((t3) => Pe(t3) === e5);
        }
      };
      wa = "/";
      Ea = class {
        constructor() {
          this.stacks = [], this.backDelta = 0, this.tabs = {}, this.methodName = "";
        }
        set delta(e5) {
          e5 > 0 ? this.backDelta = e5 : this.backDelta > 0 ? --this.backDelta : this.backDelta = 0;
        }
        get delta() {
          return this.backDelta;
        }
        set method(e5) {
          this.methodName = e5;
        }
        get method() {
          return this.methodName;
        }
        get length() {
          return this.stacks.length;
        }
        get last() {
          return this.stacks[this.length - 1];
        }
        get() {
          return this.stacks;
        }
        getItem(e5) {
          return this.stacks[e5];
        }
        getLastIndex(e5, t3 = 1) {
          const n4 = [...this.stacks].reverse();
          return n4.findIndex((n5, r4) => {
            var a4;
            return r4 >= t3 && (null === (a4 = n5.path) || void 0 === a4 ? void 0 : a4.replace(/\?.*/g, "")) === e5;
          });
        }
        getDelta(e5) {
          if (this.backDelta >= 1) return this.backDelta;
          const t3 = this.getLastIndex(e5);
          return t3 > 0 ? t3 : 1;
        }
        getPrevIndex(e5, t3 = 1) {
          const n4 = this.getLastIndex(e5, t3);
          return n4 < 0 ? -1 : this.length - 1 - n4;
        }
        pop() {
          return this.stacks.pop();
        }
        push(e5) {
          return this.stacks.push(e5);
        }
        getTabs() {
          return this.tabs;
        }
        pushTab(e5) {
          this.tabs[e5] = this.last, this.pop();
        }
        popTab(e5) {
          this.push(this.tabs[e5]), delete this.tabs[e5];
        }
        removeTab(e5) {
          delete this.tabs[e5];
        }
      };
      xa = new Ea();
      $a = class {
        constructor() {
          this.conf = [], this.getConfig = (e5 = "") => {
            const t3 = this.conf.filter((t4) => t4.includes(e5));
            return t3[0];
          }, this.getOrigin = (e5 = "") => {
            var t3;
            return (null === (t3 = this.getConfig(e5)) || void 0 === t3 ? void 0 : t3[0]) || e5;
          }, this.getAlias = (e5 = "") => {
            var t3;
            return (null === (t3 = this.getConfig(e5)) || void 0 === t3 ? void 0 : t3[1]) || e5;
          }, this.getAll = (e5 = "") => this.conf.filter((t3) => t3.includes(e5)).reduceRight((e6, t3) => (e6.unshift(t3[1]), e6), []);
        }
        set(e5 = {}) {
          for (let t3 in e5) {
            const n4 = e5[t3];
            t3 = Pe(t3), "string" === typeof n4 ? this.conf.push([t3, Pe(n4)]) : (null === n4 || void 0 === n4 ? void 0 : n4.length) > 0 && this.conf.push(...n4.map((e6) => [t3, Pe(e6)]));
          }
        }
      };
      _a = new $a();
      Ca = $.routeChannel;
      Ia = "%[a-f0-9]{2}";
      Da = new RegExp(`(${Ia})+`, "gi");
      Fa = /^[a-f\d]{2}$/i;
      qa = (e5) => null === e5 || void 0 === e5;
      Ya = (e5) => encodeURIComponent(e5).replaceAll(/[!'()*]/g, (e6) => `%${e6.charCodeAt(0).toString(16).toUpperCase()}`);
      Ga = Symbol("encodeFragmentIdentifier");
      ho = Object.freeze(Object.defineProperty({ __proto__: null, exclude: po, extract: io, parse: lo, parseUrl: uo, pick: fo, stringify: so, stringifyUrl: co }, Symbol.toStringTag, { value: "Module" }));
      vo = /* @__PURE__ */ new Map();
      wo = he();
      wo();
      Io = function() {
        function e5(e6, t4) {
          if (!e6 || "object" !== typeof e6) throw new TypeError("Invalid routes");
          this.options = Object.assign({ decode: Ro }, t4), this.baseUrl = this.options.baseUrl || "", this.root = Array.isArray(e6) ? { path: "", children: e6, parent: null } : e6, this.root.parent = null;
        }
        var t3 = e5.prototype;
        return t3.resolve = function(e6) {
          var t4, n4, r4 = this, a4 = Object.assign({ router: this }, this.options.context, "string" === typeof e6 ? { pathname: e6 } : e6), o3 = Oo(this.root, this.baseUrl, this.options, a4.pathname.substr(this.baseUrl.length)), i4 = this.options.resolveRoute || Mo, l4 = a4;
          function s4(e7, r5, u3) {
            void 0 === r5 && (r5 = !t4.done && t4.value.route);
            var c4 = null === u3 && !t4.done && t4.value.route;
            if (t4 = n4 || o3.next(c4), n4 = null, !e7 && (t4.done || !zo(r5, t4.value.route))) return n4 = t4, Promise.resolve(null);
            if (t4.done) {
              var d3 = new Error("Route not found");
              return d3.status = 404, Promise.reject(d3);
            }
            return l4 = Object.assign({}, a4, t4.value), Promise.resolve(i4(l4, t4.value.params)).then(function(t5) {
              return null !== t5 && void 0 !== t5 ? t5 : s4(e7, r5, t5);
            });
          }
          return a4["next"] = s4, Promise.resolve().then(function() {
            return s4(true, r4.root);
          })["catch"](function(e7) {
            if (r4.options.errorHandler) return r4.options.errorHandler(e7, l4);
            throw e7;
          });
        }, e5;
      }();
      Do = class {
        constructor(e5) {
          this.isLoadDdEntry = false, this.cache = {}, this.pageContext = e5, this.init(), ne.on("__taroH5SetNavigationBarTitle", (e6) => {
            this.setTitle(e6);
          }), ne.on("__taroH5setNavigationBarLoading", (e6) => {
            this.setNavigationLoading(e6);
          }), ne.on("__taroH5setNavigationBarColor", ({ backgroundColor: e6, frontColor: t3 }) => {
            "string" === typeof e6 && this.setNavigationBarBackground(e6), "string" === typeof t3 && this.setNavigationBarTextStyle(t3);
          });
        }
        toHomeFn() {
          Ma({ url: this.pageContext.originHomePage });
        }
        backFn() {
          Ra();
        }
        get homeBtnElement() {
          var e5;
          return this.navigationBarElement ? null === (e5 = this.navigationBarElement.getElementsByClassName("taro-navigation-bar-home")) || void 0 === e5 ? void 0 : e5[0] : null;
        }
        get backBtnElement() {
          var e5;
          return this.navigationBarElement ? null === (e5 = this.navigationBarElement.getElementsByClassName("taro-navigation-bar-back")) || void 0 === e5 ? void 0 : e5[0] : null;
        }
        get titleElement() {
          var e5;
          return this.navigationBarElement ? null === (e5 = this.navigationBarElement.getElementsByClassName("taro-navigation-bar-title")) || void 0 === e5 ? void 0 : e5[0] : null;
        }
        get loadingElement() {
          return this.navigationBarElement ? this.navigationBarElement.getElementsByClassName("taro-navigation-bar-loading")[0] : null;
        }
        init() {
          var e5, t3;
          this.setNavigationBarElement(), this.navigationBarElement && (null === (e5 = this.homeBtnElement) || void 0 === e5 || e5.addEventListener("click", this.toHomeFn.bind(this)), null === (t3 = this.backBtnElement) || void 0 === t3 || t3.addEventListener("click", this.backFn.bind(this)));
        }
        setNavigationBarElement() {
          this.navigationBarElement = document.getElementById("taro-navigation-bar");
        }
        load() {
          this.setCacheValue(), this.setTitle(), this.setNavigationBarVisible(), this.setFnBtnState(), this.setNavigationBarBackground(), this.setNavigationBarTextStyle(), this.setNavigationLoading();
        }
        setCacheValue() {
          const e5 = this.pageContext.originPathname;
          "object" !== typeof this.cache[e5] && (this.cache[e5] = {});
        }
        setFnBtnState() {
          const e5 = this.pageContext.currentPage;
          this.pageContext.isTabBar(e5) || this.pageContext.homePage === e5 ? this.fnBtnToggleToNone() : xa.length > 1 ? this.fnBtnToggleToBack() : this.fnBtnToggleToHome();
        }
        shiftLoadingState(e5) {
          this.loadingElement && (e5 ? this.loadingElement.classList.add("taro-navigation-bar-loading-show") : this.loadingElement.classList.remove("taro-navigation-bar-loading-show"));
        }
        setNavigationLoading(e5) {
          var t3;
          if (!this.navigationBarElement) return;
          const n4 = this.pageContext.originPathname;
          let r4;
          if ("boolean" === typeof e5) r4 = e5, this.cache[n4] && (this.cache[n4].loading = r4);
          else {
            const e6 = null === (t3 = this.cache[n4]) || void 0 === t3 ? void 0 : t3.loading;
            "boolean" === typeof e6 ? r4 = e6 : (r4 = false, this.cache[n4] && (this.cache[n4].loading = r4));
          }
          this.shiftLoadingState(r4);
        }
        setNavigationBarBackground(e5) {
          var t3, n4, r4;
          if (!this.navigationBarElement) return;
          const a4 = this.pageContext.originPathname;
          let o3;
          if ("string" === typeof e5) o3 = e5, this.cache[a4] && (this.cache[a4].backgroundColor = o3);
          else {
            const e6 = null === (t3 = this.cache[a4]) || void 0 === t3 ? void 0 : t3.backgroundColor;
            "string" === typeof e6 ? o3 = e6 : (o3 = (null === (r4 = null === (n4 = this.pageContext.config) || void 0 === n4 ? void 0 : n4.window) || void 0 === r4 ? void 0 : r4.navigationBarBackgroundColor) || "#000000", this.cache[a4] && (this.cache[a4].backgroundColor = o3));
          }
          this.navigationBarElement.style.background = o3;
        }
        setNavigationBarTextStyle(e5) {
          var t3, n4, r4;
          if (!this.navigationBarElement) return;
          const a4 = this.pageContext.originPathname;
          let o3;
          if ("string" === typeof e5) o3 = e5, this.cache[a4] && (this.cache[a4].fontColor = o3);
          else {
            const e6 = null === (t3 = this.cache[a4]) || void 0 === t3 ? void 0 : t3.fontColor;
            "string" === typeof e6 ? o3 = e6 : (o3 = (null === (r4 = null === (n4 = this.pageContext.config) || void 0 === n4 ? void 0 : n4.window) || void 0 === r4 ? void 0 : r4.navigationBarTextStyle) || "white", this.cache[a4] && (this.cache[a4].fontColor = o3));
          }
          this.navigationBarElement.style.color = o3;
        }
        setTitle(e5) {
          var t3, n4, r4;
          const a4 = this.pageContext.originPathname;
          let o3;
          if ("string" === typeof e5) o3 = e5, this.cache[a4] && (this.cache[a4].title = o3);
          else {
            const e6 = null === (t3 = this.cache[a4]) || void 0 === t3 ? void 0 : t3.title;
            "string" === typeof e6 ? o3 = e6 : (o3 = null !== (r4 = null === (n4 = this.pageContext.pageConfig) || void 0 === n4 ? void 0 : n4.navigationBarTitleText) && void 0 !== r4 ? r4 : document.title, this.cache[a4] && (this.cache[a4].title = o3));
          }
          document.title = o3, this.titleElement && (this.titleElement.innerHTML = o3);
        }
        fnBtnToggleToHome() {
          this.navigationBarElement && (this.navigationBarElement.classList.add("taro-navigation-bar-home-icon"), this.navigationBarElement.classList.remove("taro-navigation-bar-back-icon"));
        }
        fnBtnToggleToBack() {
          this.navigationBarElement && (this.navigationBarElement.classList.remove("taro-navigation-bar-home-icon"), this.navigationBarElement.classList.add("taro-navigation-bar-back-icon"));
        }
        fnBtnToggleToNone() {
          this.navigationBarElement && (this.navigationBarElement.classList.remove("taro-navigation-bar-home-icon"), this.navigationBarElement.classList.remove("taro-navigation-bar-back-icon"));
        }
        setNavigationBarVisible(e5) {
          var t3, n4;
          if (!this.navigationBarElement) return;
          let r4;
          "boolean" === typeof e5 ? r4 = e5 : (r4 = null === (t3 = this.pageContext.config.window) || void 0 === t3 ? void 0 : t3.navigationStyle, "string" === typeof (null === (n4 = this.pageContext.pageConfig) || void 0 === n4 ? void 0 : n4.navigationStyle) && (r4 = this.pageContext.pageConfig.navigationStyle)), "default" === r4 ? (this.navigationBarElement.classList.add("taro-navigation-bar-show"), this.navigationBarElement.classList.remove("taro-navigation-bar-hide")) : (this.navigationBarElement.classList.add("taro-navigation-bar-hide"), this.navigationBarElement.classList.remove("taro-navigation-bar-show"));
        }
      };
      Fo = class {
        constructor(e5, t3) {
          this.history = t3, this.defaultAnimation = { duration: 300, delay: 50 }, this.config = e5, this.homePage = Re(this.routes[0].path, this.basename, this.customRoutes, this.config.entryPagePath), this.originHomePage = this.config.entryPagePath || this.routes[0].path || this.basename, this.mount(), this.navigationBarHandler = new Do(this);
        }
        get currentPage() {
          const e5 = Oe(this.routerMode, this.basename);
          return "/" === e5 ? this.homePage : e5;
        }
        get appId() {
          return this.config.appId || "app";
        }
        get router() {
          return this.config.router || {};
        }
        get routerMode() {
          return this.router.mode || "hash";
        }
        get customRoutes() {
          return this.router.customRoutes || {};
        }
        get routes() {
          return this.config.routes || [];
        }
        get tabBarList() {
          var e5;
          return (null === (e5 = this.config.tabBar) || void 0 === e5 ? void 0 : e5.list) || [];
        }
        get PullDownRefresh() {
          return this.config.PullDownRefresh;
        }
        get animation() {
          var e5, t3;
          return null !== (t3 = null === (e5 = this.config) || void 0 === e5 ? void 0 : e5.animation) && void 0 !== t3 ? t3 : this.defaultAnimation;
        }
        get animationDelay() {
          var e5;
          return ("object" === typeof this.animation ? this.animation.delay : this.animation ? null === (e5 = this.defaultAnimation) || void 0 === e5 ? void 0 : e5.delay : 0) || 0;
        }
        get animationDuration() {
          var e5;
          return ("object" === typeof this.animation ? this.animation.duration : this.animation ? null === (e5 = this.defaultAnimation) || void 0 === e5 ? void 0 : e5.duration : 0) || 0;
        }
        set pathname(e5) {
          this.router.pathname = e5;
        }
        get pathname() {
          return this.router.pathname;
        }
        get originPathname() {
          return _a.getOrigin(Pe(Ne(this.pathname, this.basename)));
        }
        get basename() {
          return this.router.basename || "";
        }
        get pageConfig() {
          const e5 = Pe(this.homePage);
          return this.routes.find((t3) => {
            const n4 = Pe(t3.path);
            return [n4, e5].includes(this.originPathname);
          });
        }
        isTabBar(e5) {
          var t3;
          const n4 = Pe(Ne(e5, this.basename)).split("?")[0], r4 = (null === (t3 = Object.entries(this.customRoutes).find(([, e6]) => "string" === typeof e6 ? e6 === n4 : (null === e6 || void 0 === e6 ? void 0 : e6.length) > 0 && e6.includes(n4))) || void 0 === t3 ? void 0 : t3[0]) || n4;
          return !!r4 && this.tabBarList.some((e6) => Pe(Le(e6.pagePath)) === r4);
        }
        isDefaultNavigationStyle() {
          var e5, t3;
          let n4 = null === (e5 = this.config.window) || void 0 === e5 ? void 0 : e5.navigationStyle;
          return "string" === typeof (null === (t3 = this.pageConfig) || void 0 === t3 ? void 0 : t3.navigationStyle) && (n4 = this.pageConfig.navigationStyle), "custom" !== n4;
        }
        isSamePage(e5) {
          const t3 = Ne(this.pathname, this.basename), n4 = Ne(null === e5 || void 0 === e5 ? void 0 : e5.path, this.basename);
          return n4.startsWith(t3 + "?");
        }
        get search() {
          let e5 = "?";
          if ("hash" === this.routerMode) {
            const t3 = location.hash.indexOf("?");
            t3 > -1 && (e5 = location.hash.slice(t3));
          } else e5 = location.search;
          return e5.substring(1);
        }
        get usingWindowScroll() {
          var e5;
          let t3 = false;
          "boolean" === typeof (null === (e5 = this.pageConfig) || void 0 === e5 ? void 0 : e5.usingWindowScroll) && (t3 = this.pageConfig.usingWindowScroll);
          const n4 = window;
          return n4.__taroAppConfig || (n4.__taroAppConfig = {}), n4.__taroAppConfig.usingWindowScroll = t3, t3;
        }
        getQuery(e5 = "", t3 = "", n4 = {}) {
          t3 = t3 ? `${t3}&${this.search}` : this.search;
          const r4 = t3 ? ho.parse(t3, { decode: false }) : {};
          return r4.stamp = e5, Object.assign(Object.assign({}, r4), n4);
        }
        mount() {
          Sa(this.history, this.basename), this.pathname = ba.location.pathname, this.animation && Xt(this.animationDuration), Zt(this.tabBarList.length > 1, this.usingWindowScroll, this.router.enhanceAnimation);
        }
        onReady(e5, t3 = true) {
          var n4;
          const r4 = this.getPageContainer(e5);
          if (r4 && !(null === r4 || void 0 === r4 ? void 0 : r4["__isReady"])) {
            const a4 = r4.firstElementChild, o3 = null === a4 || void 0 === a4 ? void 0 : a4["componentOnReady"];
            o3 ? null === o3 || void 0 === o3 || o3().then(() => {
              de(() => {
                var t4;
                null === (t4 = e5.onReady) || void 0 === t4 || t4.call(e5), r4["__isReady"] = true;
              });
            }) : (null === (n4 = e5.onReady) || void 0 === n4 || n4.call(e5), r4["__isReady"] = true), t3 && (r4["__page"] = e5);
          }
        }
        load(e5, t3 = {}, n4, r4 = 0) {
          var a4, o3;
          if (!e5) return;
          xa.push(e5);
          const i4 = this.getQuery(n4, "", e5.options);
          let l4 = this.getPageContainer(e5);
          l4 ? (l4.classList.remove("taro_page_shade"), this.isTabBar(this.pathname) && l4.classList.add("taro_tabbar_page"), this.isDefaultNavigationStyle() && l4.classList.add("taro_navigation_page"), this.addAnimation(l4, 0 === r4), null === (a4 = e5.onShow) || void 0 === a4 || a4.call(e5), this.navigationBarHandler.load(), this.bindPageEvents(e5, t3), this.triggerRouterChange()) : null === (o3 = e5.onLoad) || void 0 === o3 || o3.call(e5, i4, () => {
            var n5;
            l4 = this.getPageContainer(e5), this.isTabBar(this.pathname) && (null === l4 || void 0 === l4 || l4.classList.add("taro_tabbar_page")), this.isDefaultNavigationStyle() && (null === l4 || void 0 === l4 || l4.classList.add("taro_navigation_page")), this.addAnimation(l4, 0 === r4), null === (n5 = e5.onShow) || void 0 === n5 || n5.call(e5), this.navigationBarHandler.load(), this.onReady(e5, true), this.bindPageEvents(e5, t3), this.triggerRouterChange();
          });
        }
        unload(e5, t3 = 1, n4 = false) {
          var r4, a4, o3;
          if (e5) {
            if (xa.delta = --t3, xa.pop(), this.animation && n4) {
              this.unloadTimer && (clearTimeout(this.unloadTimer), null === (a4 = null === (r4 = this.lastUnloadPage) || void 0 === r4 ? void 0 : r4.onUnload) || void 0 === a4 || a4.call(r4), this.unloadTimer = null), this.lastUnloadPage = e5;
              const t4 = this.getPageContainer(e5);
              null === t4 || void 0 === t4 || t4.classList.remove("taro_page_stationed"), null === t4 || void 0 === t4 || t4.classList.remove("taro_page_show"), t4 && (t4.style.zIndex = "1"), this.unloadTimer = setTimeout(() => {
                var e6, t5;
                this.unloadTimer = null, null === (t5 = null === (e6 = this.lastUnloadPage) || void 0 === e6 ? void 0 : e6.onUnload) || void 0 === t5 || t5.call(e6), ne.trigger("__taroPageOnShowAfterDestroyed");
              }, this.animationDuration);
            } else {
              const t4 = this.getPageContainer(e5);
              null === t4 || void 0 === t4 || t4.classList.remove("taro_page_stationed"), null === t4 || void 0 === t4 || t4.classList.remove("taro_page_show"), null === (o3 = null === e5 || void 0 === e5 ? void 0 : e5.onUnload) || void 0 === o3 || o3.call(e5), setTimeout(() => {
                ne.trigger("__taroPageOnShowAfterDestroyed");
              }, 0);
            }
            t3 >= 1 && this.unload(xa.last, t3);
          }
        }
        show(e5, t3 = {}, n4 = 0) {
          var r4, a4;
          if (!e5) return;
          const o3 = this.getQuery(e5["$taroParams"]["stamp"], "", e5.options);
          let i4 = this.getPageContainer(e5);
          i4 ? (i4.classList.remove("taro_page_shade"), this.addAnimation(i4, 0 === n4), null === (r4 = e5.onShow) || void 0 === r4 || r4.call(e5), this.navigationBarHandler.load(), this.bindPageEvents(e5, t3), this.triggerRouterChange()) : null === (a4 = e5.onLoad) || void 0 === a4 || a4.call(e5, o3, () => {
            var r5;
            i4 = this.getPageContainer(e5), this.addAnimation(i4, 0 === n4), null === (r5 = e5.onShow) || void 0 === r5 || r5.call(e5), this.navigationBarHandler.load(), this.onReady(e5, false), this.bindPageEvents(e5, t3), this.triggerRouterChange();
          });
        }
        hide(e5, t3 = false) {
          var n4, r4, a4, o3, i4, l4, s4, u3;
          if (!e5) return;
          const c4 = this.getPageContainer(e5);
          c4 ? t3 ? (this.hideTimer && (clearTimeout(this.hideTimer), this.hideTimer = null, null === (a4 = null === (r4 = null === (n4 = this.lastHidePage) || void 0 === n4 ? void 0 : n4.classList) || void 0 === r4 ? void 0 : r4.add) || void 0 === a4 || a4.call(r4, "taro_page_shade")), this.lastHidePage = c4, this.hideTimer = setTimeout(() => {
            this.hideTimer = null, c4.classList.add("taro_page_shade");
          }, this.animationDuration + this.animationDelay), null === (o3 = e5.onHide) || void 0 === o3 || o3.call(e5)) : (this.hideTimer && (clearTimeout(this.hideTimer), this.hideTimer = null, null === (s4 = null === (l4 = null === (i4 = this.lastHidePage) || void 0 === i4 ? void 0 : i4.classList) || void 0 === l4 ? void 0 : l4.add) || void 0 === s4 || s4.call(l4, "taro_page_shade")), null === (u3 = e5.onHide) || void 0 === u3 || u3.call(e5), c4.classList.add("taro_page_shade"), this.lastHidePage = c4) : setTimeout(() => this.hide(e5), 0);
        }
        addAnimation(e5, t3 = false) {
          e5 && (this.animation && !t3 ? setTimeout(() => {
            e5.classList.add("taro_page_show"), setTimeout(() => {
              e5.classList.add("taro_page_stationed");
            }, this.animationDuration);
          }, this.animationDelay) : (e5.classList.add("taro_page_show"), e5.classList.add("taro_page_stationed")));
        }
        getPageContainer(e5) {
          var t3;
          const n4 = e5 ? null === e5 || void 0 === e5 ? void 0 : e5.path : null === (t3 = ie.page) || void 0 === t3 ? void 0 : t3.path, r4 = null === n4 || void 0 === n4 ? void 0 : n4.replace(/([^a-z0-9\u00a0-\uffff_-])/gi, "\\$1");
          if (e5) return document.querySelector(`.taro_page#${r4}`);
          const a4 = r4 ? document.querySelector(`.taro_page#${r4}`) : document.querySelector(".taro_page") || document.querySelector(".taro_router");
          return a4;
        }
        getScrollingElement(e5) {
          return this.usingWindowScroll ? window : this.getPageContainer(e5) || window;
        }
        bindPageEvents(e5, t3 = {}) {
          var n4;
          const r4 = this.getScrollingElement(e5), a4 = t3.onReachBottomDistance || (null === (n4 = this.config.window) || void 0 === n4 ? void 0 : n4.onReachBottomDistance) || 50;
          yo(e5, r4, a4), mo(e5);
        }
        triggerRouterChange() {
          setTimeout(() => {
            ne.trigger("__afterTaroRouterChange", { toLocation: { path: this.pathname } });
          }, 0);
        }
      };
      Ao = he();
      jo = Ao();
      Ho = class {
        constructor({ name: e5, success: t3, fail: n4, complete: r4 }) {
          this.isHandlerError = false, this.methodName = e5, this.__success = t3, this.__fail = n4, this.__complete = r4, this.isHandlerError = P(this.__complete) || P(this.__fail);
        }
        success(e5 = {}, t3 = {}) {
          e5.errMsg || (e5.errMsg = `${this.methodName}:ok`), P(this.__success) && this.__success(e5), P(this.__complete) && this.__complete(e5);
          const { resolve: n4 = Promise.resolve.bind(Promise) } = t3;
          return n4(e5);
        }
        fail(e5 = {}, t3 = {}) {
          e5.errMsg ? e5.errMsg = `${this.methodName}:fail ${e5.errMsg}` : e5.errMsg = `${this.methodName}:fail`, P(this.__fail) && this.__fail(e5), P(this.__complete) && this.__complete(e5);
          const { resolve: n4 = Promise.resolve.bind(Promise), reject: r4 = Promise.reject.bind(Promise) } = t3;
          return this.isHandlerError ? n4(e5) : r4(e5);
        }
      };
      Qo = function() {
        return Kt.getCurrentInstance().app;
      };
      qo = Kt.getCurrentInstance;
      Yo = (e5, t3) => (t3.forEach((t4) => {
        Object.defineProperty(e5, t4, { get: () => Wo(t4) });
      }), e5);
      Go = ["bounce", "ease", "elastic", "linear", "quad", "cubic", "poly", "bezier", "circle", "sin", "exp", "in", "out", "inOut"];
      Ko = ["cancelAnimation", "derived", "shared", "decay", "spring", "timing", "delay", "repeat", "sequence", "runOnJS", "runOnUI"];
      Xo = Yo({}, Ko);
      Xo.Easing = Yo({}, Go), Xo.scrollViewContext = Yo({}, ["scrollTo"]);
      Zo = Kt.nextTick;
      Jo = { addRouteBuilder: Wo("addRouteBuilder"), getRouteContext: Wo("getRouteContext"), removeRouteBuilder: Wo("removeRouteBuilder") };
      ({ Behavior: ei, getEnv: ti, ENV_TYPE: ni, Link: ri, interceptors: ai, interceptorify: oi, Current: ii, options: li, eventCenter: si, Events: ui, preload: ci } = Kt);
      di = { Behavior: ei, getEnv: ti, ENV_TYPE: ni, Link: ri, interceptors: ai, interceptorify: oi, Current: ii, getCurrentInstance: qo, options: li, nextTick: Zo, eventCenter: si, Events: ui, preload: ci, history: ba, navigateBack: Ra, navigateTo: Na, reLaunch: Ma, redirectTo: La, getCurrentPages: za, switchTab: Oa, router: Jo, worklet: Xo };
      fi = Vo("requirePlugin");
      hi = 750;
      gi = { 640: 1.17, 750: 1, 828: 0.905 };
      mi = 20;
      vi = 5;
      yi = "rem";
      bi = function({ designWidth: e5 = hi, deviceRatio: t3 = gi, baseFontSize: n4 = mi, unitPrecision: r4 = vi, targetUnit: a4 = yi }) {
        const o3 = pi.call(this);
        o3.designWidth = e5, o3.deviceRatio = t3, o3.baseFontSize = n4, o3.targetUnit = a4, o3.unitPrecision = r4;
      };
      wi = function(e5 = 0, t3) {
        const n4 = pi.call(this), r4 = n4.baseFontSize || mi, a4 = n4.deviceRatio || gi, o3 = t3 || ((e6 = 0) => P(n4.designWidth) ? n4.designWidth(e6) : n4.designWidth)(e5);
        if (!(o3 in a4)) throw new Error(`deviceRatio \u914D\u7F6E\u4E2D\u4E0D\u5B58\u5728 ${o3} \u7684\u8BBE\u7F6E\uFF01`);
        const i4 = n4.targetUnit || yi, l4 = n4.unitPrecision || vi, s4 = ~~e5;
        let u3 = 1 / a4[o3];
        switch (i4) {
          case "vw":
            u3 = o3 / 100;
            break;
          case "px":
            u3 *= 2;
            break;
          default:
            u3 *= 2 * r4;
        }
        let c4 = s4 / u3;
        return l4 >= 0 && l4 <= 100 && (c4 = Number(c4.toFixed(l4))), c4 + i4;
      };
      Si = function() {
        const e5 = document.createElement("canvas");
        return 0 === e5.toDataURL("image/webp").indexOf("data:image/webp");
      };
      ki = function() {
        const e5 = pi.call(this);
        return { platform: "web", taroVersion: "4.3.2", designWidth: e5.designWidth };
      };
      di.requirePlugin = fi, di.getApp = Qo, di.pxTransform = wi, di.initPxTransform = bi, di.canIUseWebp = Si, di.getAppInfo = ki;
      Ei = di;
      Ei.useAddToFavorites = pt, Ei.useDidHide = et, Ei.useDidShow = tt, Ei.useError = nt, Ei.useLaunch = at, Ei.useLoad = it, Ei.useOptionMenuClick = ht, Ei.useKeyboardHeight = gt, Ei.usePageNotFound = ot, Ei.usePageScroll = lt, Ei.usePullDownRefresh = st, Ei.usePullIntercept = ut, Ei.useReachBottom = ct, Ei.useReady = wt, Ei.useResize = dt, Ei.useRouter = St, Ei.useSaveExitState = mt, Ei.useShareAppMessage = vt, Ei.useShareTimeline = yt, Ei.useTabItemTap = kt, Ei.useTitleClick = bt, Ei.useScope = Et, Ei.useUnhandledRejection = rt, Ei.useUnload = ft;
      xi = { exports: {} };
      $i = {};
      _i = Symbol.for("react.element");
      Ci = Symbol.for("react.portal");
      Pi = Symbol.for("react.fragment");
      Ti = Symbol.for("react.strict_mode");
      Ni = Symbol.for("react.profiler");
      Li = Symbol.for("react.provider");
      Ri = Symbol.for("react.context");
      Oi = Symbol.for("react.forward_ref");
      Mi = Symbol.for("react.suspense");
      zi = Symbol.for("react.memo");
      Ii = Symbol.for("react.lazy");
      Di = Symbol.iterator;
      Ai = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      ji = Object.assign;
      Bi = {};
      Ui.prototype.isReactComponent = {}, Ui.prototype.setState = function(e5, t3) {
        if ("object" !== typeof e5 && "function" !== typeof e5 && null != e5) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e5, t3, "setState");
      }, Ui.prototype.forceUpdate = function(e5) {
        this.updater.enqueueForceUpdate(this, e5, "forceUpdate");
      }, Hi.prototype = Ui.prototype;
      Vi = Wi.prototype = new Hi();
      Vi.constructor = Wi, ji(Vi, Ui.prototype), Vi.isPureReactComponent = true;
      Qi = Array.isArray;
      qi = Object.prototype.hasOwnProperty;
      Yi = { current: null };
      Gi = { key: true, ref: true, __self: true, __source: true };
      el = /\/+/g;
      ol = { current: null };
      il = { transition: null };
      ll = { ReactCurrentDispatcher: ol, ReactCurrentBatchConfig: il, ReactCurrentOwner: Yi };
      $i.Children = { map: rl, forEach: function(e5, t3, n4) {
        rl(e5, function() {
          t3.apply(this, arguments);
        }, n4);
      }, count: function(e5) {
        var t3 = 0;
        return rl(e5, function() {
          t3++;
        }), t3;
      }, toArray: function(e5) {
        return rl(e5, function(e6) {
          return e6;
        }) || [];
      }, only: function(e5) {
        if (!Zi(e5)) throw Error("React.Children.only expected to receive a single React element child.");
        return e5;
      } }, $i.Component = Ui, $i.Fragment = Pi, $i.Profiler = Ni, $i.PureComponent = Wi, $i.StrictMode = Ti, $i.Suspense = Mi, $i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ll, $i.act = sl, $i.cloneElement = function(e5, t3, n4) {
        if (null === e5 || void 0 === e5) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e5 + ".");
        var r4 = ji({}, e5.props), a4 = e5.key, o3 = e5.ref, i4 = e5._owner;
        if (null != t3) {
          if (void 0 !== t3.ref && (o3 = t3.ref, i4 = Yi.current), void 0 !== t3.key && (a4 = "" + t3.key), e5.type && e5.type.defaultProps) var l4 = e5.type.defaultProps;
          for (s4 in t3) qi.call(t3, s4) && !Gi.hasOwnProperty(s4) && (r4[s4] = void 0 === t3[s4] && void 0 !== l4 ? l4[s4] : t3[s4]);
        }
        var s4 = arguments.length - 2;
        if (1 === s4) r4.children = n4;
        else if (1 < s4) {
          l4 = Array(s4);
          for (var u3 = 0; u3 < s4; u3++) l4[u3] = arguments[u3 + 2];
          r4.children = l4;
        }
        return { $$typeof: _i, type: e5.type, key: a4, ref: o3, props: r4, _owner: i4 };
      }, $i.createContext = function(e5) {
        return e5 = { $$typeof: Ri, _currentValue: e5, _currentValue2: e5, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e5.Provider = { $$typeof: Li, _context: e5 }, e5.Consumer = e5;
      }, $i.createElement = Ki, $i.createFactory = function(e5) {
        var t3 = Ki.bind(null, e5);
        return t3.type = e5, t3;
      }, $i.createRef = function() {
        return { current: null };
      }, $i.forwardRef = function(e5) {
        return { $$typeof: Oi, render: e5 };
      }, $i.isValidElement = Zi, $i.lazy = function(e5) {
        return { $$typeof: Ii, _payload: { _status: -1, _result: e5 }, _init: al };
      }, $i.memo = function(e5, t3) {
        return { $$typeof: zi, type: e5, compare: void 0 === t3 ? null : t3 };
      }, $i.startTransition = function(e5) {
        var t3 = il.transition;
        il.transition = {};
        try {
          e5();
        } finally {
          il.transition = t3;
        }
      }, $i.unstable_act = sl, $i.useCallback = function(e5, t3) {
        return ol.current.useCallback(e5, t3);
      }, $i.useContext = function(e5) {
        return ol.current.useContext(e5);
      }, $i.useDebugValue = function() {
      }, $i.useDeferredValue = function(e5) {
        return ol.current.useDeferredValue(e5);
      }, $i.useEffect = function(e5, t3) {
        return ol.current.useEffect(e5, t3);
      }, $i.useId = function() {
        return ol.current.useId();
      }, $i.useImperativeHandle = function(e5, t3, n4) {
        return ol.current.useImperativeHandle(e5, t3, n4);
      }, $i.useInsertionEffect = function(e5, t3) {
        return ol.current.useInsertionEffect(e5, t3);
      }, $i.useLayoutEffect = function(e5, t3) {
        return ol.current.useLayoutEffect(e5, t3);
      }, $i.useMemo = function(e5, t3) {
        return ol.current.useMemo(e5, t3);
      }, $i.useReducer = function(e5, t3, n4) {
        return ol.current.useReducer(e5, t3, n4);
      }, $i.useRef = function(e5) {
        return ol.current.useRef(e5);
      }, $i.useState = function(e5) {
        return ol.current.useState(e5);
      }, $i.useSyncExternalStore = function(e5, t3, n4) {
        return ol.current.useSyncExternalStore(e5, t3, n4);
      }, $i.useTransition = function() {
        return ol.current.useTransition();
      }, $i.version = "18.3.1", xi.exports = $i;
      ul = xi.exports;
      cl = Rt(ul);
      dl = l({ __proto__: null, default: cl }, [ul]);
      fl = {};
      pl = { exports: {} };
      hl = {};
      gl = { exports: {} };
      ml = {};
      (function(e5) {
        function t3(e6, t4) {
          var n5 = e6.length;
          e6.push(t4);
          e: for (; 0 < n5; ) {
            var r5 = n5 - 1 >>> 1, o4 = e6[r5];
            if (!(0 < a4(o4, t4))) break e;
            e6[r5] = t4, e6[n5] = o4, n5 = r5;
          }
        }
        function n4(e6) {
          return 0 === e6.length ? null : e6[0];
        }
        function r4(e6) {
          if (0 === e6.length) return null;
          var t4 = e6[0], n5 = e6.pop();
          if (n5 !== t4) {
            e6[0] = n5;
            e: for (var r5 = 0, o4 = e6.length, i5 = o4 >>> 1; r5 < i5; ) {
              var l5 = 2 * (r5 + 1) - 1, s5 = e6[l5], u4 = l5 + 1, c5 = e6[u4];
              if (0 > a4(s5, n5)) u4 < o4 && 0 > a4(c5, s5) ? (e6[r5] = c5, e6[u4] = n5, r5 = u4) : (e6[r5] = s5, e6[l5] = n5, r5 = l5);
              else {
                if (!(u4 < o4 && 0 > a4(c5, n5))) break e;
                e6[r5] = c5, e6[u4] = n5, r5 = u4;
              }
            }
          }
          return t4;
        }
        function a4(e6, t4) {
          var n5 = e6.sortIndex - t4.sortIndex;
          return 0 !== n5 ? n5 : e6.id - t4.id;
        }
        if ("object" === typeof performance && "function" === typeof performance.now) {
          var o3 = performance;
          e5.unstable_now = function() {
            return o3.now();
          };
        } else {
          var i4 = Date, l4 = i4.now();
          e5.unstable_now = function() {
            return i4.now() - l4;
          };
        }
        var s4 = [], u3 = [], c4 = 1, d3 = null, f3 = 3, p4 = false, h4 = false, g4 = false, m4 = "function" === typeof setTimeout ? setTimeout : null, v3 = "function" === typeof clearTimeout ? clearTimeout : null, y3 = "undefined" !== typeof setImmediate ? setImmediate : null;
        function b3(e6) {
          for (var a5 = n4(u3); null !== a5; ) {
            if (null === a5.callback) r4(u3);
            else {
              if (!(a5.startTime <= e6)) break;
              r4(u3), a5.sortIndex = a5.expirationTime, t3(s4, a5);
            }
            a5 = n4(u3);
          }
        }
        function w3(e6) {
          if (g4 = false, b3(e6), !h4) if (null !== n4(s4)) h4 = true, R3(S3);
          else {
            var t4 = n4(u3);
            null !== t4 && O3(w3, t4.startTime - e6);
          }
        }
        function S3(t4, a5) {
          h4 = false, g4 && (g4 = false, v3($3), $3 = -1), p4 = true;
          var o4 = f3;
          try {
            for (b3(a5), d3 = n4(s4); null !== d3 && (!(d3.expirationTime > a5) || t4 && !P3()); ) {
              var i5 = d3.callback;
              if ("function" === typeof i5) {
                d3.callback = null, f3 = d3.priorityLevel;
                var l5 = i5(d3.expirationTime <= a5);
                a5 = e5.unstable_now(), "function" === typeof l5 ? d3.callback = l5 : d3 === n4(s4) && r4(s4), b3(a5);
              } else r4(s4);
              d3 = n4(s4);
            }
            if (null !== d3) var c5 = true;
            else {
              var m5 = n4(u3);
              null !== m5 && O3(w3, m5.startTime - a5), c5 = false;
            }
            return c5;
          } finally {
            d3 = null, f3 = o4, p4 = false;
          }
        }
        "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
        var k3, E3 = false, x3 = null, $3 = -1, _3 = 5, C3 = -1;
        function P3() {
          return !(e5.unstable_now() - C3 < _3);
        }
        function T3() {
          if (null !== x3) {
            var t4 = e5.unstable_now();
            C3 = t4;
            var n5 = true;
            try {
              n5 = x3(true, t4);
            } finally {
              n5 ? k3() : (E3 = false, x3 = null);
            }
          } else E3 = false;
        }
        if ("function" === typeof y3) k3 = function() {
          y3(T3);
        };
        else if ("undefined" !== typeof MessageChannel) {
          var N3 = new MessageChannel(), L3 = N3.port2;
          N3.port1.onmessage = T3, k3 = function() {
            L3.postMessage(null);
          };
        } else k3 = function() {
          m4(T3, 0);
        };
        function R3(e6) {
          x3 = e6, E3 || (E3 = true, k3());
        }
        function O3(t4, n5) {
          $3 = m4(function() {
            t4(e5.unstable_now());
          }, n5);
        }
        e5.unstable_IdlePriority = 5, e5.unstable_ImmediatePriority = 1, e5.unstable_LowPriority = 4, e5.unstable_NormalPriority = 3, e5.unstable_Profiling = null, e5.unstable_UserBlockingPriority = 2, e5.unstable_cancelCallback = function(e6) {
          e6.callback = null;
        }, e5.unstable_continueExecution = function() {
          h4 || p4 || (h4 = true, R3(S3));
        }, e5.unstable_forceFrameRate = function(e6) {
          0 > e6 || 125 < e6 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _3 = 0 < e6 ? Math.floor(1e3 / e6) : 5;
        }, e5.unstable_getCurrentPriorityLevel = function() {
          return f3;
        }, e5.unstable_getFirstCallbackNode = function() {
          return n4(s4);
        }, e5.unstable_next = function(e6) {
          switch (f3) {
            case 1:
            case 2:
            case 3:
              var t4 = 3;
              break;
            default:
              t4 = f3;
          }
          var n5 = f3;
          f3 = t4;
          try {
            return e6();
          } finally {
            f3 = n5;
          }
        }, e5.unstable_pauseExecution = function() {
        }, e5.unstable_requestPaint = function() {
        }, e5.unstable_runWithPriority = function(e6, t4) {
          switch (e6) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              break;
            default:
              e6 = 3;
          }
          var n5 = f3;
          f3 = e6;
          try {
            return t4();
          } finally {
            f3 = n5;
          }
        }, e5.unstable_scheduleCallback = function(r5, a5, o4) {
          var i5 = e5.unstable_now();
          switch ("object" === typeof o4 && null !== o4 ? (o4 = o4.delay, o4 = "number" === typeof o4 && 0 < o4 ? i5 + o4 : i5) : o4 = i5, r5) {
            case 1:
              var l5 = -1;
              break;
            case 2:
              l5 = 250;
              break;
            case 5:
              l5 = 1073741823;
              break;
            case 4:
              l5 = 1e4;
              break;
            default:
              l5 = 5e3;
          }
          return l5 = o4 + l5, r5 = { id: c4++, callback: a5, priorityLevel: r5, startTime: o4, expirationTime: l5, sortIndex: -1 }, o4 > i5 ? (r5.sortIndex = o4, t3(u3, r5), null === n4(s4) && r5 === n4(u3) && (g4 ? (v3($3), $3 = -1) : g4 = true, O3(w3, o4 - i5))) : (r5.sortIndex = l5, t3(s4, r5), h4 || p4 || (h4 = true, R3(S3))), r5;
        }, e5.unstable_shouldYield = P3, e5.unstable_wrapCallback = function(e6) {
          var t4 = f3;
          return function() {
            var n5 = f3;
            f3 = t4;
            try {
              return e6.apply(this, arguments);
            } finally {
              f3 = n5;
            }
          };
        };
      })(ml), gl.exports = ml;
      vl = gl.exports;
      yl = ul;
      bl = vl;
      Sl = /* @__PURE__ */ new Set();
      kl = {};
      $l = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      _l = Object.prototype.hasOwnProperty;
      Cl = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
      Pl = {};
      Tl = {};
      Ml = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e5) {
        Ml[e5] = new Ol(e5, 0, false, e5, null, false, false);
      }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e5) {
        var t3 = e5[0];
        Ml[t3] = new Ol(t3, 1, false, e5[1], null, false, false);
      }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 2, false, e5.toLowerCase(), null, false, false);
      }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 2, false, e5, null, false, false);
      }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e5) {
        Ml[e5] = new Ol(e5, 3, false, e5.toLowerCase(), null, false, false);
      }), ["checked", "multiple", "muted", "selected"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 3, true, e5, null, false, false);
      }), ["capture", "download"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 4, false, e5, null, false, false);
      }), ["cols", "rows", "size", "span"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 6, false, e5, null, false, false);
      }), ["rowSpan", "start"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 5, false, e5.toLowerCase(), null, false, false);
      });
      zl = /[\-:]([a-z])/g;
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e5) {
        var t3 = e5.replace(zl, Il);
        Ml[t3] = new Ol(t3, 1, false, e5, null, false, false);
      }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e5) {
        var t3 = e5.replace(zl, Il);
        Ml[t3] = new Ol(t3, 1, false, e5, "http://www.w3.org/1999/xlink", false, false);
      }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e5) {
        var t3 = e5.replace(zl, Il);
        Ml[t3] = new Ol(t3, 1, false, e5, "http://www.w3.org/XML/1998/namespace", false, false);
      }), ["tabIndex", "crossOrigin"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 1, false, e5.toLowerCase(), null, false, false);
      }), Ml.xlinkHref = new Ol("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false), ["src", "href", "action", "formAction"].forEach(function(e5) {
        Ml[e5] = new Ol(e5, 1, false, e5.toLowerCase(), null, true, true);
      });
      Fl = yl.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      Al = Symbol.for("react.element");
      jl = Symbol.for("react.portal");
      Bl = Symbol.for("react.fragment");
      Ul = Symbol.for("react.strict_mode");
      Hl = Symbol.for("react.profiler");
      Wl = Symbol.for("react.provider");
      Vl = Symbol.for("react.context");
      Ql = Symbol.for("react.forward_ref");
      ql = Symbol.for("react.suspense");
      Yl = Symbol.for("react.suspense_list");
      Gl = Symbol.for("react.memo");
      Kl = Symbol.for("react.lazy");
      Xl = Symbol.for("react.offscreen");
      Zl = Symbol.iterator;
      ts = Object.assign;
      rs = false;
      ws = Array.isArray;
      Ts = function(e5) {
        return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(t3, n4, r4, a4) {
          MSApp.execUnsafeLocalFunction(function() {
            return e5(t3, n4, r4, a4);
          });
        } : e5;
      }(function(e5, t3) {
        if ("http://www.w3.org/2000/svg" !== e5.namespaceURI || "innerHTML" in e5) e5.innerHTML = t3;
        else {
          for (Ps = Ps || document.createElement("div"), Ps.innerHTML = "<svg>" + t3.valueOf().toString() + "</svg>", t3 = Ps.firstChild; e5.firstChild; ) e5.removeChild(e5.firstChild);
          for (; t3.firstChild; ) e5.appendChild(t3.firstChild);
        }
      });
      Ls = { animationIterationCount: true, aspectRatio: true, borderImageOutset: true, borderImageSlice: true, borderImageWidth: true, boxFlex: true, boxFlexGroup: true, boxOrdinalGroup: true, columnCount: true, columns: true, flex: true, flexGrow: true, flexPositive: true, flexShrink: true, flexNegative: true, flexOrder: true, gridArea: true, gridRow: true, gridRowEnd: true, gridRowSpan: true, gridRowStart: true, gridColumn: true, gridColumnEnd: true, gridColumnSpan: true, gridColumnStart: true, fontWeight: true, lineClamp: true, lineHeight: true, opacity: true, order: true, orphans: true, tabSize: true, widows: true, zIndex: true, zoom: true, fillOpacity: true, floodOpacity: true, stopOpacity: true, strokeDasharray: true, strokeDashoffset: true, strokeMiterlimit: true, strokeOpacity: true, strokeWidth: true };
      Rs = ["Webkit", "ms", "Moz", "O"];
      Object.keys(Ls).forEach(function(e5) {
        Rs.forEach(function(t3) {
          t3 = t3 + e5.charAt(0).toUpperCase() + e5.substring(1), Ls[t3] = Ls[e5];
        });
      });
      zs = ts({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
      Fs = null;
      js = null;
      Bs = null;
      Us = null;
      Ys = false;
      Xs = false;
      if ($l) try {
        Zs = {};
        Object.defineProperty(Zs, "passive", { get: function() {
          Xs = true;
        } }), window.addEventListener("test", Zs, Zs), window.removeEventListener("test", Zs, Zs);
      } catch (cb) {
        Xs = false;
      }
      eu = false;
      tu = null;
      nu = false;
      ru = null;
      au = { onError: function(e5) {
        eu = true, tu = e5;
      } };
      pu = bl.unstable_scheduleCallback;
      hu = bl.unstable_cancelCallback;
      gu = bl.unstable_shouldYield;
      mu = bl.unstable_requestPaint;
      vu = bl.unstable_now;
      yu = bl.unstable_getCurrentPriorityLevel;
      bu = bl.unstable_ImmediatePriority;
      wu = bl.unstable_UserBlockingPriority;
      Su = bl.unstable_NormalPriority;
      ku = bl.unstable_LowPriority;
      Eu = bl.unstable_IdlePriority;
      xu = null;
      $u = null;
      Cu = Math.clz32 ? Math.clz32 : Nu;
      Pu = Math.log;
      Tu = Math.LN2;
      Lu = 64;
      Ru = 4194304;
      Hu = 0;
      Ku = false;
      Xu = [];
      Zu = null;
      Ju = null;
      ec = null;
      tc = /* @__PURE__ */ new Map();
      nc = /* @__PURE__ */ new Map();
      rc = [];
      ac = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
      hc = Fl.ReactCurrentBatchConfig;
      gc = true;
      bc = null;
      kc = null;
      Ec = null;
      xc = null;
      Oc = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e5) {
        return e5.timeStamp || Date.now();
      }, defaultPrevented: 0, isTrusted: 0 };
      Mc = Tc(Oc);
      zc = ts({}, Oc, { view: 0, detail: 0 });
      Ic = Tc(zc);
      Dc = ts({}, zc, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jc, button: 0, buttons: 0, relatedTarget: function(e5) {
        return void 0 === e5.relatedTarget ? e5.fromElement === e5.srcElement ? e5.toElement : e5.fromElement : e5.relatedTarget;
      }, movementX: function(e5) {
        return "movementX" in e5 ? e5.movementX : (e5 !== Rc && (Rc && "mousemove" === e5.type ? (Nc = e5.screenX - Rc.screenX, Lc = e5.screenY - Rc.screenY) : Lc = Nc = 0, Rc = e5), Nc);
      }, movementY: function(e5) {
        return "movementY" in e5 ? e5.movementY : Lc;
      } });
      Fc = Tc(Dc);
      Ac = ts({}, Dc, { dataTransfer: 0 });
      jc = Tc(Ac);
      Bc = ts({}, zc, { relatedTarget: 0 });
      Uc = Tc(Bc);
      Hc = ts({}, Oc, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
      Wc = Tc(Hc);
      Vc = ts({}, Oc, { clipboardData: function(e5) {
        return "clipboardData" in e5 ? e5.clipboardData : window.clipboardData;
      } });
      Qc = Tc(Vc);
      qc = ts({}, Oc, { data: 0 });
      Yc = Tc(qc);
      Gc = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" };
      Kc = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" };
      Xc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
      ed = ts({}, zc, { key: function(e5) {
        if (e5.key) {
          var t3 = Gc[e5.key] || e5.key;
          if ("Unidentified" !== t3) return t3;
        }
        return "keypress" === e5.type ? (e5 = _c(e5), 13 === e5 ? "Enter" : String.fromCharCode(e5)) : "keydown" === e5.type || "keyup" === e5.type ? Kc[e5.keyCode] || "Unidentified" : "";
      }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jc, charCode: function(e5) {
        return "keypress" === e5.type ? _c(e5) : 0;
      }, keyCode: function(e5) {
        return "keydown" === e5.type || "keyup" === e5.type ? e5.keyCode : 0;
      }, which: function(e5) {
        return "keypress" === e5.type ? _c(e5) : "keydown" === e5.type || "keyup" === e5.type ? e5.keyCode : 0;
      } });
      td = Tc(ed);
      nd = ts({}, Dc, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
      rd = Tc(nd);
      ad = ts({}, zc, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jc });
      od = Tc(ad);
      id = ts({}, Oc, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
      ld = Tc(id);
      sd = ts({}, Dc, { deltaX: function(e5) {
        return "deltaX" in e5 ? e5.deltaX : "wheelDeltaX" in e5 ? -e5.wheelDeltaX : 0;
      }, deltaY: function(e5) {
        return "deltaY" in e5 ? e5.deltaY : "wheelDeltaY" in e5 ? -e5.wheelDeltaY : "wheelDelta" in e5 ? -e5.wheelDelta : 0;
      }, deltaZ: 0, deltaMode: 0 });
      ud = Tc(sd);
      cd = [9, 13, 27, 32];
      dd = $l && "CompositionEvent" in window;
      fd = null;
      $l && "documentMode" in document && (fd = document.documentMode);
      pd = $l && "TextEvent" in window && !fd;
      hd = $l && (!dd || fd && 8 < fd && 11 >= fd);
      gd = String.fromCharCode(32);
      md = false;
      bd = false;
      kd = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
      $d = null;
      _d = null;
      Nd = false;
      if ($l) {
        if ($l) {
          Rd = "oninput" in document;
          if (!Rd) {
            Od = document.createElement("div");
            Od.setAttribute("oninput", "return;"), Rd = "function" === typeof Od.oninput;
          }
          Ld = Rd;
        } else Ld = false;
        Nd = Ld && (!document.documentMode || 9 < document.documentMode);
      }
      Bd = "function" === typeof Object.is ? Object.is : jd;
      Gd = $l && "documentMode" in document && 11 >= document.documentMode;
      Kd = null;
      Xd = null;
      Zd = null;
      Jd = false;
      nf = { animationend: tf("Animation", "AnimationEnd"), animationiteration: tf("Animation", "AnimationIteration"), animationstart: tf("Animation", "AnimationStart"), transitionend: tf("Transition", "TransitionEnd") };
      rf = {};
      af = {};
      $l && (af = document.createElement("div").style, "AnimationEvent" in window || (delete nf.animationend.animation, delete nf.animationiteration.animation, delete nf.animationstart.animation), "TransitionEvent" in window || delete nf.transitionend.transition);
      lf = of("animationend");
      sf = of("animationiteration");
      uf = of("animationstart");
      cf = of("transitionend");
      df = /* @__PURE__ */ new Map();
      ff = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
      for (hf = 0; hf < ff.length; hf++) {
        gf = ff[hf], mf = gf.toLowerCase(), vf = gf[0].toUpperCase() + gf.slice(1);
        pf(mf, "on" + vf);
      }
      pf(lf, "onAnimationEnd"), pf(sf, "onAnimationIteration"), pf(uf, "onAnimationStart"), pf("dblclick", "onDoubleClick"), pf("focusin", "onFocus"), pf("focusout", "onBlur"), pf(cf, "onTransitionEnd"), xl("onMouseEnter", ["mouseout", "mouseover"]), xl("onMouseLeave", ["mouseout", "mouseover"]), xl("onPointerEnter", ["pointerout", "pointerover"]), xl("onPointerLeave", ["pointerout", "pointerover"]), El("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), El("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), El("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), El("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), El("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), El("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
      yf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
      bf = new Set("cancel close invalid load scroll toggle".split(" ").concat(yf));
      xf = "_reactListening" + Math.random().toString(36).slice(2);
      Rf = /\r\n?/g;
      Of = /\u0000|\uFFFD/g;
      Df = null;
      Ff = null;
      jf = "function" === typeof setTimeout ? setTimeout : void 0;
      Bf = "function" === typeof clearTimeout ? clearTimeout : void 0;
      Uf = "function" === typeof Promise ? Promise : void 0;
      Hf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Uf ? function(e5) {
        return Uf.resolve(null).then(e5).catch(Wf);
      } : jf;
      Yf = Math.random().toString(36).slice(2);
      Gf = "__reactFiber$" + Yf;
      Kf = "__reactProps$" + Yf;
      Xf = "__reactContainer$" + Yf;
      Zf = "__reactEvents$" + Yf;
      Jf = "__reactListeners$" + Yf;
      ep = "__reactHandles$" + Yf;
      op = [];
      ip = -1;
      cp = {};
      dp = lp(cp);
      fp = lp(false);
      pp = cp;
      Sp = null;
      kp = false;
      Ep = false;
      Cp = [];
      Pp = 0;
      Tp = null;
      Np = 0;
      Lp = [];
      Rp = 0;
      Op = null;
      Mp = 1;
      zp = "";
      jp = null;
      Bp = null;
      Up = false;
      Hp = null;
      Jp = Fl.ReactCurrentBatchConfig;
      ah = rh(true);
      oh = rh(false);
      ih = lp(null);
      lh = null;
      sh = null;
      uh = null;
      gh = null;
      bh = false;
      Ph = {};
      Th = lp(Ph);
      Nh = lp(Ph);
      Lh = lp(Ph);
      Dh = lp(0);
      Ah = [];
      Bh = Fl.ReactCurrentDispatcher;
      Uh = Fl.ReactCurrentBatchConfig;
      Hh = 0;
      Wh = null;
      Vh = null;
      Qh = null;
      qh = false;
      Yh = false;
      Gh = 0;
      Kh = 0;
      zg = { readContext: hh, useCallback: Xh, useContext: Xh, useEffect: Xh, useImperativeHandle: Xh, useInsertionEffect: Xh, useLayoutEffect: Xh, useMemo: Xh, useReducer: Xh, useRef: Xh, useState: Xh, useDebugValue: Xh, useDeferredValue: Xh, useTransition: Xh, useMutableSource: Xh, useSyncExternalStore: Xh, useId: Xh, unstable_isNewReconciler: false };
      Ig = { readContext: hh, useCallback: function(e5, t3) {
        return tg().memoizedState = [e5, void 0 === t3 ? null : t3], e5;
      }, useContext: hh, useEffect: yg, useImperativeHandle: function(e5, t3, n4) {
        return n4 = null !== n4 && void 0 !== n4 ? n4.concat([e5]) : null, mg(4194308, 4, kg.bind(null, t3, e5), n4);
      }, useLayoutEffect: function(e5, t3) {
        return mg(4194308, 4, e5, t3);
      }, useInsertionEffect: function(e5, t3) {
        return mg(4, 2, e5, t3);
      }, useMemo: function(e5, t3) {
        var n4 = tg();
        return t3 = void 0 === t3 ? null : t3, e5 = e5(), n4.memoizedState = [e5, t3], e5;
      }, useReducer: function(e5, t3, n4) {
        var r4 = tg();
        return t3 = void 0 !== n4 ? n4(t3) : t3, r4.memoizedState = r4.baseState = t3, e5 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e5, lastRenderedState: t3 }, r4.queue = e5, e5 = e5.dispatch = Ng.bind(null, Wh, e5), [r4.memoizedState, e5];
      }, useRef: function(e5) {
        var t3 = tg();
        return e5 = { current: e5 }, t3.memoizedState = e5;
      }, useState: pg, useDebugValue: xg, useDeferredValue: function(e5) {
        return tg().memoizedState = e5;
      }, useTransition: function() {
        var e5 = pg(false), t3 = e5[0];
        return e5 = Pg.bind(null, e5[1]), tg().memoizedState = e5, [t3, e5];
      }, useMutableSource: function() {
      }, useSyncExternalStore: function(e5, t3, n4) {
        var r4 = Wh, a4 = tg();
        if (Up) {
          if (void 0 === n4) throw Error(wl(407));
          n4 = n4();
        } else {
          if (n4 = t3(), null === gv) throw Error(wl(349));
          0 !== (30 & Hh) || sg(r4, t3, n4);
        }
        a4.memoizedState = n4;
        var o3 = { value: n4, getSnapshot: t3 };
        return a4.queue = o3, yg(cg.bind(null, r4, o3, e5), [e5]), r4.flags |= 2048, hg(9, ug.bind(null, r4, o3, n4, t3), void 0, null), n4;
      }, useId: function() {
        var e5 = tg(), t3 = gv.identifierPrefix;
        if (Up) {
          var n4 = zp, r4 = Mp;
          n4 = (r4 & ~(1 << 32 - Cu(r4) - 1)).toString(32) + n4, t3 = ":" + t3 + "R" + n4, n4 = Gh++, 0 < n4 && (t3 += "H" + n4.toString(32)), t3 += ":";
        } else n4 = Kh++, t3 = ":" + t3 + "r" + n4.toString(32) + ":";
        return e5.memoizedState = t3;
      }, unstable_isNewReconciler: false };
      Dg = { readContext: hh, useCallback: $g, useContext: hh, useEffect: bg, useImperativeHandle: Eg, useInsertionEffect: wg, useLayoutEffect: Sg, useMemo: _g, useReducer: ag, useRef: gg, useState: function() {
        return ag(rg);
      }, useDebugValue: xg, useDeferredValue: function(e5) {
        var t3 = ng();
        return Cg(t3, Vh.memoizedState, e5);
      }, useTransition: function() {
        var e5 = ag(rg)[0], t3 = ng().memoizedState;
        return [e5, t3];
      }, useMutableSource: ig, useSyncExternalStore: lg, useId: Tg, unstable_isNewReconciler: false };
      Fg = { readContext: hh, useCallback: $g, useContext: hh, useEffect: bg, useImperativeHandle: Eg, useInsertionEffect: wg, useLayoutEffect: Sg, useMemo: _g, useReducer: og, useRef: gg, useState: function() {
        return og(rg);
      }, useDebugValue: xg, useDeferredValue: function(e5) {
        var t3 = ng();
        return null === Vh ? t3.memoizedState = e5 : Cg(t3, Vh.memoizedState, e5);
      }, useTransition: function() {
        var e5 = og(rg)[0], t3 = ng().memoizedState;
        return [e5, t3];
      }, useMutableSource: ig, useSyncExternalStore: lg, useId: Tg, unstable_isNewReconciler: false };
      Bg = { isMounted: function(e5) {
        return !!(e5 = e5._reactInternals) && lu(e5) === e5;
      }, enqueueSetState: function(e5, t3, n4) {
        e5 = e5._reactInternals;
        var r4 = jv(), a4 = Bv(e5), o3 = kh(r4, a4);
        o3.payload = t3, void 0 !== n4 && null !== n4 && (o3.callback = n4), t3 = Eh(e5, o3, a4), null !== t3 && (Uv(t3, e5, a4, r4), xh(t3, e5, a4));
      }, enqueueReplaceState: function(e5, t3, n4) {
        e5 = e5._reactInternals;
        var r4 = jv(), a4 = Bv(e5), o3 = kh(r4, a4);
        o3.tag = 1, o3.payload = t3, void 0 !== n4 && null !== n4 && (o3.callback = n4), t3 = Eh(e5, o3, a4), null !== t3 && (Uv(t3, e5, a4, r4), xh(t3, e5, a4));
      }, enqueueForceUpdate: function(e5, t3) {
        e5 = e5._reactInternals;
        var n4 = jv(), r4 = Bv(e5), a4 = kh(n4, r4);
        a4.tag = 2, void 0 !== t3 && null !== t3 && (a4.callback = t3), t3 = Eh(e5, a4, r4), null !== t3 && (Uv(t3, e5, r4, n4), xh(t3, e5, r4));
      } };
      Gg = "function" === typeof WeakMap ? WeakMap : Map;
      tm = Fl.ReactCurrentOwner;
      nm = false;
      ym = { dehydrated: null, treeContext: null, retryLane: 0 };
      hm = function(e5, t3) {
        for (var n4 = t3.child; null !== n4; ) {
          if (5 === n4.tag || 6 === n4.tag) e5.appendChild(n4.stateNode);
          else if (4 !== n4.tag && null !== n4.child) {
            n4.child.return = n4, n4 = n4.child;
            continue;
          }
          if (n4 === t3) break;
          for (; null === n4.sibling; ) {
            if (null === n4.return || n4.return === t3) return;
            n4 = n4.return;
          }
          n4.sibling.return = n4.return, n4 = n4.sibling;
        }
      }, gm = function() {
      }, mm = function(e5, t3, n4, r4) {
        var a4 = e5.memoizedProps;
        if (a4 !== r4) {
          e5 = t3.stateNode, Rh(Th.current);
          var o3, i4 = null;
          switch (n4) {
            case "input":
              a4 = hs(e5, a4), r4 = hs(e5, r4), i4 = [];
              break;
            case "select":
              a4 = ts({}, a4, { value: void 0 }), r4 = ts({}, r4, { value: void 0 }), i4 = [];
              break;
            case "textarea":
              a4 = ks(e5, a4), r4 = ks(e5, r4), i4 = [];
              break;
            default:
              "function" !== typeof a4.onClick && "function" === typeof r4.onClick && (e5.onclick = If);
          }
          for (u3 in Is(n4, r4), n4 = null, a4) if (!r4.hasOwnProperty(u3) && a4.hasOwnProperty(u3) && null != a4[u3]) if ("style" === u3) {
            var l4 = a4[u3];
            for (o3 in l4) l4.hasOwnProperty(o3) && (n4 || (n4 = {}), n4[o3] = "");
          } else "dangerouslySetInnerHTML" !== u3 && "children" !== u3 && "suppressContentEditableWarning" !== u3 && "suppressHydrationWarning" !== u3 && "autoFocus" !== u3 && (kl.hasOwnProperty(u3) ? i4 || (i4 = []) : (i4 = i4 || []).push(u3, null));
          for (u3 in r4) {
            var s4 = r4[u3];
            if (l4 = null != a4 ? a4[u3] : void 0, r4.hasOwnProperty(u3) && s4 !== l4 && (null != s4 || null != l4)) if ("style" === u3) if (l4) {
              for (o3 in l4) !l4.hasOwnProperty(o3) || s4 && s4.hasOwnProperty(o3) || (n4 || (n4 = {}), n4[o3] = "");
              for (o3 in s4) s4.hasOwnProperty(o3) && l4[o3] !== s4[o3] && (n4 || (n4 = {}), n4[o3] = s4[o3]);
            } else n4 || (i4 || (i4 = []), i4.push(u3, n4)), n4 = s4;
            else "dangerouslySetInnerHTML" === u3 ? (s4 = s4 ? s4.__html : void 0, l4 = l4 ? l4.__html : void 0, null != s4 && l4 !== s4 && (i4 = i4 || []).push(u3, s4)) : "children" === u3 ? "string" !== typeof s4 && "number" !== typeof s4 || (i4 = i4 || []).push(u3, "" + s4) : "suppressContentEditableWarning" !== u3 && "suppressHydrationWarning" !== u3 && (kl.hasOwnProperty(u3) ? (null != s4 && "onScroll" === u3 && kf("scroll", e5), i4 || l4 === s4 || (i4 = [])) : (i4 = i4 || []).push(u3, s4));
          }
          n4 && (i4 = i4 || []).push("style", n4);
          var u3 = i4;
          (t3.updateQueue = u3) && (t3.flags |= 4);
        }
      }, vm = function(e5, t3, n4, r4) {
        n4 !== r4 && (t3.flags |= 4);
      };
      Mm = false;
      zm = false;
      Im = "function" === typeof WeakSet ? WeakSet : Set;
      Dm = null;
      jm = false;
      Km = null;
      Xm = false;
      cv = Math.ceil;
      dv = Fl.ReactCurrentDispatcher;
      fv = Fl.ReactCurrentOwner;
      pv = Fl.ReactCurrentBatchConfig;
      hv = 0;
      gv = null;
      mv = null;
      vv = 0;
      yv = 0;
      bv = lp(0);
      wv = 0;
      Sv = null;
      kv = 0;
      Ev = 0;
      xv = 0;
      $v = null;
      _v = null;
      Cv = 0;
      Pv = 1 / 0;
      Tv = null;
      Nv = false;
      Lv = null;
      Rv = null;
      Ov = false;
      Mv = null;
      zv = 0;
      Iv = 0;
      Dv = null;
      Fv = -1;
      Av = 0;
      uv = function(e5, t3, n4) {
        if (null !== e5) if (e5.memoizedProps !== t3.pendingProps || fp.current) nm = true;
        else {
          if (0 === (e5.lanes & n4) && 0 === (128 & t3.flags)) return nm = false, Tm(e5, t3, n4);
          nm = 0 !== (131072 & e5.flags);
        }
        else nm = false, Up && 0 !== (1048576 & t3.flags) && Dp(t3, Np, t3.index);
        switch (t3.lanes = 0, t3.tag) {
          case 2:
            var r4 = t3.type;
            Cm(e5, t3), e5 = t3.pendingProps;
            var a4 = hp(t3, dp.current);
            ph(t3, n4), a4 = Jh(null, t3, r4, e5, a4, n4);
            var o3 = eg();
            return t3.flags |= 1, "object" === typeof a4 && null !== a4 && "function" === typeof a4.render && void 0 === a4.$$typeof ? (t3.tag = 1, t3.memoizedState = null, t3.updateQueue = null, gp(r4) ? (o3 = true, bp(t3)) : o3 = false, t3.memoizedState = null !== a4.state && void 0 !== a4.state ? a4.state : null, wh(t3), a4.updater = Bg, t3.stateNode = a4, a4._reactInternals = t3, Vg(t3, r4, e5, n4), t3 = dm(null, t3, r4, true, o3, n4)) : (t3.tag = 0, Up && o3 && Fp(t3), rm(null, t3, a4, n4), t3 = t3.child), t3;
          case 16:
            r4 = t3.elementType;
            e: {
              switch (Cm(e5, t3), e5 = t3.pendingProps, a4 = r4._init, r4 = a4(r4._payload), t3.type = r4, a4 = t3.tag = Sy(r4), e5 = Ag(r4, e5), a4) {
                case 0:
                  t3 = um(null, t3, r4, e5, n4);
                  break e;
                case 1:
                  t3 = cm(null, t3, r4, e5, n4);
                  break e;
                case 11:
                  t3 = am(null, t3, r4, e5, n4);
                  break e;
                case 14:
                  t3 = om(null, t3, r4, Ag(r4.type, e5), n4);
                  break e;
              }
              throw Error(wl(306, r4, ""));
            }
            return t3;
          case 0:
            return r4 = t3.type, a4 = t3.pendingProps, a4 = t3.elementType === r4 ? a4 : Ag(r4, a4), um(e5, t3, r4, a4, n4);
          case 1:
            return r4 = t3.type, a4 = t3.pendingProps, a4 = t3.elementType === r4 ? a4 : Ag(r4, a4), cm(e5, t3, r4, a4, n4);
          case 3:
            e: {
              if (fm(t3), null === e5) throw Error(wl(387));
              r4 = t3.pendingProps, o3 = t3.memoizedState, a4 = o3.element, Sh(e5, t3), _h(t3, r4, null, n4);
              var i4 = t3.memoizedState;
              if (r4 = i4.element, o3.isDehydrated) {
                if (o3 = { element: r4, isDehydrated: false, cache: i4.cache, pendingSuspenseBoundaries: i4.pendingSuspenseBoundaries, transitions: i4.transitions }, t3.updateQueue.baseState = o3, t3.memoizedState = o3, 256 & t3.flags) {
                  a4 = Qg(Error(wl(423)), t3), t3 = pm(e5, t3, r4, n4, a4);
                  break e;
                }
                if (r4 !== a4) {
                  a4 = Qg(Error(wl(424)), t3), t3 = pm(e5, t3, r4, n4, a4);
                  break e;
                }
                for (Bp = Qf(t3.stateNode.containerInfo.firstChild), jp = t3, Up = true, Hp = null, n4 = oh(t3, null, r4, n4), t3.child = n4; n4; ) n4.flags = -3 & n4.flags | 4096, n4 = n4.sibling;
              } else {
                if (Xp(), r4 === a4) {
                  t3 = Pm(e5, t3, n4);
                  break e;
                }
                rm(e5, t3, r4, n4);
              }
              t3 = t3.child;
            }
            return t3;
          case 5:
            return zh(t3), null === e5 && qp(t3), r4 = t3.type, a4 = t3.pendingProps, o3 = null !== e5 ? e5.memoizedProps : null, i4 = a4.children, Af(r4, a4) ? i4 = null : null !== o3 && Af(r4, o3) && (t3.flags |= 32), sm(e5, t3), rm(e5, t3, i4, n4), t3.child;
          case 6:
            return null === e5 && qp(t3), null;
          case 13:
            return wm(e5, t3, n4);
          case 4:
            return Oh(t3, t3.stateNode.containerInfo), r4 = t3.pendingProps, null === e5 ? t3.child = ah(t3, null, r4, n4) : rm(e5, t3, r4, n4), t3.child;
          case 11:
            return r4 = t3.type, a4 = t3.pendingProps, a4 = t3.elementType === r4 ? a4 : Ag(r4, a4), am(e5, t3, r4, a4, n4);
          case 7:
            return rm(e5, t3, t3.pendingProps, n4), t3.child;
          case 8:
            return rm(e5, t3, t3.pendingProps.children, n4), t3.child;
          case 12:
            return rm(e5, t3, t3.pendingProps.children, n4), t3.child;
          case 10:
            e: {
              if (r4 = t3.type._context, a4 = t3.pendingProps, o3 = t3.memoizedProps, i4 = a4.value, up(ih, r4._currentValue), r4._currentValue = i4, null !== o3) if (Bd(o3.value, i4)) {
                if (o3.children === a4.children && !fp.current) {
                  t3 = Pm(e5, t3, n4);
                  break e;
                }
              } else for (o3 = t3.child, null !== o3 && (o3.return = t3); null !== o3; ) {
                var l4 = o3.dependencies;
                if (null !== l4) {
                  i4 = o3.child;
                  for (var s4 = l4.firstContext; null !== s4; ) {
                    if (s4.context === r4) {
                      if (1 === o3.tag) {
                        s4 = kh(-1, n4 & -n4), s4.tag = 2;
                        var u3 = o3.updateQueue;
                        if (null !== u3) {
                          u3 = u3.shared;
                          var c4 = u3.pending;
                          null === c4 ? s4.next = s4 : (s4.next = c4.next, c4.next = s4), u3.pending = s4;
                        }
                      }
                      o3.lanes |= n4, s4 = o3.alternate, null !== s4 && (s4.lanes |= n4), fh(o3.return, n4, t3), l4.lanes |= n4;
                      break;
                    }
                    s4 = s4.next;
                  }
                } else if (10 === o3.tag) i4 = o3.type === t3.type ? null : o3.child;
                else if (18 === o3.tag) {
                  if (i4 = o3.return, null === i4) throw Error(wl(341));
                  i4.lanes |= n4, l4 = i4.alternate, null !== l4 && (l4.lanes |= n4), fh(i4, n4, t3), i4 = o3.sibling;
                } else i4 = o3.child;
                if (null !== i4) i4.return = o3;
                else for (i4 = o3; null !== i4; ) {
                  if (i4 === t3) {
                    i4 = null;
                    break;
                  }
                  if (o3 = i4.sibling, null !== o3) {
                    o3.return = i4.return, i4 = o3;
                    break;
                  }
                  i4 = i4.return;
                }
                o3 = i4;
              }
              rm(e5, t3, a4.children, n4), t3 = t3.child;
            }
            return t3;
          case 9:
            return a4 = t3.type, r4 = t3.pendingProps.children, ph(t3, n4), a4 = hh(a4), r4 = r4(a4), t3.flags |= 1, rm(e5, t3, r4, n4), t3.child;
          case 14:
            return r4 = t3.type, a4 = Ag(r4, t3.pendingProps), a4 = Ag(r4.type, a4), om(e5, t3, r4, a4, n4);
          case 15:
            return im(e5, t3, t3.type, t3.pendingProps, n4);
          case 17:
            return r4 = t3.type, a4 = t3.pendingProps, a4 = t3.elementType === r4 ? a4 : Ag(r4, a4), Cm(e5, t3), t3.tag = 1, gp(r4) ? (e5 = true, bp(t3)) : e5 = false, ph(t3, n4), Hg(t3, r4, a4), Vg(t3, r4, a4, n4), dm(null, t3, r4, true, e5, n4);
          case 19:
            return _m(e5, t3, n4);
          case 22:
            return lm(e5, t3, n4);
        }
        throw Error(wl(156, t3.tag));
      };
      Fy = "function" === typeof reportError ? reportError : function(e5) {
        console.error(e5);
      };
      jy.prototype.render = Ay.prototype.render = function(e5) {
        var t3 = this._internalRoot;
        if (null === t3) throw Error(wl(409));
        Oy(e5, t3, null, null);
      }, jy.prototype.unmount = Ay.prototype.unmount = function() {
        var e5 = this._internalRoot;
        if (null !== e5) {
          this._internalRoot = null;
          var t3 = e5.containerInfo;
          Xv(function() {
            Oy(null, e5, null, null);
          }), t3[Xf] = null;
        }
      }, jy.prototype.unstable_scheduleHydration = function(e5) {
        if (e5) {
          var t3 = Yu();
          e5 = { blockedOn: null, target: e5, priority: t3 };
          for (var n4 = 0; n4 < rc.length && 0 !== t3 && t3 < rc[n4].priority; n4++) ;
          rc.splice(n4, 0, e5), 0 === n4 && sc(e5);
        }
      }, Vu = function(e5) {
        switch (e5.tag) {
          case 3:
            var t3 = e5.stateNode;
            if (t3.current.memoizedState.isDehydrated) {
              var n4 = Ou(t3.pendingLanes);
              0 !== n4 && (Uu(t3, 1 | n4), Hv(t3, vu()), 0 === (6 & hv) && (Pv = vu() + 500, _p()));
            }
            break;
          case 13:
            Xv(function() {
              var t4 = yh(e5, 1);
              if (null !== t4) {
                var n5 = jv();
                Uv(t4, e5, 1, n5);
              }
            }), Iy(e5, 1);
        }
      }, Qu = function(e5) {
        if (13 === e5.tag) {
          var t3 = yh(e5, 134217728);
          if (null !== t3) {
            var n4 = jv();
            Uv(t3, e5, 134217728, n4);
          }
          Iy(e5, 134217728);
        }
      }, qu = function(e5) {
        if (13 === e5.tag) {
          var t3 = Bv(e5), n4 = yh(e5, t3);
          if (null !== n4) {
            var r4 = jv();
            Uv(n4, e5, t3, r4);
          }
          Iy(e5, t3);
        }
      }, Yu = function() {
        return Hu;
      }, Gu = function(e5, t3) {
        var n4 = Hu;
        try {
          return Hu = e5, t3();
        } finally {
          Hu = n4;
        }
      }, js = function(e5, t3, n4) {
        switch (t3) {
          case "input":
            if (vs(e5, n4), t3 = n4.name, "radio" === n4.type && null != t3) {
              for (n4 = e5; n4.parentNode; ) n4 = n4.parentNode;
              for (n4 = n4.querySelectorAll("input[name=" + JSON.stringify("" + t3) + '][type="radio"]'), t3 = 0; t3 < n4.length; t3++) {
                var r4 = n4[t3];
                if (r4 !== e5 && r4.form === e5.form) {
                  var a4 = ap(r4);
                  if (!a4) throw Error(wl(90));
                  fs(r4), vs(r4, a4);
                }
              }
            }
            break;
          case "textarea":
            xs(e5, n4);
            break;
          case "select":
            t3 = n4.value, null != t3 && Ss(e5, !!n4.multiple, t3, false);
        }
      }, Qs = Kv, qs = Xv;
      Qy = { usingClientEntryPoint: false, Events: [np, rp, ap, Ws, Vs, Kv] };
      qy = { findFiberByHostInstance: tp, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
      Yy = { bundleType: qy.bundleType, version: qy.version, rendererPackageName: qy.rendererPackageName, rendererConfig: qy.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Fl.ReactCurrentDispatcher, findHostInstanceByFiber: function(e5) {
        return e5 = du(e5), null === e5 ? null : e5.stateNode;
      }, findFiberByHostInstance: qy.findFiberByHostInstance || Dy, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        Gy = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!Gy.isDisabled && Gy.supportsFiber) try {
          xu = Gy.inject(Yy), $u = Gy;
        } catch (cb) {
        }
      }
      hl.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Qy, hl.createPortal = function(e5, t3) {
        var n4 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!By(t3)) throw Error(wl(200));
        return Ny(e5, t3, null, n4);
      }, hl.createRoot = function(e5, t3) {
        if (!By(e5)) throw Error(wl(299));
        var n4 = false, r4 = "", a4 = Fy;
        return null !== t3 && void 0 !== t3 && (true === t3.unstable_strictMode && (n4 = true), void 0 !== t3.identifierPrefix && (r4 = t3.identifierPrefix), void 0 !== t3.onRecoverableError && (a4 = t3.onRecoverableError)), t3 = Ty(e5, 1, false, null, null, n4, false, r4, a4), e5[Xf] = t3.current, $f(8 === e5.nodeType ? e5.parentNode : e5), new Ay(t3);
      }, hl.findDOMNode = function(e5) {
        if (null == e5) return null;
        if (1 === e5.nodeType) return e5;
        var t3 = e5._reactInternals;
        if (void 0 === t3) {
          if ("function" === typeof e5.render) throw Error(wl(188));
          throw e5 = Object.keys(e5).join(","), Error(wl(268, e5));
        }
        return e5 = du(t3), e5 = null === e5 ? null : e5.stateNode, e5;
      }, hl.flushSync = function(e5) {
        return Xv(e5);
      }, hl.hydrate = function(e5, t3, n4) {
        if (!Uy(t3)) throw Error(wl(200));
        return Vy(null, e5, t3, true, n4);
      }, hl.hydrateRoot = function(e5, t3, n4) {
        if (!By(e5)) throw Error(wl(405));
        var r4 = null != n4 && n4.hydratedSources || null, a4 = false, o3 = "", i4 = Fy;
        if (null !== n4 && void 0 !== n4 && (true === n4.unstable_strictMode && (a4 = true), void 0 !== n4.identifierPrefix && (o3 = n4.identifierPrefix), void 0 !== n4.onRecoverableError && (i4 = n4.onRecoverableError)), t3 = Ry(t3, null, e5, 1, null != n4 ? n4 : null, a4, false, o3, i4), e5[Xf] = t3.current, $f(e5), r4) for (e5 = 0; e5 < r4.length; e5++) n4 = r4[e5], a4 = n4._getVersion, a4 = a4(n4._source), null == t3.mutableSourceEagerHydrationData ? t3.mutableSourceEagerHydrationData = [n4, a4] : t3.mutableSourceEagerHydrationData.push(n4, a4);
        return new jy(t3);
      }, hl.render = function(e5, t3, n4) {
        if (!Uy(t3)) throw Error(wl(200));
        return Vy(null, e5, t3, false, n4);
      }, hl.unmountComponentAtNode = function(e5) {
        if (!Uy(e5)) throw Error(wl(40));
        return !!e5._reactRootContainer && (Xv(function() {
          Vy(null, null, e5, false, function() {
            e5._reactRootContainer = null, e5[Xf] = null;
          });
        }), true);
      }, hl.unstable_batchedUpdates = Kv, hl.unstable_renderSubtreeIntoContainer = function(e5, t3, n4, r4) {
        if (!Uy(n4)) throw Error(wl(200));
        if (null == e5 || void 0 === e5._reactInternals) throw Error(wl(38));
        return Vy(e5, t3, n4, false, r4);
      }, hl.version = "18.3.1-next-f1338f8080-20240426", Ky(), pl.exports = hl;
      Xy = pl.exports;
      Zy = Xy;
      fl.createRoot = Zy.createRoot, fl.hydrateRoot = Zy.hydrateRoot;
      Jy = { exports: {} };
      eb = {};
      tb = ul;
      nb = Symbol.for("react.element");
      rb = Symbol.for("react.fragment");
      ab = Object.prototype.hasOwnProperty;
      ob = tb.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
      ib = { key: true, ref: true, __self: true, __source: true };
      eb.Fragment = rb, eb.jsx = lb, eb.jsxs = lb, Jy.exports = eb;
      sb = Jy.exports;
    }
  });

  // dist/js/common.a5c0980c.js
  function a2(e5) {
    "undefined" !== typeof window && (window.__onVoiceEvent = (t3, c4) => {
      try {
        e5(t3, c4 || {});
      } catch (n4) {
        console.error("[voice event]", t3, n4);
      }
    });
  }
  function p2(e5) {
    const t3 = e5.slice();
    for (let c4 = t3.length - 1; c4 > 0; c4--) {
      const e6 = Math.floor(Math.random() * (c4 + 1));
      [t3[c4], t3[e6]] = [t3[e6], t3[c4]];
    }
    return t3;
  }
  function f2(e5, t3) {
    const c4 = String(e5 || "").replace(/[^\u4e00-\u9fa5]/g, "");
    if (!c4) return "empty";
    if (c4.includes(t3.c)) return "ok";
    if (t3.w && c4.includes(t3.w)) return "ok";
    const n4 = w2(t3.p);
    if (!n4) return "no";
    try {
      if (i2 && "function" === typeof i2.pinyinOf) {
        const e6 = i2.pinyinOf(c4) || "", t4 = e6.split(/\s+/).filter(Boolean);
        if (t4.indexOf(n4) >= 0) return "ok";
      }
    } catch (o3) {
    }
    const s4 = m2[n4] || [];
    for (let i4 = 0; i4 < s4.length; i4++) if (c4.includes(s4[i4])) return "ok";
    return "no";
  }
  function g2(e5, t3, c4) {
    const n4 = e5.map((e6) => {
      const t4 = c4[e6.c] || { f: 0, w: 0 };
      return { ch: e6, key: (t4.f || 0) - (t4.w || 0) + ((t4.f || 0) >= 3 ? 2 : 0) + 2 * Math.random() };
    });
    return n4.sort((e6, t4) => e6.key - t4.key), n4.slice(0, t3).map((e6) => e6.ch);
  }
  function x2() {
    return Object.assign({}, b2, y2.get("hzk_settings", {}));
  }
  function k2(e5) {
    y2.set("hzk_settings", e5);
  }
  function v2() {
    return y2.get("hzk_stats", {});
  }
  function j2(e5) {
    y2.set("hzk_stats", e5);
  }
  function N2() {
    return y2.get("hzk_last", {}) || {};
  }
  function S2(e5) {
    y2.set("hzk_last", e5);
  }
  function E2() {
    const e5 = window.AudioContext || window.webkitAudioContext;
    return e5 ? (C2 || (C2 = new e5()), "suspended" === C2.state && C2.resume(), C2) : null;
  }
  function M2(e5, t3, c4, n4, s4 = 0, i4 = null) {
    const o3 = E2();
    if (!o3) return;
    const a4 = o3.currentTime + s4, r4 = o3.createOscillator(), l4 = o3.createGain();
    r4.type = c4, r4.frequency.setValueAtTime(e5, a4), i4 && r4.frequency.exponentialRampToValueAtTime(i4, a4 + t3), l4.gain.setValueAtTime(n4, a4), l4.gain.exponentialRampToValueAtTime(1e-4, a4 + t3), r4.connect(l4).connect(o3.destination), r4.start(a4), r4.stop(a4 + t3 + 0.05);
  }
  function q2() {
    E2();
  }
  function Q2(e5, t3) {
    const c4 = (Array.isArray(e5) ? e5 : [e5]).map((e6) => "string" === typeof e6 ? { t: e6 } : e6), n4 = P2(t3);
    if (i2) {
      i2.stop();
      let e6 = "";
      c4.forEach((t5) => {
        e6 && !/[\uff01\uff1f\u3002\uff0c,\u3001.!?]$/.test(e6) && (e6 += "\uFF0C"), e6 += t5.t;
      });
      let t4 = n4, s4 = 0;
      return c4.forEach((e7) => {
        e7.t.length > s4 && (s4 = e7.t.length, t4 = e7.r || n4);
      }), void i2.speak(e6, Math.round(100 * t4) / 100);
    }
    "undefined" !== typeof window && "speechSynthesis" in window && (speechSynthesis.cancel(), L2 && clearTimeout(L2), L2 = setTimeout(() => {
      c4.forEach((e6) => {
        const t4 = new SpeechSynthesisUtterance(e6.t);
        t4.lang = "zh-CN", G2.voice && (t4.voice = G2.voice), t4.rate = e6.r || n4, t4.pitch = 1.06, speechSynthesis.speak(t4);
      });
    }, 60));
  }
  function K2() {
    if ("undefined" !== typeof window && "speechSynthesis" in window) try {
      speechSynthesis.cancel();
    } catch (e5) {
    }
  }
  function X2() {
    const [, t3] = ul.useState(0);
    return ul.useCallback(() => t3((e5) => e5 + 1), []);
  }
  function Y2(t3) {
    const c4 = ul.useRef(t3);
    return c4.current = t3, c4;
  }
  function Z2() {
    const [t3, c4] = ul.useState(false), n4 = ul.useRef(null);
    ul.useEffect(() => () => {
      n4.current && clearTimeout(n4.current);
    }, []);
    const s4 = ul.useCallback(() => {
      c4(false), setTimeout(() => c4(true), 20), n4.current && clearTimeout(n4.current), n4.current = setTimeout(() => c4(false), 520);
    }, []);
    return { cls: t3 ? "bump" : "", bump: s4 };
  }
  function ee2(e5, t3, c4) {
    const n4 = P2(c4), s4 = t3 ? [{ t: "\u8FD9\u662F", r: n4 }] : [];
    s4.push({ t: e5.c, r: 0.85 * n4 }), e5.w && s4.push({ t: e5.w, r: 0.95 * n4 }), t3 || s4.push({ t: e5.c, r: 0.85 * n4 }), Q2(s4, c4);
  }
  function te2({ groupId: c4, onHome: s4, chars: i4, title: o3, onDone: a4 }) {
    const { settings: r4, patchSettings: l4 } = n2(), [p4, d3] = ul.useState(0), w3 = i4 && i4.length ? i4 : u2(c4), m4 = w3[Math.min(p4, w3.length - 1)], f3 = !!a4, g4 = p4 >= w3.length - 1, { cls: b3, bump: y3 } = Z2(), x3 = !!r4.learnIcon;
    return ul.useEffect(() => {
      const e5 = setTimeout(() => ee2(w3[0], false, r4), 250);
      return () => clearTimeout(e5);
    }, []), ul.useEffect(() => {
      0 !== p4 && ee2(m4, false, r4);
    }, [p4]), sb.jsxs("section", { className: "screen active", id: "screen-learn", children: [sb.jsxs("header", { className: "topbar", children: [sb.jsx("button", { className: "icon-btn", "aria-label": "\u56DE\u5BB6", onClick: () => {
      T2.tap(), s4();
    }, children: "\u{1F3E0}" }), sb.jsx("div", { className: "top-title", children: o3 || "\u{1F4D6} " + h2(c4) }), sb.jsx("button", { className: "icon-btn", "aria-label": x3 ? "\u9690\u85CF\u56FE\u7247\u63D0\u793A" : "\u663E\u793A\u56FE\u7247\u63D0\u793A", title: "\u770B\u56FE/\u85CF\u56FE", onClick: () => {
      l4({ learnIcon: !x3 }), T2.tap(), y3();
    }, children: x3 ? "\u{1F648}" : "\u{1F5BC}\uFE0F" }), sb.jsxs("div", { className: "counter", children: [p4 + 1, " / ", w3.length] })] }), sb.jsxs("div", { className: "learn-stage", children: [sb.jsx("button", { className: "nav-btn", "aria-label": "\u4E0A\u4E00\u4E2A", style: f3 && 0 === p4 ? { visibility: "hidden" } : void 0, onClick: () => {
      T2.tap(), f3 ? p4 > 0 && d3(p4 - 1) : d3((p4 - 1 + w3.length) % w3.length);
    }, children: "\u2039" }), sb.jsxs("button", { className: "flash-card kai " + b3 + (x3 ? "" : " no-icon"), id: "flashCard", onClick: () => {
      T2.tap(), y3(), ee2(m4, true, r4);
    }, children: [sb.jsx("div", { className: "fc-emoji" + (m4.e.length > 2 ? " small" : ""), children: m4.e }), sb.jsx("div", { className: "fc-char kai", children: m4.c }), sb.jsx("div", { className: "fc-pinyin", children: m4.p }), sb.jsx("div", { className: "fc-word", children: m4.w ? "\u8BCD\u8BED \xB7 " + m4.w : "" }), sb.jsx("div", { className: "fc-tap-hint", children: "\u{1F446} \u70B9\u4E00\u70B9\uFF0C\u518D\u542C\u4E00\u6B21" })] }), sb.jsx("button", { className: "nav-btn", "aria-label": f3 && g4 ? "\u53BB\u95EF\u5173" : "\u4E0B\u4E00\u4E2A", style: f3 && g4 ? { color: "#7ED957" } : void 0, onClick: () => {
      T2.tap(), f3 ? g4 ? a4() : d3(p4 + 1) : d3((p4 + 1) % w3.length);
    }, children: f3 && g4 ? "\u2728" : "\u203A" })] })] });
  }
  function ie2(e5 = 40) {
    null == ne2 || ne2(e5);
  }
  function oe2() {
    const [c4, n4] = ul.useState([]);
    return ul.useEffect(() => (ne2 = (e5) => {
      const t3 = [];
      for (let n5 = 0; n5 < e5; n5++) t3.push({ id: ++se2, left: 100 * Math.random(), fontSize: 15 + 18 * Math.random(), duration: 1.6 + 1.6 * Math.random(), delay: 0.7 * Math.random(), emo: ce2[n5 % ce2.length] });
      n4((e6) => e6.concat(t3));
      const c5 = new Set(t3.map((e6) => e6.id));
      setTimeout(() => n4((e6) => e6.filter((e7) => !c5.has(e7.id))), 4200);
    }, () => {
      ne2 = null;
    }), []), sb.jsx("div", { className: "confetti-layer", children: c4.map((e5) => sb.jsx("span", { className: "confetti", style: { left: e5.left + "%", fontSize: e5.fontSize + "px", animationDuration: e5.duration + "s", animationDelay: e5.delay + "s" }, children: e5.emo }, e5.id)) });
  }
  function ae2(e5, t3, c4) {
    let n4 = p2(u2(e5).filter((e6) => e6.c !== t3.c));
    n4.length < c4 - 1 && (n4 = n4.concat(p2(l2.filter((e6) => e6.c !== t3.c && !n4.some((t4) => t4.c === e6.c)))));
    const s4 = p2([t3, ...n4.slice(0, c4 - 1)]);
    return s4.map((e6, t4) => ({ char: e6, color: J2[t4 % J2.length], status: "", disabled: false }));
  }
  function re2(e5, t3) {
    const c4 = P2(t3), n4 = _2[Math.floor(Math.random() * _2.length)], s4 = R2[Math.floor(Math.random() * R2.length)], i4 = [{ t: n4 + "\uFF0C", r: 0.95 * c4 }];
    e5.w ? (i4.push({ t: e5.w + "\u7684" + e5.c, r: 0.85 * c4 }), i4.push({ t: e5.c, r: 0.75 * c4 })) : (i4.push({ t: e5.c, r: 0.85 * c4 }), i4.push({ t: e5.c, r: 0.75 * c4 })), i4.push({ t: s4, r: 0.95 * c4 }), Q2(i4, t3);
  }
  function le2({ groupId: c4, onHome: s4, onFinish: i4, targets: o3 }) {
    const { settings: a4, patchSettings: r4, bumpStat: l4 } = n2(), h4 = X2(), d3 = Y2(a4), { cls: w3, bump: m4 } = Z2(), { cls: f3, bump: b3 } = Z2(), y3 = ul.useRef(null), x3 = ul.useRef(null);
    if (!x3.current) {
      let e5;
      if (o3 && o3.length) e5 = p2(o3).map((e6, t3) => ({ target: e6, opts: 1 === o3.length ? 4 : t3 < 2 ? 2 : 4 }));
      else {
        const t3 = u2(c4), n4 = Math.min(a4.len, t3.length);
        e5 = g2(t3, n4, {}).map((e6, t4) => ({ target: e6, opts: t4 < 2 ? 2 : 4 }));
      }
      x3.current = { qs: e5, i: 0, gold: 0, silver: 0, attempts: 0, locked: false, options: [], bubble: { text: "\u542C\u4E00\u542C\uFF0C\u627E\u51FA\u6765 \u{1F447}", cls: "" }, mascot: "\u{1F43C}", stars: 0, streak: 0, pop: true, dots: e5.map(() => "") };
    }
    const k3 = ul.useRef(0), v3 = 400, j3 = 1200, N3 = () => {
      const e5 = x3.current;
      e5.attempts = 0, e5.locked = false, e5.pop = true, e5.bubble = { text: "\u542C\u4E00\u542C\uFF0C\u627E\u51FA\u6765 \u{1F447}", cls: "" }, e5.mascot = "\u{1F43C}", e5.options = ae2(c4, e5.qs[e5.i].target, e5.qs[e5.i].opts), h4(), y3.current = setTimeout(() => re2(e5.qs[e5.i].target, d3.current), 250);
    };
    ul.useEffect(() => (N3(), () => {
      y3.current && clearTimeout(y3.current);
    }), []);
    const S3 = () => {
      const e5 = x3.current;
      if (e5.i++, e5.i >= e5.qs.length) {
        const t3 = e5.qs.filter((t4, c5) => "gold" !== e5.dots[c5]).map((e6) => e6.target);
        i4(e5.gold, e5.silver, e5.qs.length, t3.length ? t3 : void 0);
      } else N3();
    }, z3 = (e5) => {
      const t3 = x3.current, c5 = Date.now();
      if (t3.locked || e5.disabled || c5 < k3.current) return;
      t3.pop = false, k3.current = c5 + v3;
      const n4 = t3.qs[t3.i].target, s5 = P2(d3.current);
      if (e5.char.c === n4.c) {
        t3.locked = true, e5.status = "correct";
        const c6 = 0 === t3.attempts;
        l4(n4.c, c6), c6 ? t3.gold++ : t3.silver++, t3.dots[t3.i] = c6 ? "gold" : "silver", t3.stars = t3.gold;
        const i5 = c6 ? D2[t3.streak + 1] : void 0;
        c6 ? t3.streak++ : t3.streak = 0;
        const o4 = null != i5 ? i5 : I2[Math.floor(Math.random() * I2.length)];
        t3.mascot = o4.m, t3.bubble = { text: t3.streak >= 2 ? o4.b + ` \u{1F525}x${t3.streak}` : o4.b, cls: "good" }, m4(), b3(), i5 ? (T2.win(), ie2(20)) : (T2.cheer(), c6 && ie2(10));
        const a5 = [{ t: o4.s }];
        a5.push({ t: "\u8FD9\u662F\u300C" + n4.c + "\u300D", r: 0.95 * s5 }, { t: n4.c, r: 0.85 * s5 }), Q2(a5, d3.current), h4(), y3.current = setTimeout(S3, i5 ? 2600 : 2e3);
      } else {
        t3.attempts++, t3.streak = 0, e5.status = "wrong", e5.disabled = true, T2.wrong();
        const i5 = O2[Math.floor(Math.random() * O2.length)], o4 = B2[Math.floor(Math.random() * B2.length)];
        if (t3.attempts >= 3) t3.bubble = { text: "\u522B\u6025\uFF0C\u5B83\u5728\u8FD9\u91CC \u2728 \u70B9\u70B9\u5B83\uFF01", cls: "hint" }, t3.mascot = "\u{1F917}", t3.options.forEach((e6) => {
          e6.char.c !== n4.c ? e6.disabled = true : e6.status = "hint-glow";
        }), Q2([{ t: i5 }, { t: "\u522B\u6025\uFF0C\u5B83\u5728\u8FD9\u91CC" }, { t: n4.c, r: 0.85 * s5 }], d3.current);
        else {
          const a5 = e5.char;
          t3.mascot = "\u{1F914}";
          const r5 = A2[Math.floor(Math.random() * A2.length)];
          t3.bubble = { text: a5.w ? `\u300C${a5.c}\u300D\u662F${a5.w}\u54E6\uFF0C\u518D\u627E\u627E \u{1F4AA}` : `\u300C${a5.c}\u300D\u4E0D\u5BF9\u54E6\uFF0C${r5} \u{1F4AA}`, cls: "bad" };
          const l5 = [{ t: i5, r: 0.95 * s5 }];
          a5.w ? l5.push({ t: "\u8FD9\u4E2A\u5B57\u5FF5\u300C" + a5.c + "\u300D\uFF0C" + a5.w + "\u7684" + a5.c, r: 0.85 * s5 }) : l5.push({ t: "\u8FD9\u4E2A\u5B57\u5FF5\u300C" + a5.c + "\u300D", r: 0.85 * s5 }), n4.w ? l5.push({ t: "\u6211\u4EEC\u8981\u627E\u7684\u662F\u300C" + n4.w + "\u7684" + n4.c + "\u300D\u54E6\uFF0C" + o4, r: 0.95 * s5 }) : l5.push({ t: "\u6211\u4EEC\u8981\u627E\u7684\u662F\u300C" + n4.c + "\u300D\u54E6\uFF0C" + o4, r: 0.95 * s5 }), Q2(l5, d3.current), k3.current = c5 + j3;
        }
        b3(), h4();
      }
    }, C3 = x3.current, E3 = C3.qs[C3.i], M3 = a4.hints;
    return sb.jsxs("section", { className: "screen active", id: "screen-quiz", children: [sb.jsxs("header", { className: "topbar", children: [sb.jsx("button", { className: "icon-btn", "aria-label": "\u56DE\u5BB6", onClick: () => {
      T2.tap(), s4();
    }, children: "\u{1F3E0}" }), sb.jsx("div", { className: "mascot " + f3, id: "mascot", children: C3.mascot }), sb.jsx("button", { className: "icon-btn", "aria-label": M3 ? "\u9690\u85CF\u56FE\u7247\u63D0\u793A" : "\u663E\u793A\u56FE\u7247\u63D0\u793A", title: "\u770B\u56FE\u63D0\u793A\u5F00/\u5173", onClick: () => {
      r4({ hints: !M3 }), T2.tap();
    }, children: M3 ? "\u{1F648}" : "\u{1F5BC}\uFE0F" }), sb.jsx("button", { className: "icon-btn", "aria-label": "\u4E0B\u4E00\u9898", title: "\u4E0B\u4E00\u9898", onClick: () => {
      C3.locked || (T2.tap(), y3.current && clearTimeout(y3.current), S3());
    }, children: "\u23ED\uFE0F" }), sb.jsxs("div", { className: "star-count " + w3, id: "starCount", children: ["\u2B50 ", C3.stars] }), C3.streak >= 2 && sb.jsxs("div", { className: "streak-badge", children: ["\u{1F525}x", C3.streak] })] }), sb.jsxs("div", { className: "bubble-row", children: [sb.jsx("div", { className: "bubble " + C3.bubble.cls, id: "bubbleText", children: C3.bubble.text }), sb.jsxs("button", { className: "replay-btn", onClick: () => {
      T2.tap(), re2(E3.target, d3.current);
    }, children: ["\u{1F50A}", sb.jsx("small", { children: "\u518D\u542C\u4E00\u904D" })] })] }), sb.jsx("div", { className: "dots", children: C3.qs.map((e5, c5) => sb.jsx("span", { className: "dot" + (C3.dots[c5] ? " " + C3.dots[c5] : "") + (c5 === C3.i ? " cur" : "") }, c5)) }), sb.jsx("div", { className: "options", id: "options", children: C3.options.map((e5, c5) => sb.jsxs("button", { className: "opt " + (C3.pop ? "pop " : "") + e5.status + (M3 ? " with-emoji" : ""), style: { borderColor: e5.color, "--d": 70 * c5 + "ms" }, disabled: e5.disabled, onClick: () => z3(e5), children: [sb.jsx("span", { className: "opt-emoji" + (e5.char.e.length > 2 ? " small" : ""), style: { display: M3 ? "" : "none" }, children: e5.char.e }), sb.jsx("span", { className: "opt-char kai", children: e5.char.c })] }, `${C3.i}-${c5}`)) })] });
  }
  var c2, n2, s2, i2, o2, r2, l2, u2, h2, d2, w2, m2, b2, y2, z2, C2, F2, T2, _2, R2, I2, A2, O2, B2, D2, V2, $2, J2, U2, H2, P2, G2, L2, W2, ce2, ne2, se2;
  var init_common_a5c0980c = __esm({
    "dist/js/common.a5c0980c.js"() {
      init_vendors_9e84cbaa();
      c2 = ul.createContext(null);
      n2 = () => ul.useContext(c2);
      s2 = { groups: [{ id: "family", name: "\u6211\u7684\u5BB6\u4EBA", icon: "\u{1F3E1}", color: "#FF7BAC", chars: [{ c: "\u7238", p: "b\xE0", e: "\u{1F468}", w: "\u7238\u7238" }, { c: "\u5988", p: "m\u0101", e: "\u{1F469}", w: "\u5988\u5988" }, { c: "\u7237", p: "y\xE9", e: "\u{1F474}", w: "\u7237\u7237" }, { c: "\u5976", p: "n\u01CEi", e: "\u{1F475}", w: "\u5976\u5976" }, { c: "\u54E5", p: "g\u0113", e: "\u{1F466}", w: "\u54E5\u54E5" }, { c: "\u59D0", p: "ji\u011B", e: "\u{1F467}", w: "\u59D0\u59D0" }, { c: "\u5BB6", p: "ji\u0101", e: "\u{1F3E0}", w: "\u56DE\u5BB6" }, { c: "\u5B9D", p: "b\u01CEo", e: "\u{1F476}", w: "\u5B9D\u5B9D" }, { c: "\u5F1F", p: "d\xEC", e: "\u{1F9D2}", w: "\u5F1F\u5F1F" }, { c: "\u53D4", p: "sh\u016B", e: "\u{1F468}", w: "\u53D4\u53D4" }, { c: "\u7231", p: "\xE0i", e: "\u2764\uFE0F", w: "\u7231\u4F60" }] }, { id: "animals", name: "\u53EF\u7231\u52A8\u7269", icon: "\u{1F43E}", color: "#FF9F43", chars: [{ c: "\u732B", p: "m\u0101o", e: "\u{1F431}", w: "\u5C0F\u732B" }, { c: "\u72D7", p: "g\u01D2u", e: "\u{1F436}", w: "\u5C0F\u72D7" }, { c: "\u9C7C", p: "y\xFA", e: "\u{1F41F}", w: "\u5C0F\u9C7C" }, { c: "\u9E1F", p: "ni\u01CEo", e: "\u{1F426}", w: "\u5C0F\u9E1F" }, { c: "\u9A6C", p: "m\u01CE", e: "\u{1F434}", w: "\u5C0F\u9A6C" }, { c: "\u725B", p: "ni\xFA", e: "\u{1F42E}", w: "\u5C0F\u725B" }, { c: "\u5154", p: "t\xF9", e: "\u{1F430}", w: "\u5C0F\u5154" }, { c: "\u866B", p: "ch\xF3ng", e: "\u{1F41B}", w: "\u5C0F\u866B" }, { c: "\u9E2D", p: "y\u0101", e: "\u{1F986}", w: "\u9E2D\u5B50" }, { c: "\u9E21", p: "j\u012B", e: "\u{1F414}", w: "\u5C0F\u9E21" }, { c: "\u732A", p: "zh\u016B", e: "\u{1F437}", w: "\u5C0F\u732A" }, { c: "\u7F8A", p: "y\xE1ng", e: "\u{1F411}", w: "\u5C0F\u7F8A" }, { c: "\u7334", p: "h\xF3u", e: "\u{1F435}", w: "\u5C0F\u7334" }, { c: "\u718A", p: "xi\xF3ng", e: "\u{1F43B}", w: "\u5C0F\u718A" }, { c: "\u9F9F", p: "gu\u012B", e: "\u{1F422}", w: "\u4E4C\u9F9F" }] }, { id: "food", name: "\u597D\u5403\u98DF\u7269", icon: "\u{1F34E}", color: "#7ED957", chars: [{ c: "\u7C73", p: "m\u01D0", e: "\u{1F35A}", w: "\u5927\u7C73" }, { c: "\u9762", p: "mi\xE0n", e: "\u{1F35C}", w: "\u9762\u6761" }, { c: "\u86CB", p: "d\xE0n", e: "\u{1F95A}", w: "\u9E21\u86CB" }, { c: "\u679C", p: "gu\u01D2", e: "\u{1F34E}", w: "\u6C34\u679C" }, { c: "\u83DC", p: "c\xE0i", e: "\u{1F96C}", w: "\u9752\u83DC" }, { c: "\u8336", p: "ch\xE1", e: "\u{1F375}", w: "\u559D\u8336" }, { c: "\u7CD6", p: "t\xE1ng", e: "\u{1F36C}", w: "\u7CD6\u679C" }, { c: "\u997C", p: "b\u01D0ng", e: "\u{1F36A}", w: "\u997C\u5E72" }, { c: "\u74DC", p: "gu\u0101", e: "\u{1F349}", w: "\u897F\u74DC" }, { c: "\u6C64", p: "t\u0101ng", e: "\u{1F372}", w: "\u559D\u6C64" }, { c: "\u996D", p: "f\xE0n", e: "\u{1F35A}", w: "\u5403\u996D" }, { c: "\u8C46", p: "d\xF2u", e: "\u{1FAD8}", w: "\u8C46\u8C46" }, { c: "\u7CD5", p: "g\u0101o", e: "\u{1F382}", w: "\u86CB\u7CD5" }] }, { id: "colors", name: "\u5F69\u8272\u4E16\u754C", icon: "\u{1F3A8}", color: "#FF6B6B", chars: [{ c: "\u7EA2", p: "h\xF3ng", e: "\u{1F534}", w: "\u7EA2\u8272" }, { c: "\u9EC4", p: "hu\xE1ng", e: "\u{1F7E1}", w: "\u9EC4\u8272" }, { c: "\u84DD", p: "l\xE1n", e: "\u{1F535}", w: "\u84DD\u8272" }, { c: "\u7EFF", p: "l\u01DC", e: "\u{1F7E2}", w: "\u7EFF\u8272" }, { c: "\u9ED1", p: "h\u0113i", e: "\u26AB", w: "\u9ED1\u8272" }, { c: "\u767D", p: "b\xE1i", e: "\u26AA", w: "\u767D\u8272" }, { c: "\u7D2B", p: "z\u01D0", e: "\u{1F7E3}", w: "\u7D2B\u8272" }, { c: "\u6A59", p: "ch\xE9ng", e: "\u{1F7E0}", w: "\u6A59\u8272" }, { c: "\u7C89", p: "f\u011Bn", e: "\u{1F338}", w: "\u7C89\u8272" }, { c: "\u91D1", p: "j\u012Bn", e: "\u{1F947}", w: "\u91D1\u8272" }, { c: "\u5F69", p: "c\u01CEi", e: "\u{1F308}", w: "\u5F69\u8272" }] }, { id: "body", name: "\u6211\u7684\u8EAB\u4F53", icon: "\u270B", color: "#5EC6F0", chars: [{ c: "\u53E3", p: "k\u01D2u", e: "\u{1F444}", w: "\u53E3\u6C34" }, { c: "\u624B", p: "sh\u01D2u", e: "\u270B", w: "\u5C0F\u624B" }, { c: "\u773C", p: "y\u01CEn", e: "\u{1F440}", w: "\u773C\u775B" }, { c: "\u8033", p: "\u011Br", e: "\u{1F442}", w: "\u8033\u6735" }, { c: "\u9F3B", p: "b\xED", e: "\u{1F443}", w: "\u9F3B\u5B50" }, { c: "\u7259", p: "y\xE1", e: "\u{1F9B7}", w: "\u7259\u9F7F" }, { c: "\u820C", p: "sh\xE9", e: "\u{1F445}", w: "\u820C\u5934" }, { c: "\u8DB3", p: "z\xFA", e: "\u{1F9B6}", w: "\u8DB3\u7403" }, { c: "\u5FC3", p: "x\u012Bn", e: "\u2764\uFE0F", w: "\u7231\u5FC3" }, { c: "\u5934", p: "t\xF3u", e: "\u{1F600}", w: "\u70B9\u5934" }, { c: "\u8138", p: "li\u01CEn", e: "\u{1F60A}", w: "\u8138\u86CB" }, { c: "\u53D1", p: "f\xE0", e: "\u{1F487}", w: "\u5934\u53D1" }, { c: "\u817F", p: "tu\u01D0", e: "\u{1F9B5}", w: "\u5927\u817F" }] }, { id: "actions", name: "\u52A8\u8D77\u6765", icon: "\u{1F3C3}", color: "#E84393", chars: [{ c: "\u8D70", p: "z\u01D2u", e: "\u{1F6B6}", w: "\u8D70\u8DEF" }, { c: "\u8DD1", p: "p\u01CEo", e: "\u{1F3C3}", w: "\u8DD1\u6B65" }, { c: "\u5403", p: "ch\u012B", e: "\u{1F37D}\uFE0F", w: "\u5403\u996D" }, { c: "\u7761", p: "shu\xEC", e: "\u{1F634}", w: "\u7761\u89C9" }, { c: "\u7B11", p: "xi\xE0o", e: "\u{1F604}", w: "\u7B11\u8138" }, { c: "\u54ED", p: "k\u016B", e: "\u{1F622}", w: "\u5927\u54ED" }, { c: "\u8DF3", p: "ti\xE0o", e: "\u{1F938}", w: "\u8DF3\u9AD8" }, { c: "\u5750", p: "zu\xF2", e: "\u{1FA91}", w: "\u5750\u4E0B" }, { c: "\u770B", p: "k\xE0n", e: "\u{1F440}", w: "\u770B\u4E66" }, { c: "\u542C", p: "t\u012Bng", e: "\u{1F442}", w: "\u542C\u8BDD" }, { c: "\u8BF4", p: "shu\u014D", e: "\u{1F4AC}", w: "\u8BF4\u8BDD" }, { c: "\u8BFB", p: "d\xFA", e: "\u{1F4D6}", w: "\u8BFB\u4E66" }, { c: "\u5199", p: "xi\u011B", e: "\u270D\uFE0F", w: "\u5199\u5B57" }, { c: "\u5531", p: "ch\xE0ng", e: "\u{1F3A4}", w: "\u5531\u6B4C" }, { c: "\u753B", p: "hu\xE0", e: "\u{1F3A8}", w: "\u753B\u753B" }, { c: "\u73A9", p: "w\xE1n", e: "\u{1F9F8}", w: "\u73A9\u800D" }] }, { id: "clothes", name: "\u7A7F\u8863\u670D", icon: "\u{1F455}", color: "#7B61FF", chars: [{ c: "\u8863", p: "y\u012B", e: "\u{1F455}", w: "\u8863\u670D" }, { c: "\u88E4", p: "k\xF9", e: "\u{1F456}", w: "\u88E4\u5B50" }, { c: "\u978B", p: "xi\xE9", e: "\u{1F45F}", w: "\u978B\u5B50" }, { c: "\u5E3D", p: "m\xE0o", e: "\u{1F9E2}", w: "\u5E3D\u5B50" }, { c: "\u889C", p: "w\xE0", e: "\u{1F9E6}", w: "\u889C\u5B50" }, { c: "\u88D9", p: "q\xFAn", e: "\u{1F457}", w: "\u88D9\u5B50" }, { c: "\u5305", p: "b\u0101o", e: "\u{1F392}", w: "\u4E66\u5305" }, { c: "\u888B", p: "d\xE0i", e: "\u{1F45B}", w: "\u53E3\u888B" }, { c: "\u56F4", p: "w\xE9i", e: "\u{1F9E3}", w: "\u56F4\u5DFE" }, { c: "\u6263", p: "k\xF2u", e: "\u{1F518}", w: "\u6263\u5B50" }] }, { id: "vehicles", name: "\u8F66\u8F66\u4E16\u754C", icon: "\u{1F697}", color: "#2E86DE", chars: [{ c: "\u8F66", p: "ch\u0113", e: "\u{1F697}", w: "\u6C7D\u8F66" }, { c: "\u8239", p: "chu\xE1n", e: "\u{1F6A2}", w: "\u5C0F\u8239" }, { c: "\u98DE", p: "f\u0113i", e: "\u2708\uFE0F", w: "\u98DE\u673A" }, { c: "\u6865", p: "qi\xE1o", e: "\u{1F309}", w: "\u5927\u6865" }, { c: "\u706F", p: "d\u0113ng", e: "\u{1F4A1}", w: "\u7535\u706F" }, { c: "\u8F6E", p: "l\xFAn", e: "\u{1F6DE}", w: "\u8F66\u8F6E" }, { c: "\u8DEF", p: "l\xF9", e: "\u{1F6E3}\uFE0F", w: "\u9A6C\u8DEF" }, { c: "\u9A91", p: "q\xED", e: "\u{1F6B4}", w: "\u9A91\u8F66" }, { c: "\u5212", p: "hu\xE1", e: "\u{1F6A3}", w: "\u5212\u8239" }, { c: "\u505C", p: "t\xEDng", e: "\u{1F17F}\uFE0F", w: "\u505C\u8F66" }, { c: "\u6C7D", p: "q\xEC", e: "\u{1F699}", w: "\u6C7D\u8F66" }] }, { id: "nature", name: "\u5927\u81EA\u7136", icon: "\u{1F308}", color: "#B69CFF", chars: [{ c: "\u65E5", p: "r\xEC", e: "\u2600\uFE0F", w: "\u65E5\u51FA" }, { c: "\u6708", p: "yu\xE8", e: "\u{1F319}", w: "\u6708\u4EAE" }, { c: "\u6C34", p: "shu\u01D0", e: "\u{1F4A7}", w: "\u559D\u6C34" }, { c: "\u706B", p: "hu\u01D2", e: "\u{1F525}", w: "\u706B\u7130" }, { c: "\u5C71", p: "sh\u0101n", e: "\u26F0\uFE0F", w: "\u5927\u5C71" }, { c: "\u6728", p: "m\xF9", e: "\u{1F333}", w: "\u5927\u6811" }, { c: "\u77F3", p: "sh\xED", e: "\u{1FAA8}", w: "\u77F3\u5934" }, { c: "\u4E91", p: "y\xFAn", e: "\u2601\uFE0F", w: "\u767D\u4E91" }, { c: "\u96E8", p: "y\u01D4", e: "\u{1F327}\uFE0F", w: "\u4E0B\u96E8" }, { c: "\u82B1", p: "hu\u0101", e: "\u{1F338}", w: "\u82B1\u6735" }, { c: "\u8349", p: "c\u01CEo", e: "\u{1F33F}", w: "\u5C0F\u8349" }, { c: "\u96EA", p: "xu\u011B", e: "\u2744\uFE0F", w: "\u4E0B\u96EA" }, { c: "\u98CE", p: "f\u0113ng", e: "\u{1F32C}\uFE0F", w: "\u5927\u98CE" }, { c: "\u661F", p: "x\u012Bng", e: "\u2B50", w: "\u661F\u661F" }, { c: "\u6D77", p: "h\u01CEi", e: "\u{1F30A}", w: "\u5927\u6D77" }] }, { id: "compare", name: "\u5927\u5C0F\u591A\u5C11", icon: "\u{1F418}", color: "#4ECDC4", chars: [{ c: "\u5927", p: "d\xE0", e: "\u{1F418}", w: "\u5927\u8C61" }, { c: "\u5C0F", p: "xi\u01CEo", e: "\u{1F41C}", w: "\u5C0F\u624B" }, { c: "\u591A", p: "du\u014D", e: "\u{1F351}\u{1F351}\u{1F351}", w: "\u5F88\u591A" }, { c: "\u5C11", p: "sh\u01CEo", e: "\u{1F351}", w: "\u591A\u5C11" }, { c: "\u4E0A", p: "sh\xE0ng", e: "\u2B06\uFE0F", w: "\u4E0A\u9762" }, { c: "\u4E0B", p: "xi\xE0", e: "\u2B07\uFE0F", w: "\u4E0B\u9762" }, { c: "\u5DE6", p: "zu\u01D2", e: "\u2B05\uFE0F", w: "\u5DE6\u624B" }, { c: "\u53F3", p: "y\xF2u", e: "\u27A1\uFE0F", w: "\u53F3\u624B" }, { c: "\u9AD8", p: "g\u0101o", e: "\u{1F992}", w: "\u9AD8\u5C71" }, { c: "\u77EE", p: "\u01CEi", e: "\u{1F439}", w: "\u77EE\u5C0F" }, { c: "\u5929", p: "ti\u0101n", e: "\u{1F324}\uFE0F", w: "\u5929\u7A7A" }, { c: "\u5730", p: "d\xEC", e: "\u{1F331}", w: "\u5927\u5730" }, { c: "\u4EBA", p: "r\xE9n", e: "\u{1F9CD}", w: "\u5927\u4EBA" }, { c: "\u597D", p: "h\u01CEo", e: "\u{1F44D}", w: "\u4F60\u597D" }] }, { id: "numbers", name: "\u6570\u5B57\u5B9D\u5B9D", icon: "\u{1F522}", color: "#E8B931", chars: [{ c: "\u4E00", p: "y\u012B", e: "1\uFE0F\u20E3" }, { c: "\u4E8C", p: "\xE8r", e: "2\uFE0F\u20E3" }, { c: "\u4E09", p: "s\u0101n", e: "3\uFE0F\u20E3" }, { c: "\u56DB", p: "s\xEC", e: "4\uFE0F\u20E3" }, { c: "\u4E94", p: "w\u01D4", e: "5\uFE0F\u20E3" }, { c: "\u516D", p: "li\xF9", e: "6\uFE0F\u20E3" }, { c: "\u4E03", p: "q\u012B", e: "7\uFE0F\u20E3" }, { c: "\u516B", p: "b\u0101", e: "8\uFE0F\u20E3" }, { c: "\u4E5D", p: "ji\u01D4", e: "9\uFE0F\u20E3" }, { c: "\u5341", p: "sh\xED", e: "\u{1F51F}" }, { c: "\u96F6", p: "l\xEDng", e: "0\uFE0F\u20E3" }] }] };
      i2 = "undefined" !== typeof window && window.HanziNative ? window.HanziNative : null;
      o2 = !(!i2 || "function" !== typeof i2.voiceStartRecord || "function" !== typeof i2.voiceRecognize);
      r2 = s2.groups;
      l2 = r2.flatMap((e5) => e5.chars);
      u2 = (e5) => "all" === e5 ? l2 : (r2.find((t3) => t3.id === e5) || r2[0]).chars;
      h2 = (e5) => "all" === e5 ? "\u5168\u90E8\u6C49\u5B57" : r2.find((t3) => t3.id === e5).name;
      d2 = { "\u0101": "a", "\xE1": "a", "\u01CE": "a", "\xE0": "a", "\u0113": "e", "\xE9": "e", "\u011B": "e", "\xE8": "e", "\u012B": "i", "\xED": "i", "\u01D0": "i", "\xEC": "i", "\u014D": "o", "\xF3": "o", "\u01D2": "o", "\xF2": "o", "\u016B": "u", "\xFA": "u", "\u01D4": "u", "\xF9": "u", "\u01D6": "v", "\u01D8": "v", "\u01DA": "v", "\u01DC": "v", "\xFC": "v" };
      w2 = (e5) => (e5 || "").toLowerCase().replace(/[\u0101\xe1\u01ce\xe0\u0113\xe9\u011b\xe8\u012b\xed\u01d0\xec\u014d\xf3\u01d2\xf2\u016b\xfa\u01d4\xf9\u01d6\u01d8\u01da\u01dc\xfc]/g, (e6) => d2[e6]);
      m2 = {};
      l2.forEach((e5) => {
        const t3 = w2(e5.p);
        t3 && (m2[t3] = m2[t3] || []).push(e5.c);
      });
      b2 = { rate: "normal", hints: true, len: 10, learnIcon: false, readIcon: false };
      y2 = { get(e5, t3) {
        try {
          if (i2 && "hzk_stats" === e5) {
            const e6 = i2.getProgress();
            return e6 ? JSON.parse(e6) : t3;
          }
          if (i2 && "hzk_settings" === e5) {
            const e6 = i2.getSettings();
            return e6 ? JSON.parse(e6) : t3;
          }
          const c4 = localStorage.getItem(e5);
          return c4 ? JSON.parse(c4) : t3;
        } catch (c4) {
          return t3;
        }
      }, set(e5, t3) {
        try {
          if (i2 && "hzk_stats" === e5) return void i2.setProgress(JSON.stringify(t3));
          if (i2 && "hzk_settings" === e5) return void i2.setSettings(JSON.stringify(t3));
          localStorage.setItem(e5, JSON.stringify(t3));
        } catch (c4) {
        }
      } };
      if (i2) {
        const e5 = (e6, t3, c4) => {
          try {
            const n4 = localStorage.getItem(e6);
            n4 && !t3() && c4(n4);
          } catch (n4) {
          }
        };
        e5("hzk_stats", () => i2.getProgress(), (e6) => i2.setProgress(e6)), e5("hzk_settings", () => i2.getSettings(), (e6) => i2.setSettings(e6));
      }
      z2 = (e5, t3) => !!(e5[t3] && e5[t3].f >= 3);
      C2 = null;
      F2 = [() => [523, 659, 784, 1047].forEach((e5, t3) => M2(e5, 0.14, "triangle", 0.2, 0.08 * t3)), () => [587, 740, 880, 1175].forEach((e5, t3) => M2(e5, 0.13, "triangle", 0.18, 0.07 * t3)), () => [659, 784, 988, 1319].forEach((e5, t3) => M2(e5, 0.15, "sine", 0.18, 0.09 * t3)), () => {
        [523, 784].forEach((e5, t3) => M2(e5, 0.18, "triangle", 0.2, 0.1 * t3)), M2(1047, 0.25, "sine", 0.15, 0.22);
      }];
      T2 = { tap: () => M2(600, 0.07, "sine", 0.09, 0, 900), wrong: () => {
        M2(300, 0.12, "sine", 0.09, 0, 240), M2(240, 0.16, "sine", 0.09, 0.1, 200);
      }, win: () => [523, 659, 784, 1047, 1319].forEach((e5, t3) => M2(e5, 0.16, "triangle", 0.22, 0.12 * t3)), cheer: () => F2[Math.floor(Math.random() * F2.length)]() };
      _2 = ["\u627E\u51FA", "\u8BF7\u627E\u51FA", "\u627E\u4E00\u627E", "\u5C0F\u670B\u53CB\uFF0C\u627E\u51FA"];
      R2 = ["\u5728\u54EA\u91CC\u5440\uFF1F", "\u5728\u54EA\u91CC\u5462\uFF1F", "\u662F\u54EA\u4E00\u4E2A\u5440\uFF1F"];
      I2 = [{ s: "\u7B54\u5BF9\u5566\uFF01", m: "\u{1F973}", b: "\u7B54\u5BF9\u5566\uFF01\u{1F389}" }, { s: "\u771F\u68D2\uFF01\u4F60\u771F\u68D2\uFF01", m: "\u{1F929}", b: "\u771F\u68D2\uFF01\u{1F44D}" }, { s: "\u592A\u5389\u5BB3\u5566\uFF01", m: "\u{1F60D}", b: "\u592A\u5389\u5BB3\u4E86\uFF01" }, { s: "\u597D\u806A\u660E\u5440\uFF01", m: "\u{1F984}", b: "\u597D\u806A\u660E\u5440\uFF01" }, { s: "\u5B8C\u5168\u6B63\u786E\uFF01", m: "\u{1F389}", b: "\u5B8C\u5168\u6B63\u786E\uFF01\u2728" }, { s: "\u4E86\u4E0D\u8D77\u5440\uFF01", m: "\u{1F31F}", b: "\u4E86\u4E0D\u8D77\uFF01" }, { s: "\u4F60\u662F\u8BC6\u5B57\u5C0F\u5929\u624D\uFF01", m: "\u{1F3C6}", b: "\u5C0F\u5929\u624D\uFF01\u{1F44F}" }, { s: "\u54C7\uFF0C\u4E00\u4E0B\u5B50\u5C31\u627E\u5230\u4E86\uFF01", m: "\u{1F43C}", b: "\u54C7\uFF01\u627E\u5230\u4E86\uFF01" }, { s: "\u7B54\u5BF9\u5566\uFF0C\u597D\u5389\u5BB3\u5440\uFF01", m: "\u{1F60E}", b: "\u5389\u5BB3\uFF01\u270C\uFE0F" }, { s: "\u54C7\u585E\uFF0C\u5C31\u662F\u5B83\uFF01", m: "\u{1F917}", b: "\u5C31\u662F\u5B83\uFF01\u{1F388}" }];
      A2 = ["\u6CA1\u5173\u7CFB\uFF0C\u518D\u60F3\u4E00\u60F3", "\u522B\u7070\u5FC3\uFF0C\u518D\u8BD5\u4E00\u6B21", "\u6162\u6162\u60F3\uFF0C\u4F60\u53EF\u4EE5\u7684", "\u5DEE\u4E00\u70B9\u70B9\uFF0C\u518D\u770B\u770B"];
      O2 = ["\u54CE\u5440\uFF0C\u7B54\u9519\u4E86\u3002", "\u5662\uFF0C\u7B54\u9519\u4E86\u3002", "\u54CE\u5440\uFF0C\u7B54\u9519\u4E86\u54E6\u3002"];
      B2 = ["\u518D\u627E\u627E\u5427\uFF01", "\u6CA1\u5173\u7CFB\uFF0C\u518D\u627E\u4E00\u627E\uFF01", "\u52A0\u6CB9\uFF0C\u518D\u627E\u627E\uFF01", "\u6211\u4EEC\u518D\u770B\u770B\uFF0C\u627E\u627E\u5B83\uFF01"];
      D2 = { 3: { s: "\u54C7\uFF0C\u4E09\u8FDE\u51FB\uFF01\u4F60\u592A\u68D2\u5566\uFF01", m: "\u{1F525}", b: "\u4E09\u8FDE\u51FB\uFF01\u{1F525}\u{1F525}\u{1F525}" }, 5: { s: "\u5929\u54EA\uFF0C\u4E94\u8FDE\u51FB\uFF01\u7B80\u76F4\u662F\u5929\u624D\uFF01", m: "\u{1F680}", b: "\u4E94\u8FDE\u51FB\uFF01\u{1F680}\u{1F680}" }, 8: { s: "\u516B\u8FDE\u51FB\uFF01\u65E0\u4EBA\u80FD\u654C\u5440\uFF01", m: "\u{1F451}", b: "\u516B\u8FDE\u51FB\uFF01\u{1F451}" } };
      V2 = [{ e: "\u{1F3C6}", t: "\u5168\u5BF9\uFF01\u4F60\u662F\u8BC6\u5B57\u5C0F\u5929\u624D\uFF01", s: "\u54C7\uFF01\u5168\u5BF9\u5566\uFF01\u4F60\u662F\u8BC6\u5B57\u5C0F\u5929\u624D\uFF01" }, { e: "\u{1F947}", t: "\u6EE1\u5206\uFF01\u592A\u5389\u5BB3\u4E86\uFF01", s: "\u6EE1\u5206\uFF01\u4F60\u771F\u662F\u592A\u5389\u5BB3\u5566\uFF01" }, { e: "\u{1F451}", t: "\u51A0\u519B\u5C31\u662F\u4F60\uFF01", s: "\u5168\u90E8\u7B54\u5BF9\uFF01\u51A0\u519B\u5C31\u662F\u4F60\uFF01" }];
      $2 = [{ e: "\u{1F389}", t: "\u592A\u68D2\u4E86\uFF0C\u7EE7\u7EED\u52A0\u6CB9\uFF01", s: "\u592A\u68D2\u5566\uFF01\u7EE7\u7EED\u52A0\u6CB9\uFF01" }, { e: "\u{1F43C}", t: "\u5B8C\u6210\u5566\uFF0C\u771F\u4E0D\u9519\uFF01", s: "\u5B8C\u6210\u5566\uFF01\u4F60\u771F\u68D2\uFF01" }, { e: "\u{1F388}", t: "\u5B66\u5F97\u771F\u597D\uFF01", s: "\u5B66\u5F97\u771F\u597D\uFF01\u4E0B\u6B21\u4E89\u53D6\u5168\u5BF9\u54E6\uFF01" }];
      J2 = ["#FF7BAC", "#FF9F43", "#7ED957", "#5EC6F0", "#B69CFF", "#4ECDC4"];
      U2 = ["\u8FD9\u4E2A\u5B57\u600E\u4E48\u8BFB\uFF1F\u5927\u58F0\u8BFB\u51FA\u6765\u5427", "\u770B\u4E00\u770B\uFF0C\u5B83\u5FF5\u4EC0\u4E48\uFF1F\u5927\u58F0\u8BF4", "\u8F6E\u5230\u4F60\u8BFB\u5566\uFF0C\u5927\u58F0\u8BFB\u51FA\u6765", "\u731C\u4E00\u731C\uFF0C\u8FD9\u4E2A\u5B57\u600E\u4E48\u8BFB\uFF1F\u8BF4\u7ED9\u6211\u542C\u5427"];
      H2 = { slow: 0.75, normal: 0.95, fast: 1.1 };
      P2 = (e5) => H2[e5.rate] || 0.95;
      G2 = { voice: null, zhFound: false, score(e5) {
        let t3 = 0;
        const c4 = e5.name || "";
        return /zh[-_]CN/i.test(e5.lang) ? t3 += 4 : /^zh/i.test(e5.lang) && (t3 += 2), /natural|online/i.test(c4) && (t3 += 3), /xiaoxiao|xiaoyi|yunxi|yunyang|tingting|ting-ting|mei-jia|yaoyao|huihui|female|\u5973/i.test(c4) && (t3 += 2), /kangkang|male|\u7537/i.test(c4) && (t3 -= 2), /google/i.test(c4) && !/natural/i.test(c4) && (t3 -= 1), t3;
      }, zhVoices() {
        return "undefined" !== typeof window && "speechSynthesis" in window ? speechSynthesis.getVoices().filter((e5) => /^zh/i.test(e5.lang)).sort((e5, t3) => this.score(t3) - this.score(e5)) : [];
      }, pick(e5) {
        const t3 = this.zhVoices();
        t3.length && (this.zhFound = true), this.voice = e5.voiceURI && t3.find((t4) => t4.voiceURI === e5.voiceURI) || t3[0] || null;
      }, init(e5, t3) {
        "undefined" !== typeof window && "speechSynthesis" in window && (this.pick(e5), speechSynthesis.onvoiceschanged = () => {
          this.pick(e5), t3();
        });
      }, warm() {
        if ("undefined" !== typeof window && "speechSynthesis" in window) try {
          const e5 = new SpeechSynthesisUtterance(" ");
          e5.volume = 0, speechSynthesis.speak(e5);
        } catch (e5) {
        }
      } };
      L2 = null;
      W2 = G2;
      ce2 = ["\u2B50", "\u{1F389}", "\u2728", "\u{1F388}", "\u{1F31F}"];
      ne2 = null;
      se2 = 0;
    }
  });

  // dist/js/index.d6f81cab.js
  var index_d6f81cab_exports = {};
  __export(index_d6f81cab_exports, {
    default: () => ee3
  });
  function J3({ mode: e5, onModeChange: s4, onStart: t3, onParent: a4 }) {
    const { settings: n4, stats: r4 } = n2(), c4 = (s5, a5, n5, c5, i4) => {
      const l4 = i4.filter((e6) => z2(r4, e6.c)).length;
      return sb.jsxs("button", { className: "group-card", style: { borderColor: c5, background: c5 + "22" }, onClick: () => {
        T2.tap(), S2({ mode: e5, group: s5 }), t3(e5, s5);
      }, children: [sb.jsx("span", { className: "g-icon", children: a5 }), sb.jsx("b", { children: n5 }), sb.jsxs("small", { children: ["\u2B50 ", l4, "/", i4.length] })] }, s5);
    };
    return sb.jsxs("section", { className: "screen active", id: "screen-home", children: [sb.jsxs("header", { className: "topbar", children: [sb.jsx("div", { className: "logo", children: "\u{1F43C} \u8BC6\u5B57\u5C0F\u4E50\u56ED" }), sb.jsx("button", { className: "icon-btn", "aria-label": "\u5BB6\u957F\u4E2D\u5FC3", onClick: () => {
      T2.tap(), a4();
    }, children: "\u2699\uFE0F" })] }), sb.jsx("p", { className: "subtitle", children: "\u5148\u9009\u4E00\u4E2A\u73A9\u6CD5\uFF0C\u518D\u6311\u4E00\u7EC4\u6C49\u5B57\u5427" }), sb.jsx("div", { className: "modes", children: Q3.map((t4) => sb.jsxs("button", { className: "mode-card" + (e5 === t4.mode ? " selected" : ""), onClick: () => {
      s4(t4.mode), T2.tap(), Q2(t4.name, n4);
    }, children: [sb.jsx("span", { className: "big", children: t4.icon }), t4.name, sb.jsx("small", { children: t4.sub })] }, t4.mode)) }), sb.jsx("div", { className: "group-scroll", children: sb.jsxs("div", { className: "group-grid", children: [c4("all", "\u{1F308}", "\u5168\u90E8\u6DF7\u73A9", "#8E7CC3", l2), r2.map((e6) => c4(e6.id, e6.icon, e6.name, e6.color, e6.chars))] }) })] });
  }
  function K3({ groupId: e5, onHome: s4, onFinish: t3 }) {
    const { settings: a4, patchSettings: n4, bumpStat: r4 } = n2(), c4 = X2(), i4 = Y2(a4), { cls: l4, bump: g4 } = Z2(), { cls: b3, bump: p4 } = Z2(), x3 = ul.useRef(null), M3 = ul.useRef(null);
    if (!M3.current) {
      const s5 = u2(e5), t4 = Math.min(a4.len, s5.length);
      M3.current = { qs: g2(s5, t4, {}).map((e6) => ({ target: e6 })), i: 0, gold: 0, silver: 0, tries: 0, advancing: false, state: "idle", degraded: !o2, playbackDone: false, asrDone: false, asrText: null, asrFailed: false, peak: 0, bubble: { text: "", cls: "" }, mic: "idle", feedback: false };
    }
    const F3 = (e6, s5) => {
      H3(), x3.current = setTimeout(s5, e6);
    }, H3 = () => {
      x3.current && (clearTimeout(x3.current), x3.current = null);
    }, z3 = () => {
      if (o2 && i2.voiceCancel) try {
        i2.voiceCancel();
      } catch (e6) {
      }
    }, L3 = (e6, s5 = "") => {
      M3.current.bubble = { text: e6, cls: s5 };
    }, O3 = (e6) => {
      M3.current.mic = e6;
    }, P3 = () => {
      const e6 = M3.current, s5 = e6.qs[e6.i];
      if (e6.tries = 0, e6.advancing = false, e6.state = "idle", e6.playbackDone = false, e6.asrDone = false, e6.asrText = null, e6.asrFailed = false, e6.peak = 0, e6.feedback = false, H3(), O3(o2 ? "idle" : "off"), e6.degraded) L3(o2 ? "\u8DDF\u8BFB\u6A21\u5F0F\uFF1A\u5148\u542C\u4E00\u542C\uFF0C\u518D\u8DDF\u7740\u8BFB \u{1F447}" : "\u8FD9\u53F0\u8BBE\u5907\u6682\u4E0D\u652F\u6301\u5F55\u97F3\uFF0C\u8DDF\u7740\u8BFB\u4E00\u904D\u5427 \u{1F446}", "hint"), c4(), $3(s5.target, true);
      else {
        const e7 = U2[Math.floor(Math.random() * U2.length)];
        L3(e7, ""), c4(), Q2([{ t: e7, r: P2(i4.current) }], i4.current);
      }
    }, $3 = (e6, s5) => {
      const t4 = P2(i4.current), a5 = s5 ? [{ t: "\u8DDF\u6211\u8BFB\uFF1A", r: t4 }] : [];
      a5.push({ t: e6.c, r: 0.85 * t4 }), e6.w && a5.push({ t: e6.w, r: 0.95 * t4 }), a5.push({ t: e6.c, r: 0.85 * t4 }), Q2(a5, i4.current);
    }, U3 = (e6) => {
      M3.current.state = "idle", O3(o2 ? "idle" : "off"), e6 && (L3(e6, "hint"), p4());
    }, V3 = (e6) => {
      const s5 = M3.current;
      if ("recording" === s5.state || "waitRec" === s5.state) {
        if (H3(), e6 < 500) return U3("\u6309\u4E00\u4E0B\u5C31\u5F00\u59CB\u5F55\u5566\uFF0C\u591A\u8BFB\u4E00\u4F1A\u513F\u54E6 \u{1F446}"), void c4();
        s5.state = "processing", O3("busy"), L3("\u6765\u542C\u542C\u4F60\u521A\u624D\u8BFB\u7684 \u{1F50A}", ""), s5.playbackDone = false, s5.asrDone = false, s5.asrText = null, s5.asrFailed = false, i2.voicePlayRecording(), s5.degraded ? F3(e6 + 5e3, () => {
          "processing" !== M3.current.state || M3.current.playbackDone || (M3.current.playbackDone = true, _3());
        }) : (i2.voiceRecognize(s5.qs[s5.i].target.w || ""), F3(25e3, () => {
          "processing" !== M3.current.state || M3.current.asrDone || (M3.current.asrFailed = true, _3());
        })), c4();
      }
    }, _3 = () => {
      const e6 = M3.current;
      if ("processing" !== e6.state) return;
      if (!e6.playbackDone) return;
      if (e6.degraded || e6.asrFailed) return e6.degraded || (e6.degraded = true, L3("\u8FD9\u53F0\u8BBE\u5907\u6682\u4E0D\u652F\u6301\u81EA\u52A8\u8BC4\u5206\uFF0C\u8DDF\u8BFB\u4E00\u904D\u5427 \u{1F4AA}", "hint")), void Q4();
      if (!e6.asrDone) return;
      const s5 = f2(e6.asrText || "", e6.qs[e6.i].target);
      if (console.info("[read] asr=" + e6.asrText + " target=" + e6.qs[e6.i].target.c + " verdict=" + s5), c4(), "ok" === s5) A3();
      else if ("empty" === s5) {
        const s6 = !e6.peak || e6.peak < 1500, t4 = s6 ? "\u58F0\u97F3\u6709\u70B9\u5C0F\u54E6\uFF0C\u9760\u8FD1\u4E00\u70B9\u5927\u58F0\u8BFB \u{1F4AA}" : "\u6CA1\u542C\u6E05\uFF0C\u518D\u5927\u58F0\u8BF4\u4E00\u6B21 \u{1F4AA}";
        U3(t4), c4(), Q2([{ t: t4, r: P2(i4.current) }], i4.current);
      } else G3();
    }, A3 = () => {
      const e6 = M3.current, s5 = e6.qs[e6.i];
      e6.state = "done", H3(), O3("busy");
      const t4 = 0 === e6.tries;
      r4(s5.target.c, t4), t4 ? e6.gold++ : e6.silver++;
      const a5 = I2[Math.floor(Math.random() * I2.length)];
      L3(a5.b, "good"), T2.cheer(), t4 && ie2(10);
      const n5 = P2(i4.current);
      Q2([{ t: a5.s }, { t: "\u8FD9\u662F\u300C" + s5.target.c + "\u300D", r: 0.95 * n5 }, { t: s5.target.c, r: 0.85 * n5 }], i4.current), c4(), F3(2e3, J4);
    }, B3 = (e6) => {
      const s5 = M3.current;
      s5.feedback = true, c4();
      const t4 = P2(i4.current), a5 = [{ t: "\u8FD9\u662F", r: t4 }, { t: e6.c, r: 0.8 * t4 }];
      e6.w ? a5.push({ t: e6.w + "\u7684" + e6.c, r: 0.9 * t4 }) : a5.push({ t: e6.c, r: 0.75 * t4 }), Q2(a5, i4.current);
    }, G3 = () => {
      const e6 = M3.current;
      e6.state = "feedback", O3("off"), T2.wrong(), L3("\u8BFB\u5F97\u4E0D\u592A\u50CF\u54E6\uFF0C\u542C\u4E00\u542C\u6807\u51C6\u8BFB\u97F3\u5427 \u{1F447}", "bad"), c4(), B3(e6.qs[e6.i].target);
    }, Q4 = () => {
      const e6 = M3.current;
      e6.state = "feedback", O3("off"), c4(), B3(e6.qs[e6.i].target);
    }, J4 = () => {
      const e6 = M3.current;
      e6.advancing || (e6.advancing = true, H3(), z3(), e6.i++, e6.i >= e6.qs.length ? t3(e6.gold, e6.silver, e6.qs.length) : P3());
    }, K4 = () => {
      const e6 = M3.current;
      if (o2) if (T2.tap(), "idle" === e6.state) {
        try {
          i2.stop();
        } catch (s5) {
        }
        e6.state = "waitRec", i2.voiceStartRecord(), F3(3e3, () => {
          "waitRec" === M3.current.state && (U3("\u6CA1\u542F\u52A8\u6210\u529F\uFF0C\u518D\u70B9\u4E00\u6B21\u8BD5\u8BD5 \u{1F3A4}"), c4());
        }), c4();
      } else "recording" === e6.state && i2.voiceStopRecord();
    }, W4 = () => {
      const e6 = M3.current;
      if (T2.tap(), z3(), H3(), e6.tries++, e6.state = "idle", e6.feedback = false, O3(o2 ? "idle" : "off"), e6.degraded) L3(o2 ? "\u518D\u8DDF\u7740\u8BFB\u4E00\u904D\u5427 \u{1F447}" : "\u8FD9\u53F0\u8BBE\u5907\u6682\u4E0D\u652F\u6301\u5F55\u97F3\uFF0C\u8DDF\u7740\u8BFB\u4E00\u904D\u5427 \u{1F446}", "hint"), c4(), $3(e6.qs[e6.i].target, true);
      else {
        const e7 = "\u518D\u8BD5\u4E00\u6B21\uFF0C\u5927\u58F0\u8BFB\u51FA\u6765\u5427";
        L3(e7, ""), c4(), Q2([{ t: e7, r: P2(i4.current) }], i4.current);
      }
    };
    ul.useEffect(() => {
      a2((e7, s5) => {
        const t4 = M3.current;
        "mic" === e7 ? s5.granted || (t4.state = "idle", O3("idle"), L3("\u9700\u8981\u9EA6\u514B\u98CE\u624D\u80FD\u5F55\u4F60\u7684\u58F0\u97F3\u54E6 \u{1F622}", "bad"), c4(), setTimeout(() => {
          L3("\u8BF7\u5230\u300C\u8BBE\u7F6E \u2192 \u9690\u79C1 \u2192 \u6743\u9650 \u2192 \u9EA6\u514B\u98CE\u300D\u6253\u5F00\u5B83\uFF0C\u518D\u56DE\u6765\u8BFB\u5427", "hint"), c4();
        }, 1800)) : "recStarted" === e7 ? "waitRec" === t4.state && (H3(), t4.state = "recording", O3("rec"), L3("\u6B63\u5728\u542C\u4F60\u8BFB\u2026\u2026 \u{1F3A4}", ""), c4(), F3(9e3, () => {
          "recording" === M3.current.state && (i2.voiceStopRecord(), U3("\u597D\u50CF\u5361\u4F4F\u4E86\uFF0C\u518D\u70B9\u4E00\u6B21\u8BD5\u8BD5 \u{1F3A4}"), c4());
        })) : "recStopped" === e7 ? (t4.peak = s5.peak || 0, V3(s5.ms || 0)) : "playbackDone" === e7 ? (t4.playbackDone = true, c4(), _3()) : "asrResult" === e7 ? (t4.asrDone = true, t4.asrText = s5.text || "", c4(), _3()) : "asrError" === e7 && (t4.asrDone = true, t4.asrFailed = true, c4(), _3());
      }), P3();
      const e6 = () => {
        document.hidden && (K2(), z3(), H3());
      };
      return document.addEventListener("visibilitychange", e6), () => {
        document.removeEventListener("visibilitychange", e6), K2(), z3(), H3(), "undefined" !== typeof window && (window.__onVoiceEvent = void 0);
      };
    }, []);
    const X4 = M3.current, Y4 = X4.qs[X4.i], Z4 = "rec" === X4.mic ? "\u23F9\uFE0F<small>\u505C\u6B62</small>" : "busy" === X4.mic ? "\u23F3<small>\u8BC4\u5206\u4E2D</small>" : "off" === X4.mic ? "\u{1F3A4}<small>\u6682\u4E0D\u53EF\u7528</small>" : "\u{1F3A4}<small>\u70B9\u6211\u5F55\u97F3</small>", ee4 = !!a4.readIcon;
    return sb.jsxs("section", { className: "screen active", id: "screen-read", children: [sb.jsxs("header", { className: "topbar", children: [sb.jsx("button", { className: "icon-btn", "aria-label": "\u56DE\u5BB6", onClick: () => {
      T2.tap(), s4();
    }, children: "\u{1F3E0}" }), sb.jsxs("div", { className: "top-title", children: ["\u{1F3A4} ", h2(e5)] }), sb.jsx("button", { className: "icon-btn", "aria-label": ee4 ? "\u9690\u85CF\u56FE\u7247\u63D0\u793A" : "\u663E\u793A\u56FE\u7247\u63D0\u793A", title: "\u770B\u56FE/\u85CF\u56FE", onClick: () => {
      n4({ readIcon: !ee4 }), T2.tap(), g4();
    }, children: ee4 ? "\u{1F648}" : "\u{1F5BC}\uFE0F" }), sb.jsx("button", { className: "icon-btn", "aria-label": "\u4E0B\u4E00\u9898", title: "\u4E0B\u4E00\u9898", onClick: () => {
      T2.tap(), J4();
    }, children: "\u23ED\uFE0F" }), sb.jsxs("div", { className: "counter", children: [X4.i + 1, " / ", X4.qs.length] })] }), sb.jsx("div", { className: "read-stage", children: sb.jsxs("button", { className: "read-card kai " + l4 + (ee4 ? "" : " no-icon"), id: "readCard", onClick: () => {
      (X4.degraded || "feedback" === X4.state) && (T2.tap(), g4(), $3(Y4.target, false));
    }, children: [sb.jsx("div", { className: "fc-emoji" + (Y4.target.e.length > 2 ? " small" : ""), children: Y4.target.e }), sb.jsx("div", { className: "fc-char kai", children: Y4.target.c }), sb.jsx("div", { className: "fc-pinyin", children: Y4.target.p }), sb.jsx("div", { className: "fc-word", children: Y4.target.w ? "\u8BCD\u8BED \xB7 " + Y4.target.w : "" }), sb.jsx("div", { className: "fc-tap-hint", children: "\u{1F3A4} \u5927\u58F0\u8BFB\u51FA\u8FD9\u4E2A\u5B57\u5427" })] }) }), sb.jsx("div", { className: "bubble-row", children: sb.jsx("div", { className: "bubble " + X4.bubble.cls, id: "readBubble", children: X4.bubble.text }) }), sb.jsx("div", { className: "read-actions", children: sb.jsx("button", { className: "mic-btn " + b3 + ("idle" !== X4.mic ? " " + X4.mic : ""), id: "btnMic", disabled: "busy" === X4.mic || "off" === X4.mic, onClick: K4, dangerouslySetInnerHTML: { __html: Z4 } }) }), sb.jsx("div", { className: "read-feedback" + (X4.feedback ? "" : " hidden"), id: "readFeedback", children: sb.jsxs("div", { className: "rf-card", children: [sb.jsx("div", { className: "rf-head", children: "\u8FD9\u662F\u5B83\u7684\u8BFB\u97F3 \u{1F508}" }), sb.jsx("div", { className: "rf-emoji" + (Y4.target.e.length > 2 ? " small" : ""), children: Y4.target.e }), sb.jsx("div", { className: "rf-char kai", children: Y4.target.c }), sb.jsx("div", { className: "rf-pinyin", children: Y4.target.p }), sb.jsx("div", { className: "rf-word kai", children: Y4.target.w ? Y4.target.w : "" }), sb.jsxs("div", { className: "rf-btns", children: [sb.jsx("button", { className: "big-btn primary", onClick: W4, children: "\u{1F501} \u518D\u8BFB\u4E00\u6B21" }), sb.jsx("button", { className: "big-btn", onClick: () => {
      T2.tap(), J4();
    }, children: "\u23ED\uFE0F \u4E0B\u4E00\u9898" })] })] }) })] });
  }
  function W3({ result: e5, onAgain: s4, onHome: t3 }) {
    const { settings: a4 } = n2(), n4 = ul.useRef(false), r4 = (e5.gold === e5.total && e5.total > 0 ? V2 : $2)[Math.floor(3 * Math.random())], c4 = "read" === e5.mode ? "\u8BFB" : "\u7B54";
    return ul.useEffect(() => {
      if (n4.current) return;
      n4.current = true, ie2(), T2.win();
      const s5 = "read" === e5.mode ? `\u4F60\u8BFB\u5BF9\u4E86${e5.gold}\u4E2A\u5B57\uFF01` : `\u4F60\u62FF\u5230\u4E86${e5.gold}\u9897\u661F\u661F\uFF01`;
      Q2([{ t: r4.s }, { t: s5 }], a4);
    }, []), sb.jsx("section", { className: "screen active", id: "screen-end", children: sb.jsxs("div", { className: "end-card", children: [sb.jsx("div", { className: "end-emoji", children: r4.e }), sb.jsx("h2", { id: "endTitle", children: r4.t }), sb.jsxs("div", { className: "end-stars", children: ["\u2B50".repeat(e5.gold), e5.silver ? " \u{1F31F}\xD7" + e5.silver : ""] }), sb.jsxs("p", { id: "endMsg", children: ["\u7B2C\u4E00\u6B21\u5C31" + c4 + "\u5BF9 " + e5.gold + " \u4E2A", e5.silver ? `\uFF0C\u5E2E\u52A9\u540E${c4}\u5BF9 ${e5.silver} \u4E2A` : ""] }), sb.jsx("button", { className: "big-btn primary", onClick: s4, children: "\u{1F501} \u518D\u6765\u4E00\u6B21" }), sb.jsx("button", { className: "big-btn", onClick: t3, children: "\u{1F3E0} \u56DE\u5BB6" })] }) });
  }
  function Y3({ groupId: e5, onHome: s4, onFinish: t3 }) {
    const { settings: a4 } = n2(), [n4, r4] = ul.useState(() => {
      const s5 = u2(e5);
      return s5.length > a4.len ? p2(s5).slice(0, a4.len) : s5.slice();
    }), [c4, i4] = ul.useState("learn"), [l4, g4] = ul.useState(1), [b3, p4] = ul.useState(null), x3 = ul.useRef(null), j3 = ul.useRef(null), v3 = ul.useRef(n4.length);
    ul.useEffect(() => () => {
      x3.current && clearTimeout(x3.current);
    }, []);
    const f3 = (e6, s5, t4) => {
      p4({ icon: e6, text: s5 }), Q2(s5, a4), x3.current && clearTimeout(x3.current), x3.current = setTimeout(() => {
        p4(null), t4();
      }, X3);
    }, k3 = (e6, s5, a5, n5) => {
      if (j3.current || (j3.current = { gold: e6, silver: s5 }), n5 && n5.length) r4(n5), f3("\u{1F4D6}", `\u6709 ${n5.length} \u4E2A\u5B57\uFF0C\u6211\u4EEC\u518D\u5B66\u4E00\u904D`, () => {
        g4((e7) => e7 + 1), i4("learn");
      });
      else {
        const e7 = j3.current;
        t3(e7.gold, e7.silver, v3.current);
      }
    };
    if (b3) return sb.jsxs("section", { className: "screen active", id: "screen-flow-notice", children: [sb.jsxs("header", { className: "topbar", children: [sb.jsx("button", { className: "icon-btn", "aria-label": "\u56DE\u5BB6", onClick: () => {
      T2.tap(), s4();
    }, children: "\u{1F3E0}" }), sb.jsxs("div", { className: "top-title", children: ["\u{1F331} \u5B66\u4E00\u5B66 \xB7 ", h2(e5)] })] }), sb.jsxs("div", { className: "flow-notice", children: [sb.jsx("div", { className: "fn-icon", children: b3.icon }), sb.jsx("div", { className: "fn-text", children: b3.text })] })] });
    const w3 = n4.map((e6) => e6.c).join("");
    return "learn" === c4 ? sb.jsx(te2, { groupId: e5, chars: n4, title: 1 === l4 ? `\u{1F331} \u5B66\u4E00\u5B66 \xB7 ${h2(e5)}` : `\u{1F4D6} \u518D\u8BA4\u4E00\u8BA4 \xB7 \u5269 ${n4.length} \u4E2A\u5B57`, onHome: s4, onDone: () => f3("\u{1F3AF}", "\u8BA4\u5B8C\u5566\uFF0C\u6765\u8003\u8003\u4F60\uFF01", () => i4("quiz")) }, "learn-" + l4 + "-" + w3) : sb.jsx(le2, { groupId: e5, targets: n4, onHome: s4, onFinish: k3 }, "quiz-" + l4 + "-" + w3);
  }
  function Z3({ open: e5, onClose: s4 }) {
    const { settings: t3, patchSettings: a4, stats: n4, resetStats: r4 } = n2(), [, c4] = ul.useState(0), [m4, p4] = ul.useState(false), [x3, j3] = ul.useState(null);
    if (!e5) return null;
    const v3 = i2 ? [] : W2.zhVoices(), f3 = (e6) => {
      a4(e6), c4((e7) => e7 + 1);
    }, N3 = () => {
      if (!m4) {
        p4(true);
        const e6 = setTimeout(() => {
          p4(false);
        }, 3e3);
        return void j3(e6);
      }
      x3 && clearTimeout(x3), p4(false), r4(), c4((e6) => e6 + 1);
    };
    return sb.jsx("div", { className: "modal", id: "parentModal", onClick: (e6) => {
      e6.target === e6.currentTarget && s4();
    }, children: sb.jsxs("div", { className: "modal-card", children: [sb.jsxs("div", { className: "modal-head", children: [sb.jsx("span", { children: "\u2699\uFE0F \u5BB6\u957F\u4E2D\u5FC3" }), sb.jsx("button", { className: "icon-btn", "aria-label": "\u5173\u95ED", onClick: s4, children: "\u2716\uFE0F" })] }), sb.jsxs("div", { className: "modal-body", children: [sb.jsxs("div", { children: [sb.jsxs("div", { className: "set-title", children: ["\u{1F5E3}\uFE0F \u6717\u8BFB\u4EBA\u58F0 ", sb.jsx("small", { style: { color: "#b09a7d" }, children: "\uFF08\u9010\u4E2A\u8BD5\u542C\uFF0C\u9009\u6700\u6E05\u695A\u7684\u90A3\u4E2A\uFF09" })] }), sb.jsx("div", { className: "seg", id: "segVoice", children: i2 ? sb.jsx("span", { className: "voice-note", children: "\u2705 \u6B63\u5728\u4F7F\u7528\u7CFB\u7EDF\u539F\u751F\u6717\u8BFB" }) : v3.length ? v3.map((e6) => {
      const s5 = e6.name.replace(/^(Microsoft|Google)\s+/i, "").replace(/\s*-\s*(Chinese|\u4e2d\u6587|\u666e\u901a\u8bdd).*$/i, "").trim();
      return sb.jsx("button", { className: "seg-btn" + (t3.voiceURI === e6.voiceURI ? " active" : ""), title: e6.name, onClick: () => {
        a4({ voiceURI: e6.voiceURI }), W2.pick(t3), c4((e7) => e7 + 1), Q2("\u4F60\u597D\u5440\uFF0C\u5C0F\u670B\u53CB\uFF0C\u6211\u7528\u8FD9\u4E2A\u58F0\u97F3\u966A\u4F60\u73A9", t3);
      }, children: s5 || e6.name }, e6.voiceURI);
    }) : sb.jsx("span", { className: "voice-note", children: "\u672A\u627E\u5230\u4E2D\u6587\u8BED\u97F3\u5305\uFF0C\u8BF7\u6362 Chrome / Edge \u6253\u5F00" }) }), sb.jsx("p", { className: "voice-note", children: i2 ? "\u5F53\u524D\u4EBA\u58F0\uFF1A\u7CFB\u7EDF\u539F\u751F\u6717\u8BFB" : W2.voice ? "\u5F53\u524D\u4EBA\u58F0\uFF1A" + W2.voice.name : "\u26A0\uFE0F \u672A\u68C0\u6D4B\u5230\u4E2D\u6587\u8BED\u97F3\u5305\uFF1A\u8BF7\u786E\u8BA4\u8BBE\u5907\u5DF2\u88C5\u4E2D\u6587 TTS\uFF0C\u6216\u6539\u7528 Chrome / Edge / Safari \u6253\u5F00" })] }), sb.jsxs("div", { children: [sb.jsxs("div", { className: "set-title", children: ["\u{1F399}\uFE0F \u6717\u8BFB\u901F\u5EA6", sb.jsx("button", { className: "seg-btn", onClick: () => Q2("\u4F60\u597D\u5440\uFF0C\u6211\u662F\u8BC6\u5B57\u5C0F\u4E50\u56ED", t3), children: "\u{1F50A} \u8BD5\u542C" })] }), sb.jsx("div", { className: "seg", id: "segRate", children: [["slow", "\u6162\u4E00\u4E9B"], ["normal", "\u6807\u51C6"], ["fast", "\u5FEB\u4E00\u4E9B"]].map(([e6, s5]) => sb.jsx("button", { className: "seg-btn" + (t3.rate === e6 ? " active" : ""), onClick: () => {
      f3({ rate: e6 }), Q2("\u4F60\u597D\u5440\uFF0C\u5C0F\u670B\u53CB", l3(i3({}, t3), { rate: e6 }));
    }, children: s5 }, e6)) })] }), sb.jsxs("div", { children: [sb.jsx("div", { className: "set-title", children: "\u{1F5BC}\uFE0F \u9009\u9879\u56FE\u7247\u63D0\u793A" }), sb.jsxs("div", { className: "seg", id: "segHints", children: [sb.jsx("button", { className: "seg-btn" + (t3.hints ? " active" : ""), onClick: () => f3({ hints: true }), children: "\u663E\u793A\u56FE\u7247" }), sb.jsx("button", { className: "seg-btn" + (t3.hints ? "" : " active"), onClick: () => f3({ hints: false }), children: "\u53EA\u770B\u6C49\u5B57" })] }), sb.jsx("p", { className: "voice-note", children: "\u5165\u95E8\u65F6\u663E\u793A\u56FE\u7247\u5E2E\u52A9\u8054\u60F3\uFF1B\u5B69\u5B50\u719F\u6089\u540E\u53EF\u5207\u5230\u300C\u53EA\u770B\u6C49\u5B57\u300D\u771F\u6B63\u8003\u8BA4\u5B57\u3002" })] }), sb.jsxs("div", { children: [sb.jsx("div", { className: "set-title", children: "\u{1F3AF} \u6BCF\u8F6E\u9898\u6570" }), sb.jsx("div", { className: "seg", id: "segLen", children: [5, 10, 15].map((e6) => sb.jsxs("button", { className: "seg-btn" + (t3.len === e6 ? " active" : ""), onClick: () => f3({ len: e6 }), children: [e6, " \u9898"] }, e6)) }), sb.jsx("p", { className: "voice-note", children: "3 \u5C81\u534A\u5EFA\u8BAE 5\uFF5E10 \u9898\uFF0C\u4E00\u5C40 2\uFF5E3 \u5206\u949F\u521A\u597D\u3002" })] }), sb.jsxs("div", { children: [sb.jsx("div", { className: "set-title", children: "\u{1F4CA} \u5B66\u4E60\u8FDB\u5EA6" }), sb.jsxs("div", { style: { marginTop: 8 }, id: "progressList", children: [r2.map((e6) => sb.jsxs("div", { className: "pg-group", children: [sb.jsxs("b", { children: [e6.icon, " ", e6.name] }), sb.jsx("div", { className: "pg-chips", children: e6.chars.map((e7) => sb.jsx("span", { className: "chip kai" + (z2(n4, e7.c) ? " mastered" : ""), title: e7.p, children: e7.c }, e7.c)) })] }, e6.id)), sb.jsx("p", { className: "pg-tip", children: "\u2B50 \u91D1\u8272 = \u5DF2\u638C\u63E1\uFF08\u8FDE\u5BF9 3 \u6B21\uFF09\u3002\u7B54\u9898\u4F1A\u4F18\u5148\u5B89\u6392\u8FD8\u6CA1\u638C\u63E1\u7684\u5B57\u3002" })] })] }), sb.jsx("button", { className: "danger", onClick: N3, children: m4 ? "\u518D\u70B9\u4E00\u6B21\u786E\u8BA4\u91CD\u7F6E \u26A0\uFE0F" : "\u{1F5D1} \u91CD\u7F6E\u5168\u90E8\u8FDB\u5EA6" })] })] }) });
  }
  function ee3() {
    const [e5, s4] = ul.useState(() => x2()), [t3, a4] = ul.useState(() => v2()), [n4, r4] = ul.useState("home"), [c4, l4] = ul.useState(() => N2().mode || "learn"), [u3, m4] = ul.useState(false), [h4, g4] = ul.useState("animals"), [b3, p4] = ul.useState(null), x3 = ul.useRef(null), j3 = ul.useMemo(() => ({ settings: e5, stats: t3, patchSettings: (e6) => {
      s4((s5) => {
        const t4 = Object.assign({}, s5, e6);
        return k2(t4), t4;
      });
    }, bumpStat: (e6, s5) => {
      a4((t4) => {
        const a5 = t4[e6] = t4[e6] || { s: 0, f: 0, w: 0 };
        return a5.s++, s5 ? a5.f++ : a5.w++, j2(t4), i3({}, t4);
      });
    }, resetStats: () => {
      a4({}), j2({});
    }, goto: (e6) => r4(e6) }), [e5, t3]), v3 = ul.useCallback(() => {
      if (K2(), i2 && i2.voiceCancel) try {
        i2.voiceCancel();
      } catch (e6) {
      }
      r4("home");
    }, []), f3 = ul.useCallback((e6, s5) => {
      g4(s5), "learn" === e6 ? r4("learn") : "flow" === e6 ? (x3.current = { mode: e6, id: s5 }, r4("flow")) : "read" === e6 ? (x3.current = { mode: e6, id: s5 }, r4("read")) : (x3.current = { mode: e6, id: s5 }, r4("quiz"));
    }, []), N3 = ul.useCallback((e6) => (s5, t4, a5) => {
      p4({ mode: e6, total: a5, gold: s5, silver: t4 }), r4("end");
    }, []);
    return ul.useEffect(() => {
      let e6 = false;
      const s5 = () => {
        e6 || (e6 = true, q2(), W2.warm());
      };
      document.addEventListener("pointerdown", s5, true);
      const t4 = (e7) => e7.preventDefault();
      return document.addEventListener("contextmenu", t4), () => {
        document.removeEventListener("pointerdown", s5, true), document.removeEventListener("contextmenu", t4);
      };
    }, []), ul.useEffect(() => {
      W2.init(e5, () => {
      });
    }, []), ul.useEffect(() => {
      const e6 = "undefined" !== typeof location ? location.hash : "";
      "#learn" === e6 ? f3("learn", "animals") : "#quiz" === e6 ? f3("quiz", "animals") : "#read" === e6 ? f3("read", "animals") : "#flow" === e6 && f3("flow", "animals");
    }, []), sb.jsx(c2.Provider, { value: j3, children: sb.jsxs("div", { className: "page-root", children: ["home" === n4 && sb.jsx(J3, { mode: c4, onModeChange: l4, onStart: f3, onParent: () => m4(true) }), "learn" === n4 && sb.jsx(te2, { groupId: h4, onHome: v3 }), "flow" === n4 && sb.jsx(Y3, { groupId: h4, onHome: v3, onFinish: N3("flow") }), "quiz" === n4 && sb.jsx(le2, { groupId: h4, onHome: v3, onFinish: N3("quiz") }), "read" === n4 && sb.jsx(K3, { groupId: h4, onHome: v3, onFinish: N3("read") }), "end" === n4 && b3 && sb.jsx(W3, { result: b3, onAgain: () => {
      const e6 = x3.current;
      e6 ? f3(e6.mode, e6.id) : v3();
    }, onHome: v3 }), sb.jsx(Z3, { open: u3, onClose: () => m4(false) }), sb.jsx(oe2, {})] }) });
  }
  var e3, s3, t2, a3, n3, r3, c3, i3, l3, Q3, X3;
  var init_index_d6f81cab = __esm({
    "dist/js/index.d6f81cab.js"() {
      init_vendors_9e84cbaa();
      init_common_a5c0980c();
      e3 = Object.defineProperty;
      s3 = Object.defineProperties;
      t2 = Object.getOwnPropertyDescriptors;
      a3 = Object.getOwnPropertySymbols;
      n3 = Object.prototype.hasOwnProperty;
      r3 = Object.prototype.propertyIsEnumerable;
      c3 = (s4, t3, a4) => t3 in s4 ? e3(s4, t3, { enumerable: true, configurable: true, writable: true, value: a4 }) : s4[t3] = a4;
      i3 = (e5, s4) => {
        for (var t3 in s4 || (s4 = {})) n3.call(s4, t3) && c3(e5, t3, s4[t3]);
        if (a3) for (var t3 of a3(s4)) r3.call(s4, t3) && c3(e5, t3, s4[t3]);
        return e5;
      };
      l3 = (e5, a4) => s3(e5, t2(a4));
      Q3 = [{ mode: "learn", icon: "\u{1F4D6}", name: "\u8BA4\u4E00\u8BA4", sub: "\u770B\u5B57\u5361 \xB7 \u542C\u53D1\u97F3" }, { mode: "quiz", icon: "\u{1F3AF}", name: "\u627E\u4E00\u627E", sub: "\u542C\u58F0\u97F3 \xB7 \u627E\u6C49\u5B57" }, { mode: "read", icon: "\u{1F3A4}", name: "\u8BFB\u4E00\u8BFB", sub: "\u8DDF\u7740\u8BFB \xB7 \u5F55\u97F3\u8BC4\u5206" }, { mode: "flow", icon: "\u{1F331}", name: "\u5B66\u4E00\u5B66", sub: "\u5148\u8BA4\u5B57 \xB7 \u518D\u95EF\u5173" }];
      X3 = 1900;
    }
  });

  // dist/js/index.04d1a2e5.js
  init_vendors_9e84cbaa();
  var import_meta = {};
  var e4 = (e5, t3, n4) => new Promise((r4, i4) => {
    var o3 = (e6) => {
      try {
        s4(n4.next(e6));
      } catch (t4) {
        i4(t4);
      }
    }, a4 = (e6) => {
      try {
        s4(n4.throw(e6));
      } catch (t4) {
        i4(t4);
      }
    }, s4 = (e6) => e6.done ? r4(e6.value) : Promise.resolve(e6.value).then(o3, a4);
    s4((n4 = n4.apply(e5, t3)).next());
  });
  (function() {
    const e5 = document.createElement("link").relList;
    if (!(e5 && e5.supports && e5.supports("modulepreload"))) {
      for (const e6 of document.querySelectorAll('link[rel="modulepreload"]')) n4(e6);
      new MutationObserver((e6) => {
        for (const t4 of e6) if ("childList" === t4.type) for (const e7 of t4.addedNodes) "LINK" === e7.tagName && "modulepreload" === e7.rel && n4(e7);
      }).observe(document, { childList: true, subtree: true });
    }
    function t3(e6) {
      const t4 = {};
      return e6.integrity && (t4.integrity = e6.integrity), e6.referrerPolicy && (t4.referrerPolicy = e6.referrerPolicy), "use-credentials" === e6.crossOrigin ? t4.credentials = "include" : "anonymous" === e6.crossOrigin ? t4.credentials = "omit" : t4.credentials = "same-origin", t4;
    }
    function n4(e6) {
      if (e6.ep) return;
      e6.ep = true;
      const n5 = t3(e6);
      fetch(e6.href, n5);
    }
  })();
  function g3({ children: e5 }) {
    return di.useLaunch(() => {
      console.log("\u8BC6\u5B57\u5C0F\u4E50\u56ED launched.");
    }), e5;
  }
  var p3 = fe.__taroAppConfig = { router: {}, pages: ["pages/index/index"], window: { navigationBarTitleText: "\u8BC6\u5B57\u5C0F\u4E50\u56ED", navigationBarBackgroundColor: "#FFF6E5", navigationBarTextStyle: "black", backgroundTextStyle: "light" }, h5: { router: { mode: "hash" } } };
  p3.routes = [Object.assign({ path: "pages/index/index", load: function(t3, n4) {
    return e4(this, null, function* () {
      const e5 = yield d(() => Promise.resolve().then(() => (init_index_d6f81cab(), index_d6f81cab_exports)), [], void 0);
      return [e5, t3, n4];
    });
  } }, { navigationBarTitleText: "\u8BC6\u5B57\u5C0F\u4E50\u56ED", enablePullDownRefresh: false, navigationStyle: "custom" })], Object.assign(fl, { findDOMNode: Xy.findDOMNode, render: Xy.render, unstable_batchedUpdates: Xy.unstable_batchedUpdates }), oa();
  var h3 = Lt(g3, dl, fl, p3);
  var m3 = fa({ window: fe });
  Uo(p3), Bo(m3, h3, p3, dl), bi({ designWidth: 750, deviceRatio: { 375: 2, 640: 1.17, 750: 1, 828: 0.905 }, baseFontSize: 20, unitPrecision: void 0, targetUnit: void 0 });
})();

/**
 * @hanzi/jsbridge H5 侧 SDK（与 HAR 内原生侧 BridgeCore 配套，协议 v1）。
 *
 * 用法：
 *   <script src="jsbridge.js"></script>
 *   Bridge.ready.then(function (info) { console.log(info.methods, info.caps); });
 *   Bridge.call('system.ping', { n: 1 }).then(function (pong) { ... });
 *   Bridge.callSync('storage.getSync', { key: 'k' });
 *   Bridge.on('voice.*', function (data, event) { ... });
 *   Bridge.emit('h5.ready', { any: 'payload' });
 *   Bridge.sendBinary('up.blob', arrayBuffer).then(...);
 *   Bridge.onBinary('down.blob', function (buffer, event) { ... });
 */
(function (global) {
  'use strict';

  var NATIVE_NAME = 'HbNative';
  var PROTOCOL_VERSION = 1;
  var DEFAULT_TIMEOUT = 30000;
  var CHUNK_SIZE = 65536;
  var CODE_OK = 0;
  var CODE_TIMEOUT = 40801;
  var CODE_NO_BRIDGE = 50002;
  var CODE_NO_PORT = 50003;

  var NATIVE = global[NATIVE_NAME] || null;
  var seq = 0;
  var pending = new Map();   // id -> { resolve, reject, timer }
  var listeners = new Map(); // event pattern -> Array<fn>
  var binListeners = new Map();
  var port = null;
  var downBin = null;        // 下行二进制会话 { event, id, size, chunks, received }
  var negotiated = { pv: 0, server: '', methods: [], caps: { port: false, binary: false } };

  function BridgeError(code, message) {
    this.name = 'BridgeError';
    this.code = code;
    this.message = message || 'bridge error';
  }
  BridgeError.prototype = Object.create(Error.prototype);
  BridgeError.prototype.constructor = BridgeError;

  /* ==================== 接收通道 ==================== */

  // runJavaScript 兜底回推入口
  global.__hbReceive = function (json) {
    dispatch(json);
  };

  // 端口捕获（原生经 controller.postMessage 邮寄）
  global.addEventListener('message', function (ev) {
    if (ev.data === '__hb_port__' && ev.ports && ev.ports[0]) {
      port = ev.ports[0];
      port.onmessage = function (e) {
        if (typeof e.data === 'string') {
          dispatch(e.data);
        } else if (e.data instanceof ArrayBuffer) {
          onDownChunk(e.data);
        }
      };
      // 任意消息激活原生侧 portReady 判定
      port.postMessage(JSON.stringify({ id: 0, action: 'ping' }));
    }
  });

  /** envelope 统一分发：result / event / bin-start / bin-end */
  function dispatch(json) {
    var env = null;
    try { env = JSON.parse(json); } catch (e) { return; }
    if (!env || !env.action) { return; }
    if (env.action === 'result') {
      settle(env.id, env.code, env.message, env.data);
      return;
    }
    if (env.action === 'event') {
      fire(env.event, env.data);
      return;
    }
    if (env.action === 'bin-start') {
      downBin = { event: env.event, id: env.id, size: env.size || 0, chunks: [], received: 0 };
      return;
    }
    if (env.action === 'bin-end') {
      // 以 received>=size 为准，bin-end 作为冗余确认：不足则强制组装
      if (downBin && downBin.received < downBin.size) { finishDownBin(); }
      return;
    }
  }

  function settle(id, code, message, data) {
    var p = pending.get(id);
    if (!p) { return; }
    pending.delete(id);
    if (p.timer) { clearTimeout(p.timer); p.timer = null; }
    if (code === CODE_OK) {
      var parsed = undefined;
      if (data !== undefined && data !== '') {
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
      }
      p.resolve(parsed);
    } else {
      p.reject(new BridgeError(code, message));
    }
  }

  /* ==================== 事件订阅（支持 'ns.*' 前缀通配） ==================== */

  function on(event, fn) {
    if (!listeners.has(event)) { listeners.set(event, []); }
    listeners.get(event).push(fn);
  }

  function once(event, fn) {
    var wrapped = function (data, ev) {
      off(event, wrapped);
      fn(data, ev);
    };
    on(event, wrapped);
  }

  function off(event, fn) {
    var fns = listeners.get(event);
    if (!fns) { return; }
    var idx = fns.indexOf(fn);
    if (idx >= 0) { fns.splice(idx, 1); }
    if (fns.length === 0) { listeners.delete(event); }
  }

  function fire(event, dataJson) {
    var parsed = dataJson;
    if (typeof dataJson === 'string') {
      try { parsed = JSON.parse(dataJson); } catch (e) { parsed = dataJson; }
    }
    listeners.forEach(function (fns, pattern) {
      if (pattern === event || (pattern.slice(-2) === '.*' && event.indexOf(pattern.slice(0, -1)) === 0)) {
        for (var i = 0; i < fns.length; i++) {
          try { fns[i](parsed, event); } catch (e) { /* 订阅方异常不阻断分发 */ }
        }
      }
    });
  }

  /* ==================== 下行二进制重组 ==================== */

  function onDownChunk(buf) {
    if (!downBin) { return; }
    downBin.chunks.push(buf);
    downBin.received += buf.byteLength;
    if (downBin.received >= downBin.size) { finishDownBin(); }
  }

  function finishDownBin() {
    var session = downBin;
    downBin = null;
    if (!session) { return; }
    var whole = new Uint8Array(session.received);
    var offset = 0;
    for (var i = 0; i < session.chunks.length; i++) {
      whole.set(new Uint8Array(session.chunks[i]), offset);
      offset += session.chunks[i].byteLength;
    }
    var fns = binListeners.get(session.event) || [];
    for (var j = 0; j < fns.length; j++) {
      try { fns[j](whole.buffer, session.event); } catch (e) { /* ignore */ }
    }
  }

  function onBinary(event, fn) {
    if (!binListeners.has(event)) { binListeners.set(event, []); }
    binListeners.get(event).push(fn);
  }

  /* ==================== 发送通道 ==================== */

  function sendEnvelope(env) {
    var json = JSON.stringify(env);
    // 异步 invoke 在 port 就绪后优先走 port；同步与握手恒走 proxy（依赖同步返回值）
    if (port && env.action === 'invoke' && env.sync !== true) {
      port.postMessage(json);
    } else {
      return NATIVE.postMessage(json);
    }
    return '';
  }

  function stringifyParams(params) {
    if (params === undefined || params === null) { return ''; }
    if (typeof params === 'string') { return params; }
    return JSON.stringify(params);
  }

  function call(method, params, opts) {
    if (!NATIVE) {
      return Promise.reject(new BridgeError(CODE_NO_BRIDGE, 'no native bridge'));
    }
    var timeoutMs = (opts && opts.timeoutMs) || DEFAULT_TIMEOUT;
    return new Promise(function (resolve, reject) {
      var id = ++seq;
      var timer = setTimeout(function () {
        pending.delete(id);
        reject(new BridgeError(CODE_TIMEOUT, 'invoke timeout: ' + method));
      }, timeoutMs);
      pending.set(id, { resolve: resolve, reject: reject, timer: timer });
      sendEnvelope({ id: id, action: 'invoke', method: method, params: stringifyParams(params), sync: false });
    });
  }

  function callSync(method, params) {
    if (!NATIVE) {
      throw new BridgeError(CODE_NO_BRIDGE, 'no native bridge');
    }
    var id = ++seq;
    var ret = NATIVE.postMessage(JSON.stringify({
      id: id, action: 'invoke', method: method, params: stringifyParams(params), sync: true
    }));
    if (!ret) {
      throw new BridgeError(CODE_NO_BRIDGE, 'empty sync response: ' + method);
    }
    var env = null;
    try { env = JSON.parse(ret); } catch (e) {
      throw new BridgeError(50002, 'malformed sync response: ' + method);
    }
    if (env.code !== CODE_OK) {
      throw new BridgeError(env.code, env.message || ('sync invoke failed: ' + method));
    }
    if (env.data === undefined || env.data === '') { return undefined; }
    try { return JSON.parse(env.data); } catch (e) { return env.data; }
  }

  function emit(event, data) {
    if (!NATIVE) { return; }
    var dataJson = (data === undefined || data === null) ? '' :
      (typeof data === 'string' ? data : JSON.stringify(data));
    sendEnvelope({ id: 0, action: 'event', event: event, data: dataJson });
  }

  /** H5→原生上行二进制（分帧）：bin-start → 64KB 分片 → bin-end，等待原生 __binAck 回执 */
  function sendBinary(event, buffer, metaJson) {
    if (!port) {
      return Promise.reject(new BridgeError(CODE_NO_PORT, 'port channel not ready'));
    }
    return new Promise(function (resolve, reject) {
      var id = ++seq;
      var timer = setTimeout(function () {
        pending.delete(id);
        reject(new BridgeError(CODE_TIMEOUT, 'binary send timeout: ' + event));
      }, DEFAULT_TIMEOUT);
      pending.set(id, {
        resolve: function () { resolve(); },
        reject: reject,
        timer: timer
      });
      port.postMessage(JSON.stringify({
        id: id, action: 'bin-start', event: event, size: buffer.byteLength
      }));
      for (var off = 0; off < buffer.byteLength; off += CHUNK_SIZE) {
        port.postMessage(buffer.slice(off, Math.min(off + CHUNK_SIZE, buffer.byteLength)));
      }
      port.postMessage(JSON.stringify({
        id: id, action: 'bin-end', event: event, data: metaJson || ''
      }));
    });
  }

  /* ==================== hello 握手 ==================== */

  var ready = (function () {
    return new Promise(function (resolve) {
      if (!NATIVE) {
        resolve({ pv: 0, methods: [], caps: { port: false, binary: false }, available: false });
        return;
      }
      var ret = '';
      try {
        ret = NATIVE.postMessage(JSON.stringify({
          id: 0, action: 'hello', pv: PROTOCOL_VERSION, want: '["port"]'
        }));
      } catch (e) {
        resolve({ pv: 0, methods: [], caps: { port: false, binary: false }, available: false });
        return;
      }
      var info = { pv: 0, methods: [], caps: { port: false, binary: false }, available: true };
      try {
        var env = JSON.parse(ret);
        if (env.code === CODE_OK && env.data) {
          negotiated = JSON.parse(env.data);
          info.pv = negotiated.pv;
          info.methods = negotiated.methods;
          info.caps = negotiated.caps;
        }
      } catch (e) { /* 保持默认降级信息 */ }
      resolve(info);
    });
  })();

  /* ==================== 导出 ==================== */

  var Bridge = {
    available: !!NATIVE,
    ready: ready,
    call: call,
    callSync: callSync,
    on: on,
    once: once,
    off: off,
    emit: emit,
    sendBinary: sendBinary,
    onBinary: onBinary
  };
  Object.defineProperty(Bridge, 'methods', {
    get: function () { return negotiated.methods; }
  });
  Object.defineProperty(Bridge, 'caps', {
    get: function () { return negotiated.caps; }
  });
  global.Bridge = Bridge;
  global.BridgeError = BridgeError;
})(window);

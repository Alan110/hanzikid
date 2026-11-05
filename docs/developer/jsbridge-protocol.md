# JSBridge 协议规范（v1）

`@hanzi/jsbridge` 原生侧与 H5 侧之间的线格式与通道时序。协议版本 `pv = 1`。

## 通道

| 通道 | 载体 | 方向 | 用途 |
| --- | --- | --- | --- |
| proxy | `javaScriptProxy` 注入对象 `HbNative.postMessage(json)` | H5→原生（同步返回值可回传） | hello 握手、同步 invoke、port 未就绪时的异步 invoke |
| port | `WebMessagePort`（`controller.postMessage('__hb_port__')` 邮寄，H5 `window message` 事件捕获） | 双向（string / ArrayBuffer） | 异步 invoke 应答、事件下行、二进制双向 |
| runJS 兜底 | `controller.runJavaScript('window.__hbReceive(...)')` | 原生→H5 | port 未就绪时的 result / event 回推 |

协商规则：hello 恒走 proxy（利用同步返回值）；异步 invoke 一旦 port 就绪自动走 port；同步 invoke 恒走 proxy。

## Envelope（JSON，字段均原始类型）

```jsonc
// H5 → 原生
{ "id": 1, "action": "hello",  "pv": 1, "want": "[\"port\"]" }
{ "id": 2, "action": "invoke", "method": "system.ping", "params": "{}", "sync": false }
{ "id": 3, "action": "invoke", "method": "storage.getSync", "params": "{\"key\":\"k\"}", "sync": true }
{ "id": 0, "action": "event",  "event": "h5.ready", "data": "{}" }
{ "id": 4, "action": "bin-start", "event": "up.blob", "size": 262144 }
// … 64KB ArrayBuffer 分片，连续 port.postMessage …
{ "id": 4, "action": "bin-end", "event": "up.blob", "data": "{}" }

// 原生 → H5（invoke 应答；hello/同步 invoke 经 proxy 同步返回，异步经 port/runJS）
{ "id": 2, "action": "result", "code": 0, "message": "", "data": "{\"t\":1730000000}" }
{ "id": 0, "action": "event",  "event": "demo.tick", "data": "{}" }
{ "id": 0, "action": "bin-start", "event": "demo.blob", "id": 7, "size": 1048576 }
// … ArrayBuffer 分片 …
{ "id": 0, "action": "bin-end" }   // 冗余确认，重组以 received>=size 为准
```

约定：

- `id`：请求关联号；事件/下行帧可为 0
- `params` / `data`：**不透明字符串**，协议层不解析业务负载（H5 侧序列化，原生 handler 自行 `JSON.parse`）
- `sync: true` 时应答直接作为 `postMessage` 的**同步返回值**回传（同 result 结构）；`sync: false` 时 proxy 返回 `''`，应答经 port 或 runJS 兜底
- 二进制：上行单流会话（一次一个），原生收满 `size` 即重组并转发 handler，随后经 `__binAck` 事件回执；下行同样 64KB 分帧，H5 收满即重组

## 时序

```text
H5                          Native(javaScriptProxy + port)
 │ postMessage(hello) ──────────▶│ 解析 pv，返回 result(data=methods/caps)
 │ window message ◀──────────────│ controller.postMessage('__hb_port__', [port])
 │ 捕获 port，portReady          │
 │ postMessage(invoke async) ───▶│ port 通道（或 proxy 降级）
 │ ◀── result / event / binary ──│ port（或 runJavaScript('__hbReceive') 兜底）
```

## 错误码（BridgeCode）

| 码 | 含义 |
| --- | --- |
| 0 | 成功 |
| 40401 | 方法未注册 |
| 40801 | 调用超时（H5 侧同码） |
| 50001 | handler 抛出异常 |
| 50002 | 桥不可用 / 响应格式错误（H5 侧同码） |
| 50003 | port 通道未就绪（H5 侧 sendBinary） |

## H5 SDK 约定

- 注入对象名 `HbNative`（可经 `BridgeOptions.proxyName` 覆盖，须与 H5 SDK `NATIVE_NAME` 一致）
- 端口初始消息 `__hb_port__`；runJS 兜底入口 `window.__hbReceive(json)`
- 订阅通配：`ns.*` 匹配 `ns.` 前缀所有事件；订阅方异常被捕获，不阻断分发

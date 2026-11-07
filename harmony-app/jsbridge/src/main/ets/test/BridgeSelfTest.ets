import { BridgeRegistry } from '../core/BridgeRegistry';
import { BridgeContext } from '../core/BridgeContext';
import { BridgeAction, BridgeEnvelope } from '../core/BridgeTypes';

/** 自测上下文：记录 resolve/reject 结果。 */
class BridgeSelfTestCtx implements BridgeContext {
  readonly method: string;
  readonly id: number;
  resolvedJson: string | null = null;
  rejectedCode: number = -1;
  rejectedMsg: string = '';

  constructor(method: string, id: number) {
    this.method = method;
    this.id = id;
  }

  resolve(dataJson: string): void {
    this.resolvedJson = dataJson;
  }

  reject(code: number, message: string): void {
    this.rejectedCode = code;
    this.rejectedMsg = message;
  }
}

/**
 * 纯逻辑自测（设备上经 demo 页 'test.run' 触发，结果字符串回传）。
 * 覆盖：envelope JSON round-trip、注册表注册/查找/命名空间/注销、handler 执行。
 */
export class BridgeSelfTest {
  static run(): string {
    const lines: Array<string> = [];
    let pass: number = 0;
    let fail: number = 0;
    const check = (name: string, ok: boolean, detail: string): void => {
      if (ok) {
        pass++;
        lines.push(`PASS ${name}`);
      } else {
        fail++;
        lines.push(`FAIL ${name} ${detail}`);
      }
    };

    // 1. envelope round-trip
    try {
      const env: BridgeEnvelope = {
        id: 7,
        action: BridgeAction.INVOKE,
        method: 'system.ping',
        params: '{"n":1}',
        sync: false
      };
      const json: string = JSON.stringify(env);
      const back: BridgeEnvelope = JSON.parse(json) as BridgeEnvelope;
      check('envelope.roundtrip', back.id === 7 && back.method === 'system.ping'
        && back.params === '{"n":1}' && back.sync === false, `id=${back.id} method=${back.method}`);
    } catch (err) {
      check('envelope.roundtrip', false, `${err}`);
    }

    // 2. envelope 可选字段省略后仍可解析
    try {
      const env: BridgeEnvelope = { id: 1, action: BridgeAction.EVENT, event: 'demo.tick', data: '{}' };
      const back: BridgeEnvelope = JSON.parse(JSON.stringify(env)) as BridgeEnvelope;
      check('envelope.optionalFields', back.event === 'demo.tick' && back.method === undefined, `event=${back.event}`);
    } catch (err) {
      check('envelope.optionalFields', false, `${err}`);
    }

    // 3. 注册表：async/sync 注册与查找
    const registry: BridgeRegistry = new BridgeRegistry();
    registry.register('demo.async', (ctx: BridgeContext, paramsJson: string): void => {
      ctx.resolve(`echo:${paramsJson}`);
    });
    registry.registerSync('demo.sync', (paramsJson: string): string => {
      return `sync:${paramsJson}`;
    });
    check('registry.asyncFound', registry.getHandler('demo.async') !== null, 'async handler missing');
    check('registry.syncFound', registry.getSyncHandler('demo.sync') !== null, 'sync handler missing');
    check('registry.unknownNull', registry.getHandler('nope') === null && registry.getSyncHandler('nope') === null,
      'unknown should be null');

    // 4. handler 执行
    try {
      const h = registry.getHandler('demo.async');
      if (h !== null) {
        const ctx: BridgeSelfTestCtx = new BridgeSelfTestCtx('demo.async', 1);
        h(ctx, 'x');
        check('registry.handlerExec', ctx.resolvedJson === 'echo:x', `resolved=${ctx.resolvedJson}`);
      }
    } catch (err) {
      check('registry.handlerExec', false, `${err}`);
    }

    // 5. 命名空间批量注册
    registry.registerModule('ns', [
      { method: 'a', handler: (ctx: BridgeContext, paramsJson: string): void => {
        ctx.resolve('a');
      } },
      { method: 'b', syncHandler: (paramsJson: string): string => {
        return 'b';
      } }
    ]);
    check('registry.moduleAsync', registry.getHandler('ns.a') !== null, 'ns.a missing');
    check('registry.moduleSync', registry.getSyncHandler('ns.b') !== null, 'ns.b missing');

    // 6. 注销与清单
    registry.unregister('ns.a');
    check('registry.unregister', registry.getHandler('ns.a') === null, 'ns.a still there');
    const all: Array<string> = registry.allMethods();
    check('registry.allMethods', all.indexOf('demo.async') >= 0 && all.indexOf('ns.b') >= 0
      && all.indexOf('ns.a') < 0, `all=${all.length}`);
    registry.clear();
    check('registry.clear', registry.allMethods().length === 0, 'not cleared');

    lines.push(`---- ${pass} passed, ${fail} failed ----`);
    return lines.join('\n');
  }
}

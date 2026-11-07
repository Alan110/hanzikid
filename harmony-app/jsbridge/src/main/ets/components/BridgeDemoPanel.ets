import { webview } from '@kit.ArkWeb';
import { BridgeClient } from '../core/BridgeClient';
import { BridgeContext } from '../core/BridgeContext';
import { registerSystemPlugin } from '../plugins/SystemPlugin';
import { registerStoragePlugin } from '../plugins/StoragePlugin';
import { BridgeSelfTest } from '../test/BridgeSelfTest';

const DEMO_BLOB_SIZE: number = 1024 * 1024; // 下行二进制演示：1MB

/**
 * JSBridge demo 面板：Web（加载宿主 rawfile 下 bridge_demo.html）+ 原生侧控制台。
 * 覆盖矩阵：hello/同步/异步/延迟应答/超时/事件双向/二进制双向往返/storage 插件/自测。
 */
@Component
export struct BridgeDemoPanel {
  @State logLines: Array<string> = [];
  private controller: webview.WebviewController = new webview.WebviewController();
  private client: BridgeClient = BridgeClient.attach(this.controller);
  private blobChecksum: number = -1;

  aboutToAppear(): void {
    const context = getContext(this);
    registerSystemPlugin(this.client);
    registerStoragePlugin(this.client, context);
    // 自测入口：demo 页按钮触发，结果文本回传
    this.client.register('test.run', (ctx: BridgeContext, paramsJson: string): void => {
      ctx.resolve(BridgeSelfTest.run());
    });
    // H5→原生事件
    this.client.onEvent((event: string, dataJson: string): void => {
      this.appendLog(`<event ${event} ${dataJson}`);
      if (event === 'demo.blobCheck') {
        const ok: boolean = dataJson === `${this.blobChecksum}`;
        this.appendLog(`blob checksum verify: ${ok ? 'OK' : 'MISMATCH'} (sent=${this.blobChecksum} got=${dataJson})`);
        this.client.emit('demo.blobResult', ok ? 'ok' : 'mismatch');
      }
    });
    // H5→原生二进制
    this.client.onBinary((event: string, buffer: ArrayBuffer): void => {
      this.appendLog(`<binary ${event} len=${buffer.byteLength}`);
    });
  }

  aboutToDisappear(): void {
    this.client.detach();
  }

  build() {
    Column({ space: 8 }) {
      Web({
        src: $rawfile('bridge_demo.html'),
        controller: this.controller
      })
        .javaScriptProxy({
          object: this.client.injectedObject(),
          name: this.client.proxyName(),
          methodList: this.client.injectedMethodList(),
          controller: this.controller
        })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .layoutWeight(1)
        .width('100%')

      Row({ space: 8 }) {
        Button('emit 事件')
          .fontSize(14)
          .onClick(() => {
            this.client.emit('demo.tick', `{"t":${Date.now()}}`);
            this.appendLog('> event demo.tick');
          })
        Button('下行 1MB 二进制')
          .fontSize(14)
          .onClick(() => {
            this.sendDemoBlob();
          })
        Button('清空日志')
          .fontSize(14)
          .onClick(() => {
            this.logLines = [];
          })
      }
      .width('100%')

      List({ space: 2 }) {
        ForEach(this.logLines, (line: string, idx: number) => {
          ListItem() {
            Text(line)
              .fontSize(11)
              .fontColor('#333333')
              .width('100%')
          }
        }, (line: string, idx: number): string => `${idx}-${line}`)
      }
      .backgroundColor('#F2F2F2')
      .borderRadius(8)
      .padding(8)
      .height(150)
      .width('100%')
    }
    .padding(12)
    .width('100%')
    .height('100%')
  }

  /** 生成 1MB 模式数据并下行，H5 校验 checksum 后经 demo.blobCheck 事件回报。 */
  private sendDemoBlob(): void {
    const data: Uint8Array = new Uint8Array(DEMO_BLOB_SIZE);
    let checksum: number = 0;
    for (let i: number = 0; i < DEMO_BLOB_SIZE; i++) {
      const b: number = (i * 31 + 7) & 0xFF;
      data[i] = b;
      checksum = (checksum + b) & 0xFFFF;
    }
    this.blobChecksum = checksum;
    this.client.emitBinary('demo.blob', data.buffer as ArrayBuffer);
    this.appendLog(`> binary demo.blob 1MB checksum=${checksum}`);
  }

  private appendLog(line: string): void {
    const stamp: string = new Date().toLocaleTimeString();
    this.logLines.push(`[${stamp}] ${line}`);
    if (this.logLines.length > 200) {
      this.logLines.splice(0, this.logLines.length - 200);
    }
  }
}

import { BridgeDemoPanel } from '@hanzi/jsbridge';

/** JSBridge demo 页：宿主侧薄页面，实际内容在 HAR 的 BridgeDemoPanel。 */
@Entry
@Component
struct BridgeDemo {
  build() {
    Column() {
      BridgeDemoPanel()
    }
    .width('100%')
    .height('100%')
  }
}

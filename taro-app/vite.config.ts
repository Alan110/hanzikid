import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/* Vite 5 产物 HTML 固定写 <script type="module" crossorigin>，
 * 但本工程必须输出经典脚本标签（module/crossorigin 在 null origin 下被 CORS 拦截）。
 * bundle 内容已是 iife，仅需把标签改回经典形式。 */
function classicScriptTags(): Plugin {
  return {
    name: 'classic-script-tags',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (html && html.type === 'asset') {
        // module 脚本默认 defer；改经典脚本必须补 defer，否则 head 里同步执行时 #app 尚未解析
        html.source = String(html.source)
          .replace(/<script type="module" crossorigin /g, '<script defer ')
          .replace(/<link rel="stylesheet" crossorigin /g, '<link rel="stylesheet" ')
      }
    }
  }
}

/* 三端壳都以本地方案加载 dist（resource://rawfile / android_asset / file://），
 * 页面 origin 为 null，ES module 脚本会被 CORS 拦截（白屏），因此必须
 * 输出经典脚本：iife 单文件（js/app.js），CSS 拆为静态 <link>。 */
export default defineConfig({
  base: './',
  plugins: [react(), classicScriptTags()],
  build: {
    outDir: 'dist',
    target: 'es2018',
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'js/app.js',
        assetFileNames: 'css/[name][extname]'
      }
    }
  }
})

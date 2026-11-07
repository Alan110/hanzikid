#!/usr/bin/env node
/* =====================================================================
 * 把 Web 内核构建产物（dist/）同步到三个原生壳工程的本地资源目录。
 *
 * 用法：
 *   npm run sync:harmony   → 鸿蒙 rawfile（ArkWeb 以 $rawfile('web/index.html') 加载）
 *   npm run sync:android   → Android assets（WebView 加载 file:///android_asset/www/index.html）
 *   npm run sync:ios       → iOS bundle 资源（WKWebView 加载 Bundle.main/www/index.html）
 *   npm run sync:all       → 三个都同步
 *
 * 约定：dist 里全部是相对路径引用（config/index.ts 的 h5.publicPath: './'），
 * 因此三个壳都能以各自的本地方案（resource://rawfile / android_asset / file://）
 * 直接加载，无需起本地 HTTP 服务。
 * ===================================================================== */
import { cpSync, existsSync, rmSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(appRoot, 'dist')

/** 目标壳工程的资源目录（相对 taro-app/） */
const TARGETS = {
  harmony: { dir: '../harmony-app/entry/src/main/resources/rawfile/web', label: '鸿蒙 rawfile/web' },
  android: { dir: '../android-shell/app/src/main/assets/www', label: 'Android assets/www' },
  ios: { dir: '../ios-shell/HanziKid/www', label: 'iOS HanziKid/www' },
}

/** 统计目录内文件数（递归），用于同步后的自检输出 */
function countFiles(dir) {
  let n = 0
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    n += statSync(p).isDirectory() ? countFiles(p) : 1
  }
  return n
}

function sync(name) {
  const t = TARGETS[name]
  const dest = path.resolve(appRoot, t.dir)
  // 整目录覆盖：先删旧产物，避免 hash 文件名变更后残留旧版本
  rmSync(dest, { recursive: true, force: true })
  cpSync(DIST, dest, { recursive: true })
  const ok = existsSync(path.join(dest, 'index.html'))
  console.log(`[${name}] dist → ${t.dir}（${countFiles(dest)} 个文件，index.html ${ok ? '✓' : '缺失 ✗'}）`)
  return ok
}

const arg = process.argv[2]
if (!arg || arg === '-h' || arg === '--help') {
  console.log('用法: node scripts/sync-web.mjs <harmony|android|ios|all>')
  process.exit(arg ? 0 : 1)
}

const names = arg === 'all' ? Object.keys(TARGETS) : [arg]
if (names.some(n => !TARGETS[n])) {
  console.error(`未知目标: ${arg}（可选 harmony|android|ios|all）`)
  process.exit(1)
}
if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html 不存在，请先执行 npm run build:h5')
  process.exit(1)
}

let failed = false
for (const n of names) {
  if (!sync(n)) failed = true
}
process.exit(failed ? 1 : 0)

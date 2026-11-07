#!/usr/bin/env node
/* =====================================================================
 * 校验三壳内嵌 Web 产物是否与 taro-app/dist 完全一致。
 *
 * 三壳 www 目录不入库（.gitignore），构建任一端前必须：
 *   cd taro-app && npm run build:h5 && npm run sync:all
 *
 * 用法：npm run check:sync
 * 退出码：0 一致；1 缺失/过期（会列出前 10 个差异）
 * ===================================================================== */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(appRoot, 'dist')

const TARGETS = {
  harmony: '../harmony-app/entry/src/main/resources/rawfile/web',
  android: '../android-shell/app/src/main/assets/www',
  ios: '../ios-shell/HanziKid/www',
}

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, base, out)
    else out.push(path.relative(base, p))
  }
  return out
}

const hash = (p) => createHash('sha1').update(readFileSync(p)).digest('hex')

if (!existsSync(DIST) || !existsSync(path.join(DIST, 'index.html'))) {
  console.error('✗ dist 不存在，请先执行：cd taro-app && npm run build:h5')
  process.exit(1)
}

const distFiles = walk(DIST)
const distSet = new Set(distFiles)
let failed = false

for (const [name, rel] of Object.entries(TARGETS)) {
  const target = path.resolve(appRoot, rel)
  const label = `${name} (${rel})`
  if (!existsSync(target) || !existsSync(path.join(target, 'index.html'))) {
    console.error(`✗ ${label}: 产物目录缺失，请执行 npm run sync:${name}`)
    failed = true
    continue
  }
  const targetFiles = walk(target)
  const targetSet = new Set(targetFiles)
  const missing = distFiles.filter(f => !targetSet.has(f))
  const extra = targetFiles.filter(f => !distSet.has(f))
  const changed = []
  for (const f of distFiles) {
    if (!targetSet.has(f)) continue
    if (hash(path.join(DIST, f)) !== hash(path.join(target, f))) changed.push(f)
  }
  const diff = missing.length + extra.length + changed.length
  if (diff === 0) {
    console.log(`✓ ${label}: ${distFiles.length} 个文件一致`)
    continue
  }
  failed = true
  console.error(`✗ ${label}: 不一致（缺失 ${missing.length} / 多余 ${extra.length} / 内容不同 ${changed.length}）`)
  for (const f of missing.slice(0, 10)) console.error(`    - 缺失 ${f}`)
  for (const f of extra.slice(0, 10)) console.error(`    + 多余 ${f}`)
  for (const f of changed.slice(0, 10)) console.error(`    ~ 不同 ${f}`)
  console.error(`  修复：cd taro-app && npm run build:h5 && npm run sync:all`)
}

process.exit(failed ? 1 : 0)

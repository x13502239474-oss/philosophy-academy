import { build } from 'esbuild'
import { writeFileSync } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const entry = `
import { lessons, modules } from './src/data/curriculum'
import { concepts } from './src/data/concepts'
import { philosophers } from './src/data/philosophers'
export const payload = { lessons, modules, concepts, philosophers }
`
writeFileSync('_vc_entry.ts', entry)

await build({
  entryPoints: ['_vc_entry.ts'],
  bundle: true,
  outfile: '_vc_bundle.cjs',
  format: 'cjs',
  platform: 'node',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  logLevel: 'error',
})

const { payload } = require('./_vc_bundle.cjs')
const { lessons, modules, concepts, philosophers } = payload
const cids = new Set(concepts.map((c) => c.id))
const pids = new Set(philosophers.map((p) => p.id))

const errors = []
const warns = []

// 模块
if (modules.length !== 8) errors.push(`模块数应为 8，实际 ${modules.length}`)
const allModuleLessonIds = modules.flatMap((m) => m.lessonIds)
if (allModuleLessonIds.length !== lessons.length) errors.push(`模块 lessonIds 总数 ${allModuleLessonIds.length} ≠ 章节数 ${lessons.length}`)
for (const mid of allModuleLessonIds) if (!lessons.find((l) => l.id === mid)) errors.push(`模块引用了不存在的章节 ${mid}`)

// 章节
if (lessons.length !== 47) errors.push(`章节数应为 47，实际 ${lessons.length}`)
const seen = new Set()
for (const l of lessons) {
  if (seen.has(l.id)) errors.push(`重复章节 id ${l.id}`)
  seen.add(l.id)
  const tag = `${l.id}《${l.title}》`
  if (!l.title) errors.push(`${tag} 缺 title`)
  if (!['bigquestions', 'history', 'thought', 'extension'].includes(l.source?.book)) errors.push(`${tag} source.book 非法：${l.source?.book}`)
  if (!l.source?.chapter) warns.push(`${tag} 缺 source.chapter`)
  if (!l.intro || l.intro.length < 60) errors.push(`${tag} 导读过短`)
  if ((l.objectives ?? []).length < 4) errors.push(`${tag} 学习目标不足 4 条`)
  if ((l.coreQuestions ?? []).length < 3) errors.push(`${tag} 核心问题不足 3 条`)
  if ((l.background ?? []).length < 3) errors.push(`${tag} 思想背景不足 3 段`)
  if ((l.theories ?? []).length !== 3) errors.push(`${tag} 理论单元应为 3，实际 ${(l.theories ?? []).length}`)

  for (const [i, t] of (l.theories ?? []).entries()) {
    const ttag = `${tag} 理论${i + 1}`
    if (!t.heading || t.heading.length < 4) errors.push(`${ttag} 缺 heading`)
    for (const f of ['problem', 'background', 'thesis', 'reasoning', 'influence']) {
      if (!t[f] || String(t[f]).length < 20) errors.push(`${ttag} 字段 ${f} 缺失或过短`)
    }
    if (!t.conclusion || t.conclusion.length < 8) errors.push(`${ttag} 结论缺失或过短`)
    if ((t.premises ?? []).length < 2) errors.push(`${ttag} 前提不足 2 条`)
    if ((t.assumptions ?? []).length < 2) errors.push(`${ttag} 隐含假设不足 2 条`)
    if ((t.texts ?? []).length < 1) errors.push(`${ttag} 缺文本解读`)
    if ((t.objections ?? []).length < 2) errors.push(`${ttag} 反对意见不足 2 条`)
    if ((t.thinking ?? []).length < 2) errors.push(`${ttag} 独立思考不足 2 问`)
    for (const o of t.objections ?? []) {
      if (!o.by || !o.claim || !o.verdict) errors.push(`${ttag} 反对意见字段不全`)
    }
  }

  if ((l.conceptIds ?? []).length < 4) errors.push(`${tag} 概念引用不足 4 个`)
  for (const c of l.conceptIds ?? []) if (!cids.has(c)) errors.push(`${tag} 概念 id 悬空：${c}`)
  if ((l.philosopherIds ?? []).length < 3) errors.push(`${tag} 哲学家引用不足 3 个`)
  for (const p of l.philosopherIds ?? []) if (!pids.has(p)) errors.push(`${tag} 哲学家 id 悬空：${p}`)
  if ((l.arguments ?? []).length < 2) errors.push(`${tag} 经典论证不足 2 个`)
  if ((l.readings ?? []).length < 1) errors.push(`${tag} 缺原著阅读训练`)
  for (const r of l.readings ?? []) {
    if (!r.work || !r.before || !r.passage?.modern || !r.passage?.analysis) errors.push(`${tag} 阅读训练字段不全`)
    if ((r.questions ?? []).length < 2) errors.push(`${tag} 阅读思考题不足 2 个`)
  }
  if ((l.comparisons ?? []).length < 1) errors.push(`${tag} 缺横向比较`)
  for (const c of l.comparisons ?? []) {
    if ((c.sides ?? []).length < 2) errors.push(`${tag} 比较少于 2 方`)
    for (const s of c.sides ?? []) if (!s.strength || !s.limit) errors.push(`${tag} 比较缺强处/局限`)
  }
  if ((l.exercises ?? []).length < 5) errors.push(`${tag} 练习不足 5 题`)
  for (const ex of l.exercises ?? []) {
    for (const f of ['question', 'answer', 'reasoning', 'demonstration', 'pitfall']) {
      if (!ex[f] || String(ex[f]).length < 10) errors.push(`${tag} 练习 ${ex.id} 字段 ${f} 缺失或过短`)
    }
    if ((ex.kind ?? '').includes('开放') && (ex.directions ?? []).length < 2) errors.push(`${tag} 开放题 ${ex.id} 缺论证方向`)
  }
  if (!l.summary || l.summary.length < 120) errors.push(`${tag} 总结过短`)
  if ((l.quiz ?? []).length !== 4) errors.push(`${tag} 测验应为 4 题，实际 ${(l.quiz ?? []).length}`)
  for (const q of l.quiz ?? []) {
    if (!q.explanation || q.explanation.length < 15) errors.push(`${tag} 测验题 ${q.id} 缺详解`)
    if (q.type === 'single' && (q.options ?? []).length !== 4) errors.push(`${tag} 测验题 ${q.id} 选项非 4 个`)
    if (q.type === 'single' && (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3)) errors.push(`${tag} 测验题 ${q.id} 答案索引非法`)
    if (q.type === 'judge' && typeof q.answer !== 'boolean') errors.push(`${tag} 测验题 ${q.id} 判断答案非布尔`)
  }
}

// 统计
const stat = {
  模块: modules.length,
  章节: lessons.length,
  理论单元: lessons.reduce((s, l) => s + (l.theories ?? []).length, 0),
  原著阅读: lessons.reduce((s, l) => s + (l.readings ?? []).length, 0),
  横向比较: lessons.reduce((s, l) => s + (l.comparisons ?? []).length, 0),
  练习: lessons.reduce((s, l) => s + (l.exercises ?? []).length, 0),
  测验题: lessons.reduce((s, l) => s + (l.quiz ?? []).length, 0),
  概念: concepts.length,
  哲学家: philosophers.length,
  正文字数: lessons.reduce((s, l) => s + JSON.stringify(l).length, 0),
}
console.log('=== 统计 ===')
for (const [k, v] of Object.entries(stat)) console.log(`${k}: ${v}`)
console.log('\n=== 每部分章节 ===')
for (const m of modules) console.log(`${m.id} ${m.title}: ${m.lessonIds.length} 章 → ${m.lessonIds.join(' ')}`)

if (warns.length) {
  console.log(`\n=== 警告 ${warns.length} 条 ===`)
  warns.slice(0, 20).forEach((w) => console.log('! ' + w))
}
if (errors.length) {
  console.log(`\n=== 错误 ${errors.length} 条 ===`)
  errors.slice(0, 60).forEach((e) => console.log('x ' + e))
  process.exit(1)
}
console.log('\n✅ 全部结构校验通过')

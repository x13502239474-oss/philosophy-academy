import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FlaskConical, CalendarDays, GitBranch, Swords, PenLine, ArrowRight, Sparkles, Clock3 } from 'lucide-react'
import { dailyQuestions, argumentDrills, debates, writingPrompts } from '../data/training'
import { experiments } from '../data/experiments'
import { useProgress, dailyIndex, formatDate } from '../lib/hooks'
import { todayKey } from '../lib/storage'
import { updateProgress, logActivity } from '../lib/storage'
import { SectionHeader } from '../components/ui'

const modes = [
  { id: 'daily', label: '每日问题', icon: CalendarDays, color: '#43D9D0', desc: '每天一个问题，记录你的思考' },
  { id: 'drill', label: '论证训练', icon: GitBranch, color: '#4B9EFF', desc: '拆解前提、结论与隐藏假设' },
  { id: 'debate', label: '立场辩论', icon: Swords, color: '#8C7CFF', desc: '选择立场，构建你的论证' },
  { id: 'writing', label: '哲学写作', icon: PenLine, color: '#F0A56B', desc: '长文写作，积累思想草稿' },
]

export default function Think() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'lab'
  const p = useProgress()
  const [dailyText, setDailyText] = useState(p.dailyAnswers[todayKey()]?.text ?? '')
  const [saved, setSaved] = useState(false)

  const daily = dailyQuestions[dailyIndex(dailyQuestions.length)]
  const today = todayKey()

  return (
    <div className="pad pt-6">
      <div className="mb-6">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[#43D9D0]">The Thinking Gym</div>
        <h1 className="font-display text-2xl font-bold">思辨训练场</h1>
        <p className="mt-2 text-sm muted">哲学不是记住结论，是亲手练习提问、论证与反驳。这里没有标准答案，只有更好的问题。</p>
      </div>

      {/* 思想实验实验室 - 特色入口 */}
      <Link to={`/experiment/${experiments[0]?.id ?? 'trolley-problem'}`} className="mb-7 block overflow-hidden rounded-3xl border border-[#43D9D0]/25 p-5" style={{ background: 'radial-gradient(circle at 85% 0%, rgba(67,217,208,.15), transparent 55%), linear-gradient(150deg,#0E2030,#0E1422)' }}>
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#43D9D0]">
          <FlaskConical size={13} /> Signature Program · 核心特色
        </div>
        <h2 className="font-display text-xl font-bold">思想实验实验室</h2>
        <p className="mt-2 max-w-[85%] text-sm leading-relaxed" style={{ color: '#B9C6DA' }}>
          走进 {experiments.length} 个哲学情境，选择你的立场、给出理由，系统会分析你使用的原则、隐含前提与可能的漏洞，再用追问帮你把想法想得更清楚。
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-[#43D9D0]">
          进入实验室 <ArrowRight size={14} />
          <span className="ml-1 muted">· 已完成 {Object.keys(p.experimentAnswers).length}/{experiments.length}</span>
        </div>
      </Link>

      {/* 四种训练模式 tab */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {[{ id: 'lab', label: '实验清单' }, ...modes.map((m) => ({ id: m.id, label: m.label }))].map((t) => (
          <button key={t.id} onClick={() => setParams(t.id === 'lab' ? {} : { tab: t.id })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-[#4B9EFF] text-white' : 'glass-soft muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 实验清单 */}
      {tab === 'lab' && (
        <div className="stagger grid gap-2.5">
          {experiments.map((e) => {
            const done = !!p.experimentAnswers[e.id]
            return (
              <Link key={e.id} to={`/experiment/${e.id}`} className="flex items-center gap-3 rounded-2xl glass p-4 transition active:scale-[.99]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: e.color + '1A', color: e.color }}>
                  <FlaskConical size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{e.title}</div>
                  <div className="truncate text-xs muted">{e.category} · {e.question}</div>
                </div>
                {done && <span className="shrink-0 text-[10px] text-[#43D9D0]">已思考</span>}
                <ArrowRight size={15} className="shrink-0 muted" />
              </Link>
            )
          })}
        </div>
      )}

      {/* 每日问题 */}
      {tab === 'daily' && daily && (
        <section>
          <div className="mb-3 rounded-2xl glass p-5">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#43D9D0]">
              <CalendarDays size={13} /> {formatDate(Date.now())} · {daily.category}
            </div>
            <p className="font-display text-lg font-semibold leading-snug">『{daily.question}』</p>
            <p className="mt-3 text-xs muted">提示：{daily.hint}</p>
            <div className="mt-3 space-y-1.5">
              {daily.perspectives.map((ps, i) => <div key={i} className="text-xs" style={{ color: '#B9C6DA' }}>· {ps}</div>)}
            </div>
          </div>
          <div className="rounded-2xl glass p-4">
            <div className="mb-2 text-sm font-semibold">你的观点</div>
            <textarea className="field" placeholder="先别急着下结论——你为什么这样想？试着给出理由。" value={dailyText} onChange={(e) => setDailyText(e.target.value)} />
            <button onClick={() => {
              if (!dailyText.trim()) return
              updateProgress((d) => {
                d.dailyAnswers[today] = { date: today, text: dailyText.trim(), at: Date.now() }
                logActivity(d, 'daily', today, `每日问题 · ${daily.category}`)
              })
              setSaved(true)
              setTimeout(() => setSaved(false), 2000)
            }} className="btn-primary mt-3 w-full py-2.5 text-sm">{saved ? '已保存 ✓' : '保存我的观点'}</button>
            <div className="mt-3 text-[11px] muted">已记录 {Object.keys(p.dailyAnswers).length} 天的思考</div>
          </div>
        </section>
      )}

      {/* 论证训练 */}
      {tab === 'drill' && (
        <div className="stagger space-y-2.5">
          {argumentDrills.map((d, i) => (
            <Link key={d.id} to={`/experiment/drill-${d.id}`} className="flex items-center gap-3 rounded-2xl glass p-4 transition active:scale-[.99]">
              <span className="chip shrink-0">难度 {'★'.repeat(d.difficulty)}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{d.title}</div>
                <div className="truncate text-xs muted">{d.passage.slice(0, 40)}…</div>
              </div>
              <ArrowRight size={15} className="shrink-0 muted" />
            </Link>
          ))}
        </div>
      )}

      {/* 立场辩论 */}
      {tab === 'debate' && (
        <div className="stagger space-y-2.5">
          {debates.map((d) => (
            <Link key={d.id} to={`/experiment/debate-${d.id}`} className="block rounded-2xl glass p-4 transition active:scale-[.99]">
              <div className="mb-1 flex items-center gap-2"><Swords size={14} className="text-[#8C7CFF]" /><span className="text-[10px] uppercase tracking-widest text-[#8C7CFF]">Debate</span></div>
              <div className="font-semibold">{d.title}</div>
              <div className="mt-1 text-xs muted">{d.question}</div>
            </Link>
          ))}
        </div>
      )}

      {/* 哲学写作 */}
      {tab === 'writing' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm muted">已积累 {p.writings.length} 篇草稿</div>
            <Link to="/profile?tab=writing" className="text-xs text-[#4B9EFF]">我的草稿 ›</Link>
          </div>
          <div className="stagger space-y-2.5">
            {writingPrompts.map((w) => (
              <Link key={w.id} to={`/experiment/write-${w.id}`} className="block rounded-2xl glass p-4 transition active:scale-[.99]">
                <div className="mb-1 flex items-center justify-between">
                  <span className="chip">难度 {'★'.repeat(w.difficulty)}</span>
                  <span className="flex items-center gap-1 text-[11px] muted"><Clock3 size={11} /> 建议 {w.minWords} 字</span>
                </div>
                <div className="mt-2 font-semibold">{w.title}</div>
                <div className="mt-1 text-xs muted">{w.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

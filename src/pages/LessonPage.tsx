import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Clock3, Target, CircleHelp, Lightbulb, BookOpen, Users, Scale, CaseSensitive, Brain,
  CheckCircle2, XCircle, Bookmark, NotebookPen, ChevronRight, Sparkles, LockKeyhole, UnlockKeyhole,
  History, ScrollText, GitCompareArrows, Compass, Quote, AlertTriangle, ArrowRight, Layers3,
} from 'lucide-react'
import { lessons, modules, lessonNumber } from '../data/curriculum'
import { concepts } from '../data/concepts'
import { philosophers } from '../data/philosophers'
import { updateProgress, logActivity } from '../lib/storage'
import { useProgress, formatDate } from '../lib/hooks'
import { BackBar, EmptyState } from '../components/ui'
import type { TheoryUnit, ReadingGuide, Comparison } from '../types'

const srcName: Record<string, string> = {
  bigquestions: '《大问题》', history: '《西方哲学简史》', thought: '《做哲学》', extension: '平台扩展',
}

/** 阿拉伯数字转罗马数字，用于典籍卷次装饰 */
function roman(n: number): string {
  const table: [number, string][] = [[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let out = ''
  for (const [v, s] of table) while (n >= v) { out += s; n -= v }
  return out || 'I'
}

function Block({ icon: Icon, title, color, children, tag }: { icon: typeof Target; title: string; color: string; children: React.ReactNode; tag?: string }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-sm" style={{ background: color + '1A', color }}><Icon size={15} /></div>
        <h2 className="font-bold tracking-wide">{title}</h2>
        {tag && <span className="chip text-[10px]">{tag}</span>}
      </div>
      {children}
    </section>
  )
}

/** 八段式理论单元：一段一段拆开论证 */
function TheoryCard({ t, idx, open, onToggle, color }: { t: TheoryUnit; idx: number; open: boolean; onToggle: () => void; color: string }) {
  const step = { fontSize: 11, letterSpacing: '.06em' } as const
  const label = (n: string, text: string, c = color) => (
    <div className="mb-1.5 flex items-center gap-1.5" style={{ color: c }}>
      <span className="font-mono" style={{ ...step, opacity: .9 }}>{n}</span>
      <span className="text-[11px] font-bold" style={{ ...step }}>{text}</span>
    </div>
  )
  return (
    <div className="overflow-hidden rounded-sm glass">
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px]" style={{ background: color + '22', color }}>{idx + 1}</span>
        <span className="flex-1 text-sm font-bold leading-snug">{t.heading}</span>
        <ChevronRight size={16} className={`shrink-0 muted transition ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="animate-fade-up space-y-5 border-t border-[#C4AB82] px-4 py-4">
          {/* 1 哲学问题 */}
          <div>
            {label('①', '哲学问题')}
            <p className="text-sm leading-[1.9]" style={{ color: '#514332' }}>{t.problem}</p>
          </div>
          {/* 2 思想背景 */}
          <div>
            {label('②', '思想背景', '#A8874F')}
            <p className="text-sm leading-[1.9]" style={{ color: '#514332' }}>{t.background}</p>
          </div>
          {/* 3 核心命题 */}
          <div className="rounded-sm border-l-2 border-[#586044] bg-[#586044]/[.06] px-3.5 py-3">
            {label('③', '核心命题', '#586044')}
            <p className="text-sm leading-[1.9]" style={{ color: '#586044' }}>{t.thesis}</p>
          </div>
          {/* 4 论证过程 */}
          <div>
            {label('④', '论证过程')}
            <div className="space-y-1.5">
              {t.premises.map((pr, j) => (
                <div key={j} className="flex gap-2 text-sm leading-[1.8]">
                  <span className="shrink-0 font-mono text-[11px] text-[#87745A]">P{j + 1}</span><span>{pr}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5 text-sm leading-[1.9]" style={{ color: '#514332' }}>
              <span className="mr-1.5 font-mono text-[11px]" style={{ color }}>推理</span>{t.reasoning}
            </div>
            <div className="mt-2.5 flex gap-2 rounded-sm bg-[#586044]/[.07] px-3 py-2 text-sm font-medium">
              <span className="shrink-0 font-mono text-[11px] text-[#586044]">∴</span><span>{t.conclusion}</span>
            </div>
            <div className="mt-2.5 rounded-sm border border-dashed border-[#B08D57]/35 px-3 py-2">
              <div className="mb-1 text-[11px] font-bold text-[#B08D57]">隐含假设（论证没说出口的部分）</div>
              <ul className="space-y-1">
                {t.assumptions.map((a, j) => (
                  <li key={j} className="flex gap-1.5 text-[13px] leading-[1.8]" style={{ color: '#514332' }}>
                    <span className="text-[#B08D57]">·</span><span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 5 文本解读 */}
          <div>
            {label('⑤', '经典文本解读', '#8A6A3E')}
            <div className="space-y-2.5">
              {t.texts.map((tx, j) => (
                <div key={j} className="rounded-sm bg-[#E9D9B8]/55 p-3">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-[#8A6A3E]">{tx.work}</span>
                    <span className="muted">·</span>
                    <span className="muted">{tx.locator}</span>
                  </div>
                  <p className="text-[13px] leading-[1.85]" style={{ color: '#514332' }}>{tx.gist}</p>
                  <p className="mt-1.5 border-t border-[#C4AB82] pt-1.5 text-[13px] leading-[1.85]" style={{ color: '#87745A' }}>
                    <span className="mr-1 font-semibold text-[#8A6A3E]">解读</span>{tx.analysis}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* 6 反对意见 */}
          <div>
            {label('⑥', '反对意见', '#8F4A40')}
            <div className="space-y-2">
              {t.objections.map((o, j) => (
                <div key={j} className="rounded-sm border border-[#8F4A40]/20 bg-[#8F4A40]/[.04] px-3 py-2.5">
                  <div className="mb-1 text-[12px] font-bold text-[#8F4A40]">{o.by}</div>
                  <p className="text-[13px] leading-[1.85]" style={{ color: '#514332' }}>{o.claim}</p>
                  <p className="mt-1 text-[13px] leading-[1.85]" style={{ color: '#87745A' }}>
                    <span className="mr-1 font-semibold text-[#B08D57]">这批评成立吗</span>{o.verdict}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* 7 理论影响 */}
          <div>
            {label('⑦', '理论影响', '#A8874F')}
            <p className="text-sm leading-[1.9]" style={{ color: '#514332' }}>{t.influence}</p>
          </div>
          {/* 8 独立思考 */}
          <div className="rounded-sm border border-[#A8874F]/25 bg-[#A8874F]/[.06] px-3.5 py-3">
            {label('⑧', '独立思考', '#A8874F')}
            <ul className="space-y-1.5">
              {t.thinking.map((q, j) => (
                <li key={j} className="flex gap-2 text-[13px] leading-[1.85]" style={{ color: '#60452F' }}>
                  <span className="shrink-0 font-mono text-[11px] text-[#A8874F]">Q{j + 1}</span><span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function ReadingCard({ r, color }: { r: ReadingGuide; color: string }) {
  const [openPassage, setOpenPassage] = useState(false)
  return (
    <div className="rounded-sm glass p-4">
      <div className="mb-1 flex items-start gap-2">
        <ScrollText size={16} className="mt-0.5 shrink-0" style={{ color }} />
        <div className="flex-1">
          <div className="text-sm font-bold">{r.title}</div>
          <div className="mt-0.5 text-[11px] muted">建议阅读：{r.work}</div>
        </div>
      </div>
      <div className="mt-3 space-y-3 text-[13px] leading-[1.85]" style={{ color: '#514332' }}>
        <div>
          <div className="mb-1 text-[11px] font-bold text-[#87745A]">读之前先明白这件事</div>
          <p>{r.before}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {r.keyConcepts.map((c, i) => <span key={i} className="chip text-[11px]" style={{ borderColor: color + '44', color }}>{c}</span>)}
        </div>
        <div>
          <div className="mb-1 text-[11px] font-bold text-[#87745A]">要抓的核心命题</div>
          <ul className="space-y-1">
            {r.corePropositions.map((p, i) => (
              <li key={i} className="flex gap-1.5"><span style={{ color }}>·</span><span>{p}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-sm bg-[#E9D9B8]/55 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#586044]"><Quote size={12} /> 重点段落：先看白话，再看论证</div>
          <p className="text-[13px] leading-[1.85]" style={{ color: '#514332' }}>{r.passage.modern}</p>
          <button onClick={() => setOpenPassage((s) => !s)} className="btn-ghost mt-2 w-full py-1.5 text-[11px]">
            {openPassage ? '收起论证分析' : '我读完了，看论证分析'}
          </button>
          {openPassage && (
            <p className="animate-fade-up mt-2 border-t border-[#C4AB82] pt-2 text-[13px] leading-[1.85]" style={{ color: '#87745A' }}>{r.passage.analysis}</p>
          )}
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#B08D57]"><AlertTriangle size={12} /> 阅读难点</div>
          <ul className="space-y-1">
            {r.difficulties.map((d, i) => <li key={i} className="flex gap-1.5"><span className="text-[#B08D57]">·</span><span>{d}</span></li>)}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-bold text-[#87745A]">思想脉络</div>
          <p>{r.thread}</p>
        </div>
        <div className="rounded-sm border border-[#A8874F]/20 bg-[#A8874F]/[.05] p-3">
          <div className="mb-1 text-[11px] font-bold text-[#A8874F]">读完想这几个问题</div>
          <ul className="space-y-1">
            {r.questions.map((q, i) => <li key={i} className="flex gap-1.5"><span className="text-[#A8874F]">Q{i + 1}</span><span>{q}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ComparisonCard({ c }: { c: Comparison }) {
  const tint = ['#793D36', '#586044', '#A8874F']
  return (
    <div className="rounded-sm glass p-4">
      <div className="mb-1 flex items-center gap-2">
        <GitCompareArrows size={16} className="text-[#586044]" />
        <div className="text-sm font-bold">{c.title}</div>
      </div>
      <div className="mb-3 text-[12px] leading-relaxed" style={{ color: '#87745A' }}>分歧所在：{c.question}</div>
      <div className="space-y-2.5">
        {c.sides.map((s, i) => (
          <div key={i} className="rounded-sm p-3" style={{ background: tint[i % 3] + '0F', borderLeft: `2px solid ${tint[i % 3]}` }}>
            <div className="mb-1 text-[12px] font-bold" style={{ color: tint[i % 3] }}>{s.label}</div>
            <p className="text-[13px] leading-[1.85]" style={{ color: '#514332' }}>{s.thesis}</p>
            <p className="mt-1 text-[13px] leading-[1.85]" style={{ color: '#87745A' }}><span className="font-semibold">论证 </span>{s.argument}</p>
            <div className="mt-1.5 grid gap-1 text-[12px] leading-[1.8]">
              <div style={{ color: '#586044' }}><span className="font-semibold">强处 </span>{s.strength}</div>
              <div style={{ color: '#A8874F' }}><span className="font-semibold">局限 </span>{s.limit}</div>
            </div>
          </div>
        ))}
      </div>
      {c.takeaway && (
        <div className="mt-3 rounded-sm border border-[#586044]/25 bg-[#586044]/[.06] px-3 py-2 text-[13px] leading-[1.85]" style={{ color: '#586044' }}>
          <span className="mr-1 font-bold text-[#586044]">比较之后</span>{c.takeaway}
        </div>
      )}
    </div>
  )
}

export default function LessonPage() {
  const { id } = useParams()
  const p = useProgress()
  const lesson = lessons.find((l) => l.id === id)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | boolean>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [exerciseOpen, setExerciseOpen] = useState<Record<string, boolean>>({})
  const [noteText, setNoteText] = useState('')
  const [openTheory, setOpenTheory] = useState<number>(0)

  if (!lesson) return <div className="pad pt-6"><BackBar title="返回课程" /><EmptyState icon={<BookOpen size={40} />} text="未找到该章节" /></div>

  const mod = modules.find((m) => m.id === lesson.moduleId)
  const color = mod?.color ?? '#793D36'
  const isDone = p.completedLessons.includes(lesson.id)
  const isFav = p.favorites.includes(`lesson-${lesson.id}`)
  const correctCount = lesson.quiz.filter((q) => quizAnswers[q.id] === q.answer).length
  const allAnswered = lesson.quiz.every((q) => q.id in quizAnswers)
  const globalNo = lessonNumber(lesson.id)
  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const prev = idx > 0 ? lessons[idx - 1] : undefined
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined

  const markDone = () => {
    updateProgress((d) => {
      if (!d.completedLessons.includes(lesson.id)) {
        d.completedLessons.push(lesson.id)
        d.totalMinutes += lesson.duration
        logActivity(d, 'lesson', lesson.id, lesson.title)
      }
    })
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
    updateProgress((d) => {
      lesson.quiz.forEach((q) => {
        const ok = quizAnswers[q.id] === q.answer
        d.quizResults[q.id] = { correct: ok, at: Date.now() }
        if (!ok && !d.wrongQuestions.includes(q.id)) d.wrongQuestions.push(q.id)
        if (ok) d.wrongQuestions = d.wrongQuestions.filter((x) => x !== q.id)
      })
      d.totalMinutes += 5
      logActivity(d, 'quiz', lesson.id, `${lesson.title} · 章节测验`)
    })
  }

  const saveNote = () => {
    if (!noteText.trim()) return
    updateProgress((d) => {
      if (!d.notes[lesson.id]) d.notes[lesson.id] = []
      d.notes[lesson.id].unshift({ id: `n-${Date.now()}`, targetId: lesson.id, text: noteText.trim(), at: Date.now() })
      logActivity(d, 'lesson', lesson.id, `笔记 · ${lesson.title}`)
    })
    setNoteText('')
  }

  return (
    <div className="pad pt-5">
      <BackBar title={mod?.title ?? '课程'} to={`/course/${lesson.moduleId}`} />

      {/* 章节头 · 典籍卷首页 */}
      <div className="folio-frame relative mb-7 bg-[#F6EDD9]/60 px-4 py-5">
        <div className="absolute -top-2 left-4 bg-[#E9D9B8] px-2 font-display text-[10px] tracking-[.3em] text-[#A8874F]">LECTIO · {roman(globalNo)}</div>
        <div className="mb-2 flex flex-wrap items-center gap-2 pt-1">
          <span className="chip" style={{ color, borderColor: color + '44' }}>第 {globalNo} 讲</span>
          <span className="chip">{srcName[lesson.source.book]}</span>
          {lesson.source.chapter && <span className="text-[11px] muted">源自：{lesson.source.chapter}</span>}
        </div>
        <h1 className="font-display text-[25px] font-bold leading-tight tracking-[.03em]">{lesson.title}</h1>
        {lesson.subtitle && <p className="font-reading mt-1.5 text-sm" style={{ color: '#6d583d' }}>{lesson.subtitle}</p>}
        <div className="ornament my-3 text-[10px]">✦</div>
        <div className="flex flex-wrap items-center gap-3 text-xs muted">
          <span className="flex items-center gap-1"><Clock3 size={13} /> {lesson.duration} 分钟</span>
          <span className="flex items-center gap-1"><Layers3 size={13} /> 十二段精读</span>
          <span className="flex items-center gap-1"><ScrollText size={13} /> 原著阅读训练</span>
        </div>
        {lesson.source.note && <div className="margin-note mt-3 pt-2">※ {lesson.source.note}</div>}
      </div>

      {/* 01 导读 */}
      {lesson.intro && (
        <div className="mb-7 rounded-sm border-l-2 p-4 text-[15px] leading-[1.9]" style={{ borderColor: color, background: color + '0F', color: '#514332' }}>
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color }}><Compass size={12} /> 本章导读</div>
          {lesson.intro}
        </div>
      )}

      {/* 02 学习目标 */}
      <Block icon={Target} title="02 · 本章学习目标" color="#793D36">
        <div className="grid gap-2">
          {(lesson.objectives ?? []).map((o, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-sm glass-soft px-4 py-3 text-sm">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#793D36]" /> <span>{o}</span>
            </div>
          ))}
        </div>
      </Block>

      {/* 03 核心问题 */}
      <Block icon={CircleHelp} title="03 · 核心问题" color="#A8874F">
        <div className="space-y-2">
          {(lesson.coreQuestions ?? []).map((q, i) => (
            <div key={i} className="rounded-sm border border-[#A8874F]/20 bg-[#A8874F]/[.05] px-4 py-3 text-sm font-medium leading-relaxed">
              <span className="mr-2 font-display text-[#A8874F]">Q{i + 1}</span>{q}
            </div>
          ))}
        </div>
      </Block>

      {/* 04 历史与思想背景 */}
      {(lesson.background ?? []).length > 0 && (
        <Block icon={History} title="04 · 历史与思想背景" color="#8A6A3E">
          <div className="prose-philo space-y-3">
            {(lesson.background ?? []).map((b, i) => (
              <p key={i} className="rounded-sm glass-soft px-4 py-3 text-[14px]">{b}</p>
            ))}
          </div>
        </Block>
      )}

      {/* 05 核心概念详解 */}
      {(lesson.conceptIds ?? []).length > 0 && (
        <Block icon={Lightbulb} title="05 · 核心概念详解" color="#586044">
          <div className="space-y-2">
            {(lesson.conceptIds ?? []).map((cid) => {
              const c = concepts.find((x) => x.id === cid)
              if (!c) return <div key={cid} className="chip opacity-50">{cid}（词条待补）</div>
              return (
                <Link key={cid} to={`/concept/${cid}`} className="term-note block rounded-sm p-3.5 transition active:scale-[.99]">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: '#586044' }}>{c.zh}</span>
                    <span className="font-reading text-[11px] italic muted">{c.en}</span>
                    <ChevronRight size={13} className="ml-auto muted" />
                  </div>
                  <p className="text-[13px] leading-[1.85]" style={{ color: '#514332' }}>{c.plain}</p>
                </Link>
              )
            })}
          </div>
        </Block>
      )}

      {/* 06 哲学理论系统讲解（八段式） */}
      <Block icon={BookOpen} title="06 · 哲学理论系统讲解" color={color} tag="点开每条看完整论证">
        <div className="space-y-2.5">
          {(lesson.theories ?? []).map((t, i) => (
            <TheoryCard key={i} t={t} idx={i} color={color} open={openTheory === i} onToggle={() => setOpenTheory(openTheory === i ? -1 : i)} />
          ))}
        </div>
      </Block>

      {/* 07 代表性哲学家 */}
      {(lesson.philosopherIds ?? []).length > 0 && (
        <Block icon={Users} title="07 · 代表性哲学家" color="#A8874F">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(lesson.philosopherIds ?? []).map((pid) => {
              const ph = philosophers.find((x) => x.id === pid)
              return ph ? (
                <Link key={pid} to={`/philosopher/${pid}`} className="min-w-[130px] shrink-0 rounded-sm glass p-3 transition active:scale-95">
                  <div className="mb-1 h-1.5 w-8 rounded-full" style={{ background: ph.color }} />
                  <div className="font-semibold">{ph.name}</div>
                  <div className="text-[10px] muted">{ph.era} · {ph.school}</div>
                </Link>
              ) : null
            })}
          </div>
        </Block>
      )}

      {/* 08 原著阅读训练 */}
      {(lesson.readings ?? []).length > 0 && (
        <Block icon={ScrollText} title="08 · 原著阅读训练" color="#8A6A3E" tag="先看白话，再读原文">
          <div className="space-y-3">
            {(lesson.readings ?? []).map((r, i) => <ReadingCard key={i} r={r} color="#8A6A3E" />)}
          </div>
        </Block>
      )}

      {/* 09 经典论证重构 */}
      {(lesson.arguments ?? []).length > 0 && (
        <Block icon={Scale} title="09 · 经典论证重构" color="#586044">
          <div className="space-y-3">
            {(lesson.arguments ?? []).map((a, i) => (
              <div key={i} className="rounded-sm glass p-4">
                <div className="mb-3 text-sm font-bold text-[#586044]">{a.label}</div>
                <div className="space-y-1.5">
                  {a.premises.map((pr, j) => (
                    <div key={j} className="flex gap-2 text-sm leading-[1.8]">
                      <span className="shrink-0 font-mono text-xs text-[#87745A]">P{j + 1}</span><span>{pr}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 rounded-sm bg-[#586044]/[.07] px-3 py-2 text-sm font-medium">
                  <span className="shrink-0 font-mono text-xs text-[#586044]">∴</span><span>{a.conclusion}</span>
                </div>
                {a.note && <div className="mt-2 text-xs muted">※ 软肋：{a.note}</div>}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* 10 横向比较 */}
      {(lesson.comparisons ?? []).length > 0 && (
        <Block icon={GitCompareArrows} title="10 · 横向比较" color="#586044">
          <div className="space-y-3">
            {(lesson.comparisons ?? []).map((c, i) => <ComparisonCard key={i} c={c} />)}
          </div>
        </Block>
      )}

      {/* 11 现实案例与延伸 */}
      {((lesson.cases ?? []).length > 0 || (lesson.significance ?? []).length > 0) && (
        <Block icon={CaseSensitive} title="11 · 现实意义与延伸思考" color="#B08D57">
          <div className="space-y-3">
            {(lesson.cases ?? []).map((c, i) => (
              <div key={i} className="rounded-sm glass p-4">
                <div className="mb-2 font-bold">{c.title}</div>
                <p className="text-sm leading-[1.85]" style={{ color: '#514332' }}>{c.body}</p>
                <div className="mt-3 rounded-sm border-l-2 border-[#B08D57] bg-[#B08D57]/[.06] px-3 py-2 text-sm">
                  <span className="text-[#B08D57]">思考：</span>{c.question}
                </div>
              </div>
            ))}
            {(lesson.significance ?? []).length > 0 && (
              <div className="rounded-sm border border-[#B08D57]/20 bg-[#B08D57]/[.04] p-4">
                <div className="mb-2 text-[11px] font-bold text-[#B08D57]">这门理论在今天还有什么用</div>
                <ul className="space-y-1.5">
                  {(lesson.significance ?? []).map((s, i) => (
                    <li key={i} className="flex gap-1.5 text-[13px] leading-[1.85]" style={{ color: '#514332' }}>
                      <ArrowRight size={13} className="mt-1 shrink-0 text-[#B08D57]" /><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Block>
      )}

      {/* 12 思考练习（答案门控） */}
      <Block icon={Brain} title="12 · 思考练习" color="#A8874F" tag={`共 ${(lesson.exercises ?? []).length} 题`}>
        <div className="space-y-3">
          {(lesson.exercises ?? []).map((ex, i) => (
            <div key={ex.id} className="rounded-sm glass p-4">
              <div className="mb-3 flex items-start gap-2">
                <span className="chip shrink-0">{ex.kind ?? `练习 ${i + 1}`}</span>
                <div className="flex-1 text-sm font-semibold leading-relaxed">{ex.question}</div>
              </div>
              <button onClick={() => setExerciseOpen((s) => ({ ...s, [ex.id]: !s[ex.id] }))} className="btn-ghost w-full py-2 text-xs">
                {exerciseOpen[ex.id] ? <><UnlockKeyhole size={14} /> 收起详解</> : <><LockKeyhole size={14} /> 先自己写一遍，再看详解</>}
              </button>
              {exerciseOpen[ex.id] && (
                <div className="animate-fade-up mt-3 space-y-3 border-t border-[#C4AB82] pt-3 text-sm">
                  <div><span className="font-bold text-[#586044]">答案 · </span><span>{ex.answer}</span></div>
                  <div><span className="font-bold text-[#A8874F]">解题思路 · </span><span>{ex.reasoning}</span></div>
                  <div><span className="font-bold text-[#793D36]">逐步演示 · </span><span>{ex.demonstration}</span></div>
                  <div><span className="font-bold text-[#B08D57]">易错提醒 · </span><span>{ex.pitfall}</span></div>
                  {(ex.directions ?? []).length > 0 && (
                    <div className="rounded-sm border border-[#586044]/25 bg-[#586044]/[.05] px-3 py-2">
                      <div className="mb-1 text-[11px] font-bold text-[#586044]">这道题没有唯一答案，常见的几条合理路径</div>
                      <ul className="space-y-1">
                        {(ex.directions ?? []).map((d, j) => (
                          <li key={j} className="flex gap-1.5 text-[13px] leading-[1.8]" style={{ color: '#514332' }}>
                            <span className="text-[#586044]">{j + 1}.</span><span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Block>

      {/* 13 本章总结 */}
      <Block icon={Sparkles} title="13 · 本章知识体系总结" color="#586044">
        <div className="rounded-sm border border-[#586044]/20 bg-[#586044]/[.05] p-4 text-sm leading-[1.9]" style={{ color: '#514332' }}>
          {lesson.summary}
        </div>
      </Block>

      {/* 14 章节测验 */}
      <Block icon={CircleHelp} title="14 · 章节测验" color="#793D36">
        <div className="space-y-4">
          {(lesson.quiz ?? []).map((q, i) => (
            <div key={q.id} className="rounded-sm glass p-4">
              <div className="mb-3 text-sm font-semibold leading-relaxed">{i + 1}. {q.stem}</div>
              {q.type === 'judge' ? (
                <div className="grid grid-cols-2 gap-2">
                  {[true, false].map((v) => (
                    <button key={String(v)} onClick={() => !quizSubmitted && setQuizAnswers((s) => ({ ...s, [q.id]: v }))}
                      className={`rounded-sm py-2.5 text-sm transition ${quizAnswers[q.id] === v ? 'bg-[#793D36]/25 text-[#F6EDD9] ring-1 ring-[#793D36]' : 'glass-soft muted'}`}>
                      {v ? '正确' : '错误'}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt, oi) => (
                    <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers((s) => ({ ...s, [q.id]: oi }))}
                      className={`flex w-full items-start gap-2.5 rounded-sm px-3.5 py-2.5 text-left text-sm transition ${quizAnswers[q.id] === oi ? 'bg-[#793D36]/20 ring-1 ring-[#793D36]/70' : 'glass-soft'}`}>
                      <span className="shrink-0 font-mono text-xs text-[#A8874F]">{String.fromCharCode(65 + oi)}</span><span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
              {quizSubmitted && (
                <div className={`animate-fade-up mt-3 rounded-sm px-3 py-2 text-xs leading-relaxed ${quizAnswers[q.id] === q.answer ? 'bg-[#586044]/10 text-[#586044]' : 'bg-[#8F4A40]/10 text-[#8F4A40]'}`}>
                  {quizAnswers[q.id] === q.answer ? <CheckCircle2 size={13} className="mr-1 inline" /> : <XCircle size={13} className="mr-1 inline" />}
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
          {!quizSubmitted ? (
            <button onClick={submitQuiz} disabled={!allAnswered} className="btn-primary w-full disabled:opacity-40">提交测验</button>
          ) : (
            <div className="rounded-sm border border-[#793D36]/25 bg-[#793D36]/[.07] p-4 text-center">
              <div className="font-display text-2xl font-bold text-[#793D36]">{correctCount} / {lesson.quiz.length}</div>
              <div className="text-xs muted">答错题目已自动收入「我的 · 错题本」</div>
            </div>
          )}
        </div>
      </Block>

      {/* 笔记 */}
      <section className="mb-6">
        <h2 className="section-title mb-3"><NotebookPen size={17} className="mr-2 inline text-[#A8874F]" />我的笔记</h2>
        <div className="rounded-sm glass p-4">
          <textarea className="field" placeholder="写下你的疑问、联想或反驳…（读哲学的标准动作：先把他的论证复述一遍）" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <button onClick={saveNote} className="btn-ghost mt-2 w-full py-2 text-sm">保存笔记</button>
          {(p.notes[lesson.id] ?? []).map((n) => (
            <div key={n.id} className="mt-3 rounded-sm bg-[#E9D9B8]/50 p-3 text-sm">
              <div className="mb-1 text-[10px] muted">{formatDate(n.at)}</div>
              <div className="whitespace-pre-wrap leading-relaxed">{n.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 完成操作 */}
      <div className="flex gap-3 pb-4">
        <button onClick={() => updateProgress((d) => {
          d.favorites = isFav ? d.favorites.filter((x) => x !== `lesson-${lesson.id}`) : [...d.favorites, `lesson-${lesson.id}`]
        })} className={`btn-ghost flex-1 ${isFav ? '!text-[#586044] !border-[#586044]/40' : ''}`}>
          <Bookmark size={16} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? '已收藏' : '收藏'}
        </button>
        <button onClick={markDone} disabled={isDone} className="btn-primary flex-[2] disabled:opacity-50">
          <CheckCircle2 size={17} /> {isDone ? '已完成本章' : '标记学完本章'}
        </button>
      </div>

      {/* 上/下一讲 */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="rounded-sm glass p-3">
            <div className="mb-1 flex items-center gap-1 text-[10px] muted"><ArrowLeft size={11} /> 上一讲</div>
            <div className="line-clamp-2 text-xs font-medium">{prev.title}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="rounded-sm glass p-3 text-right">
            <div className="mb-1 flex items-center justify-end gap-1 text-[10px] muted">下一讲 <ArrowRight size={11} /></div>
            <div className="line-clamp-2 text-xs font-medium">{next.title}</div>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, Target, CircleHelp, Lightbulb, BookOpen, Users, Scale, CaseSensitive, Brain, CheckCircle2, XCircle, Bookmark, NotebookPen, ChevronRight, Sparkles, LockKeyhole, UnlockKeyhole } from 'lucide-react'
import { lessons, modules } from '../data/curriculum'
import { concepts } from '../data/concepts'
import { philosophers } from '../data/philosophers'
import { updateProgress, logActivity, todayKey } from '../lib/storage'
import { useProgress, formatDate } from '../lib/hooks'
import { BackBar, EmptyState, Chip } from '../components/ui'

const srcName: Record<string, string> = {
  bigquestions: '《大问题》', history: '《西方哲学简史》', thought: '《做哲学》', extension: '平台扩展',
}

function Block({ icon: Icon, title, color, children }: { icon: typeof Target; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: color + '1A', color }}><Icon size={15} /></div>
        <h2 className="font-bold tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
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

  if (!lesson) return <div className="pad pt-6"><BackBar title="返回课程" /><EmptyState icon={<BookOpen size={40} />} text="未找到该章节" /></div>

  const mod = modules.find((m) => m.id === lesson.moduleId)
  const isDone = p.completedLessons.includes(lesson.id)
  const isFav = p.favorites.includes(`lesson-${lesson.id}`)
  const correctCount = lesson.quiz.filter((q) => quizAnswers[q.id] === q.answer).length
  const allAnswered = lesson.quiz.every((q) => q.id in quizAnswers)

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

      {/* 章节头 */}
      <div className="mb-7">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="chip" style={{ color: mod?.color, borderColor: (mod?.color ?? '#4B9EFF') + '44' }}>第 {lesson.order} 章</span>
          <span className="chip">{srcName[lesson.source.book]}</span>
          {lesson.source.chapter && <span className="text-[11px] muted">源自：{lesson.source.chapter}</span>}
        </div>
        <h1 className="font-display text-[26px] font-bold leading-tight">{lesson.title}</h1>
        {lesson.subtitle && <p className="mt-1.5 text-sm muted">{lesson.subtitle}</p>}
        <div className="mt-3 flex items-center gap-3 text-xs muted">
          <span className="flex items-center gap-1"><Clock3 size={13} /> {lesson.duration} 分钟</span>
          <span className="flex items-center gap-1"><BookOpen size={13} /> 十段式精读</span>
        </div>
      </div>

      {lesson.intro && (
        <div className="mb-7 rounded-2xl border-l-2 border-[#4B9EFF] bg-[#4B9EFF]/[.06] p-4 text-[15px] leading-[1.9]" style={{ color: '#C9D5E8' }}>
          {lesson.intro}
        </div>
      )}

      {/* 1 学习目标 */}
      <Block icon={Target} title="01 · 本章学习目标" color="#4B9EFF">
        <div className="grid gap-2">
          {lesson.objectives.map((o, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-xl glass-soft px-4 py-3 text-sm">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#4B9EFF]" /> <span>{o}</span>
            </div>
          ))}
        </div>
      </Block>

      {/* 2 核心问题 */}
      <Block icon={CircleHelp} title="02 · 核心问题" color="#8C7CFF">
        <div className="space-y-2">
          {lesson.coreQuestions.map((q, i) => (
            <div key={i} className="rounded-xl border border-[#8C7CFF]/20 bg-[#8C7CFF]/[.05] px-4 py-3 text-sm font-medium leading-relaxed">
              <span className="mr-2 font-display text-[#8C7CFF]">Q{i + 1}</span>{q}
            </div>
          ))}
        </div>
      </Block>

      {/* 3 关键概念 */}
      {lesson.conceptIds.length > 0 && (
        <Block icon={Lightbulb} title="03 · 关键概念" color="#43D9D0">
          <div className="flex flex-wrap gap-2">
            {lesson.conceptIds.map((cid) => {
              const c = concepts.find((x) => x.id === cid)
              return c ? <Link key={cid} to={`/concept/${cid}`} className="chip transition active:scale-95" style={{ borderColor: '#43D9D044' }}>{c.zh} <ChevronRight size={11} /></Link>
                : <span key={cid} className="chip opacity-50">{cid}</span>
            })}
          </div>
        </Block>
      )}

      {/* 4 哲学理论 */}
      <Block icon={BookOpen} title="04 · 哲学理论" color="#4B9EFF">
        <div className="prose-philo">
          {lesson.theories.map((t, i) => (
            <div key={i}>
              <h3>{t.heading}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* 5 代表性哲学家 */}
      {lesson.philosopherIds.length > 0 && (
        <Block icon={Users} title="05 · 代表性哲学家" color="#8C7CFF">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {lesson.philosopherIds.map((pid) => {
              const ph = philosophers.find((x) => x.id === pid)
              return ph ? (
                <Link key={pid} to={`/philosopher/${pid}`} className="min-w-[130px] shrink-0 rounded-xl glass p-3 transition active:scale-95">
                  <div className="mb-1 h-1.5 w-8 rounded-full" style={{ background: ph.color }} />
                  <div className="font-semibold">{ph.name}</div>
                  <div className="text-[10px] muted">{ph.era} · {ph.school}</div>
                </Link>
              ) : null
            })}
          </div>
        </Block>
      )}

      {/* 6 经典论证 */}
      <Block icon={Scale} title="06 · 经典论证" color="#43D9D0">
        <div className="space-y-3">
          {lesson.arguments.map((a, i) => (
            <div key={i} className="rounded-2xl glass p-4">
              <div className="mb-3 text-sm font-bold text-[#43D9D0]">{a.label}</div>
              <div className="space-y-1.5">
                {a.premises.map((pr, j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <span className="shrink-0 font-mono text-xs text-[#8996AA]">P{j + 1}</span><span>{pr}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2 rounded-lg bg-[#43D9D0]/[.07] px-3 py-2 text-sm font-medium">
                <span className="shrink-0 font-mono text-xs text-[#43D9D0]">∴</span><span>{a.conclusion}</span>
              </div>
              {a.note && <div className="mt-2 text-xs muted">※ {a.note}</div>}
            </div>
          ))}
        </div>
      </Block>

      {/* 7 现实案例 */}
      <Block icon={CaseSensitive} title="07 · 现实案例" color="#F0A56B">
        <div className="space-y-3">
          {lesson.cases.map((c, i) => (
            <div key={i} className="rounded-2xl glass p-4">
              <div className="mb-2 font-bold">{c.title}</div>
              <p className="text-sm leading-[1.85]" style={{ color: '#B9C6DA' }}>{c.body}</p>
              <div className="mt-3 rounded-lg border-l-2 border-[#F0A56B] bg-[#F0A56B]/[.06] px-3 py-2 text-sm">
                <span className="text-[#F0A56B]">思考：</span>{c.question}
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* 8 思考练习（答案门控：先自己想，再看详解） */}
      <Block icon={Brain} title="08 · 思考练习" color="#8C7CFF">
        <div className="space-y-3">
          {lesson.exercises.map((ex, i) => (
            <div key={ex.id} className="rounded-2xl glass p-4">
              <div className="mb-3 flex items-start gap-2">
                <span className="chip shrink-0">练习 {i + 1}</span>
                <div className="flex-1 text-sm font-semibold leading-relaxed">{ex.question}</div>
              </div>
              <button onClick={() => setExerciseOpen((s) => ({ ...s, [ex.id]: !s[ex.id] }))} className="btn-ghost w-full py-2 text-xs">
                {exerciseOpen[ex.id] ? <><UnlockKeyhole size={14} /> 收起详解</> : <><LockKeyhole size={14} /> 我先想想…再看详解</>}
              </button>
              {exerciseOpen[ex.id] && (
                <div className="animate-fade-up mt-3 space-y-3 border-t border-[#263247] pt-3 text-sm">
                  <div><span className="font-bold text-[#43D9D0]">答案 · </span><span>{ex.answer}</span></div>
                  <div><span className="font-bold text-[#8C7CFF]">解题思路 · </span><span>{ex.reasoning}</span></div>
                  <div><span className="font-bold text-[#4B9EFF]">逐步演示 · </span><span>{ex.demonstration}</span></div>
                  <div><span className="font-bold text-[#F0A56B]">易错提醒 · </span><span>{ex.pitfall}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Block>

      {/* 9 本章总结 */}
      <Block icon={Sparkles} title="09 · 本章总结" color="#43D9D0">
        <div className="rounded-2xl border border-[#43D9D0]/20 bg-[#43D9D0]/[.05] p-4 text-sm leading-[1.9]" style={{ color: '#C5D3E6' }}>
          {lesson.summary}
        </div>
      </Block>

      {/* 10 章节测验 */}
      <Block icon={CircleHelp} title="10 · 章节测验" color="#4B9EFF">
        <div className="space-y-4">
          {lesson.quiz.map((q, i) => (
            <div key={q.id} className="rounded-2xl glass p-4">
              <div className="mb-3 text-sm font-semibold leading-relaxed">{i + 1}. {q.stem}</div>
              {q.type === 'judge' ? (
                <div className="grid grid-cols-2 gap-2">
                  {[true, false].map((v) => (
                    <button key={String(v)} onClick={() => !quizSubmitted && setQuizAnswers((s) => ({ ...s, [q.id]: v }))}
                      className={`rounded-xl py-2.5 text-sm transition ${quizAnswers[q.id] === v ? 'bg-[#4B9EFF]/25 text-white ring-1 ring-[#4B9EFF]' : 'glass-soft muted'}`}>
                      {v ? '正确' : '错误'}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt, oi) => (
                    <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers((s) => ({ ...s, [q.id]: oi }))}
                      className={`flex w-full items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${quizAnswers[q.id] === oi ? 'bg-[#4B9EFF]/20 ring-1 ring-[#4B9EFF]/70' : 'glass-soft'}`}>
                      <span className="shrink-0 font-mono text-xs text-[#8C7CFF]">{String.fromCharCode(65 + oi)}</span><span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
              {quizSubmitted && (
                <div className={`animate-fade-up mt-3 rounded-lg px-3 py-2 text-xs ${quizAnswers[q.id] === q.answer ? 'bg-[#43D9D0]/10 text-[#43D9D0]' : 'bg-[#FF9A8C]/10 text-[#FF9A8C]'}`}>
                  {quizAnswers[q.id] === q.answer ? <CheckCircle2 size={13} className="mr-1 inline" /> : <XCircle size={13} className="mr-1 inline" />}
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
          {!quizSubmitted ? (
            <button onClick={submitQuiz} disabled={!allAnswered} className="btn-primary w-full disabled:opacity-40">提交测验</button>
          ) : (
            <div className="rounded-2xl border border-[#4B9EFF]/25 bg-[#4B9EFF]/[.07] p-4 text-center">
              <div className="font-display text-2xl font-bold text-[#4B9EFF]">{correctCount} / {lesson.quiz.length}</div>
              <div className="text-xs muted">答错题目已自动收入「我的 · 错题本」</div>
            </div>
          )}
        </div>
      </Block>

      {/* 笔记 */}
      <section className="mb-6">
        <h2 className="section-title mb-3"><NotebookPen size={17} className="mr-2 inline text-[#8C7CFF]" />我的笔记</h2>
        <div className="rounded-2xl glass p-4">
          <textarea className="field" placeholder="写下你的疑问、联想或反驳…（哲学从提问开始）" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <button onClick={saveNote} className="btn-ghost mt-2 w-full py-2 text-sm">保存笔记</button>
          {(p.notes[lesson.id] ?? []).map((n) => (
            <div key={n.id} className="mt-3 rounded-xl bg-[#080B14]/50 p-3 text-sm">
              <div className="mb-1 text-[10px] muted">{formatDate(n.at)}</div>
              <div className="whitespace-pre-wrap leading-relaxed">{n.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 完成操作 */}
      <div className="flex gap-3 pb-6">
        <button onClick={() => updateProgress((d) => {
          d.favorites = isFav ? d.favorites.filter((x) => x !== `lesson-${lesson.id}`) : [...d.favorites, `lesson-${lesson.id}`]
        })} className={`btn-ghost flex-1 ${isFav ? '!text-[#43D9D0] !border-[#43D9D0]/40' : ''}`}>
          <Bookmark size={16} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? '已收藏' : '收藏'}
        </button>
        <button onClick={markDone} disabled={isDone} className="btn-primary flex-[2] disabled:opacity-50">
          <CheckCircle2 size={17} /> {isDone ? '已完成本章' : '标记学完本章'}
        </button>
      </div>
    </div>
  )
}

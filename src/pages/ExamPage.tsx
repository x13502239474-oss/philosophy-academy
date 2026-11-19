import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Trophy, CheckCircle2, XCircle, RotateCcw, CircleHelp } from 'lucide-react'
import { modules, lessons } from '../data/curriculum'
import { updateProgress, logActivity } from '../lib/storage'
import { useProgress } from '../lib/hooks'
import { BackBar, EmptyState, SectionHeader } from '../components/ui'

export default function ExamPage() {
  const { id } = useParams()
  const p = useProgress()
  const mod = modules.find((m) => m.id === id)
  const [answers, setAnswers] = useState<Record<string, number | boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!mod) return <div className="pad pt-6"><BackBar title="课程" to="/courses"/><EmptyState icon={<Trophy size={40}/>} text="未找到该阶段考试" /></div>
  const qs = lessons.filter((l) => l.moduleId === mod.id).flatMap((l) => l.quiz.map((q) => ({ ...q, lessonTitle: l.title })))
  const correct = qs.filter((q) => answers[q.id] === q.answer).length
  const allAnswered = qs.length > 0 && qs.every((q) => q.id in answers)
  const result = p.examResults[mod.id]

  const submit = () => {
    setSubmitted(true)
    updateProgress((d) => {
      d.examResults[mod.id] = { score: correct, total: qs.length, at: Date.now() }
      qs.forEach((q) => {
        const ok = answers[q.id] === q.answer
        if (!ok && !d.wrongQuestions.includes(q.id)) d.wrongQuestions.push(q.id)
        if (ok) d.wrongQuestions = d.wrongQuestions.filter((x) => x !== q.id)
      })
      logActivity(d, 'exam', mod.id, `阶段考试 · ${mod.title}`)
    })
  }

  return (
    <div className="pad pt-5">
      <BackBar title="课程" to="/courses" />
      <div className="mb-6 overflow-hidden rounded-3xl border border-[#263247] p-5" style={{ background: `linear-gradient(150deg,${mod.color}18,#0E1422 65%)` }}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em]" style={{ color: mod.color }}><Trophy size={13}/> 阶段考试</div>
        <h1 className="mt-2 font-display text-2xl font-bold">{mod.title}</h1>
        <p className="mt-2 text-xs muted">共 {qs.length} 题 · 汇总本模块各章测验 · 检验你是否真的理解了</p>
        {result && !submitted && <div className="mt-3 inline-block rounded-lg px-3 py-1.5 text-xs" style={{ background: mod.color + '18', color: mod.color }}>历史最好：{result.score}/{result.total}</div>}
      </div>

      {qs.length === 0 ? <EmptyState icon={<CircleHelp size={40}/>} text="本模块暂无测验题" /> : (
        <>
          <div className="space-y-4">
            {qs.map((q, i) => (
              <div key={q.id} className="rounded-2xl glass p-4">
                <div className="mb-1 text-[11px] muted">{q.lessonTitle}</div>
                <div className="mb-3 text-sm font-semibold leading-relaxed">{i + 1}. {q.stem}</div>
                {q.type === 'judge' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[true, false].map((v) => (
                      <button key={String(v)} onClick={() => !submitted && setAnswers((s) => ({ ...s, [q.id]: v }))}
                        className={`rounded-xl py-2 text-sm transition ${answers[q.id] === v ? 'bg-[#4B9EFF]/25 ring-1 ring-[#4B9EFF]' : 'glass-soft muted'}`}>{v ? '正确' : '错误'}</button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">{(q.options ?? []).map((opt, oi) => (
                    <button key={oi} onClick={() => !submitted && setAnswers((s) => ({ ...s, [q.id]: oi }))}
                      className={`flex w-full gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${answers[q.id] === oi ? 'bg-[#4B9EFF]/20 ring-1 ring-[#4B9EFF]/70' : 'glass-soft'}`}>
                      <span className="font-mono text-xs text-[#8C7CFF]">{String.fromCharCode(65+oi)}</span><span>{opt}</span>
                    </button>
                  ))}</div>
                )}
                {submitted && (
                  <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${answers[q.id] === q.answer ? 'bg-[#43D9D0]/10 text-[#43D9D0]' : 'bg-[#FF9A8C]/10 text-[#FF9A8C]'}`}>
                    {answers[q.id] === q.answer ? <CheckCircle2 size={13} className="mr-1 inline"/> : <XCircle size={13} className="mr-1 inline"/>}{q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!submitted ? (
            <button onClick={submit} disabled={!allAnswered} className="btn-primary mt-5 w-full disabled:opacity-40">提交试卷</button>
          ) : (
            <div className="mt-5 text-center">
              <div className="rounded-2xl border border-[#4B9EFF]/25 bg-[#4B9EFF]/[.07] p-5">
                <Trophy size={28} className="mx-auto mb-2 text-[#F0A56B]" />
                <div className="font-display text-3xl font-bold text-[#4B9EFF]">{correct} / {qs.length}</div>
                <div className="mt-1 text-xs muted">正确率 {Math.round(correct / qs.length * 100)}% · 错题已收入错题本</div>
              </div>
              <Link to="/profile?tab=wrong" className="mt-3 inline-block text-xs text-[#4B9EFF]">查看错题本 ›</Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

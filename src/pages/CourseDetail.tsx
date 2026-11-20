import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, BookMarked, CheckCircle2, Circle } from 'lucide-react'
import { modules, lessons } from '../data/curriculum'
import { philosophers } from '../data/philosophers'
import { useProgress } from '../lib/hooks'
import { BackBar, EmptyState } from '../components/ui'

const bookNames: Record<string, string> = {
  bigquestions: '《大问题：简明哲学导论》',
  history: '《西方哲学简史》',
  thought: '《做哲学：88个思想实验中的哲学导论》',
  extension: '平台扩展内容',
}

export default function CourseDetail() {
  const { id } = useParams()
  const p = useProgress()
  const m = modules.find((x) => x.id === id)
  if (!m) return <div className="pad pt-6"><BackBar title="返回课程" /><EmptyState icon={<BookMarked size={40} />} text="未找到该模块" /></div>

  const mlessons = lessons.filter((l) => l.moduleId === m.id)
  const done = mlessons.filter((l) => p.completedLessons.includes(l.id)).length
  const relatedPhilosophers = philosophers.filter((ph) => mlessons.some((l) => l.philosopherIds.includes(ph.id)))

  return (
    <div className="pad pt-5">
      <BackBar title="全部课程" to="/courses" />
      <div className="mb-6 overflow-hidden rounded-sm border border-[#C4AB82] p-5" style={{ background: `linear-gradient(150deg, ${m.color}18, #F2E7CE 65%)` }}>
        <div className="text-[10px] font-bold tracking-[.3em]" style={{ color: m.color }}>MODULE 0{m.order} · {m.enTitle}</div>
        <h1 className="mt-2 font-display text-[26px] font-bold">{m.title}</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: '#514332' }}>{m.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs muted">
          <span className="flex items-center gap-1"><BookMarked size={14} /> {mlessons.length} 讲</span>
          <span className="flex items-center gap-1"><Clock3 size={14} /> 约 {mlessons.reduce((s, l) => s + l.duration, 0)} 分钟</span>
          <span>已完成 {done} 讲</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#C4AB82] pt-3 text-[11px] muted">
          <span>理论单元 {mlessons.reduce((s, l) => s + (l.theories?.length ?? 0), 0)}</span>
          <span>原著阅读 {mlessons.reduce((s, l) => s + (l.readings?.length ?? 0), 0)}</span>
          <span>横向比较 {mlessons.reduce((s, l) => s + (l.comparisons?.length ?? 0), 0)}</span>
          <span>练习 {mlessons.reduce((s, l) => s + (l.exercises?.length ?? 0), 0)} 题</span>
          <span>测验 {mlessons.reduce((s, l) => s + (l.quiz?.length ?? 0), 0)} 题</span>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="section-title mb-3">本部分目录</h2>
        <div className="space-y-2.5">
          {mlessons.length === 0 && (
            <div className="rounded-sm glass p-5 text-sm muted">
              这个模块的训练以互动形式展开。前往「思辨」页签，进入思想实验实验室与四种哲学训练。
              <Link to="/think" className="mt-3 block text-[#793D36]">前往思辨训练 →</Link>
            </div>
          )}
          {mlessons.map((l, i) => (
            <Link key={l.id} to={`/lesson/${l.id}`} className="flex items-center gap-3 rounded-sm glass p-4 transition active:scale-[.99]">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm font-display text-sm font-bold" style={{ background: m.color + '18', color: m.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{l.title}</div>
                <div className="truncate text-xs muted">{l.subtitle || l.coreQuestions[0]}</div>
              </div>
              {p.completedLessons.includes(l.id) ? <CheckCircle2 size={18} className="shrink-0 text-[#586044]" /> : <Circle size={18} className="shrink-0 text-[#B39B72]" />}
            </Link>
          ))}
        </div>
      </section>

      {mlessons.length > 0 && (
        <Link to={`/exam/${m.id}`} className="mb-6 flex items-center gap-3 rounded-sm border border-[#B08D57]/25 bg-[#B08D57]/[.06] p-4 transition active:scale-[.99]">
          <div className="grid h-10 w-10 place-items-center rounded-sm bg-[#B08D57]/15 text-[#B08D57]">✦</div>
          <div className="flex-1"><div className="font-semibold">阶段考试</div><div className="text-xs muted">检验本模块学习成果</div></div>
          <span className="text-[#B08D57]">›</span>
        </Link>
      )}

      {relatedPhilosophers.length > 0 && (
        <section>
          <h2 className="section-title mb-3">相关思想家</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {relatedPhilosophers.map((ph) => (
              <Link key={ph.id} to={`/philosopher/${ph.id}`} className="shrink-0 rounded-sm glass px-4 py-2.5 text-sm transition active:scale-95" style={{ borderColor: ph.color + '44' }}>
                <span style={{ color: ph.color }}>●</span> {ph.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

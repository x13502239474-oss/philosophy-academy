import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { Layers3, CheckCircle2, Circle } from 'lucide-react'
import { modules, lessons } from '../data/curriculum'
import { useProgress } from '../lib/hooks'
import { SectionHeader } from '../components/ui'

export default function Courses() {
  const p = useProgress()
  return (
    <div className="pad pt-6">
      <div className="mb-6">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[#4B9EFF]">Curriculum</div>
        <h1 className="font-display text-2xl font-bold">课程体系</h1>
        <p className="mt-2 text-sm muted">以三本著作为骨架，从入门到思辨逐层深入。共 {modules.length} 大模块 · {lessons.length} 章。</p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 text-xs">
        <span className="chip shrink-0">《大问题》核心教材</span>
        <span className="chip shrink-0">《西方哲学简史》思想脉络</span>
        <span className="chip shrink-0">《做哲学》思辨训练</span>
      </div>

      <div className="space-y-4">
        {modules.map((m) => {
          const Icon = (Icons as unknown as Record<string, typeof Layers3>)[m.icon] ?? Layers3
          const mlessons = lessons.filter((l) => l.moduleId === m.id)
          const done = mlessons.filter((l) => p.completedLessons.includes(l.id)).length
          return (
            <section key={m.id} className="overflow-hidden rounded-2xl border border-[#263247] glass">
              <Link to={`/course/${m.id}`} className="block p-4" style={{ background: `linear-gradient(120deg, ${m.color}0E, transparent 60%)` }}>
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: m.color + '1E', color: m.color }}>
                    <Icon size={21} strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest" style={{ color: m.color }}>MODULE 0{m.order}</span>
                    </div>
                    <h2 className="mt-0.5 font-bold">{m.title}</h2>
                    <p className="mt-1 text-xs leading-relaxed muted">{m.tagline}</p>
                  </div>
                  <span className="shrink-0 text-xs muted">{done}/{mlessons.length}</span>
                </div>
              </Link>
              <div className="border-t border-[#263247]/70 px-4 py-2">
                {mlessons.length === 0 ? (
                  <div className="py-2 text-xs muted">本模块的交互内容在「思辨 · 思想实验实验室」中展开 →</div>
                ) : mlessons.map((l) => (
                  <Link key={l.id} to={`/lesson/${l.id}`} className="flex items-center gap-3 border-b border-[#263247]/40 py-2.5 last:border-0">
                    {p.completedLessons.includes(l.id)
                      ? <CheckCircle2 size={17} className="shrink-0 text-[#43D9D0]" />
                      : <Circle size={17} className="shrink-0 text-[#3B4A63]" />}
                    <span className="min-w-0 flex-1 truncate text-sm">{l.title}</span>
                    <span className="shrink-0 text-[11px] muted">{l.duration}′</span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

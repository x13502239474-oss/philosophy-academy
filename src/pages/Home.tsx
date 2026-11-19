import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Clock3, CheckCircle2, FlaskConical, Layers3, Sparkles, Compass } from 'lucide-react'
import * as Icons from 'lucide-react'
import { modules } from '../data/curriculum'
import { lessons } from '../data/curriculum'
import { dailyQuestions } from '../data/training'
import { experiments } from '../data/experiments'
import { useProgress, dailyIndex } from '../lib/hooks'
import { ProgressRing, SectionHeader } from '../components/ui'

function Hero() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#263247]/80 bg-gradient-to-br from-[#121A2B] via-[#0E1422] to-[#141026] px-5 pb-7 pt-8">
      {/* 抽象几何空间 */}
      <div className="pointer-events-none absolute -right-10 -top-8 h-56 w-56 animate-float opacity-70">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="88" stroke="#4B9EFF" strokeOpacity=".22" />
          <circle cx="100" cy="100" r="64" stroke="#8C7CFF" strokeOpacity=".3" />
          <circle cx="100" cy="100" r="40" stroke="#43D9D0" strokeOpacity=".35" />
          <circle cx="100" cy="100" r="16" stroke="#4B9EFF" strokeOpacity=".6" />
          <path d="M100 12v176M12 100h176" stroke="#263247" strokeDasharray="3 5" />
          <path d="M38 38l124 124M162 38L38 162" stroke="#263247" strokeDasharray="3 5" />
          <circle cx="100" cy="12" r="3" fill="#4B9EFF" />
          <circle cx="164" cy="100" r="3" fill="#8C7CFF" />
          <circle cx="100" cy="60" r="2.5" fill="#43D9D0" />
          <circle cx="52" cy="148" r="2" fill="#4B9EFF" />
        </svg>
      </div>
      <div className="relative z-10 max-w-[75%]">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.28em] text-[#43D9D0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#43D9D0] shadow-[0_0_8px_#43D9D0]" />
          The Thinking Space
        </div>
        <h1 className="text-gradient font-display text-[26px] font-bold leading-tight tracking-tight">
          PHILOSOPHY<br />ACADEMY
        </h1>
        <p className="mt-3 text-[11px] font-medium uppercase leading-relaxed tracking-[.12em] text-[#8996AA]">
          Explore Ideas. Question Everything.<br />Think Independently.
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Layers3; value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-3.5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] muted">
        <Icon size={14} style={{ color }} /> {label}
      </div>
      <div className="font-display text-2xl font-bold" style={{ color }}>{value}</div>
    </div>
  )
}

export default function Home() {
  const p = useProgress()
  const totalLessons = lessons.length || 1
  const completed = p.completedLessons.length
  const percent = Math.round((completed / totalLessons) * 100)
  const expDone = Object.keys(p.experimentAnswers).length
  const masteredConcepts = p.favorites.filter((id) => !id.startsWith('lesson')).length

  const daily = dailyQuestions[dailyIndex(dailyQuestions.length)]
  const nextLesson = lessons.find((l) => !p.completedLessons.includes(l.id)) ?? lessons[0]
  const nextModule = nextLesson ? modules.find((m) => m.id === nextLesson.moduleId) : undefined

  return (
    <div className="pad pt-5">
      <Hero />

      {/* 学习仪表盘 */}
      <section className="mb-7">
        <SectionHeader eyebrow="Your Journey" title="学习仪表盘" />
        <div className="mb-3 flex items-center gap-4 rounded-2xl border border-[#263247] bg-[#0E1422]/70 p-4">
          <div className="relative grid h-[64px] w-[64px] shrink-0 place-items-center">
            <ProgressRing value={percent} size={64} stroke={5} />
            <span className="absolute font-display text-lg font-bold text-ink">{percent}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">总学习进度</div>
            <div className="mt-0.5 text-xs muted">已完成 {completed} / {lessons.length} 章 · 坚持思考的每一天都算数</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#263247]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#4B9EFF] to-[#8C7CFF]" style={{ width: `${percent}%`, transition: 'width .6s ease' }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard icon={Flame} value={p.streak.days} label="连续学习天数" color="#43D9D0" />
          <StatCard icon={Clock3} value={`${Math.round(p.totalMinutes)}m`} label="累计学习时长" color="#8C7CFF" />
          <StatCard icon={CheckCircle2} value={completed} label="已完成课程" color="#4B9EFF" />
          <StatCard icon={Layers3} value={masteredConcepts} label="收藏概念" color="#43D9D0" />
          <StatCard icon={FlaskConical} value={expDone} label="思想实验" color="#8C7CFF" />
          <StatCard icon={Sparkles} value={p.wrongQuestions.length} label="待攻克错题" color="#FF9A8C" />
        </div>
      </section>

      {/* 继续学习 */}
      {nextLesson && (
        <section className="mb-7">
          <SectionHeader eyebrow="Continue" title="继续学习" />
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="group flex items-center gap-4 rounded-2xl border border-[#4B9EFF]/25 bg-gradient-to-r from-[#4B9EFF]/10 to-transparent p-4 transition active:scale-[.99]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#4B9EFF]/15 text-[#4B9EFF]">
              <Compass size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-[#4B9EFF]">{nextModule?.title ?? '课程'}</div>
              <div className="truncate font-semibold">{nextLesson.title}</div>
              <div className="truncate text-xs muted">{nextLesson.subtitle ?? nextLesson.coreQuestions[0]}</div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-[#4B9EFF]" />
          </Link>
        </section>
      )}

      {/* 八大课程入口 */}
      <section className="mb-7">
        <SectionHeader eyebrow="Eight Disciplines" title="八大课程" action={<Link to="/courses" className="text-xs text-[#4B9EFF]">全部 ›</Link>} />
        <div className="stagger grid grid-cols-2 gap-3">
          {modules.map((m) => {
            const Icon = (Icons as unknown as Record<string, typeof Layers3>)[m.icon] ?? Layers3
            const done = m.lessonIds.filter((id) => p.completedLessons.includes(id)).length
            return (
              <Link
                key={m.id}
                to={`/course/${m.id}`}
                className="relative overflow-hidden rounded-2xl border p-4 transition active:scale-[.97]"
                style={{ borderColor: m.color + '40', background: `linear-gradient(155deg, ${m.color}12, rgba(14,20,34,.85))` }}
              >
                <div className="absolute -right-3 -top-3 font-display text-[64px] font-bold leading-none opacity-[.07]" style={{ color: m.color }}>
                  0{m.order}
                </div>
                <div className="relative z-10">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl" style={{ background: m.color + '20', color: m.color }}>
                    <Icon size={20} strokeWidth={1.9} />
                  </div>
                  <div className="text-sm font-bold">{m.title}</div>
                  <div className="mt-0.5 truncate text-[10px] uppercase tracking-wider muted">{m.enTitle}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#263247]">
                      <div className="h-full rounded-full" style={{ width: `${m.lessonIds.length ? (done/m.lessonIds.length)*100 : 0}%`, background: m.color }} />
                    </div>
                    <span className="text-[10px] muted">{done}/{m.lessonIds.length}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 每日哲学问题 */}
      {daily && (
        <section className="mb-7">
          <SectionHeader eyebrow="Daily Question" title="今日哲学问题" />
          <Link to="/think?tab=daily" className="block rounded-2xl border border-[#8C7CFF]/25 bg-gradient-to-br from-[#8C7CFF]/10 to-[#0E1422] p-5 transition active:scale-[.99]">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#8C7CFF]">
              <Sparkles size={12} /> {daily.category}
            </div>
            <p className="font-display text-[17px] font-semibold leading-snug">『{daily.question}』</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#8C7CFF]">
              {p.dailyAnswers[new Date().toISOString().slice(0,10)] ? '已记录你的观点 · 点击查看 ›' : '写下你的观点 ›'}
            </div>
          </Link>
        </section>
      )}

      {/* 思想实验入口 + 思想地图 */}
      <section className="mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/experiment/${experiments[0]?.id ?? 'trolley-problem'}`} className="relative overflow-hidden rounded-2xl border border-[#43D9D0]/25 bg-[#43D9D0]/[.06] p-4 transition active:scale-[.97]">
            <FlaskConical size={22} className="mb-3 text-[#43D9D0]" />
            <div className="text-sm font-bold">思想实验</div>
            <div className="mt-1 text-[11px] muted">{experiments.length} 个情境等你选择立场</div>
          </Link>
          <Link to="/map" className="relative overflow-hidden rounded-2xl border border-[#4B9EFF]/25 bg-[#4B9EFF]/[.06] p-4 transition active:scale-[.97]">
            <svg className="mb-3 h-[22px] w-[22px] text-[#4B9EFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="5" cy="6" r="2"/><circle cx="19" cy="8" r="2"/><circle cx="12" cy="18" r="2"/>
              <path d="M6.7 7.2 17.3 7.8M6 7.8l5 8.6M18 9.8l-5 6.6"/>
            </svg>
            <div className="text-sm font-bold">思想地图</div>
            <div className="mt-1 text-[11px] muted">看见流派与思想的传承</div>
          </Link>
        </div>
      </section>
    </div>
  )
}

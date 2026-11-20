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
    <div className="folio-frame relative mb-6 overflow-hidden bg-gradient-to-br from-[#F6EDD9] via-[#F2E7CE] to-[#EDE0C3] px-5 pb-7 pt-7">
      {/* 古典柱廊纹样：典籍封面的压印装饰 */}
      <div className="pointer-events-none absolute -right-6 -top-2 h-52 w-52 opacity-[.5]">
        <svg viewBox="0 0 200 200" fill="none">
          {/* 三角楣 */}
          <path d="M18 60 L100 18 L182 60 Z" stroke="#A8874F" strokeWidth="1.4" />
          <path d="M26 60 L100 24 L174 60" stroke="#793D36" strokeWidth=".7" strokeOpacity=".55" />
          <circle cx="100" cy="46" r="5" stroke="#793D36" strokeWidth="1" />
          {/* 柱身与柱头 */}
          {[40, 80, 120, 160].map((x) => (
            <g key={x} stroke="#A8874F" strokeWidth="1.1">
              <path d={`M${x-8} 64 h16 M${x-6} 68 h12`} />
              <path d={`M${x-5} 70 v92 M${x+5} 70 v92`} strokeOpacity=".8" />
              <path d={`M${x-5} 82 h10 M${x-5} 148 h10`} strokeWidth=".6" strokeOpacity=".5" />
              <path d={`M${x-9} 164 h18 M${x-11} 168 h22`} />
            </g>
          ))}
          {/* 基座 */}
          <path d="M20 172 H180 M14 178 H186" stroke="#793D36" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="relative z-10 max-w-[76%]">
        {/* 卷次题头 */}
        <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.3em] text-[#586044]">
          <span className="h-px w-5 bg-[#A8874F]" />
          The Thinking Space
        </div>
        <div className="mb-2 font-display text-[10px] tracking-[.35em] text-[#A8874F]">VOL. I · No. 1</div>
        <h1 className="text-gradient font-display text-[27px] font-bold leading-[1.15] tracking-[.06em]">
          PHILOSOPHY<br />ACADEMY
        </h1>
        <div className="my-4 flex items-center gap-2 text-[#A8874F]">
          <span className="h-px flex-1 bg-[#C4AB82]" /><span className="text-xs">◆</span><span className="h-px w-8 bg-[#C4AB82]" />
        </div>
        <p className="font-reading text-[12px] italic leading-relaxed text-[#87745A]">
          Explore Ideas. Question Everything.<br />Think Independently.
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Layers3; value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-sm p-3.5">
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
        <div className="mb-3 flex items-center gap-4 rounded-sm border border-[#C4AB82] bg-[#F2E7CE]/70 p-4">
          <div className="relative grid h-[64px] w-[64px] shrink-0 place-items-center">
            <ProgressRing value={percent} size={64} stroke={5} />
            <span className="absolute font-display text-lg font-bold text-ink">{percent}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">总学习进度</div>
            <div className="mt-0.5 text-xs muted">已完成 {completed} / {lessons.length} 章 · 坚持思考的每一天都算数</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#C4AB82]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#793D36] to-[#A8874F]" style={{ width: `${percent}%`, transition: 'width .6s ease' }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard icon={Flame} value={p.streak.days} label="连续学习天数" color="#586044" />
          <StatCard icon={Clock3} value={`${Math.round(p.totalMinutes)}m`} label="累计学习时长" color="#A8874F" />
          <StatCard icon={CheckCircle2} value={completed} label="已完成课程" color="#793D36" />
          <StatCard icon={Layers3} value={masteredConcepts} label="收藏概念" color="#586044" />
          <StatCard icon={FlaskConical} value={expDone} label="思想实验" color="#A8874F" />
          <StatCard icon={Sparkles} value={p.wrongQuestions.length} label="待攻克错题" color="#8F4A40" />
        </div>
      </section>

      {/* 继续学习 */}
      {nextLesson && (
        <section className="mb-7">
          <SectionHeader eyebrow="Continue" title="继续学习" />
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="group flex items-center gap-4 rounded-sm border border-[#793D36]/25 bg-gradient-to-r from-[#793D36]/10 to-transparent p-4 transition active:scale-[.99]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-[#793D36]/15 text-[#793D36]">
              <Compass size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-[#793D36]">{nextModule?.title ?? '课程'}</div>
              <div className="truncate font-semibold">{nextLesson.title}</div>
              <div className="truncate text-xs muted">{nextLesson.subtitle ?? nextLesson.coreQuestions[0]}</div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-[#793D36]" />
          </Link>
        </section>
      )}

      {/* 八大课程入口 */}
      <section className="mb-7">
        <SectionHeader eyebrow="Eight Disciplines" title="八大课程" action={<Link to="/courses" className="text-xs text-[#793D36]">全部 ›</Link>} />
        <div className="stagger grid grid-cols-2 gap-3">
          {modules.map((m) => {
            const Icon = (Icons as unknown as Record<string, typeof Layers3>)[m.icon] ?? Layers3
            const done = m.lessonIds.filter((id) => p.completedLessons.includes(id)).length
            return (
              <Link
                key={m.id}
                to={`/course/${m.id}`}
                className="relative overflow-hidden rounded-sm border p-4 transition active:scale-[.97]"
                style={{ borderColor: m.color + '40', background: `linear-gradient(155deg, ${m.color}12, rgba(242,231,206,.85))` }}
              >
                <div className="absolute -right-3 -top-3 font-display text-[64px] font-bold leading-none opacity-[.07]" style={{ color: m.color }}>
                  0{m.order}
                </div>
                <div className="relative z-10">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-sm" style={{ background: m.color + '20', color: m.color }}>
                    <Icon size={20} strokeWidth={1.9} />
                  </div>
                  <div className="text-sm font-bold">{m.title}</div>
                  <div className="mt-0.5 truncate text-[10px] uppercase tracking-wider muted">{m.enTitle}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#C4AB82]">
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
          <Link to="/think?tab=daily" className="block rounded-sm border border-[#A8874F]/25 bg-gradient-to-br from-[#A8874F]/10 to-[#F2E7CE] p-5 transition active:scale-[.99]">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#A8874F]">
              <Sparkles size={12} /> {daily.category}
            </div>
            <p className="font-display text-[17px] font-semibold leading-snug">『{daily.question}』</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#A8874F]">
              {p.dailyAnswers[new Date().toISOString().slice(0,10)] ? '已记录你的观点 · 点击查看 ›' : '写下你的观点 ›'}
            </div>
          </Link>
        </section>
      )}

      {/* 思想实验入口 + 思想地图 */}
      <section className="mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/experiment/${experiments[0]?.id ?? 'trolley-problem'}`} className="relative overflow-hidden rounded-sm border border-[#586044]/25 bg-[#586044]/[.06] p-4 transition active:scale-[.97]">
            <FlaskConical size={22} className="mb-3 text-[#586044]" />
            <div className="text-sm font-bold">思想实验</div>
            <div className="mt-1 text-[11px] muted">{experiments.length} 个情境等你选择立场</div>
          </Link>
          <Link to="/map" className="relative overflow-hidden rounded-sm border border-[#793D36]/25 bg-[#793D36]/[.06] p-4 transition active:scale-[.97]">
            <svg className="mb-3 h-[22px] w-[22px] text-[#793D36]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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

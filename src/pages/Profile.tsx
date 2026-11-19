import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { UserRound, BookMarked, NotebookPen, CircleX, PenLine, History, Trophy, Settings, Flame, Clock3, Trash2, Download, RotateCcw, ChevronRight } from 'lucide-react'
import { useProgress, formatDate } from '../lib/hooks'
import { lessons } from '../data/curriculum'
import { concepts } from '../data/concepts'
import { experiments } from '../data/experiments'
import { writingPrompts, dailyQuestions } from '../data/training'
import { updateProgress, localStorageAdapter } from '../lib/storage'
import { EmptyState, SectionHeader } from '../components/ui'

type Tab = 'overview' | 'notes' | 'favorites' | 'wrong' | 'writing' | 'history' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: 'overview', label: '概览', icon: UserRound },
  { id: 'notes', label: '笔记', icon: NotebookPen },
  { id: 'favorites', label: '收藏', icon: BookMarked },
  { id: 'writing', label: '写作', icon: PenLine },
  { id: 'wrong', label: '错题', icon: CircleX },
  { id: 'history', label: '历史', icon: History },
  { id: 'settings', label: '设置', icon: Settings },
]

const findQuiz = (qid: string) => {
  for (const l of lessons) { const q = l.quiz.find((x) => x.id === qid); if (q) return { q, lesson: l } }
  return null
}

export default function Profile() {
  const p = useProgress()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'overview'
  const percent = Math.round((p.completedLessons.length / (lessons.length || 1)) * 100)
  const setTab = (t: Tab) => setParams(t === 'overview' ? {} : { tab: t })

  const allNotes = Object.entries(p.notes).flatMap(([tid, ns]) => ns.map((n) => ({ ...n, target: lessons.find((l) => l.id === tid)?.title ?? tid })))
  const wrongQs = p.wrongQuestions.map(findQuiz).filter(Boolean)

  return (
    <div className="pad pt-6">
      <div className="mb-5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[#8C7CFF]">Your Space</div>
        <h1 className="font-display text-2xl font-bold">我的</h1>
      </div>

      {/* 概览卡 */}
      <div className="mb-5 overflow-hidden rounded-3xl border border-[#263247] p-5" style={{ background: 'radial-gradient(circle at 85% 0%, rgba(140,124,255,.15), transparent 55%), #0E1422' }}>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full font-display text-xl font-bold" style={{ background: 'linear-gradient(135deg,#4B9EFF,#8C7CFF)' }}>思</div>
          <div>
            <div className="font-display text-lg font-bold">独立思考者</div>
            <div className="text-xs muted">PHILOSOPHY ACADEMY 学员</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div><div className="font-display text-xl font-bold text-[#4B9EFF]">{percent}%</div><div className="text-[10px] muted">课程进度</div></div>
          <div><div className="font-display text-xl font-bold text-[#43D9D0]">{p.streak.days}</div><div className="text-[10px] muted">连续天数</div></div>
          <div><div className="font-display text-xl font-bold text-[#8C7CFF]">{Math.round(p.totalMinutes)}m</div><div className="text-[10px] muted">学习时长</div></div>
        </div>
      </div>

      {/* 快捷统计 */}
      <div className="mb-5 grid grid-cols-3 gap-2.5">
        <div className="rounded-xl glass p-3 text-center"><div className="font-display text-lg font-bold text-[#43D9D0]">{allNotes.length}</div><div className="text-[10px] muted">笔记</div></div>
        <div className="rounded-xl glass p-3 text-center"><div className="font-display text-lg font-bold text-[#8C7CFF]">{p.writings.length}</div><div className="text-[10px] muted">写作</div></div>
        <div className="rounded-xl glass p-3 text-center"><div className="font-display text-lg font-bold text-[#F0A56B]">{wrongQs.length}</div><div className="text-[10px] muted">错题</div></div>
      </div>

      {/* Tab 栏 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition ${tab === t.id ? 'bg-[#8C7CFF] text-white' : 'glass-soft muted'}`}>
            <t.icon size={13}/>{t.label}
          </button>
        ))}
      </div>

      {/* 概览 */}
      {tab === 'overview' && (
        <div className="space-y-3">
          <SectionHeader title="成就与进度" />
          <div className="rounded-2xl glass p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Trophy size={16} className="text-[#F0A56B]"/>学习里程碑</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="muted">已完成章节</span><span>{p.completedLessons.length} / {lessons.length}</span></div>
              <div className="flex justify-between"><span className="muted">完成思想实验</span><span>{Object.keys(p.experimentAnswers).length} / {experiments.length}</span></div>
              <div className="flex justify-between"><span className="muted">每日问题记录</span><span>{Object.keys(p.dailyAnswers).length} 天</span></div>
              <div className="flex justify-between"><span className="muted">论证训练作答</span><span>{Object.keys(p.drillAnswers).length} 次</span></div>
              <div className="flex justify-between"><span className="muted">立场辩论</span><span>{Object.keys(p.debateAnswers).length} 次</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-[#43D9D0]/20 bg-[#43D9D0]/[.05] p-4 text-xs leading-relaxed muted">
            <Flame size={14} className="mr-1 inline text-[#43D9D0]"/>
            哲学的进步不在于记住多少观点，而在于你开始提出自己的问题。继续保持追问的习惯。
          </div>
        </div>
      )}

      {/* 笔记 */}
      {tab === 'notes' && (
        allNotes.length === 0 ? <EmptyState icon={<NotebookPen size={38}/>} text="还没有笔记。在章节页面可以边读边记。" /> :
        <div className="space-y-2.5">{allNotes.map((n) => (
          <div key={n.id} className="rounded-2xl glass p-4">
            <div className="mb-1.5 flex justify-between text-[11px] muted"><span>{n.target}</span><span>{formatDate(n.at)}</span></div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{n.text}</div>
            <button onClick={() => updateProgress((d) => { for (const k in d.notes) d.notes[k] = d.notes[k].filter((x) => x.id !== n.id) })} className="mt-2 text-[11px] text-[#F0A56B]">删除</button>
          </div>
        ))}</div>
      )}

      {/* 收藏 */}
      {tab === 'favorites' && (
        p.favorites.length === 0 ? <EmptyState icon={<BookMarked size={38}/>} text="还没有收藏。收藏重要的章节和概念。" /> :
        <div className="space-y-2">{p.favorites.map((fid) => {
          const isLesson = fid.startsWith('lesson-')
          const target = isLesson ? lessons.find((l) => `lesson-${l.id}` === fid) : concepts.find((c) => c.id === fid)
          return (
            <div key={fid} className="flex items-center gap-3 rounded-2xl glass p-4">
              <BookMarked size={16} className="shrink-0 text-[#8C7CFF]" />
              <span className="flex-1 text-sm">{target ? (isLesson ? (target as typeof lessons[0]).title : (target as typeof concepts[0]).zh) : fid}</span>
              {target && <Link to={isLesson ? `/lesson/${(target as typeof lessons[0]).id}` : `/concept/${(target as typeof concepts[0]).id}`} className="text-xs text-[#4B9EFF]">查看 ›</Link>}
              <button onClick={() => updateProgress((d) => { d.favorites = d.favorites.filter((x) => x !== fid) })} className="text-xs muted">✕</button>
            </div>
          )
        })}</div>
      )}

      {/* 写作 */}
      {tab === 'writing' && (
        p.writings.length === 0 ? <EmptyState icon={<PenLine size={38}/>} text="还没有写作草稿。" /> :
        <div className="space-y-2.5">{p.writings.map((w) => {
          const pr = writingPrompts.find((x) => x.id === w.promptId)
          return (
            <div key={w.id} className="rounded-2xl glass p-4">
              <div className="flex items-center justify-between"><div className="font-semibold">{w.title}</div><span className="text-[11px] muted">{formatDate(w.updatedAt)}</span></div>
              <div className="mt-1 text-xs muted">{pr?.title} · {w.content.length} 字 · {w.versions.length} 个历史版本</div>
              <Link to={`/experiment/write-${w.promptId}`} className="mt-3 inline-flex items-center gap-1 text-xs text-[#4B9EFF]">继续写作 <ChevronRight size={12}/></Link>
              <button onClick={() => { if (confirm('确定删除这篇文章？')) updateProgress((d) => { d.writings = d.writings.filter((x) => x.id !== w.id) }) }} className="ml-4 text-xs text-[#F0A56B]">删除</button>
            </div>
          )
        })}</div>
      )}

      {/* 错题 */}
      {tab === 'wrong' && (
        wrongQs.length === 0 ? <EmptyState icon={<CircleX size={38}/>} text="错题本是空的，继续保持！" /> :
        <div className="space-y-2.5">{wrongQs.map((item) => {
          const { q, lesson } = item!
          return (
            <Link key={q.id} to={`/lesson/${lesson.id}`} className="block rounded-2xl glass p-4">
              <div className="mb-1 text-[11px] muted">{lesson.title}</div>
              <div className="text-sm">{q.stem}</div>
              <div className="mt-2 text-xs text-[#43D9D0]">正确答案：{q.type === 'judge' ? (q.answer ? '正确' : '错误') : (q.options?.[q.answer as number] ?? '')}</div>
              <div className="mt-1 text-xs muted">{q.explanation}</div>
            </Link>
          )
        })}</div>
      )}

      {/* 历史 */}
      {tab === 'history' && (
        p.learningHistory.length === 0 ? <EmptyState icon={<History size={38}/>} text="还没有学习记录。" /> :
        <div className="relative ml-2 space-y-1 border-l border-[#263247] pl-5">
          {p.learningHistory.map((h) => (
            <div key={h.id} className="relative py-2.5">
              <span className="absolute -left-[26px] top-4 h-2 w-2 rounded-full bg-[#4B9EFF]" />
              <div className="text-sm">{h.title}</div>
              <div className="text-[11px] muted">{formatDate(h.at)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 设置 */}
      {tab === 'settings' && (
        <div className="space-y-3">
          <div className="rounded-2xl glass p-4">
            <div className="mb-1 text-sm font-bold">数据管理</div>
            <p className="mb-4 text-xs muted">你的所有学习数据保存在本机浏览器中，刷新或重新打开都不会丢失。导出可备份。</p>
            <button onClick={() => {
              const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob); const a = document.createElement('a')
              a.href = url; a.download = `philosophy-academy-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
            }} className="btn-ghost mb-2 w-full"><Download size={15}/>导出学习数据</button>
            <button onClick={() => { if (confirm('确定清空所有学习记录？此操作不可撤销。')) { localStorageAdapter.clear(); window.location.reload() } }} className="w-full rounded-xl border border-[#FF9A8C]/30 bg-[#FF9A8C]/[.06] py-2.5 text-sm font-medium text-[#FF9A8C]"><Trash2 size={15} className="mr-1 inline"/>清空所有数据</button>
          </div>
          <div className="rounded-2xl glass p-4">
            <div className="mb-2 text-sm font-bold">关于平台</div>
            <div className="space-y-1 text-xs muted">
              <div>PHILOSOPHY ACADEMY · 哲学思维与思想探索学习平台</div>
              <div>Explore Ideas. Question Everything. Think Independently.</div>
              <div className="pt-2">核心教材：《大问题》《西方哲学简史》《做哲学》</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

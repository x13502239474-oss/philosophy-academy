import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookMarked, Network, Search, UserRound, Lightbulb, ArrowRight, History } from 'lucide-react'
import { philosophers } from '../data/philosophers'
import { concepts } from '../data/concepts'
import { SectionHeader, EmptyState } from '../components/ui'

const periodNames: Record<string, string> = {
  ancient: '古希腊', medieval: '中世纪', modern: '近代', german: '德国古典', contemporary: '现代',
}
const periods = ['all', 'ancient', 'medieval', 'modern', 'german', 'contemporary']

export default function Knowledge() {
  const [tab, setTab] = useState<'philosophers' | 'concepts' | 'map'>('philosophers')
  const [q, setQ] = useState('')
  const [period, setPeriod] = useState('all')

  const filteredPh = philosophers.filter((ph) =>
    (period === 'all' || ph.period === period) &&
    (q.trim() === '' || [ph.name, ph.enName, ph.school, ph.bio].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  )
  const filteredConcepts = concepts.filter((c) =>
    q.trim() === '' || [c.zh, c.en, c.plain, c.definition].some((v) => v.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="pad pt-6">
      <div className="mb-5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[#8C7CFF]">The Archive</div>
        <h1 className="font-display text-2xl font-bold">知识库</h1>
        <p className="mt-2 text-sm muted">思想家、概念与它们之间的传承脉络。点进去，看见思想如何生长。</p>
      </div>

      <div className="mb-4 flex gap-2 rounded-xl bg-[#0E1422] p-1">
        {([
          { id: 'philosophers', label: '思想家', icon: Users },
          { id: 'concepts', label: '概念词典', icon: BookMarked },
          { id: 'map', label: '思想地图', icon: Network },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition ${tab === t.id ? 'bg-[#1A2638] text-white shadow-sm' : 'muted'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab !== 'map' && (
        <div className="relative mb-4">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 muted" />
          <input className="field !pl-10" placeholder={tab === 'philosophers' ? '搜索哲学家、流派、思想…' : '搜索概念（中英文）…'} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      )}

      {/* 思想家 */}
      {tab === 'philosophers' && (
        <>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {periods.map((per) => (
              <button key={per} onClick={() => setPeriod(per)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${period === per ? 'bg-[#8C7CFF] text-white' : 'glass-soft muted'}`}>
                {per === 'all' ? '全部时期' : periodNames[per]}
              </button>
            ))}
          </div>
          {filteredPh.length === 0 ? <EmptyState icon={<Search size={36}/>} text="没有匹配的思想家" /> : (
            <div className="stagger space-y-2.5">
              {filteredPh.map((ph) => (
                <Link key={ph.id} to={`/philosopher/${ph.id}`} className="flex items-center gap-3 rounded-2xl glass p-4 transition active:scale-[.99]">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold" style={{ background: ph.color + '1A', color: ph.color, border: `1px solid ${ph.color}44` }}>
                    {ph.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><span className="font-semibold">{ph.name}</span><span className="text-[10px] muted">{ph.enName}</span></div>
                    <div className="truncate text-xs muted">{ph.era} · {ph.school}</div>
                  </div>
                  <ArrowRight size={15} className="shrink-0 muted" />
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* 概念词典 */}
      {tab === 'concepts' && (
        <>
          <div className="mb-3 text-xs muted">共 {concepts.length} 个概念 · 点击可查看关联</div>
          {filteredConcepts.length === 0 ? <EmptyState icon={<Search size={36}/>} text="没有匹配的概念" /> : (
            <div className="stagger grid gap-2.5 sm:grid-cols-2">
              {filteredConcepts.map((c) => (
                <Link key={c.id} to={`/concept/${c.id}`} className="rounded-2xl glass p-4 transition active:scale-[.99]">
                  <div className="flex items-start justify-between gap-2">
                    <div><div className="font-bold">{c.zh}</div><div className="text-[10px] uppercase tracking-wider muted">{c.en}</div></div>
                    <span className="chip shrink-0 !text-[9px]">{c.category}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed muted">{c.plain}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* 思想地图入口 */}
      {tab === 'map' && (
        <div>
          <div className="mb-4 overflow-hidden rounded-3xl border border-[#4B9EFF]/20 p-5" style={{ background: 'radial-gradient(circle at 70% 0%, rgba(75,158,255,.13), transparent 55%), #0E1422' }}>
            <Network size={28} className="mb-3 text-[#4B9EFF]" />
            <h2 className="font-display text-xl font-bold">思想的关系图</h2>
            <p className="mt-2 text-sm muted">哲学不是孤立的名字。柏拉图影响亚里士多德，洛克经贝克莱、休谟传到康德，康德又启发黑格尔与整个现代哲学。在这张图里看见思想的继承、批判与分歧。</p>
            <Link to="/map" className="btn-primary mt-5 inline-flex"><Network size={16}/> 打开思想地图 <ArrowRight size={15}/></Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl glass p-4"><div className="font-display text-2xl font-bold text-[#4B9EFF]">{philosophers.length}</div><div className="text-[11px] muted">思想家</div></div>
            <div className="rounded-2xl glass p-4"><div className="font-display text-2xl font-bold text-[#8C7CFF]">{concepts.length}</div><div className="text-[11px] muted">核心概念</div></div>
            <div className="rounded-2xl glass p-4"><div className="font-display text-2xl font-bold text-[#43D9D0]">{philosophers.reduce((s,p)=>s+p.influenced.length,0)}</div><div className="text-[11px] muted">思想关联</div></div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Network, GitBranch, Clock3, ArrowRight } from 'lucide-react'
import { philosophers } from '../data/philosophers'
import { BackBar } from '../components/ui'

const periodNames: Record<string, string> = { ancient: '古希腊', medieval: '中世纪', modern: '近代', german: '德国古典', contemporary: '现代' }
const periods = ['ancient', 'medieval', 'modern', 'german', 'contemporary'] as const

export default function MapPage() {
  const [mode, setMode] = useState<'graph' | 'timeline'>('graph')

  // 分层布局：按时期分列
  const cols = periods.map((per, ci) => {
    const phs = philosophers.filter((p) => p.period === per)
    return { per, ci, phs }
  })
  const colCount = periods.length
  const W = 900, H = 620, COL_W = W / colCount
  const nodePos: Record<string, { x: number; y: number }> = {}
  cols.forEach(({ phs, ci }) => {
    phs.forEach((p, i) => {
      nodePos[p.id] = { x: 45 + ci * COL_W + (ci % 2) * 12, y: 45 + i * ((H - 60) / Math.max(phs.length, 1)) }
    })
  })

  return (
    <div className="pad pt-5">
      <BackBar title="知识库" to="/knowledge" />
      <div className="mb-5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[#4B9EFF]">Idea Map</div>
        <h1 className="font-display text-2xl font-bold">思想地图</h1>
        <p className="mt-2 text-sm muted">每位思想家都是一个节点，连线代表影响与传承。沿着箭头，看见哲学如何一步步生长。</p>
      </div>

      <div className="mb-4 flex gap-2 rounded-xl bg-[#0E1422] p-1">
        <button onClick={() => setMode('graph')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition ${mode === 'graph' ? 'bg-[#1A2638] text-white' : 'muted'}`}><Network size={15}/>关系网络</button>
        <button onClick={() => setMode('timeline')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition ${mode === 'timeline' ? 'bg-[#1A2638] text-white' : 'muted'}`}><Clock3 size={15}/>历史时间线</button>
      </div>

      {mode === 'graph' ? (
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#263247] bg-[#0A0F1A]">
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[680px]" style={{ width: '100%' }}>
              <defs>
                <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 z" fill="#3B4A63" /></marker>
              </defs>
              {/* 时期列背景 */}
              {cols.map(({ per, ci }) => (
                <g key={per}>
                  <rect x={ci * COL_W} y="0" width={COL_W} height={H} fill={ci % 2 ? '#4B9EFF' : '#8C7CFF'} fillOpacity="0.02" />
                  <text x={ci * COL_W + 16} y="26" fill="#8996AA" fontSize="13" fontWeight="600">{periodNames[per]}</text>
                  <line x1={ci * COL_W} y1="0" x2={ci * COL_W} y2={H} stroke="#263247" strokeWidth="1" />
                </g>
              ))}
              {/* 连线 */}
              {philosophers.flatMap((p) => p.influenced.map((tid) => {
                const from = nodePos[p.id], to = nodePos[tid]
                if (!from || !to) return null
                return <line key={`${p.id}-${tid}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#3B4A63" strokeWidth="1" strokeOpacity="0.55" markerEnd="url(#arrow)" />
              }))}
              {/* 节点 */}
              {philosophers.map((p) => {
                const pos = nodePos[p.id]
                return (
                  <a key={p.id} href={`#/philosopher/${p.id}`}>
                    <circle cx={pos.x} cy={pos.y} r="5" fill={p.color} fillOpacity="0.9" />
                    <circle cx={pos.x} cy={pos.y} r="10" fill={p.color} fillOpacity="0.12" />
                    <text x={pos.x + 11} y={pos.y + 4} fill="#C3CDDE" fontSize="11">{p.name}</text>
                  </a>
                )
              })}
            </svg>
          </div>
          <div className="border-t border-[#263247] px-4 py-3 text-[11px] muted">← 左右滑动查看完整图谱 · 点击节点进入档案</div>
        </div>
      ) : (
        <div className="mb-5 space-y-5">
          {cols.map(({ per, phs, ci }) => (
            <div key={per}>
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold" style={{ background: ['#4B9EFF','#8C7CFF','#43D9D0','#F0A56B','#FF9A8C'][ci] + '22', color: ['#4B9EFF','#8C7CFF','#43D9D0','#F0A56B','#FF9A8C'][ci] }}>{ci+1}</span>
                <h2 className="font-bold">{periodNames[per]}</h2>
                <span className="text-xs muted">{phs.length} 位</span>
              </div>
              <div className="relative ml-3 border-l border-[#263247] pl-5">
                {phs.map((p) => (
                  <Link key={p.id} to={`/philosopher/${p.id}`} className="relative mb-3 block rounded-xl glass p-3.5 transition active:scale-[.99]">
                    <span className="absolute -left-[25px] top-5 h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <div className="flex items-center justify-between">
                      <div><span className="font-semibold">{p.name}</span><span className="ml-2 text-[10px] muted">{p.enName}</span></div>
                      <ArrowRight size={14} className="muted" />
                    </div>
                    <div className="mt-1 text-xs muted">{p.school}{p.years ? ` · ${p.years}` : ''}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-[#4B9EFF]/20 bg-[#4B9EFF]/[.05] p-4 text-xs leading-relaxed muted">
        <GitBranch size={14} className="mr-1 inline text-[#4B9EFF]" />
        图谱依据教材整理的思想传承关系绘制，展示的是主要影响脉络，哲学思想的实际发展远比这张图复杂。
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Sparkles, GitBranch, MessageSquareWarning, Zap, UserRound } from 'lucide-react'
import { philosophers } from '../data/philosophers'
import { concepts } from '../data/concepts'
import { BackBar, EmptyState, SectionHeader } from '../components/ui'

function Panel({ icon: Icon, title, color, children }: { icon: typeof BookOpen; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: color + '1A', color }}><Icon size={15}/></div>
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export default function PhilosopherPage() {
  const { id } = useParams()
  const ph = philosophers.find((p) => p.id === id)
  if (!ph) return <div className="pad pt-6"><BackBar title="知识库" to="/knowledge"/><EmptyState icon={<UserRound size={40}/>} text="未找到该思想家" /></div>
  const relatedConcepts = concepts.filter((c) => c.philosopherIds.includes(ph.id))
  const influenced = ph.influenced.map((pid) => philosophers.find((p) => p.id === pid)).filter(Boolean)
  const influencedBy = ph.influencedBy.map((pid) => philosophers.find((p) => p.id === pid)).filter(Boolean)

  return (
    <div className="pad pt-5">
      <BackBar title="思想家档案" to="/knowledge" />
      <div className="mb-6 overflow-hidden rounded-3xl border border-[#263247] p-5" style={{ background: `radial-gradient(circle at 85% 0%, ${ph.color}22, transparent 55%), linear-gradient(150deg,#141D2D,#0E1422)` }}>
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-2xl font-bold" style={{ background: ph.color + '1E', color: ph.color, border: `1px solid ${ph.color}55` }}>{ph.name.slice(0,1)}</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[25px] font-bold leading-tight">{ph.name}</h1>
            <div className="text-xs muted">{ph.enName}{ph.years ? ` · ${ph.years}` : ''}</div>
            <div className="mt-2 flex flex-wrap gap-2"><span className="chip">{ph.era}</span><span className="chip" style={{ color: ph.color, borderColor: ph.color + '44' }}>{ph.school}</span></div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-[1.9]" style={{ color: '#C3CFE2' }}>{ph.bio}</p>
      </div>

      <Panel icon={Sparkles} title="核心思想" color="#4B9EFF">
        <div className="space-y-2">{ph.coreIdeas.map((idea,i)=><div key={i} className="flex gap-2.5 rounded-xl glass-soft px-4 py-2.5 text-sm"><span className="font-mono text-xs text-[#4B9EFF]">{String(i+1).padStart(2,'0')}</span><span>{idea}</span></div>)}</div>
      </Panel>

      <Panel icon={BookOpen} title="代表著作" color="#8C7CFF">
        <div className="flex flex-wrap gap-2">{ph.works.map((w,i)=><span key={i} className="chip">《{w}》</span>)}</div>
      </Panel>

      {relatedConcepts.length > 0 && (
        <Panel icon={Zap} title="关键概念" color="#43D9D0">
          <div className="flex flex-wrap gap-2">{relatedConcepts.map((c)=><Link key={c.id} to={`/concept/${c.id}`} className="chip transition active:scale-95">{c.zh} <ArrowRight size={11}/></Link>)}</div>
        </Panel>
      )}

      <Panel icon={GitBranch} title="重要论证" color="#43D9D0">
        <div className="space-y-2">{ph.arguments.map((a,i)=><div key={i} className="rounded-xl glass p-3.5"><div className="mb-1 text-sm font-semibold text-[#43D9D0]">{a.label}</div><div className="text-xs leading-relaxed muted">{a.summary}</div></div>)}</div>
      </Panel>

      <Panel icon={GitBranch} title="思想传承" color="#8C7CFF">
        <div className="space-y-3 rounded-2xl glass p-4">
          {influencedBy.length > 0 && <div><div className="mb-2 text-xs font-bold muted">思想来源 · 受其影响</div><div className="flex flex-wrap gap-2">{influencedBy.map((x)=><Link key={x!.id} to={`/philosopher/${x!.id}`} className="chip">← {x!.name}</Link>)}</div></div>}
          <div className="divider" />
          {influenced.length > 0 ? <div><div className="mb-2 text-xs font-bold muted">影响了 · 后世回响</div><div className="flex flex-wrap gap-2">{influenced.map((x)=><Link key={x!.id} to={`/philosopher/${x!.id}`} className="chip" style={{ color: ph.color, borderColor: ph.color + '44' }}>{x!.name} →</Link>)}</div></div> : <div className="text-xs muted">暂无记录的直接影响链</div>}
        </div>
      </Panel>

      <Panel icon={MessageSquareWarning} title="受到的主要批评" color="#F0A56B">
        <div className="space-y-2">{ph.criticisms.map((c,i)=><div key={i} className="flex gap-2 rounded-xl border border-[#F0A56B]/15 bg-[#F0A56B]/[.04] px-4 py-2.5 text-sm"><span className="text-[#F0A56B]">·</span><span>{c}</span></div>)}</div>
      </Panel>

      <Panel icon={Zap} title="现代意义" color="#43D9D0">
        <div className="rounded-2xl border border-[#43D9D0]/20 bg-[#43D9D0]/[.05] p-4 text-sm leading-[1.9]">{ph.modernRelevance}</div>
      </Panel>

      <div className="mb-4 text-[11px] muted">资料来源：赵敦华《西方哲学简史》· {ph.source.chapter ?? '综合整理'}。内容以本平台语言重写。</div>
    </div>
  )
}

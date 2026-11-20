import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Lightbulb, BookOpen, Users, CaseSensitive, Network, UserRound } from 'lucide-react'
import { concepts } from '../data/concepts'
import { philosophers } from '../data/philosophers'
import { BackBar, EmptyState } from '../components/ui'

export default function ConceptPage() {
  const { id } = useParams()
  const c = concepts.find((x) => x.id === id)
  if (!c) return <div className="pad pt-6"><BackBar title="概念词典" to="/knowledge"/><EmptyState icon={<BookOpen size={40}/>} text="未找到该概念" /></div>
  const related = c.relatedIds.map((rid)=>concepts.find((x)=>x.id===rid)).filter(Boolean)
  const phs = c.philosopherIds.map((pid)=>philosophers.find((p)=>p.id===pid)).filter(Boolean)

  return (
    <div className="pad pt-5">
      <BackBar title="概念词典" to="/knowledge" />
      <div className="mb-6 overflow-hidden rounded-sm border border-[#586044]/20 p-5" style={{ background: 'radial-gradient(circle at 85% 0%, rgba(88,96,68,.12), transparent 55%), #F2E7CE' }}>
        <span className="chip !text-[#586044]">{c.category}</span>
        <h1 className="mt-3 font-display text-[28px] font-bold">{c.zh}</h1>
        <div className="text-sm uppercase tracking-wider muted">{c.en}</div>
      </div>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#586044]"><Lightbulb size={16}/>通俗理解</div>
        <div className="rounded-sm glass p-4 text-[15px] leading-[1.9]" style={{ color: '#514332' }}>{c.plain}</div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#793D36]"><BookOpen size={16}/>严谨定义</div>
        <div className="rounded-sm glass p-4 text-sm leading-[1.9]">{c.definition}</div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#B08D57]"><CaseSensitive size={16}/>现实案例</div>
        <div className="rounded-sm border-l-2 border-[#B08D57] bg-[#B08D57]/[.05] p-4 text-sm leading-[1.9]">{c.example}</div>
      </section>

      {phs.length > 0 && (
        <section className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#A8874F]"><Users size={16}/>相关思想家</div>
          <div className="flex flex-wrap gap-2">{phs.map((ph)=><Link key={ph!.id} to={`/philosopher/${ph!.id}`} className="chip transition active:scale-95" style={{ color: ph!.color, borderColor: ph!.color + '44' }}>{ph!.name} <ArrowRight size={11}/></Link>)}</div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#586044]"><Network size={16}/>关联概念</div>
          <div className="flex flex-wrap gap-2">{related.map((r)=><Link key={r!.id} to={`/concept/${r!.id}`} className="chip transition active:scale-95">{r!.zh} <ArrowRight size={11}/></Link>)}</div>
        </section>
      )}

      <div className="mb-4 text-[11px] muted">概念之间可以相互跳转，沿着关联一路探索下去。</div>
    </div>
  )
}

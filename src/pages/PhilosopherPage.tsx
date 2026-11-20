import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Sparkles, GitBranch, MessageSquareWarning, Zap, UserRound } from 'lucide-react'
import { philosophers } from '../data/philosophers'
import { concepts } from '../data/concepts'
import { BackBar, EmptyState, SectionHeader } from '../components/ui'

function Panel({ icon: Icon, title, color, children }: { icon: typeof BookOpen; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-sm" style={{ background: color + '1A', color }}><Icon size={15}/></div>
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
      <div className="folio-frame relative mb-6 overflow-hidden p-5" style={{ background: `radial-gradient(circle at 88% 0%, ${ph.color}1C, transparent 55%), linear-gradient(150deg,#F6EDD9,#F2E7CE)` }}>
        <div className="mb-3 font-display text-[10px] tracking-[.3em] text-[#A8874F]">PHILOSOPHORUM · IMAGINES</div>
        <div className="flex items-start gap-4">
          {/* 古典肖像徽章：月桂环 + 姓氏，非照片，避免虚构肖像 */}
          <div className="relative grid h-[72px] w-[72px] shrink-0 place-items-center" style={{ border: `1px solid ${ph.color}77`, outline: `1px solid ${ph.color}33`, outlineOffset: 3, background: ph.color + '14' }}>
            <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 72 72" fill="none">
              <path d="M18 56c-9-12-8-30 4-40 M54 56c9-12 8-30-4-40" stroke={ph.color} strokeWidth="1" />
              <path d="M16 42l6 2M15 34l7 1M17 26l6 3M21 19l5 4M56 42l-6 2M57 34l-7 1M55 26l-6 3M51 19l-5 4" stroke={ph.color} strokeWidth="1" />
            </svg>
            <span className="relative font-display text-[26px] font-bold" style={{ color: ph.color }}>{ph.name.slice(0,1)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[25px] font-bold leading-tight tracking-[.03em]">{ph.name}</h1>
            <div className="font-reading text-xs italic muted">{ph.enName}{ph.years ? ` · ${ph.years}` : ''}</div>
            <div className="mt-2 flex flex-wrap gap-2"><span className="chip">{ph.era}</span><span className="chip" style={{ color: ph.color, borderColor: ph.color + '44' }}>{ph.school}</span></div>
          </div>
        </div>
        <div className="ornament my-4 text-[10px]">✦</div>
        <p className="prose-philo text-sm leading-[2]" style={{ color: '#514332' }}>{ph.bio}</p>
        <div className="margin-note mt-4 pt-2">资料来源：赵敦华《西方哲学简史》· {ph.source.chapter ?? '综合整理'}。内容以本平台语言重写。</div>
      </div>

      <Panel icon={Sparkles} title="核心思想" color="#793D36">
        <div className="space-y-2">{ph.coreIdeas.map((idea,i)=><div key={i} className="flex gap-2.5 rounded-sm glass-soft px-4 py-2.5 text-sm"><span className="font-mono text-xs text-[#793D36]">{String(i+1).padStart(2,'0')}</span><span>{idea}</span></div>)}</div>
      </Panel>

      <Panel icon={BookOpen} title="代表著作" color="#A8874F">
        <div className="flex flex-wrap gap-2">{ph.works.map((w,i)=><span key={i} className="chip">《{w}》</span>)}</div>
      </Panel>

      {relatedConcepts.length > 0 && (
        <Panel icon={Zap} title="关键概念" color="#586044">
          <div className="flex flex-wrap gap-2">{relatedConcepts.map((c)=><Link key={c.id} to={`/concept/${c.id}`} className="chip transition active:scale-95">{c.zh} <ArrowRight size={11}/></Link>)}</div>
        </Panel>
      )}

      <Panel icon={GitBranch} title="重要论证" color="#586044">
        <div className="space-y-2">{ph.arguments.map((a,i)=><div key={i} className="rounded-sm glass p-3.5"><div className="mb-1 text-sm font-semibold text-[#586044]">{a.label}</div><div className="text-xs leading-relaxed muted">{a.summary}</div></div>)}</div>
      </Panel>

      <Panel icon={GitBranch} title="思想传承" color="#A8874F">
        <div className="space-y-3 rounded-sm glass p-4">
          {influencedBy.length > 0 && <div><div className="mb-2 text-xs font-bold muted">思想来源 · 受其影响</div><div className="flex flex-wrap gap-2">{influencedBy.map((x)=><Link key={x!.id} to={`/philosopher/${x!.id}`} className="chip">← {x!.name}</Link>)}</div></div>}
          <div className="divider" />
          {influenced.length > 0 ? <div><div className="mb-2 text-xs font-bold muted">影响了 · 后世回响</div><div className="flex flex-wrap gap-2">{influenced.map((x)=><Link key={x!.id} to={`/philosopher/${x!.id}`} className="chip" style={{ color: ph.color, borderColor: ph.color + '44' }}>{x!.name} →</Link>)}</div></div> : <div className="text-xs muted">暂无记录的直接影响链</div>}
        </div>
      </Panel>

      <Panel icon={MessageSquareWarning} title="受到的主要批评" color="#B08D57">
        <div className="space-y-2">{ph.criticisms.map((c,i)=><div key={i} className="flex gap-2 rounded-sm border border-[#B08D57]/15 bg-[#B08D57]/[.04] px-4 py-2.5 text-sm"><span className="text-[#B08D57]">·</span><span>{c}</span></div>)}</div>
      </Panel>

      <Panel icon={Zap} title="现代意义" color="#586044">
        <div className="rounded-sm border border-[#586044]/20 bg-[#586044]/[.05] p-4 text-sm leading-[1.9]">{ph.modernRelevance}</div>
      </Panel>

    </div>
  )
}

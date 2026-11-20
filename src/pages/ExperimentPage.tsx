import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FlaskConical, CircleHelp, Scale, ShieldAlert, MessageCircleQuestion, Lightbulb, ChevronRight, CheckCircle2, Send, Sparkles, PenLine, GitBranch, Swords, RotateCcw, BookOpen } from 'lucide-react'
import { experiments } from '../data/experiments'
import { argumentDrills, debates, writingPrompts } from '../data/training'
import { analyzeExperiment, evaluateDebate } from '../lib/analysis'
import { updateProgress, logActivity } from '../lib/storage'
import { useProgress } from '../lib/hooks'
import { BackBar, EmptyState, SectionHeader } from '../components/ui'

function ArgCard({ label, premises, conclusion, color }: { label: string; premises: string[]; conclusion: string; color: string }) {
  return (
    <div className="rounded-sm glass-soft p-3.5">
      <div className="mb-2 text-xs font-bold" style={{ color }}>{label}</div>
      <div className="space-y-1">
        {premises.map((p, i) => <div key={i} className="flex gap-2 text-xs leading-relaxed"><span className="shrink-0 font-mono muted">P{i+1}</span><span>{p}</span></div>)}
      </div>
      <div className="mt-2 border-t border-[#C4AB82] pt-2 text-xs" style={{ color }}>∴ {conclusion}</div>
    </div>
  )
}

/** ===== 思想实验主体 ===== */
function ExperimentView({ id }: { id: string }) {
  const exp = experiments.find((e) => e.id === id)
  const p = useProgress()
  const [stance, setStance] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [followIdx, setFollowIdx] = useState(0)
  const [followAnswers, setFollowAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    const ans = p.experimentAnswers[id]
    if (ans) { setStance(ans.stanceId); setReason(ans.reason); setSubmitted(true); setFollowAnswers(ans.followUpAnswers ?? {}) }
  }, [id])

  if (!exp) return <EmptyState icon={<FlaskConical size={40} />} text="未找到该思想实验" />

  const analysis = analyzeExperiment(exp, stance, reason)

  const submit = () => {
    if (!stance || reason.trim().length < 4) return
    setSubmitted(true)
    updateProgress((d) => {
      d.experimentAnswers[id] = { stanceId: stance, reason: reason.trim(), at: Date.now(), followUpAnswers: followAnswers, analysisSeen: true }
      logActivity(d, 'experiment', id, `思想实验 · ${exp.title}`)
    })
  }

  const reset = () => {
    setStance(''); setReason(''); setSubmitted(false); setFollowIdx(0); setFollowAnswers({})
  }

  return (
    <div className="pad pt-5">
      <BackBar title="思想实验实验室" to="/think" />
      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="chip" style={{ color: exp.color, borderColor: exp.color + '44' }}>{exp.category}</span>
          <span className="text-[11px] muted">{exp.enTitle}</span>
        </div>
        <h1 className="font-display text-[25px] font-bold leading-tight">{exp.title}</h1>
        <div className="mt-2 text-[11px] muted">源自《做哲学》· {exp.source.chapter} · 约 {exp.readingTime} 分钟</div>
      </div>

      {/* 情境 */}
      <section className="mb-6">
        <SectionHeader eyebrow="The Scenario" title="情境" />
        <div className="space-y-3 rounded-sm border border-[#C4AB82] bg-[#F2E7CE]/80 p-4">
          {exp.scenario.map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.9]" style={{ color: '#514332' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* 核心问题 */}
      <div className="mb-6 rounded-sm border-l-2 p-4" style={{ borderColor: exp.color, background: exp.color + '0D' }}>
        <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: exp.color }}><CircleHelp size={13} /> 核心问题</div>
        <p className="font-display text-lg font-semibold leading-snug">{exp.question}</p>
      </div>

      {/* 不同立场 + 论证 */}
      <section className="mb-6">
        <SectionHeader eyebrow="Perspectives" title="不同的立场" />
        <div className="space-y-3">
          {exp.stances.map((s) => {
            const support = exp.supportArguments.filter((a) => a.stanceId === s.id)
            const counter = exp.counterArguments.filter((a) => a.stanceId === s.id)
            const selected = stance === s.id
            return (
              <div key={s.id} className={`rounded-sm border p-4 transition ${selected ? 'ring-1' : ''}`}
                style={{ borderColor: selected ? exp.color + '88' : '#C4AB82', background: selected ? exp.color + '0D' : undefined }}>
                <button onClick={() => !submitted && setStance(s.id)} className="flex w-full items-start gap-3 text-left">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${selected ? 'text-[#E9D9B8]' : 'border-[#B39B72]'}`}
                    style={selected ? { background: exp.color, borderColor: exp.color } : {}}>{selected ? '✓' : ''}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{s.label}</div>
                    <div className="mt-0.5 text-xs muted">{s.summary}</div>
                    <div className="mt-1.5 text-[11px]" style={{ color: exp.color }}>依据原则：{s.principle}</div>
                  </div>
                </button>
                {selected && (
                  <div className="animate-fade-up mt-3 space-y-2 border-t border-[#C4AB82] pt-3">
                    {support.map((a, i) => <ArgCard key={`s${i}`} label={`支持 · ${a.label}`} premises={a.premises} conclusion={a.conclusion} color="#586044" />)}
                    {counter.map((a, i) => <ArgCard key={`c${i}`} label={`反对 · ${a.label}`} premises={a.premises} conclusion={a.conclusion} color="#B08D57" />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 用户作答 */}
      {!submitted ? (
        <section className="mb-6">
          <SectionHeader eyebrow="Your Turn" title="你的回答" />
          <div className="rounded-sm glass p-4">
            <div className="mb-3 text-sm font-semibold">你的理由是什么？</div>
            <textarea className="field" placeholder="为什么选择这个立场？你依据什么原则？试着用『因为…所以我认为…』把推理说清楚。" value={reason} onChange={(e) => setReason(e.target.value)} rows={5} />
            <div className="mt-2 text-[11px] muted">至少写 12 个字。理由越具体，分析越有价值。</div>
            <button onClick={submit} disabled={!stance || reason.trim().length < 4} className="btn-primary mt-4 w-full">
              <Send size={16} /> 提交并查看论证分析
            </button>
            {!stance && <div className="mt-2 text-center text-[11px] text-[#B08D57]">请先选择一个立场</div>}
          </div>
        </section>
      ) : (
        <>
          {/* 分析结果 */}
          <section className="mb-6">
            <SectionHeader eyebrow="Analysis" title="你的论证分析" action={<button onClick={reset} className="flex items-center gap-1 text-xs muted"><RotateCcw size={12} /> 重新思考</button>} />
            <div className="space-y-3">
              <div className="rounded-sm border border-[#793D36]/25 bg-[#793D36]/[.06] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#793D36]"><CheckCircle2 size={14} /> 你的核心立场</div>
                <div className="text-sm">{analysis.stanceLabel}</div>
              </div>
              <div className="rounded-sm glass p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#586044]"><Scale size={14} /> 你使用的道德原则</div>
                <div className="mb-2 text-sm font-semibold">{analysis.principleLabel}</div>
                <div className="text-xs leading-relaxed muted">{analysis.principleFeedback}</div>
              </div>
              {analysis.flaws.length > 0 && (
                <div className="rounded-sm border border-[#B08D57]/25 bg-[#B08D57]/[.06] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#B08D57]"><ShieldAlert size={14} /> 值得留意的论证漏洞</div>
                  {analysis.flaws.map((f, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <div className="text-sm font-semibold">{f.label}</div>
                      <div className="text-xs muted">{f.feedback}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="rounded-sm glass p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#A8874F]"><Lightbulb size={14} /> 论证结构</div>
                <div className="text-xs leading-relaxed" style={{ color: '#514332' }}>{analysis.structure.note}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`chip ${analysis.structure.hasReason ? '' : 'opacity-40'}`}>有明确理由</span>
                  <span className={`chip ${analysis.structure.hasConcrete ? '' : 'opacity-40'}`}>用了具体例子</span>
                  <span className={`chip ${analysis.structure.hasCounter ? '' : 'opacity-40'}`}>考虑了反面</span>
                </div>
              </div>
            </div>
          </section>

          {/* 逐层追问 */}
          <section className="mb-6">
            <SectionHeader eyebrow="Go Deeper" title="再往深处想一步" />
            <div className="space-y-3">
              {exp.followUps.slice(0, followIdx + 1).map((f, i) => (
                <div key={f.id} className="animate-fade-up rounded-sm glass p-4">
                  <div className="mb-2 flex items-start gap-2">
                    <span className="chip shrink-0">追问 {i + 1}</span>
                    <div className="flex-1 text-sm font-semibold leading-relaxed">{f.question}</div>
                  </div>
                  <div className="mb-3 text-xs muted">提示：{f.hint}</div>
                  <textarea className="field !py-2.5 !text-sm" placeholder="想一想，写下你的回应…" value={followAnswers[f.id] ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setFollowAnswers((s) => ({ ...s, [f.id]: v }))
                    }} />
                </div>
              ))}
              {followIdx < exp.followUps.length - 1 && (
                <button onClick={() => {
                  const next = followIdx + 1
                  setFollowIdx(next)
                  updateProgress((d) => { if (d.experimentAnswers[id]) d.experimentAnswers[id].followUpAnswers = followAnswers })
                }} className="btn-ghost w-full"><MessageCircleQuestion size={15} /> 接受追问，继续思考</button>
              )}
              {followIdx >= exp.followUps.length - 1 && (
                <button onClick={() => updateProgress((d) => { if (d.experimentAnswers[id]) d.experimentAnswers[id].followUpAnswers = followAnswers })}
                  className="btn-primary w-full"><CheckCircle2 size={16} /> 保存本轮思考</button>
              )}
            </div>
          </section>

          {/* 延伸问题 */}
          <section className="mb-6">
            <SectionHeader eyebrow="For Further Thought" title="延伸问题" />
            <div className="space-y-2">
              {exp.extensions.map((q, i) => (
                <div key={i} className="flex gap-2.5 rounded-sm glass-soft px-4 py-3 text-sm">
                  <span className="shrink-0 font-mono text-xs text-[#A8874F]">{String(i+1).padStart(2,'0')}</span><span>{q}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-sm border border-[#586044]/20 bg-[#586044]/[.05] p-3 text-xs leading-relaxed muted">
              <Sparkles size={13} className="mr-1 inline text-[#586044]" />
              这里没有标准答案。好的哲学思考不在于选『对』的一边，而在于能否说清理由、经得起反驳。
            </div>
          </section>
        </>
      )}
    </div>
  )
}

/** ===== 论证训练 ===== */
function DrillView({ id }: { id: string }) {
  const drill = argumentDrills.find((d) => `drill-${d.id}` === id)
  const [showAnswer, setShowAnswer] = useState(false)
  if (!drill) return <EmptyState icon={<GitBranch size={40} />} text="未找到该训练" />
  return (
    <div className="pad pt-5">
      <BackBar title="论证训练" to="/think?tab=drill" />
      <div className="mb-5"><span className="chip">难度 {'★'.repeat(drill.difficulty)}</span>
        <h1 className="mt-3 font-display text-2xl font-bold">{drill.title}</h1></div>
      <div className="mb-5 rounded-sm glass p-5 text-[15px] leading-[1.95]" style={{ color: '#514332' }}>{drill.passage}</div>
      <div className="mb-5 rounded-sm border border-[#793D36]/25 bg-[#793D36]/[.06] p-4 font-semibold">
        请先自己分析：结论是什么？前提有哪些？有没有隐藏假设？推理有效吗？
      </div>
      {!showAnswer ? <button onClick={() => setShowAnswer(true)} className="btn-primary w-full">查看结构化解析</button> : (
        <div className="animate-fade-up space-y-3">
          <div className="rounded-sm glass p-4"><div className="mb-2 text-xs font-bold text-[#793D36]">结论</div><div className="text-sm">{drill.conclusion}</div></div>
          <div className="rounded-sm glass p-4"><div className="mb-2 text-xs font-bold text-[#586044]">前提</div>{drill.premises.map((p,i)=><div key={i} className="flex gap-2 text-sm"><span className="font-mono text-xs muted">P{i+1}</span>{p}</div>)}</div>
          <div className="rounded-sm glass p-4"><div className="mb-2 text-xs font-bold text-[#A8874F]">隐藏假设</div>{drill.hiddenAssumptions.map((a,i)=><div key={i} className="text-sm">· {a}</div>)}</div>
          <div className="rounded-sm glass p-4"><div className="mb-2 text-xs font-bold text-[#B08D57]">推理有效性：{drill.validity === 'valid' ? '有效' : drill.validity === 'invalid' ? '无效' : '可争议'}</div><div className="text-sm">{drill.validityNote}</div></div>
          <div className="rounded-sm glass p-4"><div className="mb-2 text-xs font-bold text-[#586044]">可能的反例</div>{drill.counterExamples.map((c,i)=><div key={i} className="text-sm">· {c}</div>)}</div>
        </div>
      )}
    </div>
  )
}

/** ===== 立场辩论 ===== */
function DebateView({ id }: { id: string }) {
  const debate = debates.find((d) => `debate-${d.id}` === id)
  const p = useProgress()
  const [side, setSide] = useState<'pro' | 'con' | ''>('')
  const [argument, setArgument] = useState('')
  const saved = p.debateAnswers[id]
  useEffect(() => { if (saved) { setSide(saved.side); setArgument(saved.argument) } }, [id])
  if (!debate) return <EmptyState icon={<Swords size={40} />} text="未找到该辩论题" />
  const feedback = saved ? evaluateDebate(saved) : null
  const submit = () => {
    if (!side || argument.trim().length < 10) return
    updateProgress((d) => {
      const base = { side: side as 'pro'|'con', argument: argument.trim(), at: Date.now() }
      d.debateAnswers[id] = { ...base, feedback: evaluateDebate(base) }
      logActivity(d, 'debate', id, `立场辩论 · ${debate.title}`)
    })
  }
  return (
    <div className="pad pt-5">
      <BackBar title="立场辩论" to="/think?tab=debate" />
      <div className="mb-5"><span className="chip"><Swords size={12} className="mr-1" />DEBATE</span>
        <h1 className="mt-3 font-display text-2xl font-bold">{debate.title}</h1>
        <p className="mt-2 text-sm muted">{debate.question}</p></div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-sm border border-[#793D36]/25 bg-[#793D36]/[.05] p-4">
          <div className="mb-2 text-xs font-bold text-[#793D36]">正方</div>
          <div className="mb-2 text-sm font-semibold">{debate.pro.claim}</div>
          {debate.pro.arguments.map((a,i)=><div key={i} className="mb-1 text-xs muted">· {a}</div>)}
        </div>
        <div className="rounded-sm border border-[#A8874F]/25 bg-[#A8874F]/[.05] p-4">
          <div className="mb-2 text-xs font-bold text-[#A8874F]">反方</div>
          <div className="mb-2 text-sm font-semibold">{debate.con.claim}</div>
          {debate.con.arguments.map((a,i)=><div key={i} className="mb-1 text-xs muted">· {a}</div>)}
        </div>
      </div>
      <section className="mb-5">
        <div className="mb-2 text-sm font-bold">选择你的立场</div>
        <div className="grid grid-cols-2 gap-2">
          {(['pro','con'] as const).map((s)=>(
            <button key={s} onClick={()=>!saved && setSide(s)} className={`rounded-sm py-2.5 text-sm font-semibold transition ${side===s?'ring-1':'glass-soft muted'}`}
              style={side===s?{background:(s==='pro'?'#793D36':'#A8874F')+'25',color:s==='pro'?'#793D36':'#793D36',borderColor:(s==='pro'?'#793D36':'#A8874F')+'88'}:{}}>
              {s==='pro'?'支持正方':'支持反方'}
            </button>
          ))}
        </div>
      </section>
      <section className="mb-5">
        <div className="mb-2 text-sm font-bold">构建你的论证</div>
        <textarea className="field" rows={6} placeholder="陈述你的主张、给出理由、回应可能的反对意见。评价依据是论证质量，而非你站在哪一边。" value={argument} onChange={(e)=>setArgument(e.target.value)} disabled={!!saved} />
        {!saved ? <button onClick={submit} disabled={!side||argument.trim().length<10} className="btn-primary mt-3 w-full">提交论证</button>
          : <button onClick={()=>{updateProgress(d=>{delete d.debateAnswers[id]});setSide('');setArgument('')}} className="btn-ghost mt-3 w-full">重写论证</button>}
      </section>
      {feedback && (
        <section className="animate-fade-up mb-5">
          <SectionHeader eyebrow="Feedback" title="论证质量反馈" />
          <div className="space-y-3">
            {([['完整性','completeness','#793D36'],['逻辑一致性','consistency','#A8874F'],['证据质量','evidence','#586044'],['反驳能力','rebuttal','#B08D57']] as const).map(([label,key,color])=>(
              <div key={key} className="rounded-sm glass p-3">
                <div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span style={{color}}>{feedback[key]}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#C4AB82]"><div className="h-full rounded-full" style={{width:`${feedback[key]}%`,background:color}}/></div>
              </div>
            ))}
            <div className="rounded-sm glass p-4 text-xs leading-relaxed muted">
              评分只看论证质量：是否给出明确主张与理由、推理是否连贯、有无具体支撑、是否回应了反方。你的立场本身不会影响分数。
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/** ===== 哲学写作 ===== */
function WritingView({ id }: { id: string }) {
  const prompt = writingPrompts.find((w) => `write-${w.id}` === id)
  const p = useProgress()
  const existing = p.writings.find((w) => w.promptId === id)
  const [title, setTitle] = useState(existing?.title ?? '')
  const [content, setContent] = useState(existing?.content ?? '')
  const [saved, setSaved] = useState(false)
  if (!prompt) return <EmptyState icon={<PenLine size={40} />} text="未找到该写作题" />
  const save = () => {
    if (!content.trim()) return
    updateProgress((d) => {
      const now = Date.now()
      if (existing) {
        const w = d.writings.find((x) => x.promptId === id)!
        w.versions.push({ content: w.content, at: now })
        w.content = content; w.title = title; w.updatedAt = now
      } else {
        d.writings.unshift({ id: `w-${now}`, promptId: id, title: title || prompt.title, content, versions: [], createdAt: now, updatedAt: now })
      }
      logActivity(d, 'writing', id, `哲学写作 · ${title || prompt.title}`)
    })
    setSaved(true); setTimeout(()=>setSaved(false), 2000)
  }
  return (
    <div className="pad pt-5">
      <BackBar title="哲学写作" to="/think?tab=writing" />
      <div className="mb-5"><span className="chip">难度 {'★'.repeat(prompt.difficulty)}</span>
        <h1 className="mt-3 font-display text-2xl font-bold">{prompt.title}</h1>
        <p className="mt-2 text-sm muted">{prompt.description}</p></div>
      <section className="mb-5 rounded-sm glass p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#793D36]"><BookOpen size={14}/>写作指引</div>
        {prompt.guidance.map((g,i)=><div key={i} className="mb-1 text-xs" style={{color:'#514332'}}>· {g}</div>)}
        <div className="mt-2 text-[11px] muted">建议篇幅 {prompt.minWords} 字以上</div>
      </section>
      <input className="field mb-3" placeholder="给这篇文章起个标题" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <textarea className="field !min-h-[280px]" placeholder="开始写作。哲学写作的核心是说清楚：我主张什么、为什么、有什么反对意见、我如何回应。" value={content} onChange={(e)=>setContent(e.target.value)} />
      <div className="mt-2 flex justify-between text-[11px] muted"><span>{content.length} 字</span><span>{existing ? `已保存 ${existing.versions.length} 个历史版本` : '尚未保存'}</span></div>
      <button onClick={save} disabled={!content.trim()} className="btn-primary mt-3 w-full"><PenLine size={16}/>{saved ? '已保存 ✓' : '保存草稿'}</button>
    </div>
  )
}

export default function ExperimentPage() {
  const { id } = useParams()
  if (!id) return <EmptyState icon={<FlaskConical size={40}/>} text="未找到内容" />
  if (id.startsWith('drill-')) return <DrillView id={id} />
  if (id.startsWith('debate-')) return <DebateView id={id} />
  if (id.startsWith('write-')) return <WritingView id={id} />
  return <ExperimentView id={id} />
}

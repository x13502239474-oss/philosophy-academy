import type { ThoughtExperiment, DebateAnswer } from '../types'

/** 分析用户在思想实验中的立场与论证——不给标准答案，只揭示逻辑结构 */
export function analyzeExperiment(exp: ThoughtExperiment, stanceId: string, reason: string) {
  const text = reason || ''
  const hit = (keywords: string[]) => keywords.some((k) => text.includes(k))

  const principles = exp.principleKeywords.filter((p) => hit(p.keywords))
  const flaws = exp.flawKeywords.filter((f) => hit(f.keywords))

  const stance = exp.stances.find((s) => s.id === stanceId)
  const hasReason = text.trim().length >= 12
  const hasConcrete = /例如|比如|如果|假设|假如|就像|想象/.test(text)
  const hasCounter = /但是|然而|不过|反对|虽然|除非|尽管/.test(text)

  return {
    stanceLabel: stance?.label ?? '未明确立场',
    principleLabel: principles.length ? principles.map((p) => p.label).join(' / ') : '尚未清晰表达所用原则',
    principleFeedback: principles.length
      ? principles.map((p) => p.feedback).join(' ')
      : '你的理由里还没有出现可辨认的道德原则。试着问自己：我到底在保护什么价值？是大多数人的利益、个人的权利，还是某种品质？',
    flaws: flaws.map((f) => ({ label: f.label, feedback: f.feedback })),
    structure: {
      hasReason,
      hasConcrete,
      hasCounter,
      note: !hasReason
        ? '理由还太简短。哲学论证的价值在于把「我觉得」变成「因为……所以我主张……」。'
        : hasCounter
          ? '你已经主动考虑了相反情形，这是很强的哲学习惯——它让你的论证更难被推翻。'
          : hasConcrete
            ? '你用了具体例子支撑观点，很好。下一步可以试着想：有没有一个例子会让你的原则得出你不想要的结论？'
            : '试着补一个具体情境或反例，让别人能沿着你的推理走一遍。',
    },
  }
}

/** 立场辩论评价：按论证质量四维评分，不按立场对错 */
export function evaluateDebate(answer: DebateAnswer): DebateAnswer['feedback'] {
  const text = answer.argument || ''
  const sentences = text.split(/[。！？!?]/).filter((s) => s.trim().length > 4)
  const len = text.trim().length

  const connective = /因为|所以|由于|因此|假如|如果|既然|倘若|鉴于|由此/.test(text)
  const evidence = /例如|比如|事实|研究|数据|经验|案例|想象|假设/.test(text)
  const rebuttal = /反对|然而|但是|对方|有人会说|可能认为|尽管|诚然/.test(text)
  const conclusion = /我认为|我主张|我的立场是|结论是|因此我/.test(text)

  const completeness = Math.min(100, 30 + sentences.length * 12 + (conclusion ? 20 : 0))
  const consistency = Math.min(100, 40 + (connective ? 30 : 0) + (conclusion ? 20 : 0) + (sentences.length >= 3 ? 10 : 0))
  const evidenceScore = Math.min(100, 25 + (evidence ? 40 : 0) + (len > 120 ? 20 : 0) + (len > 220 ? 15 : 0))
  const rebuttalScore = Math.min(100, 20 + (rebuttal ? 55 : 0) + (sentences.length >= 4 ? 25 : 0))

  return {
    completeness,
    consistency,
    evidence: evidenceScore,
    rebuttal: rebuttalScore,
  }
}

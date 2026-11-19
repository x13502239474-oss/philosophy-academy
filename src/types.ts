// ===== PHILOSOPHY ACADEMY 数据契约 =====

/** 教材来源标识 */
export type SourceBook = 'bigquestions' | 'history' | 'thought' | 'extension'

export interface SourceRef {
  book: SourceBook
  /** 章节/篇名（真实教材章节，不得虚构页码） */
  chapter?: string
  /** 平台扩展内容标注 */
  note?: string
}

/** 章节测验题 */
export interface QuizQuestion {
  id: string
  type: 'single' | 'judge'
  stem: string
  options?: string[]
  answer: number | boolean
  explanation: string
}

/** 练习详解四段式 */
export interface Exercise {
  id: string
  /** 题型：概念理解 / 论证分析 / 理论比较 / 开放思考 */
  kind?: string
  question: string
  answer: string
  reasoning: string
  demonstration: string
  pitfall: string
  /** 开放题的多种合理论证方向（不设唯一答案） */
  directions?: string[]
}

/** 经典文本解读（第 5 段：原著观点与关键命题） */
export interface TextReading {
  /** 真实书名，如《理想国》《纯粹理性批判》 */
  work: string
  /** 真实定位（篇名/卷次/章节名），不得编造页码 */
  locator: string
  /** 该处原文的核心主张（用自己的话概述，不长段照抄） */
  gist: string
  /** 解读：这段为什么关键、容易误读在哪 */
  analysis: string
}

/** 理论单元：八段式深度展开 */
export interface TheoryUnit {
  heading: string
  /** 1 哲学问题：这位哲学家想回答什么，为什么重要 */
  problem: string
  /** 2 思想背景：时代处境、既有理论、他要解决的思想困难 */
  background: string
  /** 3 核心命题：准确表述（可多条，不用一句话打发复杂理论） */
  thesis: string
  /** 4 论证过程：前提 */
  premises: string[]
  /** 4 论证过程：推理步骤 */
  reasoning: string
  /** 4 论证过程：结论 */
  conclusion: string
  /** 4 论证依赖的隐含假设 */
  assumptions: string[]
  /** 5 经典文本解读 */
  texts: TextReading[]
  /** 6 反对意见：谁、怎么批、批得成立吗 */
  objections: { by: string; claim: string; verdict: string }[]
  /** 7 理论影响 */
  influence: string
  /** 8 独立思考 */
  thinking: string[]
}

/** 原著阅读训练 */
export interface ReadingGuide {
  title: string
  /** 建议阅读的原著与位置 */
  work: string
  /** 阅读前需要理解的背景 */
  before: string
  /** 重点概念 */
  keyConcepts: string[]
  /** 核心命题 */
  corePropositions: string[]
  /** 重点段落解析：先现代汉语解释，再析论证 */
  passage: { modern: string; analysis: string }
  /** 阅读难点 */
  difficulties: string[]
  /** 思想脉络梳理 */
  thread: string
  /** 阅读后的思考题 */
  questions: string[]
}

/** 横向比较（哲学家之间 / 流派之间） */
export interface Comparison {
  title: string
  /** 他们在什么问题上真正分歧 */
  question: string
  sides: { label: string; thesis: string; argument: string; strength: string; limit: string }[]
  /** 比较后的判断：分歧的真实所在 */
  takeaway: string
}

/** 统一章节结构（十二段式深度教学） */
export interface Lesson {
  id: string
  moduleId: string
  order: number
  title: string
  subtitle?: string
  duration: number // 预计分钟
  source: SourceRef
  /** 1 本章导读 */
  intro?: string
  /** 2 学习目标 */
  objectives: string[]
  /** 3 核心问题 */
  coreQuestions: string[]
  /** 4 历史与思想背景（3 段） */
  background: string[]
  /** 5 关键概念（概念词典 id 引用） */
  conceptIds: string[]
  /** 6 哲学理论系统讲解（八段式单元） */
  theories: TheoryUnit[]
  /** 7 代表性哲学家（档案 id 引用） */
  philosopherIds: string[]
  /** 8 经典论证重构 */
  arguments: { label: string; premises: string[]; conclusion: string; note?: string }[]
  /** 9 原著阅读训练 */
  readings: ReadingGuide[]
  /** 10 横向比较 */
  comparisons: Comparison[]
  /** 11 现实案例 */
  cases: { title: string; body: string; question: string }[]
  /** 12 现实意义与延伸思考 */
  significance: string[]
  /** 13 思考练习（≥5 题，四段式详解） */
  exercises: Exercise[]
  /** 14 本章知识体系总结 */
  summary: string
  /** 15 章节测验 */
  quiz: QuizQuestion[]
}

/** 课程模块 */
export interface CourseModule {
  id: string
  order: number
  title: string
  enTitle: string
  tagline: string
  description: string
  icon: string // lucide icon name
  color: string
  lessonIds: string[]
  source: SourceBook[]
}

/** 哲学家档案 */
export interface Philosopher {
  id: string
  name: string
  enName: string
  era: string
  period: 'ancient' | 'medieval' | 'modern' | 'german' | 'contemporary'
  school: string
  years?: string
  bio: string
  coreIdeas: string[]
  works: string[]
  keyConcepts: string[]
  arguments: { label: string; summary: string }[]
  influenced: string[] // 影响的哲学家 id
  influencedBy: string[] // 受其影响的哲学家 id
  criticisms: string[]
  modernRelevance: string
  source: SourceRef
  color: string
}

/** 概念词典 */
export interface Concept {
  id: string
  zh: string
  en: string
  plain: string
  definition: string
  philosopherIds: string[]
  theoryIds: string[]
  example: string
  relatedIds: string[]
  category: '形而上学' | '认识论' | '伦理学' | '政治哲学' | '心灵哲学' | '逻辑学' | '方法论'
}

/** 思想实验 */
export interface ThoughtExperiment {
  id: string
  order: number
  title: string
  enTitle: string
  category: string
  icon: string
  color: string
  readingTime: number
  source: SourceRef
  /** 情境介绍 */
  scenario: string[]
  /** 核心问题 */
  question: string
  /** 不同立场 */
  stances: { id: string; label: string; summary: string; principle: string }[]
  /** 支持论证 */
  supportArguments: { stanceId: string; label: string; premises: string[]; conclusion: string }[]
  /** 反对论证 */
  counterArguments: { stanceId: string; label: string; premises: string[]; conclusion: string }[]
  /** 追问链（用户回答后逐步深入） */
  followUps: { id: string; question: string; hint: string }[]
  /** 延伸问题 */
  extensions: string[]
  /** 立场分析关键词映射：关键词 -> 原则标签 */
  principleKeywords: { keywords: string[]; label: string; feedback: string }[]
  /** 常见逻辑漏洞检测 */
  flawKeywords: { keywords: string[]; label: string; feedback: string }[]
  tags: string[]
}

/** 每日哲学问题 */
export interface DailyQuestion {
  id: string
  question: string
  category: string
  hint: string
  perspectives: string[]
}

/** 论证训练题 */
export interface ArgumentDrill {
  id: string
  title: string
  passage: string
  /** 结构化分析答案 */
  conclusion: string
  premises: string[]
  hiddenAssumptions: string[]
  validity: 'valid' | 'invalid' | 'debatable'
  validityNote: string
  counterExamples: string[]
  difficulty: 1 | 2 | 3
}

/** 立场辩论题 */
export interface Debate {
  id: string
  title: string
  question: string
  pro: { claim: string; arguments: string[] }
  con: { claim: string; arguments: string[] }
  keyPoints: string[] // 评价要点
}

/** 哲学写作题 */
export interface WritingPrompt {
  id: string
  title: string
  difficulty: 1 | 2 | 3
  description: string
  guidance: string[]
  minWords: number
}

/** 阶段考试 */
export interface Exam {
  id: string
  title: string
  description: string
  questionIds: string[] // 引用各章测验题
}

// ===== 用户学习数据（与课程内容分离） =====

export interface UserProgress {
  completedLessons: string[]
  quizResults: Record<string, { correct: boolean; at: number }>
  experimentAnswers: Record<string, ExperimentAnswer>
  dailyAnswers: Record<string, { date: string; text: string; at: number }>
  notes: Record<string, Note[]>
  favorites: string[] // concept ids / lesson ids
  wrongQuestions: string[]
  writings: WritingDraft[]
  debateAnswers: Record<string, DebateAnswer>
  drillAnswers: Record<string, DrillAnswer>
  learningHistory: HistoryEntry[]
  streak: { lastDate: string; days: number }
  totalMinutes: number
  examResults: Record<string, { score: number; total: number; at: number }>
}

export interface ExperimentAnswer {
  stanceId: string
  reason: string
  at: number
  followUpAnswers?: Record<string, string>
  analysisSeen?: boolean
}

export interface Note {
  id: string
  targetId: string
  text: string
  at: number
}

export interface WritingDraft {
  id: string
  promptId: string
  title: string
  content: string
  versions: { content: string; at: number }[]
  createdAt: number
  updatedAt: number
}

export interface DebateAnswer {
  side: 'pro' | 'con'
  argument: string
  at: number
  feedback?: { completeness: number; consistency: number; evidence: number; rebuttal: number }
}

export interface DrillAnswer {
  conclusion: string
  premises: string
  assumptions: string
  validity: string
  counterExamples: string
  at: number
}

export interface HistoryEntry {
  id: string
  type: 'lesson' | 'quiz' | 'experiment' | 'writing' | 'daily' | 'debate' | 'drill' | 'exam'
  targetId: string
  title: string
  at: number
}

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
  question: string
  answer: string
  reasoning: string
  demonstration: string
  pitfall: string
}

/** 统一章节结构（十段式教学） */
export interface Lesson {
  id: string
  moduleId: string
  order: number
  title: string
  subtitle?: string
  duration: number // 预计分钟
  source: SourceRef
  /** 1 学习目标 */
  objectives: string[]
  /** 2 核心问题 */
  coreQuestions: string[]
  /** 3 关键概念（概念词典 id 引用） */
  conceptIds: string[]
  /** 4 哲学理论（段落，可含小标题用 ### ） */
  theories: { heading: string; body: string; premises?: string[] }[]
  /** 5 代表性哲学家（档案 id 引用） */
  philosopherIds: string[]
  /** 6 经典论证 */
  arguments: { label: string; premises: string[]; conclusion: string; note?: string }[]
  /** 7 现实案例 */
  cases: { title: string; body: string; question: string }[]
  /** 8 思考练习（四段式详解） */
  exercises: Exercise[]
  /** 9 本章总结 */
  summary: string
  /** 10 章节测验 */
  quiz: QuizQuestion[]
  /** 导语 */
  intro?: string
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

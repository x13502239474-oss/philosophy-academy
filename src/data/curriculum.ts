import type { CourseModule, Lesson } from '../types'
import { part1Lessons } from './parts/part1'
import { part2Lessons } from './parts/part2'
import { part3Lessons } from './parts/part3'
import { part4Lessons } from './parts/part4'
import { part5Lessons } from './parts/part5'
import { part6Lessons } from './parts/part6'
import { part7Lessons } from './parts/part7'
import { part8Lessons } from './parts/part8'

/**
 * 八大部分课程模块
 * 内容依据：《大问题：简明哲学导论》《西方哲学简史》《做哲学：88个思想实验中的哲学导论》
 */
export const modules: CourseModule[] = [
  {
    id: 'm1',
    order: 1,
    title: '哲学基础与哲学史',
    enTitle: 'Foundations & History',
    tagline: '先看清这门学问在问什么，再走进它的历史',
    description:
      '哲学不是一堆观点，而是一套提问与论证的手艺。这一部分先界定哲学的研究对象与问题类型，再顺着希腊的起源、苏格拉底的诘问、柏拉图的理念、亚里士多德的体系一路走到中世纪与近代的转折，给你一条能站住的时间线。',
    icon: 'Compass',
    color: '#4B9EFF',
    lessonIds: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'],
    source: ['bigquestions', 'history'],
  },
  {
    id: 'm2',
    order: 2,
    title: '形而上学与本体论',
    enTitle: 'Metaphysics & Ontology',
    tagline: '世界究竟由什么构成，什么才算真正存在',
    description:
      '从「存在是什么」这个最拗口也最根本的问题出发，处理实体与属性、物质与精神、身心关系、因果、自由意志、时空与可能世界。这里没有可以背完的结论，只有一条条必须自己走一遍的论证。',
    icon: 'Atom',
    color: '#8C7CFF',
    lessonIds: ['l8', 'l9', 'l10', 'l11', 'l12', 'l13', 'l14'],
    source: ['bigquestions', 'history', 'thought'],
  },
  {
    id: 'm3',
    order: 3,
    title: '认识论',
    enTitle: 'Epistemology',
    tagline: '你的「我知道」，到底凭什么成立',
    description:
      '知识的三分定义与盖梯尔反例、四种真理理论、从皮浪到缸中之脑的怀疑论、理性主义与经验主义的来源之争、归纳问题与绿蓝悖论、认识的边界与科学合理性。学完你会对自己的每一个信念多问一句：理由够吗。',
    icon: 'Eye',
    color: '#43D9D0',
    lessonIds: ['l15', 'l16', 'l17', 'l18', 'l19', 'l20'],
    source: ['bigquestions', 'history', 'thought'],
  },
  {
    id: 'm4',
    order: 4,
    title: '近代西方哲学',
    enTitle: 'Early Modern Philosophy',
    tagline: '当哲学把问题从世界转向认识世界的人',
    description:
      '笛卡尔的怀疑与「我思」、斯宾诺莎的实体一元论、莱布尼茨的单子、洛克的白板、贝克莱与休谟的彻底化，最后收在一场正面交锋里：理性主义与经验主义究竟在争什么，康德又如何把这场争论改写。',
    icon: 'BookOpen',
    color: '#5EC8F5',
    lessonIds: ['l21', 'l22', 'l23', 'l24', 'l25'],
    source: ['history', 'bigquestions'],
  },
  {
    id: 'm5',
    order: 5,
    title: '德国古典哲学',
    enTitle: 'German Idealism',
    tagline: '先天综合判断、物自体与绝对精神',
    description:
      '康德用「先天综合判断如何可能」重构了整个知识论，又用定言命令重构了道德；黑格尔则把辩证法推向历史与精神。这一部分是现代哲学的发动机，也是读懂现象学与马克思的前提。',
    icon: 'Brain',
    color: '#A78BFA',
    lessonIds: ['l26', 'l27', 'l28', 'l29', 'l30'],
    source: ['history', 'bigquestions'],
  },
  {
    id: 'm6',
    order: 6,
    title: '伦理学',
    enTitle: 'Ethics',
    tagline: '对错这把尺子，究竟从哪来',
    description:
      '先给道德判断做地形测绘，再逐一拆开三大理论：义务论的普遍化检验、功利主义的后果计算、美德伦理的品格与中道。每一条都给出最强论证与最强反驳，再让你自己判断。',
    icon: 'Scale',
    color: '#4FC3A1',
    lessonIds: ['l31', 'l32', 'l33', 'l34', 'l35'],
    source: ['bigquestions', 'thought'],
  },
  {
    id: 'm7',
    order: 7,
    title: '政治哲学',
    enTitle: 'Political Philosophy',
    tagline: '权力凭什么正当，个体欠国家什么',
    description:
      '国家为什么存在、权力如何取得合法性、自然状态与社会契约的四种版本、自由与平等的冲突、罗尔斯与诺齐克的正面对撞，最后落到公民义务与反抗的边界，以及马克思的国家批判。',
    icon: 'Landmark',
    color: '#7E9BFF',
    lessonIds: ['l36', 'l37', 'l38', 'l39', 'l40'],
    source: ['bigquestions', 'history'],
  },
  {
    id: 'm8',
    order: 8,
    title: '现代哲学',
    enTitle: 'Modern Philosophy',
    tagline: '现象学、存在主义、语言转向与思想实验',
    description:
      '现象学的方法、存在主义对人生意义的追问、分析哲学的语言转向、解释学与后现代的争论、实用主义的真理观，最后回到两件能带走的手艺：如何分析论证，如何构造与批评一个思想实验，如何写哲学。',
    icon: 'Globe',
    color: '#C084FC',
    lessonIds: ['l41', 'l42', 'l43', 'l44', 'l45', 'l46', 'l47'],
    source: ['history', 'thought', 'bigquestions'],
  },
]

/** 全部章节（八部分按序拼接） */
export const lessons: Lesson[] = [
  ...part1Lessons,
  ...part2Lessons,
  ...part3Lessons,
  ...part4Lessons,
  ...part5Lessons,
  ...part6Lessons,
  ...part7Lessons,
  ...part8Lessons,
]

/** 章节在全书中的序号（1 起） */
export function lessonNumber(id: string): number {
  return lessons.findIndex((l) => l.id === id) + 1
}

# 课程编写契约（所有章节编写者必读）

本文件是 PHILOSOPHY ACADEMY 课程扩充的唯一口径。字段定义以 `src/types.ts` 为准，本文件补充「该写什么」。

## 一、八部分 / 47 章目录（不许改 id、标题、所属部分）

| 部分 | 模块 id | 章 id | 标题 | 教材出处 |
|---|---|---|---|---|
| 一 哲学基础与哲学史 | m1 | l1 | 哲学的研究对象：哲学究竟在追问什么 | 大问题·导言「做哲学」 |
| 一 | m1 | l2 | 哲学、科学与宗教：三种看世界的方式 | 大问题·导言+第一章 |
| 一 | m1 | l3 | 西方哲学的起源：从神话到逻各斯 | 简史·希腊哲学的精神和特征 |
| 一 | m1 | l4 | 苏格拉底：诘问、无知与德性 | 简史·苏格拉底 |
| 一 | m1 | l5 | 柏拉图：理念论与洞穴 | 简史·柏拉图；大问题·第四章 |
| 一 | m1 | l6 | 亚里士多德：四因说、实体与目的论 | 简史·亚里士多德 |
| 一 | m1 | l7 | 中世纪哲学与近代哲学的兴起 | 简史·中世纪哲学；近代哲学 |
| 二 形而上学与本体论 | m2 | l8 | 存在问题：存在是什么 | 大问题·第四章；简史·巴门尼德 |
| 二 | m2 | l9 | 实体与属性、实在与现象 | 大问题·第四章 |
| 二 | m2 | l10 | 物质与精神：唯物主义与唯心主义 | 大问题·第四章 |
| 二 | m2 | l11 | 身心关系：二元论、同一论与意识难题 | 做哲学·第2章 心一身问题 |
| 二 | m2 | l12 | 因果关系：休谟的炸弹与康德的回应 | 大问题·第四章 |
| 二 | m2 | l13 | 自由意志与决定论 | 大问题·第七章 自由 |
| 二 | m2 | l14 | 时间、空间与可能世界 | 大问题·第四章；平台扩展 |
| 三 认识论 | m3 | l15 | 知识的定义：从 JTB 到盖梯尔问题 | 大问题·第五章；做哲学·第7章 |
| 三 | m3 | l16 | 真理理论：符合、融贯与实用 | 大问题·第五章 |
| 三 | m3 | l17 | 怀疑主义：从皮浪到缸中之脑 | 做哲学·第7章 怀疑论问题与知识 |
| 三 | m3 | l18 | 理性主义与经验主义：知识的来源之争 | 简史·洛克/休谟 |
| 三 | m3 | l19 | 归纳问题与绿蓝悖论 | 简史·休谟；平台扩展 |
| 三 | m3 | l20 | 认识的边界与科学知识的合理性 | 大问题·第五章；平台扩展 |
| 四 近代西方哲学 | m4 | l21 | 笛卡尔：怀疑方法、我思与上帝 | 简史·笛卡尔 |
| 四 | m4 | l22 | 斯宾诺莎与莱布尼茨：理性主义的两条路 | 简史·斯宾诺莎/莱布尼茨 |
| 四 | m4 | l23 | 洛克：经验主义的奠基 | 简史·洛克 |
| 四 | m4 | l24 | 贝克莱与休谟：经验主义的彻底化 | 简史·贝克莱/休谟 |
| 四 | m4 | l25 | 理性主义与经验主义之争：横向比较 | 简史；大问题·第五章 |
| 五 德国古典哲学 | m5 | l26 | 康德：先天综合判断如何可能 | 简史·康德 |
| 五 | m5 | l27 | 先验感性论与知性：现象与物自体 | 简史·康德 |
| 五 | m5 | l28 | 实践理性与道德法则：定言命令 | 简史·康德；大问题·第八章 |
| 五 | m5 | l29 | 黑格尔：辩证法与《精神现象学》 | 简史·黑格尔 |
| 五 | m5 | l30 | 德国古典哲学的影响：从费希特到马克思 | 简史·费希特/谢林/黑格尔 |
| 六 伦理学 | m6 | l31 | 道德哲学的基本问题：道德判断有客观标准吗 | 大问题·第八章 |
| 六 | m6 | l32 | 义务论：康德伦理学的展开与困境 | 大问题·第八章 |
| 六 | m6 | l33 | 功利主义：边沁、密尔与当代后果论 | 大问题·第八章 |
| 六 | m6 | l34 | 美德伦理学：从亚里士多德到当代复兴 | 大问题·第八章 |
| 六 | m6 | l35 | 道德相对主义、自由与责任、公正与善 | 大问题·第八章；做哲学·第5章 |
| 七 政治哲学 | m7 | l36 | 国家、权力与政治合法性 | 大问题·第九章 正义和好的社会 |
| 七 | m7 | l37 | 自然状态与社会契约：霍布斯 | 简史·霍布斯；大问题·第九章 |
| 七 | m7 | l38 | 洛克与卢梭：自由、财产与公意 | 简史·洛克/卢梭 |
| 七 | m7 | l39 | 自由主义、平等与正义：罗尔斯与诺齐克 | 大问题·第九章；平台扩展 |
| 七 | m7 | l40 | 个体与国家：公民义务、反抗与马克思的批判 | 大问题·第九章；简史·马克思 |
| 八 现代哲学 | m8 | l41 | 现象学：胡塞尔、海德格尔与生活世界 | 简史·胡塞尔/海德格尔 |
| 八 | m8 | l42 | 存在主义：克尔凯郭尔、尼采、萨特与人生意义 | 简史；大问题·第二章 生活的意义 |
| 八 | m8 | l43 | 分析哲学与语言哲学：弗雷格、罗素、维特根斯坦 | 简史·罗素/维特根斯坦 |
| 八 | m8 | l44 | 解释学与后现代：伽达默尔、福柯、德里达 | 简史·现代哲学；平台扩展 |
| 八 | m8 | l45 | 实用主义：皮尔士、詹姆斯、杜威 | 简史·现代哲学；平台扩展 |
| 八 | m8 | l46 | 逻辑、论证与批判性思维 | 做哲学·逻辑准备/非形式谬误 |
| 八 | m8 | l47 | 方法论收束：思想实验、论证重构与哲学写作 | 做哲学·思想实验章；大问题·附录 写作哲学 |

## 二、每章必填字段（Lesson）

| 字段 | 要求 |
|---|---|
| id / moduleId / order | 严格照上表；order 为本章在本部分内的序号（1 起） |
| title / subtitle | title 照上表；subtitle 是一句有张力的小标题（10-20 字） |
| duration | 25-40（深度章增长，写 30-40） |
| source | `{ book, chapter, note? }`，book 只能是 bigquestions / history / thought / extension；chapter 用上表教材出处中的真实章节名（可分号列两本）；平台补充内容必须在 note 里注明「平台扩展」 |
| intro | 120-200 字本章导读，从具体处境切入，不喊口号 |
| objectives | 4 条，可观测行为动词（能重构/能区分/能评价/能指出） |
| coreQuestions | 4 条本章要回答的问题 |
| background | 3 段历史与思想背景，每段 120-200 字：时代处境、既有理论、他要解决的思想困难 |
| conceptIds | 4-6 个，只能用第三节列出的 id |
| theories | **3 个** TheoryUnit，全部字段写满（见下） |
| philosopherIds | 3-5 个，只能用第四节列出的 id |
| arguments | 2 个经典论证（label / premises 2-4 条 / conclusion / note 指出该论证的软肋） |
| readings | 1-2 个 ReadingGuide（原著阅读训练） |
| comparisons | 1 个 Comparison（横向比较，sides 必须 2-3 方） |
| cases | 1-2 个现实案例（title / body 80-150 字 / question） |
| significance | 2-3 条现实意义与延伸思考 |
| exercises | **5 题**，kind 依次覆盖「概念理解」「论证分析」「理论比较」「开放思考」+1 道综合；四段式 answer/reasoning/demonstration/pitfall 全部写实；开放与综合题必须给 directions（2-4 条不同方向的合理论证路径） |
| summary | 200-300 字知识体系总结（不是复述标题，要点出本章几条线如何咬合） |
| quiz | 4 题：type single（4 选项、answer 为正确项索引 0-3）或 judge（answer 为 boolean），每题 explanation 50 字以上 |

## 三、概念 id 白名单（conceptIds 只能用这些）

已存在：ontology epistemology metaphysics phenomenology existentialism empiricism rationalism utilitarianism deontology relativism determinism freeWill materialism idealism skepticism realism nihilism dualism identity causality aPriori categoryMistake falsification socialContract justice alienation willToPower intersubjectivity

本章扩充将新增（可直接使用）：
substance attribute forms fourCauses hylomorphism tabulaRasa monad interactionism qualia intentionality categoricalImperative eudaimonia virtue consequentialism induction syntheticAPriori noumenon transcendentalIdealism dialectic historicalMaterialism stateOfNature generalWill veilOfIgnorance distributiveJustice lifeworld dasein badFaith absurd languageGame paradigm hermeneutics deconstruction pragmatism thoughtExperiment validity fallacy gettier otherMinds personalIdentity compatibilism possibleWorlds teleology essence being

用法：每章 4-6 个，选最能代表本章论证结构的，别凑数。

## 四、哲学家 id 白名单（philosopherIds 只能用这些）

已存在：thales pythagoras heraclitus parmenides socrates plato aristotle epicurus zeno augustine anselm aquinas ockham hobbes descartes spinoza leibniz locke berkeley hume rousseau kant fichte hegel schopenhauer kierkegaard nietzsche marx husserl heidegger sartre russell wittgenstein rawls dewey

本章扩充将新增：democritus protagoras pyrrho bentham mill frege moore popper kuhn quine goodman parfit searle gadamer foucault derrida peirce james nozick schelling

## 五、TheoryUnit 八段写法（核心要求）

```
heading: 「柏拉图的理念论」——给这一节一个可读的名字，不要只写人名
problem:   他试图回答什么问题？这个问题为什么重要（1-2 句点出争点）
background: 他面对的是什么既有理论/思想困难？他要反驳谁、继承谁
thesis:    核心命题，准确、不用一句话打发复杂理论（2-4 句）
premises:  论证的前提 2-4 条（陈述句）
reasoning: 推理过程：从前提如何走到结论，中间关键步骤是什么（80-150 字）
conclusion:结论一句
assumptions: 该论证依赖的隐含假设 2-3 条（这是训练重点，必须具体）
texts:     1-2 条 TextReading（work 真实书名，locator 真实篇名，gist 用自己的话概述，analysis 指出关键与易误读处）
objections:2-3 条 { by: 谁（可用中文名+id 提示）, claim: 批评是什么, verdict: 这批评成立吗/在哪成立在哪不成立 }
influence: 该思想如何影响后来的哲学、政治、伦理、科学（80-150 字）
thinking:  2-3 个能引发真思考的问题（不给答案）
```

## 六、准确性铁律

1. 不虚构书名、篇名、章节位置；不编造原文引文；如需引原话，只用你确有把握的短句并标注篇名，宁可用「大意是」改写。
2. 不把不同哲学家的观点混为一谈；不把后人的解释冒充哲学家原话。
3. 有学术争议（如「康德物自体是否可知」「亚里士多德的形式是否个别」）必须写「主要有两种解释……」并说明分歧，不许当成唯一结论。
4. 通俗化不许扭曲理论；比喻只能辅助，不能替代命题本身。
5. 禁用「不是…而是…」句式；不用「让我们…」式演讲腔；用「倾向于/较为吻合/可以理解为」级别的谨慎表述。

## 七、TypeScript 写法约束

- 单引号字符串；字符串内**绝不出现未转义的半角双引号**，中文引语用「」或『』。
- 不在字符串内使用反引号模板。
- 数组与对象用尾逗号；文件以 `export const partNLessons: Lesson[] = [ ... ]` 导出（N 为部分序号）。
- 文件顶部：`import type { Lesson } from '../../types'`

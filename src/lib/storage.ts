import type { UserProgress } from '../types'

const KEY = 'pa_user_data_v1'

export const emptyProgress = (): UserProgress => ({
  completedLessons: [],
  quizResults: {},
  experimentAnswers: {},
  dailyAnswers: {},
  notes: {},
  favorites: [],
  wrongQuestions: [],
  writings: [],
  debateAnswers: {},
  drillAnswers: {},
  learningHistory: [],
  streak: { lastDate: '', days: 0 },
  totalMinutes: 0,
  examResults: {},
})

/** 本地存储适配器：课程内容与用户数据分离，后续可替换为云端同步实现 */
export interface StorageAdapter {
  load(): UserProgress
  save(data: UserProgress): void
  clear(): void
}

export const localStorageAdapter: StorageAdapter = {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return emptyProgress()
      const parsed = JSON.parse(raw)
      return { ...emptyProgress(), ...parsed }
    } catch {
      return emptyProgress()
    }
  },
  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('保存失败', e)
    }
  },
  clear() {
    localStorage.removeItem(KEY)
  },
}

// 云端同步接口预留：实现同一 StorageAdapter 即可无缝替换
// export const cloudAdapter: StorageAdapter = { ... }

let _progress: UserProgress = localStorageAdapter.load()
const listeners = new Set<(p: UserProgress) => void>()

export const getProgress = () => _progress

export function updateProgress(mutator: (draft: UserProgress) => void) {
  const draft: UserProgress = JSON.parse(JSON.stringify(_progress))
  mutator(draft)
  _progress = draft
  localStorageAdapter.save(draft)
  listeners.forEach((fn) => fn(draft))
}

export function subscribe(fn: (p: UserProgress) => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** 记录学习历史 + 更新连续天数 */
export function logActivity(
  draft: UserProgress,
  type: 'lesson' | 'quiz' | 'experiment' | 'writing' | 'daily' | 'debate' | 'drill' | 'exam',
  targetId: string,
  title: string,
) {
  draft.learningHistory.unshift({ id: `${type}-${targetId}-${Date.now()}`, type, targetId, title, at: Date.now() })
  if (draft.learningHistory.length > 200) draft.learningHistory.length = 200
  const today = new Date().toISOString().slice(0, 10)
  if (draft.streak.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    draft.streak.days = draft.streak.lastDate === yesterday ? draft.streak.days + 1 : 1
    draft.streak.lastDate = today
  }
}

export const todayKey = () => new Date().toISOString().slice(0, 10)

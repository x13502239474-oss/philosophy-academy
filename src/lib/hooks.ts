import { useEffect, useState, useSyncExternalStore } from 'react'
import { getProgress, subscribe } from './storage'
import type { UserProgress } from '../types'

export function useProgress(): UserProgress {
  return useSyncExternalStore(subscribe, getProgress, getProgress)
}

/** 每日问题按日期确定性选一条 */
export function dailyIndex(total: number) {
  const d = new Date()
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
  return total > 0 ? day % total : 0
}

export function formatDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

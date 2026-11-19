import type { ReactNode } from 'react'

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="mb-1 text-[10px] font-semibold uppercase tracking-[.22em] text-[#4B9EFF]">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function ProgressRing({ value, size = 56, stroke = 4, color = '#4B9EFF' }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#263247" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c - (v/100)*c} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset .6s ease' }} />
    </svg>
  )
}

export function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-3 text-[#4B9EFF] opacity-60">{icon}</div>
      <p className="text-sm muted">{text}</p>
    </div>
  )
}

export function BackBar({ title, to = '/courses' }: { title: string; to?: string }) {
  const nav = useNavigateSafe()
  return (
    <button onClick={() => nav(to)} className="mb-5 flex items-center gap-2 text-sm muted transition active:text-ink">
      <span className="text-lg leading-none">‹</span> {title}
    </button>
  )
}

// 避免每个组件重复 import useNavigate
import { useNavigate } from 'react-router-dom'
function useNavigateSafe() { return useNavigate() }

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="chip" style={color ? { color, borderColor: color + '55', background: color + '18' } : undefined}>
      {children}
    </span>
  )
}

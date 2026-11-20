import { NavLink } from 'react-router-dom'
import { Home, BookOpen, BrainCircuit, Library, UserRound } from 'lucide-react'

const tabs = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/courses', label: '课程', icon: BookOpen },
  { to: '/think', label: '思辨', icon: BrainCircuit },
  { to: '/knowledge', label: '知识库', icon: Library },
  { to: '/profile', label: '我的', icon: UserRound },
]

export default function Layout() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] z-50 px-3"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass folio-frame rounded-sm mx-1 mb-2 flex items-stretch justify-around py-1.5 shadow-[0_-4px_18px_rgba(96,69,47,.18)]">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 rounded-sm py-2 transition ${
                isActive ? 'text-[#793D36]' : 'text-[#87745A] active:text-[#514332]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -top-1.5 h-[3px] w-7 bg-[#793D36]" />}
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

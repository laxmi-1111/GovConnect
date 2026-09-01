import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, FileClock, SearchCheck, FolderLock, ShieldCheck, MessageSquareWarning, Bell, UserRound } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAppData } from '../../context/AppDataContext'

const NAV_ITEMS = [
  { to: '/', icon: LayoutGrid, desktopLabel: 'Services', mobileLabel: 'Services', labelKey: 'home' },
  { to: '/applications', icon: FileClock, desktopLabel: 'My Applications', mobileLabel: 'Applications', labelKey: 'tracking' },
  { to: '/tracking', icon: SearchCheck, desktopLabel: 'Track My Application', mobileLabel: 'Track' },
  { to: '/documents', icon: FolderLock, desktopLabel: 'My Documents', mobileLabel: 'Documents', labelKey: 'vault' },
  { to: '/consents', icon: ShieldCheck, desktopLabel: 'My Consents', mobileLabel: 'Consents', labelKey: 'consents' },
  { to: '/grievances', icon: MessageSquareWarning, desktopLabel: 'Grievances', mobileLabel: 'Grievances', labelKey: 'grievances' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLanguage()
  const { unreadCount, profile } = useAppData()

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-navy-700 text-sm font-semibold text-white">
              GC
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-navy-800">{t('appName')}</p>
              <p className="hidden text-[11px] text-ink/50 sm:block">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
              className="rounded-sm border border-line px-2 py-1 text-xs font-medium text-ink/70 hover:border-navy-400 hover:text-navy-700"
              aria-label="Switch language"
            >
              {lang === 'en' ? 'मराठी' : 'English'}
            </button>
            <NavLink to="/notifications" className="relative rounded-sm p-1.5 hover:bg-navy-50" aria-label={t('notifications')}>
              <Bell size={19} className="text-ink/70" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-marigold-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/profile"
              className="flex items-center gap-1.5 rounded-sm border border-line py-1 pl-1 pr-2 hover:border-navy-400"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                <UserRound size={14} />
              </span>
              <span className="hidden text-xs font-medium text-ink/80 sm:block">{profile.name.split(' ')[0]}</span>
            </NavLink>
          </div>
        </div>

        <nav className="mx-auto hidden max-w-5xl gap-1 px-4 pb-2 sm:flex">
          {NAV_ITEMS.map(({ to, icon: Icon, desktopLabel, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-standard ${
                  isActive ? 'bg-navy-50 text-navy-700 font-semibold' : 'text-ink/60 hover:bg-navy-50 hover:text-navy-700'
                }`
              }
            >
              <Icon size={15} />
              {labelKey ? t(labelKey) : desktopLabel}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-5 sm:pb-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-white sm:hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, mobileLabel, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                isActive ? 'text-navy-700 font-semibold' : 'text-ink/45'
              }`
            }
          >
            <Icon size={18} />
            {labelKey ? t(labelKey) : mobileLabel}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
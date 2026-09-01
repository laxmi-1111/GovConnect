import { Bell, CheckCheck } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

export function Notifications() {
  const { t } = useLanguage()
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useAppData()

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy-800">{t('notifications')}</h1>
          <p className="text-sm text-ink/60">Status changes, consent activity and grievance updates.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex flex-none items-center gap-1.5 text-xs font-medium text-navy-700 hover:underline"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="divide-y divide-line rounded-sm border border-line bg-white">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-navy-50/50 ${
                n.read ? '' : 'bg-navy-50/30'
              }`}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${n.read ? 'bg-transparent' : 'bg-marigold-500'}`}
              />
              <div className="min-w-0">
                <p className={`text-sm ${n.read ? 'text-ink/70' : 'font-medium text-ink'}`}>{n.title}</p>
                <p className="mt-0.5 text-xs text-ink/50">{n.message}</p>
                <p className="mt-1 text-[11px] text-ink/35">{n.timestamp}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

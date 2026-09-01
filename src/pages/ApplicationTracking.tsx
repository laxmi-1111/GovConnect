import { Link } from 'react-router-dom'
import { FileClock, ChevronRight } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { statusTone } from '../lib/statusHelpers'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

export function ApplicationTracking() {
  const { t } = useLanguage()
  const { applications } = useAppData()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-navy-800">{t('tracking')}</h1>
        <p className="text-sm text-ink/60">Every application you've filed, across every department, in one list.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileClock}
          title="No applications yet"
          description="Applications you submit from the service catalog will appear here."
        />
      ) : (
        <div className="divide-y divide-line rounded-sm border border-line bg-white">
          {applications.map((app) => (
            <Link
              key={app.id}
              to={`/applications/${app.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-navy-50/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{app.serviceName}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink/45">{app.id}</p>
              </div>
              <div className="flex flex-none items-center gap-2">
                <StatusBadge tone={statusTone(app.status)} label={app.status} />
                <ChevronRight size={15} className="text-ink/30" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

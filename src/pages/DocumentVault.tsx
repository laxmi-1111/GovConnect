import { FileText, Upload } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useLanguage } from '../context/LanguageContext'

export function DocumentVault() {
  const { t } = useLanguage()
  const { documents } = useAppData()

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy-800">{t('vault')}</h1>
          <p className="text-sm text-ink/60">
            Documents already verified once are stored as references — attach them to any new application with one tap.
          </p>
        </div>
        <button className="flex flex-none items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-navy-400">
          <Upload size={13} /> Upload new
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-start gap-3 rounded-sm border border-line bg-white p-4">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-navy-50 text-navy-700">
              <FileText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
              <p className="text-xs text-ink/50">{doc.department}</p>
              <div className="mt-2 flex items-center justify-between">
                <StatusBadge tone={doc.status} label={doc.status} />
                <span className="text-[11px] text-ink/40">{doc.issuedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

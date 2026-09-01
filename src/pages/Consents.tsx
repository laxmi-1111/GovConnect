import { ShieldCheck, ShieldOff, ShieldX } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'
import type { ConsentStatus } from '../lib/types'

const STATUS_STYLE: Record<ConsentStatus, string> = {
  allowed: 'text-verified-600 bg-verified-50 border-verified-500/30',
  denied: 'text-caution-600 bg-caution-50 border-caution-500/30',
  revoked: 'text-ink/50 bg-navy-50 border-line',
  pending: 'text-navy-700 bg-navy-50 border-navy-400/30',
}

export function Consents() {
  const { t } = useLanguage()
  const { consents, revokeConsent } = useAppData()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-navy-800">{t('consents')}</h1>
        <p className="text-sm text-ink/60">
          Every time a department's data was shared with another, it's logged here. Revoke access any time.
        </p>
      </div>

      {consents.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No consents yet"
          description="When an application needs data from another department, you'll be asked here first."
        />
      ) : (
        <div className="space-y-3">
          {consents.map((c) => (
            <div key={c.id} className="rounded-sm border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{c.department}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{c.dataPoint}</p>
                  <p className="mt-1 text-xs text-ink/55">
                    For <span className="font-medium">{c.serviceName}</span> — {c.reason}
                  </p>
                </div>
                <span className={`flex-none rounded-sm border px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[c.status]}`}>
                  {c.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                <p className="text-[11px] text-ink/40">{c.timestamp}</p>
                {c.status === 'allowed' && (
                  <button
                    onClick={() => revokeConsent(c.id)}
                    className="flex items-center gap-1 text-xs font-medium text-caution-600 hover:underline"
                  >
                    <ShieldOff size={12} /> {t('revoke')}
                  </button>
                )}
                {c.status === 'revoked' && (
                  <span className="flex items-center gap-1 text-xs text-ink/40">
                    <ShieldX size={12} /> Access removed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

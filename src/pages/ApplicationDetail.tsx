import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, QrCode } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { Timeline } from '../components/ui/Timeline'
import { historyToSteps } from '../lib/statusHelpers'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

export function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { applications, profile } = useAppData()
  const app = applications.find((a) => a.id === id)

  if (!app) {
    return (
      <EmptyState
        title="Application not found"
        description="This reference number doesn't match any application on file."
        action={
          <Link to="/applications" className="text-sm font-medium text-navy-700">
            Back to applications
          </Link>
        }
      />
    )
  }

  const steps = historyToSteps(app.history, {
    terminal: ['Approved', 'Rejected', 'Certificate Issued'],
    flagged: ['Additional Info Needed', 'Rejected'],
  })

  function downloadCertificate() {
    const text = `GOVCONNECT — GOVERNMENT OF MAHARASHTRA
Digitally Signed Certificate
--------------------------------------------------
Application reference : ${app!.id}
Service                : ${app!.serviceName}
Issuing department     : ${app!.department}
Issued to              : ${profile.name}
Date of issue           : ${app!.history[app!.history.length - 1].timestamp}
--------------------------------------------------
This certificate is digitally signed. Verify authenticity by scanning
the QR code shown in the GovConnect app for this application.
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${app!.id}-certificate.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-navy-700"
      >
        <ArrowLeft size={13} /> {t('back')}
      </button>

      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{app.department}</p>
        <h1 className="text-xl font-semibold text-navy-800">{app.serviceName}</h1>
        <p className="mt-1 font-mono text-xs text-ink/45">{app.id}</p>
      </div>

      {app.status === 'Certificate Issued' && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-sm border border-verified-500/30 bg-verified-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-sm border border-verified-500/30 bg-white text-verified-600">
              <QrCode size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Certificate ready</p>
              <p className="text-xs text-ink/55">Digitally signed — verifiable via QR code</p>
            </div>
          </div>
          <button
            onClick={downloadCertificate}
            className="flex flex-none items-center gap-1.5 rounded-sm bg-navy-700 px-3 py-2 text-xs font-medium text-white hover:bg-navy-800"
          >
            <Download size={13} /> Download
          </button>
        </div>
      )}

      <div className="rounded-sm border border-line bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40">Status timeline</p>
        <Timeline steps={steps} />
      </div>

      {Object.keys(app.fields).length > 0 && (
        <div className="mt-4 divide-y divide-line rounded-sm border border-line bg-white">
          {Object.entries(app.fields).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="text-xs capitalize text-ink/55">{k.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-sm font-medium text-ink">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

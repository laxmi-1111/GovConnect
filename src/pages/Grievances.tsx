import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareWarning, ChevronRight, Plus, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { statusTone } from '../lib/statusHelpers'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

const CATEGORIES = ['Delay in processing', 'Incorrect information', 'Payment issue', 'Rude behaviour', 'Other']

export function Grievances() {
  const { t } = useLanguage()
  const { grievances, applications, fileGrievance } = useAppData()
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [applicationRef, setApplicationRef] = useState('')

  function submit() {
    if (!description.trim()) return
    const g = fileGrievance({ category, description, applicationRef: applicationRef || undefined })
    setOpen(false)
    setDescription('')
    setApplicationRef('')
    return g
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy-800">{t('grievances')}</h1>
          <p className="text-sm text-ink/60">File a complaint and track it to resolution.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-none items-center gap-1.5 rounded-sm bg-navy-700 px-3 py-2 text-xs font-medium text-white hover:bg-navy-800"
        >
          <Plus size={14} /> File grievance
        </button>
      </div>

      {open && (
        <div className="mb-6 rounded-sm border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">New grievance</p>
            <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-3 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-navy-700"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="mb-1 block text-xs font-medium text-ink/70">Related application (optional)</label>
          <select
            value={applicationRef}
            onChange={(e) => setApplicationRef(e.target.value)}
            className="mb-3 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-navy-700"
          >
            <option value="">None</option>
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.serviceName}
              </option>
            ))}
          </select>
          <label className="mb-1 block text-xs font-medium text-ink/70">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What went wrong?"
            className="mb-3 w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-navy-700"
          />
          <button
            onClick={submit}
            disabled={!description.trim()}
            className="w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-40"
          >
            Submit grievance
          </button>
        </div>
      )}

      {grievances.length === 0 ? (
        <EmptyState
          icon={MessageSquareWarning}
          title="No grievances filed"
          description="If something goes wrong with a service, file it here and track it to resolution."
        />
      ) : (
        <div className="divide-y divide-line rounded-sm border border-line bg-white">
          {grievances.map((g) => (
            <Link
              key={g.id}
              to={`/grievances/${g.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-navy-50/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{g.category}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink/45">{g.id}</p>
              </div>
              <div className="flex flex-none items-center gap-2">
                <StatusBadge tone={statusTone(g.status)} label={g.status} />
                <ChevronRight size={15} className="text-ink/30" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

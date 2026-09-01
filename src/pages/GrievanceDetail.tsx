import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { Timeline } from '../components/ui/Timeline'
import { historyToSteps } from '../lib/statusHelpers'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

export function GrievanceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { grievances, submitGrievanceFeedback } = useAppData()
  const grievance = grievances.find((g) => g.id === id)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  if (!grievance) {
    return (
      <EmptyState
        title="Grievance not found"
        description="This reference number doesn't match any grievance on file."
        action={
          <Link to="/grievances" className="text-sm font-medium text-navy-700">
            Back to grievances
          </Link>
        }
      />
    )
  }

  const steps = historyToSteps(grievance.history, { terminal: ['Resolved'], flagged: [] })
  const resolved = grievance.status === 'Resolved'
  const feedbackGiven = typeof grievance.feedbackRating === 'number'

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-navy-700"
      >
        <ArrowLeft size={13} /> {t('back')}
      </button>

      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{grievance.category}</p>
        <h1 className="text-xl font-semibold text-navy-800">{grievance.description}</h1>
        <p className="mt-1 font-mono text-xs text-ink/45">{grievance.id}</p>
        {grievance.officer && <p className="mt-1 text-xs text-ink/50">Assigned to {grievance.officer}</p>}
      </div>

      <div className="rounded-sm border border-line bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40">Status timeline</p>
        <Timeline steps={steps} />
      </div>

      {resolved && (
        <div className="mt-4 rounded-sm border border-line bg-white p-5">
          {feedbackGiven ? (
            <div>
              <p className="text-sm font-medium text-ink">Thanks for your feedback</p>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= (grievance.feedbackRating ?? 0) ? 'fill-marigold-500 text-marigold-500' : 'text-line'}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-sm font-medium text-ink">How was the resolution?</p>
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Star size={20} className={n <= rating ? 'fill-marigold-500 text-marigold-500' : 'text-line'} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Optional comment"
                className="mb-3 w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-navy-700"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => submitGrievanceFeedback(grievance.id, rating, comment)}
                  disabled={rating === 0}
                  className="flex-1 rounded-sm bg-navy-700 py-2 text-xs font-medium text-white hover:bg-navy-800 disabled:opacity-40"
                >
                  Submit feedback
                </button>
                <button className="flex-1 rounded-sm border border-caution-500/40 py-2 text-xs font-medium text-caution-600 hover:bg-caution-50">
                  Appeal this outcome
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

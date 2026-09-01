import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Loader2, CheckCircle2, XCircle, CreditCard, ShieldCheck } from 'lucide-react'
import { services } from '../lib/mockData'
import type { FormField } from '../lib/types'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { useAppData, nextApplicationId } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'

type Stage = 'form' | 'consent' | 'payment' | 'review' | 'submitting' | 'done'
type PayState = 'idle' | 'processing' | 'success' | 'failed'

export function DynamicForm() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { grantConsent, denyConsent, submitApplication } = useAppData()
  const service = services.find((s) => s.id === serviceId)

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((service?.fields ?? []).map((f) => [f.id, f.value ?? ''])),
  )
  const [overridden, setOverridden] = useState<Record<string, boolean>>({})
  const [stage, setStage] = useState<Stage>('form')
  const [consentDecisions, setConsentDecisions] = useState<Record<number, 'allowed' | 'denied' | null>>({})
  const [payMethod, setPayMethod] = useState<'upi' | 'card'>('upi')
  const [payState, setPayState] = useState<PayState>('idle')
  const [submittedId, setSubmittedId] = useState<string>('')

  const needsConsent = (service?.crossDeptFetches.length ?? 0) > 0
  const needsPayment = !!service?.fee && service.fee > 0

  const requiredMissing = useMemo(() => {
    if (!service) return []
    return service.fields.filter((f) => {
      const isPrefilled = f.sourceDepartment && f.verifiedStatus === 'verified' && !overridden[f.id]
      if (isPrefilled) return false
      const wantsValue = f.required || !f.sourceDepartment
      return wantsValue && !values[f.id]?.trim()
    })
  }, [service, values, overridden])

  if (!service) {
    return (
      <EmptyState
        title="Service not found"
        description="This service link looks out of date."
        action={
          <Link to="/" className="text-sm font-medium text-navy-700">
            Back to services
          </Link>
        }
      />
    )
  }

  function updateField(id: string, val: string) {
    setValues((prev) => ({ ...prev, [id]: val }))
  }

  function goToNextAfterForm() {
    if (needsConsent) setStage('consent')
    else if (needsPayment) setStage('payment')
    else setStage('review')
  }

  function allConsentsDecided() {
    return service!.crossDeptFetches.every((_, i) => consentDecisions[i])
  }

  function confirmConsent() {
    service!.crossDeptFetches.forEach((fetchItem, i) => {
      const decision = consentDecisions[i]
      if (decision === 'allowed') {
        grantConsent({
          serviceId: service!.id,
          serviceName: service!.name,
          department: fetchItem.department,
          dataPoint: fetchItem.dataPoint,
          reason: fetchItem.reason,
        })
      }
    })
    if (needsPayment) setStage('payment')
    else setStage('review')
  }

  function runPayment() {
    setPayState('processing')
    setTimeout(() => {
      // Demo: succeeds unless the citizen picked a card ending review-fail sentinel; here we just succeed.
      setPayState('success')
    }, 1400)
  }

  function finalSubmit() {
    setStage('submitting')
    const id = nextApplicationId()
    setTimeout(() => {
      submitApplication({
        id,
        serviceId: service!.id,
        serviceName: service!.name,
        department: service!.department,
        fields: values,
      })
      setSubmittedId(id)
      setStage('done')
    }, 700)
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
        <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{service.department}</p>
        <h1 className="text-xl font-semibold text-navy-800">{service.name}</h1>
        <p className="mt-1 text-sm text-ink/60">{service.description}</p>
      </div>

      <Stepper stage={stage} needsConsent={needsConsent} needsPayment={needsPayment} />

      {stage === 'form' && (
        <div className="mt-6 space-y-4">
          {service.fields.map((f) => (
            <FieldInput
              key={f.id}
              field={f}
              value={values[f.id] ?? ''}
              overridden={!!overridden[f.id]}
              onChange={(v) => updateField(f.id, v)}
              onToggleOverride={() => setOverridden((p) => ({ ...p, [f.id]: !p[f.id] }))}
            />
          ))}
          <button
            onClick={goToNextAfterForm}
            disabled={requiredMissing.length > 0}
            className="mt-2 w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-40"
          >
            {t('continue')}
          </button>
          {requiredMissing.length > 0 && (
            <p className="text-center text-xs text-ink/45">
              Fill in {requiredMissing.length} more field{requiredMissing.length > 1 ? 's' : ''} to continue.
            </p>
          )}
        </div>
      )}

      {stage === 'consent' && (
        <div className="mt-6">
          <div className="mb-4 flex items-start gap-2 rounded-sm border border-navy-700/20 bg-navy-50 px-3 py-2.5">
            <ShieldCheck size={16} className="mt-0.5 flex-none text-navy-700" />
            <p className="text-xs leading-relaxed text-navy-800">
              To complete this application without asking you to re-submit documents, GovConnect needs your
              permission to pull the data points below from other departments. Nothing is fetched until you allow it.
            </p>
          </div>
          <div className="space-y-3">
            {service.crossDeptFetches.map((fetchItem, i) => {
              const decision = consentDecisions[i]
              return (
                <div key={i} className="rounded-sm border border-line bg-white p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{fetchItem.department}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{fetchItem.dataPoint}</p>
                  <p className="mt-1 text-xs text-ink/55">{fetchItem.reason}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setConsentDecisions((p) => ({ ...p, [i]: 'allowed' }))}
                      className={`flex-1 rounded-sm border py-1.5 text-xs font-medium ${
                        decision === 'allowed'
                          ? 'border-verified-500 bg-verified-50 text-verified-600'
                          : 'border-line text-ink/60 hover:border-verified-500'
                      }`}
                    >
                      {t('allowConsent')}
                    </button>
                    <button
                      onClick={() => setConsentDecisions((p) => ({ ...p, [i]: 'denied' }))}
                      className={`flex-1 rounded-sm border py-1.5 text-xs font-medium ${
                        decision === 'denied'
                          ? 'border-caution-500 bg-caution-50 text-caution-600'
                          : 'border-line text-ink/60 hover:border-caution-500'
                      }`}
                    >
                      {t('denyConsent')}
                    </button>
                  </div>
                  {decision === 'denied' && (
                    <p className="mt-2 text-[11px] text-caution-600">
                      You'll need to add this information or a supporting document manually instead.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <button
            onClick={confirmConsent}
            disabled={!allConsentsDecided()}
            className="mt-4 w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-40"
          >
            Confirm & {t('continue').toLowerCase()}
          </button>
        </div>
      )}

      {stage === 'payment' && (
        <div className="mt-6">
          <div className="rounded-sm border border-line bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Service fee</p>
              <p className="text-lg font-semibold text-navy-800">₹{service.fee}</p>
            </div>
            {payState === 'idle' && (
              <>
                <div className="mb-4 flex gap-2">
                  {(['upi', 'card'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={`flex-1 rounded-sm border py-2 text-xs font-medium uppercase tracking-wide ${
                        payMethod === m ? 'border-navy-700 bg-navy-50 text-navy-700' : 'border-line text-ink/55'
                      }`}
                    >
                      {m === 'upi' ? 'UPI' : 'Card'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={runPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
                >
                  <CreditCard size={14} /> Pay ₹{service.fee}
                </button>
              </>
            )}
            {payState === 'processing' && (
              <div className="flex flex-col items-center gap-2 py-6 text-ink/60">
                <Loader2 size={20} className="animate-spin text-navy-700" />
                <p className="text-xs">Confirming payment…</p>
              </div>
            )}
            {payState === 'success' && (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <CheckCircle2 size={22} className="text-verified-500" />
                <p className="text-sm font-medium text-ink">Payment received</p>
                <p className="text-xs text-ink/50">Receipt GC-RCPT-{Math.floor(Math.random() * 900000 + 100000)}</p>
                <button
                  onClick={() => setStage('review')}
                  className="mt-2 w-full rounded-sm bg-navy-700 py-2 text-xs font-medium text-white hover:bg-navy-800"
                >
                  {t('continue')}
                </button>
              </div>
            )}
            {payState === 'failed' && (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <XCircle size={22} className="text-caution-500" />
                <p className="text-sm font-medium text-ink">Payment failed</p>
                <button
                  onClick={runPayment}
                  className="mt-2 w-full rounded-sm border border-navy-700 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50"
                >
                  Retry payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 'review' && (
        <div className="mt-6">
          <div className="divide-y divide-line rounded-sm border border-line bg-white">
            {service.fields.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-xs text-ink/55">{f.label}</span>
                <span className="text-sm font-medium text-ink">{values[f.id] || '—'}</span>
              </div>
            ))}
          </div>
          <button
            onClick={finalSubmit}
            className="mt-4 w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            {t('submit')}
          </button>
        </div>
      )}

      {stage === 'submitting' && (
        <div className="mt-10 flex flex-col items-center gap-2 text-ink/60">
          <Loader2 size={22} className="animate-spin text-navy-700" />
          <p className="text-sm">Submitting your application…</p>
        </div>
      )}

      {stage === 'done' && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-sm border border-verified-500/30 bg-verified-50 px-6 py-10 text-center">
          <CheckCircle2 size={26} className="text-verified-600" />
          <p className="text-base font-semibold text-ink">Application submitted</p>
          <p className="text-sm text-ink/60">
            Reference <span className="font-mono">{submittedId}</span> has been routed to {service.department}.
          </p>
          <Link
            to={`/applications/${submittedId}`}
            className="mt-2 rounded-sm bg-navy-700 px-4 py-2 text-xs font-medium text-white hover:bg-navy-800"
          >
            Track this application
          </Link>
        </div>
      )}
    </div>
  )
}

function Stepper({
  stage,
  needsConsent,
  needsPayment,
}: {
  stage: Stage
  needsConsent: boolean
  needsPayment: boolean
}) {
  const steps: { key: Stage; label: string }[] = [
    { key: 'form', label: 'Details' },
    ...(needsConsent ? [{ key: 'consent' as Stage, label: 'Consent' }] : []),
    ...(needsPayment ? [{ key: 'payment' as Stage, label: 'Payment' }] : []),
    { key: 'review', label: 'Review' },
  ]
  const activeIndex = steps.findIndex((s) => s.key === stage)
  const effectiveIndex = activeIndex === -1 ? steps.length - 1 : activeIndex

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => (
        <div key={s.key} className="flex flex-1 items-center gap-1.5">
          <div
            className={`h-1 flex-1 rounded-full ${i <= effectiveIndex ? 'bg-navy-700' : 'bg-line'}`}
          />
          <span
            className={`hidden text-[10px] font-medium sm:block ${
              i <= effectiveIndex ? 'text-navy-700' : 'text-ink/35'
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function FieldInput({
  field,
  value,
  overridden,
  onChange,
  onToggleOverride,
}: {
  field: FormField
  value: string
  overridden: boolean
  onChange: (v: string) => void
  onToggleOverride: () => void
}) {
  const isLockedPrefill = field.sourceDepartment && field.verifiedStatus === 'verified' && !overridden

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-ink/70">
          {field.label}
          {field.required && <span className="text-caution-500"> *</span>}
        </label>
        {field.sourceDepartment && field.verifiedStatus === 'verified' && (
          <StatusBadge tone="verified" label={`${field.verifiedStatus} · ${field.sourceDepartment}`} />
        )}
        {field.sourceDepartment && field.verifiedStatus === 'stale' && (
          <StatusBadge tone="stale" label={`Needs re-fetch · ${field.sourceDepartment}`} />
        )}
        {field.sourceDepartment && field.verifiedStatus === 'unavailable' && (
          <StatusBadge tone="unavailable" label={`Not on file · ${field.sourceDepartment}`} />
        )}
      </div>

      {isLockedPrefill ? (
        <div className="flex items-center justify-between rounded-sm border border-verified-500/30 bg-verified-50 px-3 py-2.5">
          <span className="text-sm text-ink">{value}</span>
          <button
            onClick={onToggleOverride}
            className="flex items-center gap-1 text-[11px] font-medium text-navy-700 hover:underline"
          >
            <Pencil size={11} /> Edit instead
          </button>
        </div>
      ) : field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-sm border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-700"
        />
      ) : field.type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-700"
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === 'file' ? (
        <div className="flex items-center justify-between rounded-sm border border-dashed border-line px-3 py-2.5">
          <span className="text-sm text-ink/50">{value || 'No file attached'}</span>
          <button
            onClick={() => onChange('New upload.pdf')}
            className="text-[11px] font-medium text-navy-700 hover:underline"
          >
            Attach from vault
          </button>
        </div>
      ) : (
        <input
          type={field.type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-700"
        />
      )}
      {field.sourceDepartment && overridden && (
        <p className="mt-1 text-[11px] text-marigold-600">
          Manual entry — you may be asked for supporting proof of this value.
        </p>
      )}
    </div>
  )
}

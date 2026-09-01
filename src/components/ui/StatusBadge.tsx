import { CheckCircle2, AlertTriangle, HelpCircle, Clock } from 'lucide-react'

type Tone = 'verified' | 'stale' | 'unavailable' | 'pending' | 'expired'

const TONE_STYLES: Record<Tone, string> = {
  verified: 'bg-verified-50 text-verified-600 border-verified-500/30',
  stale: 'bg-marigold-50 text-marigold-600 border-marigold-500/30',
  unavailable: 'bg-caution-50 text-caution-600 border-caution-500/30',
  pending: 'bg-navy-50 text-navy-700 border-navy-400/30',
  expired: 'bg-caution-50 text-caution-600 border-caution-500/30',
}

const TONE_ICON: Record<Tone, typeof CheckCircle2> = {
  verified: CheckCircle2,
  stale: Clock,
  unavailable: HelpCircle,
  pending: Clock,
  expired: AlertTriangle,
}

export function StatusBadge({ tone, label }: { tone: Tone; label: string }) {
  const Icon = TONE_ICON[tone]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium ${TONE_STYLES[tone]}`}
    >
      <Icon size={12} strokeWidth={2.2} />
      {label}
    </span>
  )
}

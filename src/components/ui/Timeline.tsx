import { Check } from 'lucide-react'

export interface TimelineStep {
  label: string
  timestamp?: string
  note?: string
  state: 'done' | 'current' | 'upcoming' | 'flagged'
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={step.label} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[9px] top-5 h-full w-px ${
                  step.state === 'done' ? 'bg-verified-500/50' : 'bg-line'
                }`}
              />
            )}
            <span
              className={[
                'z-10 mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border-2',
                step.state === 'done' && 'border-verified-500 bg-verified-500 text-white',
                step.state === 'current' && 'border-navy-700 bg-white',
                step.state === 'flagged' && 'border-marigold-500 bg-marigold-500 text-white',
                step.state === 'upcoming' && 'border-line bg-white',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {step.state === 'done' && <Check size={11} strokeWidth={3} />}
              {step.state === 'current' && <span className="h-2 w-2 rounded-full bg-navy-700" />}
            </span>
            <div className="pt-px">
              <p
                className={`text-sm font-medium ${
                  step.state === 'upcoming' ? 'text-ink/40' : 'text-ink'
                }`}
              >
                {step.label}
              </p>
              {step.timestamp && <p className="text-xs text-ink/50">{step.timestamp}</p>}
              {step.note && (
                <p className="mt-1 max-w-sm text-xs text-navy-700 bg-navy-50 rounded-sm px-2 py-1">{step.note}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

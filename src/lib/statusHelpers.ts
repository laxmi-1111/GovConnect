import type { TimelineStep } from '../components/ui/Timeline'

export function historyToSteps<S extends string>(
  history: { status: S; timestamp: string; note?: string }[],
  opts: { terminal: S[]; flagged: S[] },
): TimelineStep[] {
  return history.map((entry, i) => {
    const isLast = i === history.length - 1
    let state: TimelineStep['state'] = 'done'
    if (isLast) {
      if (opts.flagged.includes(entry.status)) state = 'flagged'
      else if (opts.terminal.includes(entry.status)) state = 'done'
      else state = 'current'
    }
    return { label: entry.status, timestamp: entry.timestamp, note: entry.note, state }
  })
}

export function statusTone(status: string): 'verified' | 'stale' | 'unavailable' | 'pending' | 'expired' {
  if (status === 'Approved' || status === 'Certificate Issued' || status === 'Resolved') return 'verified'
  if (status === 'Additional Info Needed') return 'stale'
  if (status === 'Rejected') return 'expired'
  return 'pending'
}

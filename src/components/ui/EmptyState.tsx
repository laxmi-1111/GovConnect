import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-line bg-white px-6 py-14 text-center">
      <Icon className="mb-3 text-navy-400" size={28} strokeWidth={1.6} />
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-ink/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

import { RefreshCcw, AlertTriangle } from 'lucide-react'

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-l-2 border-caution-500 bg-caution-50 px-4 py-3 text-sm text-caution-600">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} strokeWidth={2} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 rounded-sm border border-caution-500/40 px-2 py-1 text-xs font-medium text-caution-600 hover:bg-caution-500/10"
        >
          <RefreshCcw size={12} /> Retry
        </button>
      )}
    </div>
  )
}

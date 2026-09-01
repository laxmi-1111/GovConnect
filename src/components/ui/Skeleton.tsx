export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-navy-100/70 ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-sm border border-line bg-white p-4">
      <Skeleton className="mb-3 h-4 w-2/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

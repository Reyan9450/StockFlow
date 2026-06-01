import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-muted/60',
        className
      )}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl p-6 bg-card border border-border">
      <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-32 h-4 mb-3" />
      <Skeleton className="w-20 h-5 rounded-full" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

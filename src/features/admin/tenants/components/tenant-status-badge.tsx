import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { type TenantStatus } from '../data/schema'

const dotColor: Record<TenantStatus, string> = {
  active: 'bg-emerald-500',
  trial: 'bg-sky-500',
  suspended: 'bg-orange-500',
}

const variantClass: Record<TenantStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-transparent',
  trial: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-transparent',
  suspended: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-transparent',
}

export function TenantStatusBadge({ status }: { status: TenantStatus }) {
  return (
    <Badge variant='outline' className={cn('capitalize', variantClass[status])}>
      <span className={cn('size-1.5 rounded-full', dotColor[status])} />
      {status}
    </Badge>
  )
}

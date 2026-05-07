import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { type TenantPlan } from '../data/schema'

const variantClass: Record<TenantPlan, string> = {
  free: 'bg-muted text-muted-foreground border-transparent',
  starter: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-transparent',
  pro: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-transparent',
}

export function TenantPlanBadge({ plan }: { plan: TenantPlan }) {
  return (
    <Badge variant='outline' className={cn('capitalize', variantClass[plan])}>
      {plan}
    </Badge>
  )
}

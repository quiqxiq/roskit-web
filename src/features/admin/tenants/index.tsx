import { Building2, Pause, Plus, Sparkles } from 'lucide-react'
import { useTenantsStore } from '@/stores/tenants-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { TenantsTable } from './components/tenants-table'
import { TenantDialogs } from './dialogs/tenant-dialogs'
import { useTenantsDialogStore } from './store/tenants-dialog-store'

export function AdminTenants() {
  const tenants = useTenantsStore((s) => s.items)
  const openDialog = useTenantsDialogStore((s) => s.open)

  const total = tenants.length
  const active = tenants.filter((t) => t.status === 'active').length
  const trial = tenants.filter((t) => t.status === 'trial').length
  const suspended = tenants.filter((t) => t.status === 'suspended').length

  return (
    <>
      <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
              Platform Tenants
            </h2>
            <p className='text-sm text-muted-foreground sm:text-base'>
              {total} tenants · {active} active · {trial} trial · {suspended} suspended
            </p>
          </div>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => openDialog('create')}
          >
            <Plus className='size-4' />
            Create Tenant
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <SummaryCard
            icon={<Building2 className='size-4 text-foreground' />}
            label='Total'
            value={total}
          />
          <SummaryCard
            icon={<Sparkles className='size-4 text-emerald-500' />}
            label='Active'
            value={active}
          />
          <SummaryCard
            icon={<Sparkles className='size-4 text-sky-500' />}
            label='Trial'
            value={trial}
          />
          <SummaryCard
            icon={<Pause className='size-4 text-orange-500' />}
            label='Suspended'
            value={suspended}
          />
        </div>

        <TenantsTable data={tenants} />
      </Main>
      <TenantDialogs />
    </>
  )
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <Card>
      <CardContent className='flex items-center justify-between gap-2 px-4 py-3'>
        <div>
          <p className='text-[11px] uppercase text-muted-foreground'>{label}</p>
          <p className='text-2xl font-bold tabular-nums'>{value}</p>
        </div>
        <div className='rounded-full bg-muted p-2'>{icon}</div>
      </CardContent>
    </Card>
  )
}

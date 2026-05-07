import { ArrowLeft, Pause, Pencil, Play, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTenantsStore } from '@/stores/tenants-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { TenantPlanBadge } from './components/tenant-plan-badge'
import { TenantStatusBadge } from './components/tenant-status-badge'
import { TenantDialogs } from './dialogs/tenant-dialogs'
import { useTenantsDialogStore } from './store/tenants-dialog-store'

type Props = { tenantId: string }

export function AdminTenantDetail({ tenantId }: Props) {
  const tenant = useTenantsStore((s) => s.items.find((t) => t.id === tenantId))
  const openDialog = useTenantsDialogStore((s) => s.open)

  if (!tenant) {
    return (
      <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
        <div className='flex items-center gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link to='/admin/tenants'>
              <ArrowLeft className='size-4' />
              Back
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            Tenant not found
          </CardContent>
        </Card>
      </Main>
    )
  }

  const isSuspended = tenant.status === 'suspended'

  return (
    <>
      <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
        <div className='flex flex-wrap items-center gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link to='/admin/tenants'>
              <ArrowLeft className='size-4' />
              Back
            </Link>
          </Button>
        </div>

        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
                {tenant.name}
              </h2>
              <TenantStatusBadge status={tenant.status} />
              <TenantPlanBadge plan={tenant.plan} />
            </div>
            <p className='font-mono text-xs text-muted-foreground'>
              {tenant.slug}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5'
              onClick={() => openDialog('edit-name', { target: tenant })}
            >
              <Pencil className='size-4' />
              Edit Name
            </Button>
            {isSuspended ? (
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5'
                onClick={() => openDialog('activate', { target: tenant })}
              >
                <Play className='size-4' />
                Activate
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5'
                onClick={() => openDialog('suspend', { target: tenant })}
              >
                <Pause className='size-4' />
                Suspend
              </Button>
            )}
            <Button
              variant='destructive'
              size='sm'
              className='gap-1.5'
              onClick={() => openDialog('hard-delete', { target: tenant })}
            >
              <Trash2 className='size-4' />
              Hard Delete
            </Button>
          </div>
        </div>

        <Tabs defaultValue='overview' className='flex flex-col gap-3'>
          <TabsList className='w-fit'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='users'>Users · {tenant.usersCount}</TabsTrigger>
            <TabsTrigger value='routers'>Routers · {tenant.routersCount}</TabsTrigger>
            <TabsTrigger value='audit'>Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='flex flex-col gap-3'>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>Tenant Info</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 text-sm'>
                  <Row label='ID'>
                    <span className='font-mono'>{tenant.id}</span>
                  </Row>
                  <Row label='Slug'>
                    <span className='font-mono'>{tenant.slug}</span>
                  </Row>
                  <Row label='Plan'>
                    <TenantPlanBadge plan={tenant.plan} />
                  </Row>
                  <Row label='Status'>
                    <TenantStatusBadge status={tenant.status} />
                  </Row>
                  <Row label='Created'>
                    {new Date(tenant.createdAt).toLocaleString('en-GB')}
                  </Row>
                  <Row label='Updated'>
                    {new Date(tenant.updatedAt).toLocaleString('en-GB')}
                  </Row>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>Hotspot Settings</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 text-sm'>
                  <Row label='Hotspot Name'>
                    {tenant.settings.hotspotName || '—'}
                  </Row>
                  <Row label='DNS Name'>
                    <span className='font-mono'>
                      {tenant.settings.dnsName || '—'}
                    </span>
                  </Row>
                  <Row label='Currency'>{tenant.settings.currency}</Row>
                  <Row label='Phone'>{tenant.settings.phone || '—'}</Row>
                  <Row label='Email'>{tenant.settings.email || '—'}</Row>
                  <Row label='Idle Timeout'>
                    {tenant.settings.idleTimeout} min
                  </Row>
                  <Row label='Report Mode'>
                    <span className='capitalize'>{tenant.settings.reportMode}</span>
                  </Row>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
              <KpiCard label='Users' value={tenant.usersCount} />
              <KpiCard label='Routers' value={tenant.routersCount} />
              <KpiCard
                label='Voucher Sales'
                value={tenant.voucherSalesCount.toLocaleString('en-US')}
              />
            </div>
          </TabsContent>

          <TabsContent value='users'>
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                Users management akan terhubung ke{' '}
                <span className='font-mono'>GET /api/v1/users</span> saat
                real-API wiring (mock-only di sini).
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='routers'>
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                Routers list akan terhubung ke{' '}
                <span className='font-mono'>GET /api/v1/routers</span>{' '}
                (tenant-scoped) saat real-API wiring.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='audit'>
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                Audit log akan menampilkan{' '}
                <span className='font-mono'>audit_logs WHERE tenant_id = {tenant.id}</span>{' '}
                saat real-API wiring.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
      <TenantDialogs />
    </>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex items-center justify-between gap-3 border-b border-border/50 pb-1.5 last:border-0 last:pb-0'>
      <span className='text-xs uppercase text-muted-foreground'>{label}</span>
      <span>{children}</span>
    </div>
  )
}

function KpiCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className='px-4 py-3'>
        <p className='text-[11px] uppercase text-muted-foreground'>{label}</p>
        <p className='text-2xl font-bold tabular-nums'>{value}</p>
      </CardContent>
    </Card>
  )
}

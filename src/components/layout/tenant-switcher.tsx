import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Building2, ChevronsUpDown, Settings2, Shield } from 'lucide-react'
import {
  PLATFORM_TENANT_SLUG,
  isPlatformScope,
  useActiveTenantStore,
} from '@/stores/active-tenant-store'
import { useTenantsStore } from '@/stores/tenants-store'
import { planMeta } from '@/features/admin/tenants/data/schema'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function TenantSwitcher() {
  const { isMobile } = useSidebar()
  const queryClient = useQueryClient()
  const slug = useActiveTenantStore((s) => s.slug)
  const setSlug = useActiveTenantStore((s) => s.setSlug)
  const tenants = useTenantsStore((s) => s.items)

  const activeTenant = React.useMemo(
    () => tenants.find((t) => t.slug === slug),
    [tenants, slug]
  )

  // Auto-recover: kalau slug aktif merujuk ke tenant yang tidak ada (mis. baru dihapus),
  // fallback ke Platform supaya tidak stuck di state invalid.
  React.useEffect(() => {
    if (!isPlatformScope(slug) && !activeTenant) {
      setSlug(PLATFORM_TENANT_SLUG)
    }
  }, [slug, activeTenant, setSlug])

  const onSelect = React.useCallback(
    (nextSlug: string) => {
      if (nextSlug === slug) return
      setSlug(nextSlug)
      // Invalidate semua query yang scoped ke tenant aktif sekarang.
      void queryClient.invalidateQueries()
    },
    [slug, setSlug, queryClient]
  )

  const isPlatform = isPlatformScope(slug)
  const triggerIcon = isPlatform ? Shield : Building2
  const TriggerIcon = triggerIcon
  const triggerTitle = isPlatform ? 'Platform' : (activeTenant?.name ?? 'Unknown tenant')
  const triggerSubtitle = isPlatform
    ? 'Superadmin scope'
    : activeTenant
      ? `${planMeta[activeTenant.plan].label} · ${activeTenant.slug}`
      : 'Tenant tidak ditemukan'

  const activeTenants = tenants.filter((t) => t.status !== 'suspended')
  const suspendedTenants = tenants.filter((t) => t.status === 'suspended')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <TriggerIcon className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{triggerTitle}</span>
                <span className='truncate text-xs'>{triggerSubtitle}</span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Tenants
            </DropdownMenuLabel>
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => onSelect(PLATFORM_TENANT_SLUG)}
            >
              <div className='flex size-6 items-center justify-center rounded-sm border'>
                <Shield className='size-4 shrink-0' />
              </div>
              <div className='flex-1'>
                <div className='font-medium'>Platform</div>
                <div className='text-xs text-muted-foreground'>
                  Superadmin scope
                </div>
              </div>
            </DropdownMenuItem>

            {activeTenants.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {activeTenants.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    className='gap-2 p-2'
                    onClick={() => onSelect(t.slug)}
                  >
                    <div className='flex size-6 items-center justify-center rounded-sm border'>
                      <Building2 className='size-4 shrink-0' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='truncate font-medium'>{t.name}</div>
                      <div className='truncate text-xs text-muted-foreground'>
                        {t.slug}
                      </div>
                    </div>
                    <Badge variant='secondary' className='text-xs'>
                      {planMeta[t.plan].label}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {suspendedTenants.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className='text-xs text-muted-foreground'>
                  Suspended
                </DropdownMenuLabel>
                {suspendedTenants.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    className='gap-2 p-2 opacity-60'
                    disabled
                  >
                    <div className='flex size-6 items-center justify-center rounded-sm border'>
                      <Building2 className='size-4 shrink-0' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='truncate font-medium'>{t.name}</div>
                      <div className='truncate text-xs text-muted-foreground'>
                        {t.slug}
                      </div>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      Suspended
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='gap-2 p-2'>
              <Link to='/admin/tenants'>
                <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                  <Settings2 className='size-4' />
                </div>
                <div className='font-medium text-muted-foreground'>
                  Manage tenants
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

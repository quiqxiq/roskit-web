import { createFileRoute, useParams } from '@tanstack/react-router'
import { AdminTenantDetail } from '@/features/admin/tenants/tenant-detail'

export const Route = createFileRoute('/_authenticated/admin/tenants/$tenantId')({
  component: TenantDetailPage,
})

function TenantDetailPage() {
  const { tenantId } = useParams({ from: '/_authenticated/admin/tenants/$tenantId' })
  return <AdminTenantDetail tenantId={tenantId} />
}

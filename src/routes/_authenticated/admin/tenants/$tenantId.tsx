import { createFileRoute } from '@tanstack/react-router'
import { AdminTenantDetail } from '@/features/admin/tenants/tenant-detail'

export const Route = createFileRoute('/_authenticated/admin/tenants/$tenantId')({
  component: AdminTenantDetail,
})

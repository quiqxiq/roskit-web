import { createFileRoute } from '@tanstack/react-router'
import { AdminTenants } from '@/features/admin/tenants'

export const Route = createFileRoute('/_authenticated/admin/tenants/')({
  component: AdminTenants,
})

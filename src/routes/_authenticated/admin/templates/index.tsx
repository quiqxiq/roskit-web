import { createFileRoute } from '@tanstack/react-router'
import { AdminGlobalTemplates } from '@/features/admin/templates'

export const Route = createFileRoute('/_authenticated/admin/templates/')({
  component: AdminGlobalTemplates,
})

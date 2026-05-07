import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useRoleMockStore } from '@/stores/role-mock-store'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => {
    const role = useRoleMockStore.getState().role
    if (role !== 'superadmin') {
      throw redirect({ to: '/403' })
    }
  },
  component: Outlet,
})

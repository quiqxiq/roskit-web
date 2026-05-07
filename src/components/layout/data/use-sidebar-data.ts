import { useMemo } from 'react'
import { useHotspotActiveStore } from '@/stores/hotspot-active-store'
import { useHotspotUsersStore } from '@/stores/hotspot-users-store'
import { useIsSuperadmin } from '@/stores/role-mock-store'
import { useTenantsStore } from '@/stores/tenants-store'
import { type SidebarData } from '../types'
import { sidebarData } from './sidebar-data'

export function useSidebarData(): SidebarData {
  const onlineUsers = useHotspotUsersStore(
    (s) => s.items.filter((u) => u.status === 'online').length
  )
  const activeSessions = useHotspotActiveStore((s) => s.items.length)
  const isSuperadmin = useIsSuperadmin()
  const tenantsCount = useTenantsStore((s) => s.items.length)

  return useMemo<SidebarData>(() => {
    return {
      ...sidebarData,
      navGroups: sidebarData.navGroups
        // Hide Platform group untuk non-superadmin
        .filter((group) => group.title !== 'Platform' || isSuperadmin)
        .map((group) => {
          if (group.title === 'Main') {
            return {
              ...group,
              items: group.items.map((item) => {
                if ('items' in item && item.title === 'Hotspot') {
                  const total = onlineUsers + activeSessions
                  return {
                    ...item,
                    badge: total > 0 ? String(total) : undefined,
                  }
                }
                return item
              }),
            }
          }
          if (group.title === 'Platform') {
            return {
              ...group,
              items: group.items.map((item) => {
                if (!('items' in item) && item.title === 'Tenants') {
                  return {
                    ...item,
                    badge: tenantsCount > 0 ? String(tenantsCount) : undefined,
                  }
                }
                return item
              }),
            }
          }
          return group
        }),
    }
  }, [onlineUsers, activeSessions, isSuperadmin, tenantsCount])
}

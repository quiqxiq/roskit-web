import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import * as svc from './service'

const activePrefix = (routerId: number) =>
  ['hotspot', 'active', routerId] as const

// Disconnect also clears the user's cookie, so cookie list must be invalidated.
const cookiesPrefix = (routerId: number) =>
  ['hotspot', 'cookies', routerId] as const

// ─────────────────── Queries ───────────────────

export function useHotspotActive(routerId: number) {
  return useQuery({
    queryKey: qk.hotspotActive(routerId),
    queryFn: () => svc.listHotspotActive(routerId),
    enabled: routerId > 0,
  })
}

// ─────────────────── Mutations ───────────────────

export function useRemoveHotspotActive(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => svc.removeHotspotActive(routerId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activePrefix(routerId) })
    },
  })
}

export function useDisconnectHotspotUser(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => svc.disconnectHotspotUser(routerId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activePrefix(routerId) })
      qc.invalidateQueries({ queryKey: cookiesPrefix(routerId) })
    },
  })
}

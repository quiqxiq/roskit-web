import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import * as svc from './service'
import type {
  HotspotUserListFilters,
  HotspotUserMutation,
} from './schema'

// Prefix used for invalidation. Matches the shape produced by `qk.hotspotUsers`
// (without the trailing filters object) so any user-related query is wiped.
const usersPrefix = (routerId: number) =>
  ['hotspot', 'users', routerId] as const

// ─────────────────── Queries ───────────────────

export function useHotspotUsers(
  routerId: number,
  filters?: HotspotUserListFilters,
) {
  return useQuery({
    queryKey: qk.hotspotUsers(routerId, filters),
    queryFn: () => svc.listHotspotUsers(routerId, filters),
    enabled: routerId > 0,
  })
}

export function useHotspotUserCount(routerId: number, profile?: string) {
  return useQuery({
    queryKey: qk.hotspotUserCount(routerId, profile),
    queryFn: () => svc.getHotspotUserCount(routerId, profile),
    enabled: routerId > 0,
  })
}

export function useHotspotUser(routerId: number, id: string) {
  return useQuery({
    queryKey: qk.hotspotUser(routerId, id),
    queryFn: () => svc.getHotspotUser(routerId, id),
    enabled: routerId > 0 && id.length > 0,
  })
}

// ─────────────────── Mutations ───────────────────

export function useAddHotspotUser(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: HotspotUserMutation) =>
      svc.addHotspotUser(routerId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersPrefix(routerId) })
    },
  })
}

export function useUpdateHotspotUser(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: HotspotUserMutation }) =>
      svc.updateHotspotUser(routerId, id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersPrefix(routerId) })
    },
  })
}

export function useRemoveHotspotUser(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => svc.removeHotspotUser(routerId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersPrefix(routerId) })
    },
  })
}

export function useResetHotspotUserCounters(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => svc.resetHotspotUserCounters(routerId, id),
    onSuccess: (_data, id) => {
      // Invalidate the single-user query (counters live on the record).
      qc.invalidateQueries({ queryKey: qk.hotspotUser(routerId, id) })
      qc.invalidateQueries({ queryKey: usersPrefix(routerId) })
    },
  })
}

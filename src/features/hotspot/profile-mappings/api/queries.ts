import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import * as svc from './service'
import type { UpdateMappingRequest } from './schema'

const mappingsPrefix = (routerId: number) =>
  ['profile-mappings', routerId] as const

// Mappings drive the enrichment of `/hotspot/profiles` list responses,
// so any change here must also invalidate the profiles list.
const profilesPrefix = (routerId: number) =>
  ['hotspot', 'profiles', routerId] as const

// ─────────────────── Queries ───────────────────

export function useProfileMappings(routerId: number) {
  return useQuery({
    queryKey: qk.profileMappings(routerId),
    queryFn: () => svc.listProfileMappings(routerId),
    enabled: routerId > 0,
  })
}

// ─────────────────── Mutations ───────────────────

export function useUpsertProfileMapping(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      profileName,
      patch,
    }: {
      profileName: string
      patch: UpdateMappingRequest
    }) => svc.upsertProfileMapping(routerId, profileName, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mappingsPrefix(routerId) })
      qc.invalidateQueries({ queryKey: profilesPrefix(routerId) })
    },
  })
}

export function useDeleteProfileMapping(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (profileName: string) =>
      svc.deleteProfileMapping(routerId, profileName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mappingsPrefix(routerId) })
      qc.invalidateQueries({ queryKey: profilesPrefix(routerId) })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import * as svc from './service'
import type { WalledGardenMutation } from './schema'

const hostPrefix = (routerId: number) =>
  ['hotspot', 'walled-garden', routerId] as const
const ipPrefix = (routerId: number) =>
  ['hotspot', 'walled-garden-ip', routerId] as const

// ───────────── Host-level rules ─────────────

export function useWalledGarden(routerId: number) {
  return useQuery({
    queryKey: qk.walledGarden(routerId),
    queryFn: () => svc.listWalledGarden(routerId),
    enabled: routerId > 0,
  })
}

export function useAddWalledGarden(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WalledGardenMutation) =>
      svc.addWalledGarden(routerId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hostPrefix(routerId) })
    },
  })
}

export function useRemoveWalledGarden(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (wid: string) => svc.removeWalledGarden(routerId, wid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hostPrefix(routerId) })
    },
  })
}

// ───────────── IP / firewall-level rules ─────────────

export function useWalledGardenIP(routerId: number) {
  return useQuery({
    queryKey: qk.walledGardenIP(routerId),
    queryFn: () => svc.listWalledGardenIP(routerId),
    enabled: routerId > 0,
  })
}

export function useAddWalledGardenIP(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WalledGardenMutation) =>
      svc.addWalledGardenIP(routerId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ipPrefix(routerId) })
    },
  })
}

export function useRemoveWalledGardenIP(routerId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (wid: string) => svc.removeWalledGardenIP(routerId, wid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ipPrefix(routerId) })
    },
  })
}

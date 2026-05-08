import { apiClient } from '@/lib/api/client'
import type { AddResult, Envelope } from '@/lib/api/types'
import { unwrap } from '@/lib/api/unwrap'
import type {
  WalledGardenIPRecord,
  WalledGardenMutation,
  WalledGardenRecord,
} from './schema'

const hostBase = (rid: number) => `/routers/${rid}/hotspot/walled-garden`
const ipBase = (rid: number) => `/routers/${rid}/hotspot/walled-garden-ip`

// ───────────── Host-level rules ─────────────

// GET /hotspot/walled-garden — list host-level rules.
export async function listWalledGarden(
  routerId: number,
): Promise<WalledGardenRecord[]> {
  const res = await apiClient.get<Envelope<WalledGardenRecord[]>>(hostBase(routerId))
  return unwrap(res.data)
}

// POST /hotspot/walled-garden — add a host-level rule.
export async function addWalledGarden(
  routerId: number,
  payload: WalledGardenMutation,
): Promise<AddResult> {
  const res = await apiClient.post<Envelope<AddResult>>(hostBase(routerId), payload)
  return unwrap(res.data)
}

// DELETE /hotspot/walled-garden/{wid} — remove a host-level rule.
export async function removeWalledGarden(
  routerId: number,
  wid: string,
): Promise<void> {
  await apiClient.delete(`${hostBase(routerId)}/${encodeURIComponent(wid)}`)
}

// ───────────── IP / firewall-level rules ─────────────

// GET /hotspot/walled-garden-ip — list IP/firewall rules.
export async function listWalledGardenIP(
  routerId: number,
): Promise<WalledGardenIPRecord[]> {
  const res = await apiClient.get<Envelope<WalledGardenIPRecord[]>>(ipBase(routerId))
  return unwrap(res.data)
}

// POST /hotspot/walled-garden-ip — add an IP/firewall rule.
export async function addWalledGardenIP(
  routerId: number,
  payload: WalledGardenMutation,
): Promise<AddResult> {
  const res = await apiClient.post<Envelope<AddResult>>(ipBase(routerId), payload)
  return unwrap(res.data)
}

// DELETE /hotspot/walled-garden-ip/{wid} — remove an IP/firewall rule.
export async function removeWalledGardenIP(
  routerId: number,
  wid: string,
): Promise<void> {
  await apiClient.delete(`${ipBase(routerId)}/${encodeURIComponent(wid)}`)
}

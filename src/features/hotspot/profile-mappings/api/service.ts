import { apiClient } from '@/lib/api/client'
import type { Envelope } from '@/lib/api/types'
import { unwrap } from '@/lib/api/unwrap'
import type { ProfilePriceMapping, UpdateMappingRequest } from './schema'

const base = (rid: number) => `/routers/${rid}/profile-mappings`

// GET /profile-mappings — list all mappings for the router.
export async function listProfileMappings(
  routerId: number,
): Promise<ProfilePriceMapping[]> {
  const res = await apiClient.get<Envelope<ProfilePriceMapping[]>>(base(routerId))
  return unwrap(res.data)
}

// PUT /profile-mappings/{profileName} — upsert a mapping by profile name.
// Returns the resulting row. Profile names with spaces must be URL-encoded;
// `encodeURIComponent` handles that here.
export async function upsertProfileMapping(
  routerId: number,
  profileName: string,
  patch: UpdateMappingRequest,
): Promise<ProfilePriceMapping> {
  const res = await apiClient.put<Envelope<ProfilePriceMapping>>(
    `${base(routerId)}/${encodeURIComponent(profileName)}`,
    patch,
  )
  return unwrap(res.data)
}

// DELETE /profile-mappings/{profileName} — remove a mapping; the profile
// itself remains on RouterOS, just without enrichment metadata.
export async function deleteProfileMapping(
  routerId: number,
  profileName: string,
): Promise<void> {
  await apiClient.delete(
    `${base(routerId)}/${encodeURIComponent(profileName)}`,
  )
}

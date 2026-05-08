import { z } from 'zod'

// Mirror of docs/openapi/paths/profile_mapping.yaml#/ProfilePriceMapping
//
// DB-backed metadata that overlays a hotspot profile name with pricing
// and validity info. Roskit's hotspot/profiles list endpoint enriches
// RouterOS profiles with these rows. Profile names without a mapping
// fall back to defaults defined elsewhere.
//
// Note: route is `/routers/{rid}/profile-mappings/*` — NOT under
// `/hotspot/*`. We co-locate the feature under `features/hotspot/` because
// it is conceptually owned by the hotspot pricing UX.
export const ProfilePriceMappingSchema = z.object({
  id: z.number().int(),
  router_id: z.number().int(),
  profile_name: z.string().max(100),
  price: z.number().int().min(0).optional(),
  selling_price: z.number().int().min(0).optional(),
  validity: z.string().max(20).optional(),
  exp_mode: z.string().max(10).optional(),
  lock_user: z.boolean().optional(),
  lock_server: z.boolean().optional(),
})
export type ProfilePriceMapping = z.infer<typeof ProfilePriceMappingSchema>

// Body for PUT /profile-mappings/{profileName} — partial; only supplied
// fields are applied. The path identifies which profile to upsert.
export const UpdateMappingRequestSchema = z.object({
  price: z.number().int().min(0).optional(),
  selling_price: z.number().int().min(0).optional(),
  validity: z.string().max(64).optional(),
  exp_mode: z.string().max(32).optional(),
  lock_user: z.boolean().optional(),
  lock_server: z.boolean().optional(),
})
export type UpdateMappingRequest = z.infer<typeof UpdateMappingRequestSchema>

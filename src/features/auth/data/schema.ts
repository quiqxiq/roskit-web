import { z } from 'zod'

// Mirror of docs/openapi/components/schemas/auth.yaml.
// Backend implementation: internal/api/handlers/auth_handler.go +
// internal/services/auth_service.go.

export const UserRoleSchema = z.enum([
  'owner',
  'admin',
  'staff',
  'superadmin',
])
export type UserRoleT = z.infer<typeof UserRoleSchema>

// `tenant_id` is null for superadmins (cross-tenant operators).
export const UserViewSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  role: UserRoleSchema,
  tenant_id: z.number().int().nullable(),
  tenant_slug: z.string(),
})
export type UserView = z.infer<typeof UserViewSchema>

// ─────────────────── Login ───────────────────

export const LoginRequestSchema = z.object({
  // Tenant slug is optional only for superadmin login.
  tenant: z.string().max(100).optional(),
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResultSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  // Lifetime of the access token in seconds (e.g. 900 = 15min).
  expires_in: z.number().int(),
  user: UserViewSchema,
})
export type LoginResult = z.infer<typeof LoginResultSchema>

// ─────────────────── Refresh ───────────────────

export const RefreshRequestSchema = z.object({
  refresh_token: z.string().min(10).max(4096),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

// ─────────────────── Logout ───────────────────

export const LogoutRequestSchema = z.object({
  refresh_token: z.string().max(4096).optional(),
})
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>

// ─────────────────── Change password ───────────────────

export const ChangePasswordRequestSchema = z.object({
  old_password: z.string().min(1).max(128),
  new_password: z.string().min(6).max(128),
})
export type ChangePasswordRequest = z.infer<
  typeof ChangePasswordRequestSchema
>

// ─────────────────── First-tenant setup ───────────────────

// Mirrors backend SetupRequest. The slug pattern enforces lowercase
// alphanumerics + hyphens, 2-100 chars, not starting/ending with hyphen.
export const SetupRequestSchema = z.object({
  tenant_name: z.string().min(2).max(100),
  tenant_slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/),
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(128),
})
export type SetupRequest = z.infer<typeof SetupRequestSchema>

export const SetupResultSchema = z.object({
  tenant: z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
  }),
  user: z.object({
    id: z.number().int(),
    username: z.string(),
    role: UserRoleSchema,
  }),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number().int(),
})
export type SetupResult = z.infer<typeof SetupResultSchema>

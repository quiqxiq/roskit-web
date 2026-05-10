import { z } from 'zod'

// Source of truth: internal/api/handlers/auth_handler.go +
// internal/services/auth_service.go (NOT the OpenAPI yaml — yaml is stale).
// Backend is single-tenant: there is no tenant_id, tenant_slug, or owner role.

export const UserRoleSchema = z.enum(['admin', 'staff'])
export type UserRoleT = z.infer<typeof UserRoleSchema>

// Mirror of services.UserView — the shape returned by /auth/me and
// embedded in LoginResult.user.
export const UserViewSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  role: UserRoleSchema,
})
export type UserView = z.infer<typeof UserViewSchema>

// ─────────────────── Login ───────────────────

export const LoginRequestSchema = z.object({
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

// ─────────────────── First-admin setup ───────────────────

// Mirrors handlers.setupRequest — creates the first admin user when no
// users exist yet. After the first call succeeds, the endpoint returns
// 403 "setup already completed" on subsequent attempts.
export const SetupRequestSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(128),
})
export type SetupRequest = z.infer<typeof SetupRequestSchema>

// Backend response (handlers.AuthHandler.Setup) auto-issues tokens after
// creating the user, so the SPA is logged in immediately.
export const SetupResultSchema = z.object({
  user: UserViewSchema,
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number().int(),
})
export type SetupResult = z.infer<typeof SetupResultSchema>

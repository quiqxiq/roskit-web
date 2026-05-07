// Tenant entity types — selaras dengan @/internal/models/tenant.go
// dan @/internal/services/tenant_service.go (CreateTenantRequest).

export type TenantStatus = 'active' | 'trial' | 'suspended'
export type TenantPlan = 'free' | 'starter' | 'pro'

export type TenantSettings = {
  hotspotName: string
  dnsName: string
  currency: string
  phone: string
  email: string
  infoLP: string
  idleTimeout: number
  reportMode: 'enable' | 'disable'
}

export type Tenant = {
  id: string
  name: string
  slug: string
  plan: TenantPlan
  status: TenantStatus
  createdAt: Date
  updatedAt: Date
  settings: TenantSettings
  // mock-only counters; backend punya relasi nyata
  usersCount: number
  routersCount: number
  voucherSalesCount: number
}

export type TenantPlanMeta = {
  label: string
  description: string
  badgeVariant: 'free' | 'starter' | 'pro'
}

export const planMeta: Record<TenantPlan, TenantPlanMeta> = {
  free: {
    label: 'Free',
    description: 'Free tier · 1 router · basic features',
    badgeVariant: 'free',
  },
  starter: {
    label: 'Starter',
    description: 'Starter · up to 3 routers · email support',
    badgeVariant: 'starter',
  },
  pro: {
    label: 'Pro',
    description: 'Pro · unlimited routers · priority support',
    badgeVariant: 'pro',
  },
}

export const statusMeta: Record<
  TenantStatus,
  { label: string; description: string }
> = {
  active: { label: 'Active', description: 'Tenant aktif dan dapat login' },
  trial: { label: 'Trial', description: 'Periode trial · ada limit waktu' },
  suspended: {
    label: 'Suspended',
    description: 'Login tenant ditolak sampai diaktifkan kembali',
  },
}

export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/

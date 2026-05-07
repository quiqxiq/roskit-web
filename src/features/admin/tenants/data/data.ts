import {
  type Tenant,
  type TenantPlan,
  type TenantSettings,
  type TenantStatus,
} from './schema'

const baseSettings = (overrides: Partial<TenantSettings> = {}): TenantSettings => ({
  hotspotName: 'My Hotspot',
  dnsName: 'hotspot.local',
  currency: 'Rp',
  phone: '',
  email: '',
  infoLP: '',
  idleTimeout: 30,
  reportMode: 'enable',
  ...overrides,
})

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

export const tenantsSeed: Tenant[] = [
  {
    id: '1',
    name: 'Bintang Net',
    slug: 'bintang-net',
    plan: 'pro',
    status: 'active',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(2),
    settings: baseSettings({
      hotspotName: 'Bintang WiFi',
      currency: 'Rp',
      phone: '+62 812-3456-7890',
      email: 'admin@bintang.net',
      infoLP: 'Pembelian voucher: 0812-3456-7890',
    }),
    usersCount: 3,
    routersCount: 4,
    voucherSalesCount: 2840,
  },
  {
    id: '2',
    name: 'Warkop Sederhana',
    slug: 'warkop-sederhana',
    plan: 'starter',
    status: 'active',
    createdAt: daysAgo(64),
    updatedAt: daysAgo(1),
    settings: baseSettings({
      hotspotName: 'Warkop Sederhana',
      currency: 'Rp',
      email: 'owner@warkop.example',
    }),
    usersCount: 2,
    routersCount: 1,
    voucherSalesCount: 612,
  },
  {
    id: '3',
    name: 'Cafe Senja',
    slug: 'cafe-senja',
    plan: 'free',
    status: 'trial',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    settings: baseSettings({
      hotspotName: 'Cafe Senja Free WiFi',
      email: 'admin@cafesenja.example',
    }),
    usersCount: 1,
    routersCount: 1,
    voucherSalesCount: 18,
  },
  {
    id: '4',
    name: 'Kos Putri Melati',
    slug: 'kos-putri-melati',
    plan: 'starter',
    status: 'suspended',
    createdAt: daysAgo(220),
    updatedAt: daysAgo(45),
    settings: baseSettings({
      hotspotName: 'Kos Melati WiFi',
      currency: 'Rp',
    }),
    usersCount: 1,
    routersCount: 1,
    voucherSalesCount: 1230,
  },
  {
    id: '5',
    name: 'Sekolah Harapan',
    slug: 'sekolah-harapan',
    plan: 'pro',
    status: 'active',
    createdAt: daysAgo(380),
    updatedAt: daysAgo(3),
    settings: baseSettings({
      hotspotName: 'Sekolah Harapan WiFi',
      currency: 'Rp',
      email: 'it@sekolah-harapan.sch.id',
      idleTimeout: 60,
    }),
    usersCount: 8,
    routersCount: 3,
    voucherSalesCount: 4520,
  },
]

export const planOptions: { value: TenantPlan; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
]

export const statusOptions: { value: TenantStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspended' },
]

export function emptySettings(): TenantSettings {
  return baseSettings()
}

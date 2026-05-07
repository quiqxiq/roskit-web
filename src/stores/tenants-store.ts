import { create } from 'zustand'
import { tenantsSeed } from '@/features/admin/tenants/data/data'
import { type Tenant } from '@/features/admin/tenants/data/schema'

type TenantsState = {
  items: Tenant[]
  add: (tenant: Tenant) => void
  updateName: (id: string, name: string) => void
  suspend: (id: string) => void
  activate: (id: string) => void
  hardDelete: (id: string) => void
  hardDeleteMany: (ids: string[]) => void
  reset: () => void
}

export const useTenantsStore = create<TenantsState>()((set) => ({
  items: [...tenantsSeed],
  add: (tenant) => set((state) => ({ items: [tenant, ...state.items] })),
  updateName: (id, name) =>
    set((state) => ({
      items: state.items.map((t) =>
        t.id === id ? { ...t, name, updatedAt: new Date() } : t
      ),
    })),
  suspend: (id) =>
    set((state) => ({
      items: state.items.map((t) =>
        t.id === id ? { ...t, status: 'suspended', updatedAt: new Date() } : t
      ),
    })),
  activate: (id) =>
    set((state) => ({
      items: state.items.map((t) =>
        t.id === id ? { ...t, status: 'active', updatedAt: new Date() } : t
      ),
    })),
  hardDelete: (id) =>
    set((state) => ({ items: state.items.filter((t) => t.id !== id) })),
  hardDeleteMany: (ids) =>
    set((state) => ({
      items: state.items.filter((t) => !ids.includes(t.id)),
    })),
  reset: () => set({ items: [...tenantsSeed] }),
}))

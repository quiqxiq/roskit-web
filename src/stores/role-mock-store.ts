import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock role store dipisah dari auth-store agar tidak mengganggu flow login.
// Saat real-API wiring nanti, helper isSuperadmin() bisa dipindah ke auth-store
// dan store ini dihapus.

export type AppRole = 'superadmin' | 'owner' | 'admin' | 'staff'

type RoleMockState = {
  role: AppRole
  setRole: (role: AppRole) => void
}

export const useRoleMockStore = create<RoleMockState>()(
  persist(
    (set) => ({
      // Default mock role: superadmin agar admin pages langsung visible
      role: 'superadmin',
      setRole: (role) => set({ role }),
    }),
    { name: 'roskit-role-mock' }
  )
)

export function useIsSuperadmin(): boolean {
  return useRoleMockStore((s) => s.role === 'superadmin')
}

export const ROLE_OPTIONS: { value: AppRole; label: string }[] = [
  { value: 'superadmin', label: 'Superadmin' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
]

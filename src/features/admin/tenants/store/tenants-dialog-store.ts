import { create } from 'zustand'
import { type Tenant } from '../data/schema'

export type TenantDialogMode =
  | 'create'
  | 'edit-name'
  | 'suspend'
  | 'activate'
  | 'hard-delete'
  | 'hard-delete-many'
  | null

type TenantsDialogState = {
  mode: TenantDialogMode
  target: Tenant | null
  ids: string[]
  open: (
    mode: Exclude<TenantDialogMode, null>,
    payload?: { target?: Tenant; ids?: string[] }
  ) => void
  close: () => void
}

export const useTenantsDialogStore = create<TenantsDialogState>()((set) => ({
  mode: null,
  target: null,
  ids: [],
  open: (mode, payload) =>
    set({
      mode,
      target: payload?.target ?? null,
      ids: payload?.ids ?? [],
    }),
  close: () => set({ mode: null, target: null, ids: [] }),
}))

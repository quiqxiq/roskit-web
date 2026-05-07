import { TenantCreateDrawer } from './tenant-create-drawer'
import { TenantEditNameDialog } from './tenant-edit-name-dialog'
import { TenantHardDeleteDialog } from './tenant-hard-delete-dialog'
import { TenantSuspendActivateDialog } from './tenant-suspend-activate-dialog'

export function TenantDialogs() {
  return (
    <>
      <TenantCreateDrawer />
      <TenantEditNameDialog />
      <TenantSuspendActivateDialog />
      <TenantHardDeleteDialog />
    </>
  )
}

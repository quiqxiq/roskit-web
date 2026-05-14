import { RoutersDeleteDialog } from './routers-delete-dialog'
import { RoutersMutateDialog } from './routers-mutate-dialog'
import { RoutersTestDialog } from './routers-test-dialog'

export function RoutersDialogs() {
  return (
    <>
      <RoutersMutateDialog />
      <RoutersDeleteDialog />
      <RoutersTestDialog />
    </>
  )
}

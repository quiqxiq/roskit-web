import { toast } from 'sonner'
import { useTenantsStore } from '@/stores/tenants-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTenantsDialogStore } from '../store/tenants-dialog-store'

export function TenantSuspendActivateDialog() {
  const { mode, target, close } = useTenantsDialogStore()
  const suspend = useTenantsStore((s) => s.suspend)
  const activate = useTenantsStore((s) => s.activate)

  const isSuspend = mode === 'suspend'
  const isActivate = mode === 'activate'
  const isOpen = isSuspend || isActivate

  const handleConfirm = () => {
    if (!target) return
    if (isSuspend) {
      suspend(target.id)
      toast.success(`Tenant '${target.slug}' suspended`)
    } else {
      activate(target.id)
      toast.success(`Tenant '${target.slug}' activated`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSuspend ? 'Suspend tenant?' : 'Activate tenant?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSuspend
              ? `Tenant '${target?.slug}' tidak akan bisa login sampai diaktifkan kembali. Data tetap utuh.`
              : `Tenant '${target?.slug}' akan kembali bisa login.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              isSuspend
                ? 'bg-orange-600 text-white hover:bg-orange-600/90'
                : undefined
            }
          >
            {isSuspend ? 'Suspend' : 'Activate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

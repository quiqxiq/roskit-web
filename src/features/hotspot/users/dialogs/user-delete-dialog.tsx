import { toast } from 'sonner'
import { useHotspotUsersStore } from '@/stores/hotspot-users-store'
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
import { useUsersDialogStore } from '../store/users-dialog-store'

export function UserDeleteDialog() {
  const { mode, target, ids, close } = useUsersDialogStore()
  const remove = useHotspotUsersStore((s) => s.remove)
  const removeMany = useHotspotUsersStore((s) => s.removeMany)

  const isOpen = mode === 'delete' || mode === 'multi-delete'

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      remove(target.id)
      toast.success(`User '${target.username}' removed`)
    } else if (mode === 'multi-delete' && ids.length > 0) {
      removeMany(ids)
      toast.success(`Removed ${ids.length} user${ids.length > 1 ? 's' : ''}`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'multi-delete'
              ? `Remove ${ids.length} user${ids.length > 1 ? 's' : ''}?`
              : 'Remove user?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'Selected users will be permanently removed from RouterOS.'
              : target
                ? `User '${target.username}' will be permanently removed from RouterOS.`
                : 'This user will be removed.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

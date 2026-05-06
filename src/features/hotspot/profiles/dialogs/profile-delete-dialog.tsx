import { toast } from 'sonner'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
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
import { useProfilesDialogStore } from '../store/profiles-dialog-store'

export function ProfileDeleteDialog() {
  const { mode, target, ids, close } = useProfilesDialogStore()
  const remove = useHotspotProfilesStore((s) => s.remove)
  const removeMany = useHotspotProfilesStore((s) => s.removeMany)

  const isOpen = mode === 'delete' || mode === 'multi-delete'

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      remove(target.id)
      toast.success(`Profile '${target.name}' deleted`)
    } else if (mode === 'multi-delete' && ids.length > 0) {
      removeMany(ids)
      toast.success(
        `Deleted ${ids.length} profile${ids.length > 1 ? 's' : ''}`
      )
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'multi-delete'
              ? `Delete ${ids.length} profile${ids.length > 1 ? 's' : ''}?`
              : 'Delete profile?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'Selected profiles will be permanently removed. Existing users on these profiles will be orphaned.'
              : target
                ? `Profile '${target.name}' will be permanently removed.`
                : 'This profile will be removed.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

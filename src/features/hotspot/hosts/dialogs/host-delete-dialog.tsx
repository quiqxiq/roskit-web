import { toast } from 'sonner'
import { useHotspotHostsStore } from '@/stores/hotspot-hosts-store'
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
import { useHostsDialogStore } from '../store/hosts-dialog-store'

export function HostDeleteDialog() {
  const { mode, target, ids, close } = useHostsDialogStore()
  const remove = useHotspotHostsStore((s) => s.remove)
  const removeMany = useHotspotHostsStore((s) => s.removeMany)

  const isOpen = mode === 'delete' || mode === 'multi-delete'

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      remove(target.id)
      toast.success(`Host ${target.macAddress} removed`)
    } else if (mode === 'multi-delete' && ids.length > 0) {
      removeMany(ids)
      toast.success(`Removed ${ids.length} host${ids.length > 1 ? 's' : ''}`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'multi-delete'
              ? `Remove ${ids.length} host${ids.length > 1 ? 's' : ''}?`
              : 'Remove host entry?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'Selected host entries will be removed from the cache.'
              : target
                ? `Host ${target.macAddress} (${target.address}) will be removed from the cache.`
                : 'This host will be removed.'}
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

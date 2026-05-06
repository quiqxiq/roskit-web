import { toast } from 'sonner'
import { useHotspotActiveStore } from '@/stores/hotspot-active-store'
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
import { useActiveDialogStore } from '../store/active-dialog-store'

export function DisconnectDialog() {
  const { mode, target, ids, close } = useActiveDialogStore()
  const sessions = useHotspotActiveStore((s) => s.items)
  const remove = useHotspotActiveStore((s) => s.remove)
  const removeMany = useHotspotActiveStore((s) => s.removeMany)

  const isOpen =
    mode === 'disconnect' ||
    mode === 'disconnect-many' ||
    mode === 'disconnect-all'

  const handleConfirm = () => {
    if (mode === 'disconnect' && target) {
      remove(target.id)
      toast.success(`${target.user} disconnected`)
    } else if (mode === 'disconnect-many' && ids.length > 0) {
      removeMany(ids)
      toast.success(
        `Disconnected ${ids.length} session${ids.length > 1 ? 's' : ''}`
      )
    } else if (mode === 'disconnect-all') {
      const allIds = sessions.map((s) => s.id)
      removeMany(allIds)
      toast.success(`Disconnected all ${allIds.length} sessions`)
    }
    close()
  }

  const titleCount =
    mode === 'disconnect-all'
      ? sessions.length
      : mode === 'disconnect-many'
        ? ids.length
        : 1

  const title =
    mode === 'disconnect-all'
      ? `Disconnect all ${sessions.length} sessions?`
      : mode === 'disconnect-many'
        ? `Disconnect ${ids.length} session${ids.length > 1 ? 's' : ''}?`
        : 'Disconnect session?'

  const description =
    mode === 'disconnect-all'
      ? 'Every active hotspot session will be terminated. Connected users must log in again.'
      : mode === 'disconnect-many'
        ? 'Selected sessions will be terminated. Affected users must log in again.'
        : target
          ? `Session for ${target.user} (${target.address}) will be terminated.`
          : 'This session will be terminated.'

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={titleCount === 0}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { toast } from 'sonner'
import { useQuickPrintPresetsStore } from '@/stores/quick-print-presets-store'
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
import { usePresetsDialogStore } from '../store/presets-dialog-store'

export function PresetDeleteDialog() {
  const { mode, target, close } = usePresetsDialogStore()
  const remove = useQuickPrintPresetsStore((s) => s.remove)

  const isOpen = mode === 'delete'

  const handleConfirm = () => {
    if (target) {
      remove(target.id)
      toast.success(`Preset '${target.name}' deleted`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete preset?</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Preset '${target.name}' (${target.package}) will be permanently removed.`
              : 'This preset will be removed.'}{' '}
            This action cannot be undone.
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

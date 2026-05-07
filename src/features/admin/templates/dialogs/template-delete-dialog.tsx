import { toast } from 'sonner'
import { useGlobalTemplatesStore } from '@/stores/global-templates-store'
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
import { useTemplatesDialogStore } from '../store/templates-dialog-store'

export function TemplateDeleteDialog() {
  const { mode, target, ids, close } = useTemplatesDialogStore()
  const remove = useGlobalTemplatesStore((s) => s.remove)
  const removeMany = useGlobalTemplatesStore((s) => s.removeMany)

  const isOpen = mode === 'delete' || mode === 'multi-delete'

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      remove(target.id)
      toast.success(`Template '${target.name}' deleted`)
    } else if (mode === 'multi-delete' && ids.length > 0) {
      removeMany(ids)
      toast.success(`Deleted ${ids.length} templates`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'multi-delete'
              ? `Delete ${ids.length} templates?`
              : 'Delete template?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'Selected global templates will be removed. Existing tenants tetap punya copy lokal mereka.'
              : target
                ? `Template '${target.name}' will be removed. Existing tenants tetap punya copy lokal mereka.`
                : 'This template will be removed.'}
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

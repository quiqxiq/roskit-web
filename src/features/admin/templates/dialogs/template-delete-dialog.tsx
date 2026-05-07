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
  const targetIsBuiltin =
    mode === 'delete' && target?.isBuiltin === true

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      const ok = remove(target.id)
      if (ok) {
        toast.success(`Template '${target.name}' deleted`)
      } else {
        toast.error(`Built-in template '${target.name}' tidak bisa dihapus`)
      }
    } else if (mode === 'multi-delete' && ids.length > 0) {
      const result = removeMany(ids)
      if (result.removed > 0) {
        toast.success(
          `Deleted ${result.removed} template${result.removed > 1 ? 's' : ''}` +
            (result.skipped > 0
              ? ` · ${result.skipped} built-in dilewati`
              : '')
        )
      } else {
        toast.error('Semua template dipilih adalah built-in dan tidak bisa dihapus')
      }
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
              : targetIsBuiltin
                ? 'Cannot delete built-in template'
                : 'Delete template?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'Selected templates will be removed. Built-in template (Default/Small/Thermal) akan otomatis dilewati. Existing tenants tetap punya copy lokal mereka.'
              : targetIsBuiltin
                ? `Template '${target?.name}' adalah built-in dan tidak bisa dihapus. Gunakan tombol "Reset to default" pada drawer edit untuk mengembalikan ke source.`
                : target
                  ? `Template '${target.name}' will be removed. Existing tenants tetap punya copy lokal mereka.`
                  : 'This template will be removed.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {targetIsBuiltin ? 'OK' : 'Cancel'}
          </AlertDialogCancel>
          {!targetIsBuiltin && (
            <AlertDialogAction
              onClick={handleConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

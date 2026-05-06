import { toast } from 'sonner'
import { useVoucherSalesStore } from '@/stores/voucher-sales-store'
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
import { useSalesDialogStore } from '../store/sales-dialog-store'

export function SalesDialogs() {
  const { mode, target, ids, close } = useSalesDialogStore()
  const removeSale = useVoucherSalesStore((s) => s.remove)
  const removeMany = useVoucherSalesStore((s) => s.removeMany)

  const isOpen = mode === 'delete' || mode === 'multi-delete'

  const handleConfirm = () => {
    if (mode === 'delete' && target) {
      removeSale(target.id)
      toast.success('Sale deleted', {
        description: `Voucher ${target.username} removed`,
      })
    } else if (mode === 'multi-delete' && ids.length > 0) {
      removeMany(ids)
      toast.success(`Deleted ${ids.length} sale${ids.length > 1 ? 's' : ''}`)
    }
    close()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'multi-delete'
              ? `Delete ${ids.length} sale${ids.length > 1 ? 's' : ''}?`
              : 'Delete this sale?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'multi-delete'
              ? 'This will permanently remove the selected sale records from the report. This action cannot be undone.'
              : target
                ? `Voucher ${target.username} (${target.profileName}) will be removed from the report. This action cannot be undone.`
                : 'This sale record will be removed.'}
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

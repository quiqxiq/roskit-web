import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Tenant } from '../data/schema'
import { useTenantsDialogStore } from '../store/tenants-dialog-store'

const CASCADE_LIST =
  'tenant_settings · users · routers · voucher_sales · print_templates · audit_logs'

export function TenantHardDeleteDialog() {
  const { mode, target, ids, close } = useTenantsDialogStore()
  const tenants = useTenantsStore((s) => s.items)
  const isOpen = mode === 'hard-delete' || mode === 'hard-delete-many'

  if (mode === 'hard-delete-many') {
    const targets = tenants.filter((t) => ids.includes(t.id))
    return (
      <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
        {isOpen && (
          <BulkDeleteForm
            key={ids.join(',')}
            targets={targets}
            onClose={close}
          />
        )}
      </AlertDialog>
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && target && (
        <SingleDeleteForm key={target.id} target={target} onClose={close} />
      )}
    </AlertDialog>
  )
}

function SingleDeleteForm({
  target,
  onClose,
}: {
  target: Tenant
  onClose: () => void
}) {
  const hardDelete = useTenantsStore((s) => s.hardDelete)
  const [typed, setTyped] = useState('')
  const matches = typed === target.slug

  const handleConfirm = () => {
    if (!matches) return
    hardDelete(target.id)
    toast.success(`Tenant '${target.slug}' deleted with all child data`)
    onClose()
  }

  return (
    <AlertDialogContent className='max-w-md'>
      <AlertDialogHeader>
        <AlertDialogTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='size-5' />
          Hard delete tenant?
        </AlertDialogTitle>
        <AlertDialogDescription className='space-y-2'>
          <span className='block'>
            This will <b>CASCADE delete</b>: <span className='font-mono text-[11px]'>{CASCADE_LIST}</span>
          </span>
          <span className='block text-destructive'>
            This action cannot be undone.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-medium text-muted-foreground'>
          Type <span className='font-mono text-foreground'>{target.slug}</span> to confirm
        </Label>
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={target.slug}
          autoFocus
          className='font-mono'
        />
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={!matches}
          className='bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50'
        >
          Hard Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

function BulkDeleteForm({
  targets,
  onClose,
}: {
  targets: Tenant[]
  onClose: () => void
}) {
  const hardDeleteMany = useTenantsStore((s) => s.hardDeleteMany)
  const [typed, setTyped] = useState('')
  const matches = typed === 'DELETE'

  const handleConfirm = () => {
    if (!matches) return
    hardDeleteMany(targets.map((t) => t.id))
    toast.success(`Deleted ${targets.length} tenants with all child data`)
    onClose()
  }

  return (
    <AlertDialogContent className='max-w-md'>
      <AlertDialogHeader>
        <AlertDialogTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='size-5' />
          Hard delete {targets.length} tenants?
        </AlertDialogTitle>
        <AlertDialogDescription className='space-y-2'>
          <span className='block'>
            CASCADE delete on each: <span className='font-mono text-[11px]'>{CASCADE_LIST}</span>
          </span>
          <span className='block text-destructive'>
            This action cannot be undone.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className='rounded-md border bg-muted/40 p-2'>
        <ul className='max-h-32 overflow-y-auto font-mono text-[11px]'>
          {targets.slice(0, 50).map((t) => (
            <li key={t.id}>{t.slug}</li>
          ))}
          {targets.length > 50 && (
            <li className='text-muted-foreground'>
              + {targets.length - 50} more
            </li>
          )}
        </ul>
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-medium text-muted-foreground'>
          Type <span className='font-mono text-foreground'>DELETE</span> to confirm
        </Label>
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder='DELETE'
          autoFocus
          className='font-mono'
        />
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={!matches}
          className='bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50'
        >
          Hard Delete {targets.length}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

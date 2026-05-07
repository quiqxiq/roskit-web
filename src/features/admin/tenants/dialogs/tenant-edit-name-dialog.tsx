import { useState } from 'react'
import { toast } from 'sonner'
import { useTenantsStore } from '@/stores/tenants-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Tenant } from '../data/schema'
import { useTenantsDialogStore } from '../store/tenants-dialog-store'

export function TenantEditNameDialog() {
  const { mode, target, close } = useTenantsDialogStore()
  const isOpen = mode === 'edit-name'
  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && target && (
        <EditForm key={target.id} target={target} onClose={close} />
      )}
    </Dialog>
  )
}

function EditForm({ target, onClose }: { target: Tenant; onClose: () => void }) {
  const updateName = useTenantsStore((s) => s.updateName)
  const [name, setName] = useState(target.name)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    if (name === target.name) {
      onClose()
      return
    }
    updateName(target.id, name.trim())
    toast.success(`Tenant renamed to '${name.trim()}'`)
    onClose()
  }

  return (
    <DialogContent className='max-w-md'>
      <DialogHeader>
        <DialogTitle>Edit Tenant Name</DialogTitle>
        <DialogDescription>
          Slug <span className='font-mono'>{target.slug}</span> tidak bisa diubah.
        </DialogDescription>
      </DialogHeader>
      <form id='tenant-edit-form' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-medium text-muted-foreground'>
            Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Tenant name'
            autoFocus
          />
        </div>
      </form>
      <DialogFooter>
        <Button variant='outline' size='sm' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' size='sm' form='tenant-edit-form'>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

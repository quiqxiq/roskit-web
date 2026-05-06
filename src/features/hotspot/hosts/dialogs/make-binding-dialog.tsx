import { useState } from 'react'
import { toast } from 'sonner'
import { useHotspotHostsStore } from '@/stores/hotspot-hosts-store'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useHostsDialogStore } from '../store/hosts-dialog-store'

const TYPES = [
  { value: 'bypassed', label: 'Bypassed' },
  { value: 'regular', label: 'Regular' },
  { value: 'blocked', label: 'Blocked' },
]

type BindingDraft = {
  mac: string
  address: string
  toAddress: string
  comment: string
  type: string
}

const EMPTY_DRAFT: BindingDraft = {
  mac: '',
  address: '',
  toAddress: '',
  comment: '',
  type: 'bypassed',
}

export function MakeBindingDialog() {
  const { mode, target, ids, close } = useHostsDialogStore()
  const isOpen = mode === 'bind' || mode === 'bind-many'
  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && (
        <BindingForm
          key={target?.id ?? `bulk-${ids.length}`}
          mode={mode === 'bind-many' ? 'bind-many' : 'bind'}
          target={target}
          ids={ids}
          onClose={close}
        />
      )}
    </Dialog>
  )
}

type BindingFormProps = {
  mode: 'bind' | 'bind-many'
  target: import('../data/schema').HotspotHost | null
  ids: string[]
  onClose: () => void
}

function BindingForm({ mode, target, ids, onClose }: BindingFormProps) {
  const hosts = useHotspotHostsStore((s) => s.items)
  const bypass = useHotspotHostsStore((s) => s.bypass)
  const bypassMany = useHotspotHostsStore((s) => s.bypassMany)
  const isBulk = mode === 'bind-many'

  const [draft, setDraft] = useState<BindingDraft>(() => {
    if (!isBulk && target) {
      return {
        mac: target.macAddress,
        address: target.address,
        toAddress: target.toAddress,
        comment: target.comment,
        type: target.bypassed ? 'bypassed' : 'regular',
      }
    }
    return { ...EMPTY_DRAFT }
  })

  const update = <K extends keyof BindingDraft>(
    key: K,
    value: BindingDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBulk && !draft.mac.trim()) {
      toast.error('MAC address is required')
      return
    }
    if (isBulk) {
      bypassMany(ids)
      toast.success(`Created IP binding for ${ids.length} hosts`)
    } else if (target) {
      bypass(target.id)
      toast.success(`IP binding created for ${draft.mac}`)
    }
    onClose()
  }

  const bulkSelection = isBulk
    ? hosts.filter((h) => ids.includes(h.id))
    : []

  return (
    <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isBulk
              ? `Make IP Binding for ${ids.length} hosts`
              : 'Make IP Binding'}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? 'Selected hosts will be marked as bypassed.'
              : 'Bind this host so it skips hotspot login.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id='binding-form'
          className='flex flex-col gap-4 pt-2'
          onSubmit={handleSubmit}
        >
          {isBulk ? (
            <div className='rounded-md border bg-muted/40 p-3 text-xs'>
              <div className='mb-1 text-[11px] uppercase text-muted-foreground'>
                Selected hosts
              </div>
              <ul className='max-h-32 overflow-y-auto font-mono text-[11px]'>
                {bulkSelection.slice(0, 50).map((h) => (
                  <li key={h.id}>
                    {h.macAddress} · {h.address}
                  </li>
                ))}
                {bulkSelection.length > 50 && (
                  <li className='text-muted-foreground'>
                    +{bulkSelection.length - 50} more…
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <>
              <Field label='MAC Address'>
                <Input
                  value={draft.mac}
                  onChange={(e) => update('mac', e.target.value.toUpperCase())}
                  placeholder='AA:BB:CC:DD:EE:FF'
                />
              </Field>
              <div className='grid grid-cols-2 gap-3'>
                <Field label='Address'>
                  <Input
                    value={draft.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder='192.168.10.10'
                  />
                </Field>
                <Field label='To Address'>
                  <Input
                    value={draft.toAddress}
                    onChange={(e) => update('toAddress', e.target.value)}
                    placeholder='Optional'
                  />
                </Field>
              </div>
            </>
          )}

          <Field label='Type'>
            <Select
              value={draft.type}
              onValueChange={(v) => update('type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label='Comment'>
            <Input
              value={draft.comment}
              onChange={(e) => update('comment', e.target.value)}
              placeholder='Optional'
            />
          </Field>
        </form>

        <DialogFooter>
          <Button variant='outline' size='sm' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' size='sm' form='binding-form'>
            Create Binding
          </Button>
        </DialogFooter>
    </DialogContent>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-xs font-medium text-muted-foreground'>
        {label}
      </Label>
      {children}
    </div>
  )
}

import { useState } from 'react'
import { toast } from 'sonner'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { expModeOptions } from '../data/data'
import {
  type ExpMode,
  type HotspotProfile,
} from '../data/schema'
import { useProfilesDialogStore } from '../store/profiles-dialog-store'

const SHARED_OPTIONS = ['1', '2', '3', '5', '10', 'unlimited']
const PARENT_QUEUE_OPTIONS = ['none', 'global', 'hs-parent']

function emptyProfile(): HotspotProfile {
  return {
    id: '',
    name: '',
    sharedUsers: '1',
    rateLimit: '1M/1M',
    expMode: 'rem',
    validity: '1h',
    price: 0,
    sellingPrice: 0,
    lockUser: true,
    lockServer: false,
    addressPool: 'hs-pool-1',
    parentQueue: 'none',
    hasExpiredMonitor: true,
  }
}

export function ProfileMutateDrawer() {
  const { mode, target, close } = useProfilesDialogStore()
  const isOpen = mode === 'add' || mode === 'edit'
  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && (
        <ProfileForm
          key={target?.id ?? `add-${mode}`}
          mode={mode === 'edit' ? 'edit' : 'add'}
          target={target}
          onClose={close}
        />
      )}
    </Sheet>
  )
}

type ProfileFormProps = {
  mode: 'add' | 'edit'
  target: HotspotProfile | null
  onClose: () => void
}

function ProfileForm({ mode, target, onClose }: ProfileFormProps) {
  const addProfile = useHotspotProfilesStore((s) => s.add)
  const updateProfile = useHotspotProfilesStore((s) => s.update)

  const [draft, setDraft] = useState<HotspotProfile>(() => {
    if (mode === 'edit' && target) return target
    return emptyProfile()
  })

  const update = <K extends keyof HotspotProfile>(
    key: K,
    value: HotspotProfile[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Profile name is required')
      return
    }
    if (mode === 'add') {
      const id = `*${Date.now().toString(36).slice(-4).toUpperCase()}`
      addProfile({ ...draft, id })
      toast.success(`Profile '${draft.name}' added`)
    } else if (mode === 'edit' && target) {
      updateProfile(target.id, draft)
      toast.success(`Profile '${draft.name}' updated`)
    }
    onClose()
  }

  return (
    <SheetContent className='flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md'>
        <SheetHeader className='border-b'>
          <SheetTitle>
            {mode === 'add' ? 'Add Profile' : 'Edit Profile'}
          </SheetTitle>
          <SheetDescription>
            Hotspot user profile · pricing · rate-limit
          </SheetDescription>
        </SheetHeader>

        <form
          id='profile-form'
          className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4'
          onSubmit={handleSubmit}
        >
          <Field label='Name'>
            <Input
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder='1jam-1k'
            />
          </Field>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Rate Limit'>
              <Input
                value={draft.rateLimit}
                onChange={(e) => update('rateLimit', e.target.value)}
                placeholder='1M/1M'
              />
            </Field>
            <Field label='Validity'>
              <Input
                value={draft.validity}
                onChange={(e) => update('validity', e.target.value)}
                placeholder='1h, 1d, 7d, 30d'
              />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Price'>
              <Input
                type='number'
                min={0}
                value={draft.price}
                onChange={(e) =>
                  update('price', Math.max(0, +e.target.value || 0))
                }
              />
            </Field>
            <Field label='Selling Price'>
              <Input
                type='number'
                min={0}
                value={draft.sellingPrice}
                onChange={(e) =>
                  update('sellingPrice', Math.max(0, +e.target.value || 0))
                }
              />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Shared Users'>
              <Select
                value={draft.sharedUsers}
                onValueChange={(v) => update('sharedUsers', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHARED_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label='Exp Mode'>
              <Select
                value={draft.expMode}
                onValueChange={(v) => update('expMode', v as ExpMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expModeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='Address Pool'>
              <Input
                value={draft.addressPool}
                onChange={(e) => update('addressPool', e.target.value)}
              />
            </Field>
            <Field label='Parent Queue'>
              <Select
                value={draft.parentQueue}
                onValueChange={(v) => update('parentQueue', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARENT_QUEUE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className='flex items-center justify-between rounded-md border p-3'>
            <div className='flex flex-col gap-0.5'>
              <Label className='text-sm'>Lock User</Label>
              <span className='text-[11px] text-muted-foreground'>
                Bind voucher to first MAC.
              </span>
            </div>
            <Switch
              checked={draft.lockUser}
              onCheckedChange={(v) => update('lockUser', v)}
            />
          </div>
          <div className='flex items-center justify-between rounded-md border p-3'>
            <div className='flex flex-col gap-0.5'>
              <Label className='text-sm'>Lock Server</Label>
              <span className='text-[11px] text-muted-foreground'>
                Restrict to the server it logged in from.
              </span>
            </div>
            <Switch
              checked={draft.lockServer}
              onCheckedChange={(v) => update('lockServer', v)}
            />
          </div>
          <div className='flex items-center justify-between rounded-md border p-3'>
            <div className='flex flex-col gap-0.5'>
              <Label className='text-sm'>Expired Monitor Active</Label>
              <span className='text-[11px] text-muted-foreground'>
                Auto-removes expired vouchers.
              </span>
            </div>
            <Switch
              checked={draft.hasExpiredMonitor}
              onCheckedChange={(v) => update('hasExpiredMonitor', v)}
            />
          </div>
        </form>

        <SheetFooter className='border-t'>
          <SheetClose asChild>
            <Button variant='outline' size='sm'>
              Cancel
            </Button>
          </SheetClose>
          <Button type='submit' size='sm' form='profile-form'>
            {mode === 'add' ? 'Add Profile' : 'Save Changes'}
          </Button>
        </SheetFooter>
    </SheetContent>
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

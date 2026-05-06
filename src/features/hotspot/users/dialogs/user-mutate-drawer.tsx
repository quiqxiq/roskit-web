import { useState } from 'react'
import { toast } from 'sonner'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
import { useHotspotUsersStore } from '@/stores/hotspot-users-store'
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
import { type HotspotUser } from '../data/schema'
import { useUsersDialogStore } from '../store/users-dialog-store'

const SERVERS = ['all', 'HS-01', 'HS-02', 'HS-03']

function emptyUser(profileFallback: string): HotspotUser {
  return {
    id: '',
    username: '',
    password: '',
    profile: profileFallback,
    macAddress: '',
    ipAddress: undefined,
    server: 'all',
    status: 'offline',
    uptime: '—',
    bytesIn: 0,
    bytesOut: 0,
    comment: '',
    createdAt: new Date(),
    expiresAt: undefined,
  }
}

function randomId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function UserMutateDrawer() {
  const { mode, target, close } = useUsersDialogStore()
  const isOpen = mode === 'add' || mode === 'edit'
  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && (
        <UserForm
          key={target?.id ?? `add-${mode}`}
          mode={mode === 'edit' ? 'edit' : 'add'}
          target={target}
          onClose={close}
        />
      )}
    </Sheet>
  )
}

type UserFormProps = {
  mode: 'add' | 'edit'
  target: HotspotUser | null
  onClose: () => void
}

function UserForm({ mode, target, onClose }: UserFormProps) {
  const profiles = useHotspotProfilesStore((s) => s.items)
  const addUser = useHotspotUsersStore((s) => s.add)
  const updateUser = useHotspotUsersStore((s) => s.update)
  const profileFallback = profiles[0]?.name ?? '1jam-1k'

  const [draft, setDraft] = useState<HotspotUser>(() => {
    if (mode === 'edit' && target) return target
    return emptyUser(profileFallback)
  })

  const update = <K extends keyof HotspotUser>(
    key: K,
    value: HotspotUser[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.username.trim()) {
      toast.error('Username is required')
      return
    }
    if (!draft.password.trim()) {
      toast.error('Password is required')
      return
    }
    if (mode === 'add') {
      addUser({ ...draft, id: randomId(), createdAt: new Date() })
      toast.success(`User '${draft.username}' added`)
    } else if (mode === 'edit' && target) {
      updateUser(target.id, draft)
      toast.success(`User '${draft.username}' updated`)
    }
    onClose()
  }

  return (
    <SheetContent className='flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md'>
        <SheetHeader className='border-b'>
          <SheetTitle>
            {mode === 'add' ? 'Add Hotspot User' : 'Edit Hotspot User'}
          </SheetTitle>
          <SheetDescription>
            Single hotspot user · credentials · profile
          </SheetDescription>
        </SheetHeader>

        <form
          id='user-form'
          className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-2 gap-3'>
            <Field label='Username'>
              <Input
                value={draft.username}
                onChange={(e) => update('username', e.target.value)}
                placeholder='wifi-001'
              />
            </Field>
            <Field label='Password'>
              <Input
                value={draft.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder='••••'
              />
            </Field>
          </div>

          <Field label='Profile'>
            <Select
              value={draft.profile}
              onValueChange={(v) => update('profile', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} · {p.validity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label='Server'>
            <Select
              value={draft.server}
              onValueChange={(v) => update('server', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className='grid grid-cols-2 gap-3'>
            <Field label='MAC Address'>
              <Input
                value={draft.macAddress}
                onChange={(e) =>
                  update('macAddress', e.target.value.toUpperCase())
                }
                placeholder='AA:BB:CC:DD:EE:FF'
              />
            </Field>
            <Field label='IP Address'>
              <Input
                value={draft.ipAddress ?? ''}
                onChange={(e) =>
                  update('ipAddress', e.target.value || undefined)
                }
                placeholder='192.168.10.10'
              />
            </Field>
          </div>

          <Field label='Comment'>
            <Input
              value={draft.comment ?? ''}
              onChange={(e) => update('comment', e.target.value)}
              placeholder='Optional'
            />
          </Field>
        </form>

        <SheetFooter className='border-t'>
          <SheetClose asChild>
            <Button variant='outline' size='sm'>
              Cancel
            </Button>
          </SheetClose>
          <Button type='submit' size='sm' form='user-form'>
            {mode === 'add' ? 'Add User' : 'Save Changes'}
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

import { useState } from 'react'
import { toast } from 'sonner'
import { useTenantsStore } from '@/stores/tenants-store'
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
import { emptySettings, planOptions } from '../data/data'
import {
  SLUG_REGEX,
  type Tenant,
  type TenantPlan,
  type TenantSettings,
} from '../data/schema'
import { useTenantsDialogStore } from '../store/tenants-dialog-store'

type CreateDraft = {
  name: string
  slug: string
  slugManual: boolean
  plan: TenantPlan
  ownerUsername: string
  ownerPassword: string
  settings: TenantSettings
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

function emptyDraft(): CreateDraft {
  return {
    name: '',
    slug: '',
    slugManual: false,
    plan: 'free',
    ownerUsername: '',
    ownerPassword: '',
    settings: emptySettings(),
  }
}

export function TenantCreateDrawer() {
  const { mode, close } = useTenantsDialogStore()
  const isOpen = mode === 'create'
  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && <CreateForm key='create' onClose={close} />}
    </Sheet>
  )
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const addTenant = useTenantsStore((s) => s.add)
  const [draft, setDraft] = useState<CreateDraft>(() => emptyDraft())

  const slugValid = SLUG_REGEX.test(draft.slug)

  const setName = (name: string) => {
    setDraft((prev) => ({
      ...prev,
      name,
      slug: prev.slugManual ? prev.slug : slugify(name),
    }))
  }

  const setSlug = (slug: string) => {
    setDraft((prev) => ({ ...prev, slug, slugManual: true }))
  }

  const setPlan = (plan: TenantPlan) => setDraft((prev) => ({ ...prev, plan }))

  const setSettings = <K extends keyof TenantSettings>(
    key: K,
    value: TenantSettings[K]
  ) => {
    setDraft((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Tenant name is required')
      return
    }
    if (!slugValid) {
      toast.error('Slug must be lowercase alphanumeric with optional dashes')
      return
    }
    if (!draft.ownerUsername.trim() || draft.ownerUsername.length < 3) {
      toast.error('Owner username must be at least 3 characters')
      return
    }
    if (draft.ownerPassword.length < 6) {
      toast.error('Owner password must be at least 6 characters')
      return
    }

    const id = `t${Date.now().toString(36).slice(-6)}`
    const now = new Date()
    const tenant: Tenant = {
      id,
      name: draft.name.trim(),
      slug: draft.slug,
      plan: draft.plan,
      status: 'trial',
      createdAt: now,
      updatedAt: now,
      settings: draft.settings,
      usersCount: 1,
      routersCount: 0,
      voucherSalesCount: 0,
    }
    addTenant(tenant)
    toast.success(`Tenant '${tenant.slug}' created`, {
      description: `Owner: ${draft.ownerUsername}`,
    })
    onClose()
  }

  return (
    <SheetContent className='flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md'>
      <SheetHeader className='border-b'>
        <SheetTitle>Create Tenant</SheetTitle>
        <SheetDescription>
          New tenant + initial owner. Global default templates akan otomatis di-copy.
        </SheetDescription>
      </SheetHeader>

      <form
        id='tenant-create-form'
        className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4'
        onSubmit={handleSubmit}
      >
        <Section title='Tenant'>
          <Field label='Name'>
            <Input
              value={draft.name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Bintang Net'
            />
          </Field>
          <Field
            label='Slug'
            hint='lowercase, alphanumeric, dashes (auto-generated dari name)'
          >
            <Input
              value={draft.slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder='bintang-net'
              className='font-mono'
              aria-invalid={draft.slug.length > 0 && !slugValid}
            />
            {draft.slug && !slugValid && (
              <p className='text-[11px] text-destructive'>
                Invalid format. Pattern: ^[a-z0-9](?:[a-z0-9-]{'{0,98}'}[a-z0-9])?$
              </p>
            )}
          </Field>
          <Field label='Plan'>
            <Select value={draft.plan} onValueChange={(v) => setPlan(v as TenantPlan)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {planOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section
          title='Initial Owner'
          hint='Mock-only di UI ini. Backend AdminCreate saat ini tidak menerima owner credentials — perlu extension atau buat user manual setelah tenant tercipta.'
        >
          <div className='grid grid-cols-2 gap-3'>
            <Field label='Username'>
              <Input
                value={draft.ownerUsername}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, ownerUsername: e.target.value }))
                }
                placeholder='owner'
              />
            </Field>
            <Field label='Password'>
              <Input
                type='password'
                value={draft.ownerPassword}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, ownerPassword: e.target.value }))
                }
                placeholder='••••••••'
              />
            </Field>
          </div>
        </Section>

        <Section title='Hotspot Settings (optional)'>
          <Field label='Hotspot Name'>
            <Input
              value={draft.settings.hotspotName}
              onChange={(e) => setSettings('hotspotName', e.target.value)}
              placeholder='My Hotspot'
            />
          </Field>
          <div className='grid grid-cols-2 gap-3'>
            <Field label='Currency'>
              <Input
                value={draft.settings.currency}
                onChange={(e) => setSettings('currency', e.target.value)}
                placeholder='Rp'
              />
            </Field>
            <Field label='DNS Name'>
              <Input
                value={draft.settings.dnsName}
                onChange={(e) => setSettings('dnsName', e.target.value)}
                placeholder='hotspot.local'
              />
            </Field>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <Field label='Phone'>
              <Input
                value={draft.settings.phone}
                onChange={(e) => setSettings('phone', e.target.value)}
                placeholder='+62 ...'
              />
            </Field>
            <Field label='Email'>
              <Input
                value={draft.settings.email}
                onChange={(e) => setSettings('email', e.target.value)}
                placeholder='admin@example.com'
              />
            </Field>
          </div>
        </Section>
      </form>

      <SheetFooter className='border-t'>
        <SheetClose asChild>
          <Button variant='outline' size='sm'>
            Cancel
          </Button>
        </SheetClose>
        <Button type='submit' size='sm' form='tenant-create-form'>
          Create Tenant
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className='flex flex-col gap-3 rounded-md border bg-muted/30 p-3'>
      <div>
        <h3 className='text-sm font-semibold'>{title}</h3>
        {hint && <p className='text-[11px] text-muted-foreground'>{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-xs font-medium text-muted-foreground'>
        {label}
      </Label>
      {children}
      {hint && <p className='text-[10px] text-muted-foreground'>{hint}</p>}
    </div>
  )
}

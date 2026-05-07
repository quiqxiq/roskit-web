import { useState } from 'react'
import { toast } from 'sonner'
import { useGlobalTemplatesStore } from '@/stores/global-templates-store'
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
import { Textarea } from '@/components/ui/textarea'
import { emptyTemplate } from '../data/data'
import {
  partOptions,
  type PrintTemplate,
  type PrintTemplatePart,
  type PrintTemplateType,
  typeOptions,
} from '../data/schema'
import { useTemplatesDialogStore } from '../store/templates-dialog-store'

export function TemplateMutateDrawer() {
  const { mode, target, close } = useTemplatesDialogStore()
  const isOpen = mode === 'add' || mode === 'edit'
  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && (
        <TemplateForm
          key={target?.id ?? `add-${mode}`}
          mode={mode === 'edit' ? 'edit' : 'add'}
          target={target}
          onClose={close}
        />
      )}
    </Sheet>
  )
}

type FormProps = {
  mode: 'add' | 'edit'
  target: PrintTemplate | null
  onClose: () => void
}

function TemplateForm({ mode, target, onClose }: FormProps) {
  const addTemplate = useGlobalTemplatesStore((s) => s.add)
  const updateTemplate = useGlobalTemplatesStore((s) => s.update)

  const [draft, setDraft] = useState(() => {
    if (mode === 'edit' && target) return target
    return {
      ...emptyTemplate(),
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PrintTemplate
  })

  const update = <K extends keyof PrintTemplate>(
    key: K,
    value: PrintTemplate[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Template name is required')
      return
    }
    if (!draft.content.trim()) {
      toast.error('Content is required')
      return
    }
    if (mode === 'add') {
      const id = `g-${Date.now().toString(36).slice(-6)}`
      const now = new Date()
      addTemplate({ ...draft, id, tenantId: null, createdAt: now, updatedAt: now })
      toast.success(`Global template '${draft.name}' added`)
    } else if (mode === 'edit' && target) {
      updateTemplate(target.id, draft)
      toast.success(`Template '${draft.name}' updated`)
    }
    onClose()
  }

  return (
    <SheetContent className='flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
      <SheetHeader className='border-b'>
        <SheetTitle>
          {mode === 'add' ? 'Add Global Template' : 'Edit Template'}
        </SheetTitle>
        <SheetDescription>
          Global default · di-copy ke setiap tenant baru saat AdminCreate.
        </SheetDescription>
      </SheetHeader>

      <form
        id='template-form'
        className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4'
        onSubmit={handleSubmit}
      >
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <Field label='Name'>
            <Input
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder='Default · Header'
            />
          </Field>
          <Field label='Type'>
            <Select
              value={draft.type}
              onValueChange={(v) => update('type', v as PrintTemplateType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label='Part'>
            <Select
              value={draft.part}
              onValueChange={(v) => update('part', v as PrintTemplatePart)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {partOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field
          label='Content (HTML)'
          hint='Variables: {{Username}}, {{Password}}, {{Profile}}, {{Price}}, {{Currency}}, {{HotspotName}}, {{DNSName}}, {{Phone}}, {{QRImageUrl}}, {{GeneratedAt}}'
        >
          <Textarea
            value={draft.content}
            onChange={(e) => update('content', e.target.value)}
            rows={18}
            spellCheck={false}
            className='font-mono text-[11px]'
            placeholder='<div>...</div>'
          />
        </Field>
      </form>

      <SheetFooter className='border-t'>
        <SheetClose asChild>
          <Button variant='outline' size='sm'>
            Cancel
          </Button>
        </SheetClose>
        <Button type='submit' size='sm' form='template-form'>
          {mode === 'add' ? 'Add Template' : 'Save Changes'}
        </Button>
      </SheetFooter>
    </SheetContent>
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

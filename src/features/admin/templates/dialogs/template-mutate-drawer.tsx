import { useState } from 'react'
import { Lock, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useGlobalTemplatesStore } from '@/stores/global-templates-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { TemplatePreviewIframe } from '../components/template-preview-iframe'
import { emptyTemplate } from '../data/data'
import { type PrintTemplate } from '../data/schema'
import { useTemplatesDialogStore } from '../store/templates-dialog-store'

const VARIABLE_HINT = [
  'hotspotName',
  'username',
  'password',
  'price',
  'validity',
  'limitUptime',
  'limitBytesTotal',
  'qrCode',
  'dnsName',
  'logo',
  'timeStamp',
  'comment',
  '#',
]

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

type Draft = Pick<
  PrintTemplate,
  'name' | 'type' | 'header' | 'row' | 'footer' | 'isBuiltin'
>

function TemplateForm({ mode, target, onClose }: FormProps) {
  const addTemplate = useGlobalTemplatesStore((s) => s.add)
  const updateTemplate = useGlobalTemplatesStore((s) => s.update)
  const resetToDefault = useGlobalTemplatesStore((s) => s.resetToDefault)

  const [draft, setDraft] = useState<Draft>(() => {
    if (mode === 'edit' && target) {
      return {
        name: target.name,
        type: target.type,
        header: target.header,
        row: target.row,
        footer: target.footer,
        isBuiltin: target.isBuiltin,
      }
    }
    const empty = emptyTemplate()
    return {
      name: empty.name,
      type: empty.type,
      header: empty.header,
      row: empty.row,
      footer: empty.footer,
      isBuiltin: false,
    }
  })

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetToDefault = () => {
    if (!target || !target.isBuiltin) return
    const ok = resetToDefault(target.id)
    if (ok) {
      // ambil ulang state hasil reset dari store
      const fresh = useGlobalTemplatesStore
        .getState()
        .items.find((t) => t.id === target.id)
      if (fresh) {
        setDraft({
          name: fresh.name,
          type: fresh.type,
          header: fresh.header,
          row: fresh.row,
          footer: fresh.footer,
          isBuiltin: fresh.isBuiltin,
        })
      }
      toast.success(`'${target.name}' di-reset ke default`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Template name is required')
      return
    }
    if (!draft.type.trim()) {
      toast.error('Type is required')
      return
    }
    if (!draft.row.trim()) {
      toast.error('Row content is required')
      return
    }
    if (mode === 'add') {
      const id = `g-${Date.now().toString(36).slice(-6)}`
      const now = new Date()
      addTemplate({
        ...draft,
        id,
        tenantId: null,
        isBuiltin: false,
        createdAt: now,
        updatedAt: now,
      })
      toast.success(`Global template '${draft.name}' added`)
    } else if (mode === 'edit' && target) {
      updateTemplate(target.id, {
        name: draft.name,
        type: draft.type,
        header: draft.header,
        row: draft.row,
        footer: draft.footer,
      })
      toast.success(`Template '${draft.name}' updated`)
    }
    onClose()
  }

  const isBuiltin = mode === 'edit' && target?.isBuiltin === true

  return (
    <SheetContent className='flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl'>
      <SheetHeader className='border-b'>
        <SheetTitle className='flex items-center gap-2'>
          {mode === 'add' ? 'Add Global Template' : 'Edit Template'}
          {isBuiltin && (
            <Badge variant='outline' className='gap-1 text-[10px]'>
              <Lock className='size-3' />
              Built-in
            </Badge>
          )}
        </SheetTitle>
        <SheetDescription>
          1 template = header + row + footer. Built-in template di-copy ke
          tenant baru saat AdminCreate. Preview live di kanan (iframe sandbox).
        </SheetDescription>
      </SheetHeader>

      <form
        id='template-form'
        className='flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-hidden'
        onSubmit={handleSubmit}
      >
        {/* === EDITOR === */}
        <div className='flex min-h-0 flex-col gap-3 lg:overflow-y-auto lg:pe-2'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <Field label='Name'>
              <Input
                value={draft.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder='Default'
              />
            </Field>
            <Field
              label='Type'
              hint='Identifier bebas (default, small, thermal, thermal-58, ...)'
            >
              <Input
                value={draft.type}
                onChange={(e) =>
                  update(
                    'type',
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                  )
                }
                placeholder='default'
                className='font-mono'
                disabled={isBuiltin}
              />
            </Field>
          </div>

          <Tabs defaultValue='row' className='flex min-h-0 flex-1 flex-col gap-2'>
            <TabsList className='w-fit'>
              <TabsTrigger value='header'>Header</TabsTrigger>
              <TabsTrigger value='row'>Row</TabsTrigger>
              <TabsTrigger value='footer'>Footer</TabsTrigger>
            </TabsList>

            <TabsContent value='header' className='flex min-h-0 flex-1 flex-col'>
              <Textarea
                value={draft.header}
                onChange={(e) => update('header', e.target.value)}
                rows={20}
                spellCheck={false}
                className='flex-1 min-h-64 font-mono text-[11px] leading-relaxed'
                placeholder='<!DOCTYPE html><html>...<body>'
              />
            </TabsContent>
            <TabsContent value='row' className='flex min-h-0 flex-1 flex-col'>
              <Textarea
                value={draft.row}
                onChange={(e) => update('row', e.target.value)}
                rows={20}
                spellCheck={false}
                className='flex-1 min-h-64 font-mono text-[11px] leading-relaxed'
                placeholder='<table class="voucher">...</table>'
              />
            </TabsContent>
            <TabsContent value='footer' className='flex min-h-0 flex-1 flex-col'>
              <Textarea
                value={draft.footer}
                onChange={(e) => update('footer', e.target.value)}
                rows={20}
                spellCheck={false}
                className='flex-1 min-h-64 font-mono text-[11px] leading-relaxed'
                placeholder='</body></html>'
              />
            </TabsContent>
          </Tabs>

          <div className='rounded-md border bg-muted/30 px-3 py-2 text-[10px]'>
            <p className='mb-1 font-medium text-muted-foreground'>Variables</p>
            <p className='font-mono text-foreground/80'>
              {VARIABLE_HINT.map((v) => `%${v}%`).join(' · ')}
            </p>
          </div>
        </div>

        {/* === PREVIEW === */}
        <div className='flex min-h-96 flex-col gap-2 lg:min-h-0 lg:overflow-hidden'>
          <Label className='text-xs font-medium text-muted-foreground'>
            Live Preview
          </Label>
          <TemplatePreviewIframe
            header={draft.header}
            row={draft.row}
            footer={draft.footer}
            className='min-h-96 flex-1 lg:min-h-0'
          />
        </div>
      </form>

      <SheetFooter className='border-t'>
        {isBuiltin && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='me-auto gap-1.5'
            onClick={handleResetToDefault}
          >
            <RotateCcw className='size-3.5' />
            Reset to default
          </Button>
        )}
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

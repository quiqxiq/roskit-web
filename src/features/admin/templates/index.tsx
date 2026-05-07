import { FileText, Lock, Plus, Sparkles } from 'lucide-react'
import { useGlobalTemplatesStore } from '@/stores/global-templates-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { TemplatesTable } from './components/templates-table'
import { TemplateDialogs } from './dialogs/template-dialogs'
import { useTemplatesDialogStore } from './store/templates-dialog-store'

export function AdminGlobalTemplates() {
  const templates = useGlobalTemplatesStore((s) => s.items)
  const openDialog = useTemplatesDialogStore((s) => s.open)

  const total = templates.length
  const builtinCount = templates.filter((t) => t.isBuiltin).length
  const customCount = total - builtinCount

  return (
    <>
      <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
              Global Default Templates
            </h2>
            <p className='text-sm text-muted-foreground sm:text-base'>
              1 template = header + row + footer · di-copy ke setiap tenant
              baru saat AdminCreate
            </p>
          </div>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => openDialog('add')}
          >
            <Plus className='size-4' />
            Add Template
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <SummaryCard
            label='Total'
            value={total}
            icon={<FileText className='size-4 text-foreground' />}
          />
          <SummaryCard
            label='Built-in'
            value={builtinCount}
            icon={<Lock className='size-4 text-blue-500' />}
          />
          <SummaryCard
            label='Custom'
            value={customCount}
            icon={<Sparkles className='size-4 text-emerald-500' />}
          />
        </div>

        <TemplatesTable data={templates} />
      </Main>
      <TemplateDialogs />
    </>
  )
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className='flex items-center justify-between gap-2 px-4 py-3'>
        <div>
          <p className='text-[11px] uppercase text-muted-foreground'>{label}</p>
          <p className='text-2xl font-bold tabular-nums'>{value}</p>
        </div>
        <div className='rounded-full bg-muted p-2'>{icon}</div>
      </CardContent>
    </Card>
  )
}

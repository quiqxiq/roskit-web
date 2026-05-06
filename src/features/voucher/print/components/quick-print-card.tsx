import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Copy, Pencil, Printer, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuickPrintPresetsStore } from '@/stores/quick-print-presets-store'
import { generateBatch } from '@/features/voucher/generate/data/data'
import { type VoucherGenerateForm } from '@/features/voucher/generate/data/schema'
import { usePrintStore } from '@/features/voucher/print-render/store/print-store'
import { usePresetsDialogStore } from '@/features/voucher/print/store/presets-dialog-store'
import { cn } from '@/lib/utils'
import { formatIDR } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { colorClassMap, formatDataLimit } from '../data/data'
import { type QuickPrintPreset } from '../data/schema'

type QuickPrintCardProps = {
  preset: QuickPrintPreset
}

const SAMPLE_QTY = 5

function presetToForm(preset: QuickPrintPreset): VoucherGenerateForm {
  return {
    qty: SAMPLE_QTY,
    server: preset.server,
    profile: preset.profile,
    userType: preset.userMode,
    nameLength: preset.userLength,
    charSet: preset.charSet,
    prefix: preset.prefix,
    timeLimit: preset.timeLimit,
    dataLimit: preset.dataLimit,
    dataLimitUnit: preset.dataLimitUnit,
    comment: preset.name,
  }
}

export function QuickPrintCard({ preset }: QuickPrintCardProps) {
  const colorCls = colorClassMap[preset.color]
  const openPrint = usePrintStore((s) => s.open)
  const openDialog = usePresetsDialogStore((s) => s.open)
  const duplicatePreset = useQuickPrintPresetsStore((s) => s.duplicate)

  const handleOpen = () => {
    const vouchers = generateBatch(presetToForm(preset))
    openPrint({
      template: 'default',
      vouchers,
      meta: {
        title: preset.package,
        profile: preset.profile,
        server: preset.server,
        validity: preset.validity,
        sellingPrice: preset.sellingPrice,
      },
    })
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDialog('edit', { target: preset })
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    const clone = duplicatePreset(preset.id)
    if (clone) {
      toast.success(`Duplicated preset '${preset.name}'`, {
        description: `Created '${clone.name}'`,
      })
      openDialog('edit', { target: clone })
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDialog('delete', { target: preset })
  }

  return (
    <button
      type='button'
      onClick={handleOpen}
      className={cn(
        'group relative flex w-full flex-col gap-3 rounded-md border border-l-4 bg-card p-4 text-left transition-all hover:shadow-md',
        colorCls.border
      )}
    >
      <div className='flex items-start gap-3'>
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-md',
            colorCls.bg,
            colorCls.text
          )}
        >
          <Printer className='size-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h3 className='truncate text-base font-semibold'>
              {preset.package}
            </h3>
            <span className='text-[10px] uppercase tracking-wide text-muted-foreground'>
              {preset.name}
            </span>
          </div>
          <p className='text-xs text-muted-foreground'>
            {preset.server} · {preset.profile}
          </p>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='-mr-1 -mt-1 size-7 shrink-0'
              onClick={(e) => e.stopPropagation()}
            >
              <DotsHorizontalIcon className='size-4' />
              <span className='sr-only'>Preset actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className='size-4' />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className='text-red-500!'
            >
              <Trash2 className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <dl className='grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs'>
        <div className='flex justify-between gap-2'>
          <dt className='text-muted-foreground'>Time</dt>
          <dd className='font-mono'>{preset.timeLimit}</dd>
        </div>
        <div className='flex justify-between gap-2'>
          <dt className='text-muted-foreground'>Data</dt>
          <dd className='font-mono'>{formatDataLimit(preset)}</dd>
        </div>
        <div className='flex justify-between gap-2'>
          <dt className='text-muted-foreground'>Validity</dt>
          <dd className='font-mono'>{preset.validity}</dd>
        </div>
        <div className='flex justify-between gap-2'>
          <dt className='text-muted-foreground'>Mode</dt>
          <dd className='font-mono uppercase'>{preset.userMode}</dd>
        </div>
        <div className='col-span-2 flex justify-between gap-2 border-t pt-1.5'>
          <dt className='text-muted-foreground'>Selling Price</dt>
          <dd className='font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400'>
            {formatIDR(preset.sellingPrice)}
          </dd>
        </div>
      </dl>
    </button>
  )
}

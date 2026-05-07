import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGlobalTemplatesStore } from '@/stores/global-templates-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type PrintTemplate } from '../data/schema'
import { useTemplatesDialogStore } from '../store/templates-dialog-store'

type Props = { row: Row<PrintTemplate> }

export function DataTableRowActions({ row }: Props) {
  const tpl = row.original
  const openDialog = useTemplatesDialogStore((s) => s.open)
  const resetToDefault = useGlobalTemplatesStore((s) => s.resetToDefault)

  const handleReset = () => {
    const ok = resetToDefault(tpl.id)
    if (ok) toast.success(`'${tpl.name}' di-reset ke default`)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={() => openDialog('edit', { target: tpl })}>
          <Pencil className='size-4' />
          Edit Template
        </DropdownMenuItem>
        {tpl.isBuiltin && (
          <DropdownMenuItem onClick={handleReset}>
            <RotateCcw className='size-4' />
            Reset to default
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openDialog('delete', { target: tpl })}
          className='text-red-500!'
          disabled={tpl.isBuiltin}
        >
          <Trash2 className='size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PrintTemplate } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

function formatDateTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const partVariant: Record<string, string> = {
  header: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  row: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  footer: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
}

export const columns: ColumnDef<PrintTemplate>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <span className='font-semibold'>{row.original.name}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.original.type}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'part',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Part' />
    ),
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className={`border-transparent capitalize ${partVariant[row.original.part] ?? ''}`}
      >
        {row.original.part}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatDateTime(row.original.updatedAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]

import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Tenant } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { TenantPlanBadge } from './tenant-plan-badge'
import { TenantStatusBadge } from './tenant-status-badge'

function formatDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const columns: ColumnDef<Tenant>[] = [
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
      <DataTableColumnHeader column={column} title='Tenant' />
    ),
    cell: ({ row }) => {
      const t = row.original
      return (
        <Link
          to='/admin/tenants/$tenantId'
          params={{ tenantId: t.id }}
          className='flex flex-col hover:underline'
        >
          <span className='font-semibold'>{t.name}</span>
          <span className='font-mono text-[11px] text-muted-foreground'>
            {t.slug}
          </span>
        </Link>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'plan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Plan' />
    ),
    cell: ({ row }) => <TenantPlanBadge plan={row.original.plan} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'usersCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.original.usersCount}</span>
    ),
  },
  {
    accessorKey: 'routersCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Routers' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.original.routersCount}</span>
    ),
  },
  {
    accessorKey: 'voucherSalesCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm tabular-nums'>
        {row.original.voucherSalesCount.toLocaleString('en-US')}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]

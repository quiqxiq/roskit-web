import { useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUsersDialogStore } from '../store/users-dialog-store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableMobileCards,
  DataTablePagination,
  DataTableToolbar,
  type MobileCardDetail,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { formatBytes, profileOptions, serverOptions, statusOptions } from '../data/data'
import { type HotspotUser } from '../data/schema'
import { columns } from './columns'
import { DataTableRowActions } from './data-table-row-actions'

type HotspotUsersTableProps = {
  data: HotspotUser[]
}

export function HotspotUsersTable({ data }: HotspotUsersTableProps) {
  const openDialog = useUsersDialogStore((s) => s.open)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: 0, pageSize: 10 },
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    onPaginationChange: () => {},
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search users...'
        searchKey='username'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: statusOptions,
          },
          {
            columnId: 'profile',
            title: 'Profile',
            options: profileOptions,
          },
          {
            columnId: 'server',
            title: 'Server',
            options: serverOptions,
          },
        ]}
      />
      <div className='hidden overflow-hidden rounded-md border md:block'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='md:hidden'>
        <DataTableMobileCards
          table={table}
          renderPrimary={(row) => {
            const user = row.original
            return (
              <div className='flex min-w-0 items-start gap-2'>
                <span className='min-w-0 flex-1 truncate font-semibold'>
                  {user.username}
                </span>
                <Badge
                  variant={user.status}
                  className='shrink-0 text-[10px] capitalize'
                >
                  {user.status}
                </Badge>
              </div>
            )
          }}
          renderMeta={(row) => (
            <span className='font-mono'>{row.original.profile}</span>
          )}
          renderDetails={(row): MobileCardDetail[] => {
            const user = row.original
            const isActive = user.status === 'online' || user.status === 'idle'
            return [
              {
                label: 'MAC',
                value: (
                  <span className='font-mono text-[11px]'>
                    {user.macAddress}
                  </span>
                ),
              },
              {
                label: 'Server',
                value: <span className='font-mono'>{user.server}</span>,
              },
              {
                label: 'Uptime',
                value: (
                  <span
                    className={cn(
                      'font-mono',
                      user.uptime === '—' && 'text-muted-foreground'
                    )}
                  >
                    {user.uptime}
                  </span>
                ),
              },
              {
                label: 'Traffic',
                value: isActive ? (
                  <span className='font-mono text-[11px]'>
                    <span className='text-sky-600 dark:text-sky-400'>
                      ↓{formatBytes(user.bytesIn)}
                    </span>
                    {' '}
                    <span className='text-violet-600 dark:text-violet-400'>
                      ↑{formatBytes(user.bytesOut)}
                    </span>
                  </span>
                ) : (
                  <span className='text-muted-foreground'>—</span>
                ),
              },
            ]
          }}
          renderActions={(row) => <DataTableRowActions row={row} />}
        />
      </div>
      <div className='flex items-center justify-between'>
        <DataTablePagination table={table} className='flex-1' />
        {selectedCount > 0 && (
          <Button
            variant='destructive'
            size='sm'
            className='gap-1.5'
            onClick={() => {
              const ids = table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original.id)
              openDialog('multi-delete', { ids })
              table.resetRowSelection()
            }}
          >
            <Trash2 className='size-4' />
            Remove ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  )
}

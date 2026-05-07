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
import { partOptions, typeOptions } from '../data/schema'
import { type PrintTemplate } from '../data/schema'
import { useTemplatesDialogStore } from '../store/templates-dialog-store'
import { columns } from './columns'
import { DataTableRowActions } from './data-table-row-actions'

type Props = { data: PrintTemplate[] }

export function TemplatesTable({ data }: Props) {
  const openDialog = useTemplatesDialogStore((s) => s.open)
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
        searchPlaceholder='Search templates...'
        searchKey='name'
        filters={[
          { columnId: 'type', title: 'Type', options: typeOptions },
          { columnId: 'part', title: 'Part', options: partOptions },
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No templates yet · click "Add Template"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='md:hidden'>
        <DataTableMobileCards
          table={table}
          renderPrimary={(row) => (
            <span className='font-semibold'>{row.original.name}</span>
          )}
          renderMeta={(row) => (
            <span className='text-[11px] text-muted-foreground'>
              {row.original.type} · {row.original.part}
            </span>
          )}
          renderDetails={(row): MobileCardDetail[] => [
            {
              label: 'Updated',
              value: (
                <span className='text-[11px]'>
                  {new Date(row.original.updatedAt).toLocaleString('en-GB')}
                </span>
              ),
            },
          ]}
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
            Delete ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  )
}

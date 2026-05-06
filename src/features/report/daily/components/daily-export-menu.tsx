import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadCsv, exportDailyCsv } from '../data/data'
import { type DailyReport } from '../data/schema'

type DailyExportMenuProps = {
  report: DailyReport
}

function dateSlug(date: Date): string {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')
}

export function DailyExportMenu({ report }: DailyExportMenuProps) {
  const handleCsv = () => {
    const csv = exportDailyCsv(report)
    downloadCsv(`daily-report-${dateSlug(report.date)}.csv`, csv)
    toast.success('CSV downloaded', {
      description: `${report.count} rows exported`,
    })
  }

  const handleExcel = () => {
    toast.info('Excel export', {
      description: 'XLSX export coming soon — use CSV for now.',
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 gap-1.5'>
          <Download className='size-3.5' />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem onClick={handleCsv}>
          <FileText className='size-4' />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcel}>
          <FileSpreadsheet className='size-4' />
          Export Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className='size-4' />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

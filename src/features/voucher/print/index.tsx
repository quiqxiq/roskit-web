import { Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useQuickPrintPresetsStore } from '@/stores/quick-print-presets-store'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { QuickPrintCard } from './components/quick-print-card'
import { PresetDialogs } from './dialogs/preset-dialogs'
import { usePresetsDialogStore } from './store/presets-dialog-store'

export function VoucherPrint() {
  const quickPrintPresets = useQuickPrintPresetsStore((s) => s.items)
  const openDialog = usePresetsDialogStore((s) => s.open)
  const totalCount = quickPrintPresets.length

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Quick Print
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {totalCount} preset configuration{totalCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.info('Refreshed', {
                description: 'Preset list refreshed.',
              })
            }
          >
            <RefreshCw className='size-4' />
            Refresh
          </Button>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => openDialog('add')}
          >
            <Plus className='size-4' />
            Add Preset
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {quickPrintPresets.map((preset) => (
          <QuickPrintCard key={preset.id} preset={preset} />
        ))}
      </div>
      <PresetDialogs />
    </Main>
  )
}

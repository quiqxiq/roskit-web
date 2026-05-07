import { useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PREVIEW_VARS_BASE } from '../data/data'
import { type PreviewVarianceMode } from '../data/schema'
import { composePreview } from '../lib/compose-preview'

type Props = {
  header: string
  row: string
  footer: string
  className?: string
  /** Debounce ms saat sumber berubah (default 250) */
  debounceMs?: number
}

export function TemplatePreviewIframe({
  header,
  row,
  footer,
  className,
  debounceMs = 250,
}: Props) {
  const [rowCount, setRowCount] = useState<number>(3)
  const [varianceMode, setVarianceMode] = useState<PreviewVarianceMode>('up')
  const [debouncedSrc, setDebouncedSrc] = useState({ header, row, footer })
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSrc({ header, row, footer })
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [header, row, footer, debounceMs])

  const srcDoc = useMemo(
    () =>
      composePreview({
        header: debouncedSrc.header,
        row: debouncedSrc.row,
        footer: debouncedSrc.footer,
        rowCount,
        varianceMode,
        baseVars: PREVIEW_VARS_BASE,
      }),
    [debouncedSrc, rowCount, varianceMode]
  )

  const handleReload = () => {
    setReloadKey((k) => k + 1)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className='flex flex-wrap items-end gap-2 rounded-md border bg-muted/30 px-3 py-2'>
        <div className='flex flex-col gap-1'>
          <Label className='text-[10px] uppercase text-muted-foreground'>
            Rows
          </Label>
          <Select
            value={String(rowCount)}
            onValueChange={(v) => setRowCount(Number(v))}
          >
            <SelectTrigger size='sm' className='h-8 w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 5, 8].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-1'>
          <Label className='text-[10px] uppercase text-muted-foreground'>
            Mode
          </Label>
          <Select
            value={varianceMode}
            onValueChange={(v) => setVarianceMode(v as PreviewVarianceMode)}
          >
            <SelectTrigger size='sm' className='h-8 w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vc'>vc · username = password</SelectItem>
              <SelectItem value='up'>up · username + password</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='ms-auto flex items-end'>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='h-8 gap-1.5'
            onClick={handleReload}
            title='Reload iframe'
          >
            <RotateCcw className='size-3.5' />
            Reload
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-hidden rounded-md border bg-white'>
        <iframe
          key={reloadKey}
          ref={iframeRef}
          sandbox='allow-scripts'
          srcDoc={srcDoc}
          className='h-full min-h-96 w-full border-0'
          title='Voucher preview'
        />
      </div>
    </div>
  )
}

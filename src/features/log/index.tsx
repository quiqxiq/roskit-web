import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { LogTable } from './components/log-table'
import { LogToolbar } from './components/log-toolbar'
import {
  filterLogs,
  LOG_MAX_ENTRIES,
  LOG_STREAM_INTERVAL_MS,
  logEntriesSeed,
  makeLogEntry,
} from './data/data'
import { type LogEntry } from './data/schema'

export function Log() {
  const [entries, setEntries] = useState<LogEntry[]>(() => [...logEntriesSeed])
  const [search, setSearch] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const tick = () => {
      if (document.visibilityState === 'hidden') return
      setEntries((prev) => {
        const next = [makeLogEntry(new Date()), ...prev]
        if (next.length > LOG_MAX_ENTRIES) next.length = LOG_MAX_ENTRIES
        return next
      })
    }

    intervalRef.current = window.setInterval(tick, LOG_STREAM_INTERVAL_MS)
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [paused])

  const filtered = useMemo(
    () => filterLogs(entries, search, topics),
    [entries, search, topics]
  )

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            System Log
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Live RouterOS log stream · capped at {LOG_MAX_ENTRIES} entries
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? (
              <>
                <Play className='size-4' />
                Resume Stream
              </>
            ) : (
              <>
                <Pause className='size-4' />
                Pause Stream
              </>
            )}
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => {
              setEntries([...logEntriesSeed])
              toast.info('Refreshed', { description: 'Log buffer reloaded' })
            }}
          >
            <RefreshCw className='size-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => {
              setEntries([])
              toast.success('Cleared')
            }}
          >
            <Trash2 className='size-4' />
            Clear
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='flex flex-col gap-3 pt-6'>
          <LogToolbar
            search={search}
            onSearchChange={setSearch}
            selectedTopics={topics}
            onTopicsChange={setTopics}
            totalShown={filtered.length}
            totalAll={entries.length}
          />
          <LogTable entries={filtered} />
        </CardContent>
      </Card>
    </Main>
  )
}

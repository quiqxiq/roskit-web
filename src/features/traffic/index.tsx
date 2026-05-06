import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { InterfaceSelect } from './components/interface-select'
import { TrafficChart } from './components/traffic-chart'
import { TrafficModeToggle } from './components/traffic-mode-toggle'
import { TrafficStatsRow } from './components/traffic-stats-row'
import {
  build24hHistory,
  emptySample,
  interfacesSeed,
  LIVE_INTERVAL_MS,
  LIVE_MAX_POINTS,
  nextLiveSample,
} from './data/data'
import {
  type NetInterface,
  type TrafficMode,
  type TrafficSample,
} from './data/schema'

const defaultIface =
  interfacesSeed.find((i) => i.running && !i.disabled)?.name ??
  interfacesSeed[0]?.name ??
  ''

function buildSeedLive(): TrafficSample[] {
  const now = Date.now()
  const seed: TrafficSample[] = []
  for (let i = LIVE_MAX_POINTS - 1; i >= 0; i--) {
    seed.push(emptySample(now - i * LIVE_INTERVAL_MS))
  }
  return seed
}

export function Traffic() {
  const [selectedName, setSelectedName] = useState(defaultIface)
  const [mode, setMode] = useState<TrafficMode>('live')
  const [paused, setPaused] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const selectedInterface =
    interfacesSeed.find((i) => i.name === selectedName) ?? interfacesSeed[0]

  const runningCount = interfacesSeed.filter(
    (i) => i.running && !i.disabled
  ).length

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Traffic Monitor
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {runningCount} of {interfacesSeed.length} interfaces running
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            setRefreshKey((k) => k + 1)
            toast.info('Refreshed', {
              description:
                mode === 'live' ? 'Live stream restarted' : 'History rebuilt',
            })
          }}
        >
          <RefreshCw className='size-4' />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2 space-y-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <InterfaceSelect
              interfaces={interfacesSeed}
              value={selectedName}
              onChange={setSelectedName}
            />
            <TrafficModeToggle mode={mode} onChange={setMode} />
          </div>
          {mode === 'live' && (
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5'
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? (
                <>
                  <Play className='size-4' />
                  Resume
                </>
              ) : (
                <>
                  <Pause className='size-4' />
                  Pause
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <TrafficPanel
            key={`${selectedInterface.id}-${mode}-${refreshKey}`}
            iface={selectedInterface}
            mode={mode}
            paused={paused}
          />
        </CardContent>
      </Card>
    </Main>
  )
}

type TrafficPanelProps = {
  iface: NetInterface
  mode: TrafficMode
  paused: boolean
}

function TrafficPanel({ iface, mode, paused }: TrafficPanelProps) {
  const [samples, setSamples] = useState<TrafficSample[]>(() => {
    if (mode === 'history') return build24hHistory(iface)
    return buildSeedLive()
  })
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (mode !== 'live' || paused) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const tick = () => {
      if (document.visibilityState === 'hidden') return
      setSamples((prev) => {
        const last = prev[prev.length - 1] ?? null
        const next = nextLiveSample(last, iface)
        const nextArr = [...prev, next]
        if (nextArr.length > LIVE_MAX_POINTS) nextArr.shift()
        return nextArr
      })
    }

    intervalRef.current = window.setInterval(tick, LIVE_INTERVAL_MS)
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mode, paused, iface])

  const current = samples[samples.length - 1] ?? null

  return (
    <>
      <TrafficStatsRow current={current} samples={samples} />
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='font-mono text-sm'>
            {iface.name}
            {iface.comment && (
              <span className='ml-2 text-xs font-normal text-muted-foreground'>
                {iface.comment}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrafficChart samples={samples} mode={mode} />
        </CardContent>
      </Card>
    </>
  )
}

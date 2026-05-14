import { useState } from 'react'
import { CheckCircle2, Loader2, RotateCcw, WifiOff, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTestRouterConnection } from '../api/queries'
import type { ConnectionTestResult } from '../api/schema'
import { useRoutersDialogStore } from '../store/routers-dialog-store'

type Draft = {
  ip_address: string
  api_port: string
  api_username: string
  password: string
}

export function RoutersTestDialog() {
  const { mode, selectedRouter, close } = useRoutersDialogStore()
  const isOpen = mode === 'test'

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      {isOpen && selectedRouter && (
        <RoutersTestForm
          key={selectedRouter.id}
          routerId={selectedRouter.id}
          initial={{
            ip_address: selectedRouter.ip_address,
            api_port: String(selectedRouter.api_port),
            api_username: selectedRouter.api_username,
            password: '',
          }}
          onClose={close}
        />
      )}
    </Dialog>
  )
}

type FormProps = {
  routerId: number
  initial: Draft
  onClose: () => void
}

function RoutersTestForm({ routerId, initial, onClose }: FormProps) {
  const testMut = useTestRouterConnection()
  const [draft, setDraft] = useState<Draft>(initial)
  const [result, setResult] = useState<ConnectionTestResult | null>(null)

  const set = (key: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }))

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    const port = parseInt(draft.api_port, 10)
    testMut.mutate(
      {
        id: routerId,
        body: {
          ip_address: draft.ip_address.trim(),
          api_port: isNaN(port) ? undefined : port,
          api_username: draft.api_username.trim(),
          password: draft.password,
        },
      },
      {
        onSuccess: (data) => setResult(data),
        onError: (err) =>
          setResult({
            connected: false,
            latency_ms: 0,
            routeros_version: '',
            board_model: '',
            identity: '',
            error: err.message,
          }),
      },
    )
  }

  const handleReset = () => {
    setResult(null)
    testMut.reset()
  }

  return (
    <DialogContent className='sm:max-w-sm'>
      <form onSubmit={handleTest} className='space-y-4'>
        <DialogHeader>
          <DialogTitle>Test Connection</DialogTitle>
          <DialogDescription>
            Verify connectivity to this router using the credentials below.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <TestResult result={result} />
        ) : (
          <div className='space-y-3'>
            <div className='grid grid-cols-[1fr_auto] gap-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='test-ip'>IP Address</Label>
                <Input
                  id='test-ip'
                  autoComplete='off'
                  value={draft.ip_address}
                  onChange={set('ip_address')}
                  disabled={testMut.isPending}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='test-port'>Port</Label>
                <Input
                  id='test-port'
                  type='number'
                  className='w-20'
                  value={draft.api_port}
                  onChange={set('api_port')}
                  disabled={testMut.isPending}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='test-username'>Username</Label>
              <Input
                id='test-username'
                autoComplete='off'
                value={draft.api_username}
                onChange={set('api_username')}
                disabled={testMut.isPending}
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='test-password'>Password</Label>
              <Input
                id='test-password'
                type='password'
                autoComplete='off'
                autoFocus
                placeholder='Enter router API password'
                value={draft.password}
                onChange={set('password')}
                disabled={testMut.isPending}
              />
              <p className='text-[11px] text-muted-foreground'>
                Password is sent directly to the router and never stored.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={testMut.isPending}>
              Close
            </Button>
          </DialogClose>
          {result ? (
            <Button type='button' variant='secondary' onClick={handleReset}>
              <RotateCcw className='size-4' />
              Test Again
            </Button>
          ) : (
            <Button type='submit' disabled={testMut.isPending || !draft.password}>
              {testMut.isPending && <Loader2 className='size-4 animate-spin' />}
              Test Connection
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function TestResult({ result }: { result: ConnectionTestResult }) {
  if (!result.connected) {
    return (
      <div className='space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-4'>
        <div className='flex items-center gap-2 text-sm font-medium text-destructive'>
          <XCircle className='size-4' />
          Connection failed
        </div>
        {result.error && (
          <p className='text-xs text-muted-foreground'>{result.error}</p>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-2 rounded-md border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30'>
      <div className='flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400'>
        <CheckCircle2 className='size-4' />
        Connected
      </div>
      <dl className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs'>
        <dt className='text-muted-foreground'>Latency</dt>
        <dd className='font-mono'>{result.latency_ms} ms</dd>
        {result.identity && (
          <>
            <dt className='text-muted-foreground'>Identity</dt>
            <dd className='font-mono'>{result.identity}</dd>
          </>
        )}
        {result.board_model && (
          <>
            <dt className='text-muted-foreground'>Board</dt>
            <dd className='font-mono'>{result.board_model}</dd>
          </>
        )}
        {result.routeros_version && (
          <>
            <dt className='text-muted-foreground'>RouterOS</dt>
            <dd className='font-mono'>{result.routeros_version}</dd>
          </>
        )}
      </dl>
    </div>
  )
}

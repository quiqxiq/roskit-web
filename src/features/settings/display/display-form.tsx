import { useMemo } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart2,
  HelpCircle,
  FileText,
  LayoutDashboard,
  RotateCcw,
  Settings,
  Ticket,
  Wifi,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  useMobileNav,
  type MobileNavItemId,
} from '@/context/mobile-nav-store'

type AvailableItem = {
  id: MobileNavItemId
  title: string
  icon: React.ElementType
  children?: { title: string }[]
}

const AVAILABLE_ITEMS: AvailableItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'hotspot',
    title: 'Hotspot',
    icon: Wifi,
    children: [
      { title: 'Users' },
      { title: 'Profiles' },
      { title: 'Active' },
      { title: 'Hosts' },
    ],
  },
  {
    id: 'voucher',
    title: 'Voucher',
    icon: Ticket,
    children: [{ title: 'Generate' }, { title: 'Print Queue' }],
  },
  {
    id: 'traffic',
    title: 'Traffic',
    icon: Activity,
  },
  {
    id: 'log',
    title: 'Log',
    icon: FileText,
  },
  {
    id: 'report',
    title: 'Report',
    icon: BarChart2,
    children: [{ title: 'Daily' }, { title: 'Monthly' }],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Profile' },
      { title: 'Account' },
      { title: 'Appearance' },
      { title: 'Display' },
      { title: 'Notifications' },
    ],
  },
  {
    id: 'help-center',
    title: 'Help Center',
    icon: HelpCircle,
  },
]

export function DisplayForm() {
  const { items, add, remove, moveUp, moveDown, reset, maxItems } =
    useMobileNav()

  const selectedSet = useMemo(() => new Set(items), [items])
  const isFull = items.length >= maxItems

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-lg font-medium'>Mobile Bottom Navigation</h3>
        <p className='text-sm text-muted-foreground'>
          Choose which items appear in the bottom navigation bar on mobile
          devices. Up to {maxItems} items.
        </p>
      </div>
      <Separator />

      <div className='space-y-1'>
        <p className='text-sm font-medium text-muted-foreground'>
          {items.length}/{maxItems} items selected
        </p>

        <div className='space-y-3 pt-2'>
          {AVAILABLE_ITEMS.map((avail) => {
            const isSelected = selectedSet.has(avail.id)
            const canSelect = isSelected || !isFull
            const Icon = avail.icon

            return (
              <div key={avail.id}>
                <div className='flex items-center gap-3'>
                  <Checkbox
                    checked={isSelected}
                    disabled={!canSelect}
                    onCheckedChange={(checked) =>
                      checked ? add(avail.id) : remove(avail.id)
                    }
                  />
                  <Icon className='size-4 text-muted-foreground' />
                  <span
                    className={`text-sm font-medium ${isSelected ? '' : 'text-muted-foreground'}`}
                  >
                    {avail.title}
                  </span>

                  {isSelected && (
                    <div className='ml-auto flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7'
                        disabled={items.indexOf(avail.id) === 0}
                        onClick={() => moveUp(avail.id)}
                      >
                        <ArrowUp className='size-3.5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7'
                        disabled={
                          items.indexOf(avail.id) === items.length - 1
                        }
                        onClick={() => moveDown(avail.id)}
                      >
                        <ArrowDown className='size-3.5' />
                      </Button>
                    </div>
                  )}
                </div>

                {avail.children && isSelected && (
                  <div className='ml-11 mt-1 flex flex-wrap gap-1.5'>
                    {avail.children.map((child) => (
                      <span
                        key={child.title}
                        className='inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                      >
                        {child.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className='flex gap-2'>
        <Button variant='outline' onClick={reset}>
          <RotateCcw className='mr-2 size-4' />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}

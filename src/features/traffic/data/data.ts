import { faker } from '@faker-js/faker'
import { type NetInterface, type TrafficSample } from './schema'

faker.seed(500)

const INTERFACE_TEMPLATES: Array<Omit<NetInterface, 'id'> & { capMbps: number }> = [
  {
    name: 'ether1',
    type: 'ether',
    mtu: '1500',
    running: true,
    disabled: false,
    comment: 'WAN uplink',
    capMbps: 1000,
  },
  {
    name: 'ether2',
    type: 'ether',
    mtu: '1500',
    running: true,
    disabled: false,
    comment: 'Trunk to switch',
    capMbps: 1000,
  },
  {
    name: 'ether3',
    type: 'ether',
    mtu: '1500',
    running: true,
    disabled: false,
    comment: 'AP-01',
    capMbps: 1000,
  },
  {
    name: 'ether4',
    type: 'ether',
    mtu: '1500',
    running: false,
    disabled: false,
    comment: 'spare',
    capMbps: 1000,
  },
  {
    name: 'ether5',
    type: 'ether',
    mtu: '1500',
    running: false,
    disabled: true,
    comment: 'disabled',
    capMbps: 1000,
  },
  {
    name: 'bridge1',
    type: 'bridge',
    mtu: '1500',
    running: true,
    disabled: false,
    comment: 'LAN bridge',
    capMbps: 1000,
  },
  {
    name: 'wlan1',
    type: 'wlan',
    mtu: '1500',
    running: true,
    disabled: false,
    comment: 'Hotspot AP',
    capMbps: 300,
  },
  {
    name: 'pppoe-out1',
    type: 'pppoe',
    mtu: '1480',
    running: true,
    disabled: false,
    comment: 'ISP dialer',
    capMbps: 100,
  },
]

export const interfacesSeed: NetInterface[] = INTERFACE_TEMPLATES.map(
  (tpl, i) => ({
    id: `*${(i + 1).toString().padStart(4, '0')}`,
    name: tpl.name,
    type: tpl.type,
    mtu: tpl.mtu,
    running: tpl.running,
    disabled: tpl.disabled,
    comment: tpl.comment,
  })
)

export const interfaceCapMap: Record<string, number> = Object.fromEntries(
  INTERFACE_TEMPLATES.map((tpl) => [tpl.name, tpl.capMbps * 1_000_000])
)

export function emptySample(timestamp: number): TrafficSample {
  return {
    timestamp,
    rxBps: 0,
    txBps: 0,
    rxPps: 0,
    txPps: 0,
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function nextLiveSample(
  prev: TrafficSample | null,
  iface: NetInterface,
  now: number = Date.now()
): TrafficSample {
  const cap = interfaceCapMap[iface.name] ?? 100_000_000
  if (!iface.running || iface.disabled) {
    return emptySample(now)
  }

  const baseRx = prev?.rxBps ?? cap * 0.15
  const baseTx = prev?.txBps ?? cap * 0.1

  const rxJitter = (Math.random() - 0.5) * cap * 0.1
  const txJitter = (Math.random() - 0.5) * cap * 0.08

  const rxBps = clamp(baseRx + rxJitter, cap * 0.02, cap * 0.85)
  const txBps = clamp(baseTx + txJitter, cap * 0.01, cap * 0.7)

  return {
    timestamp: now,
    rxBps: Math.round(rxBps),
    txBps: Math.round(txBps),
    rxPps: Math.round(rxBps / 8000),
    txPps: Math.round(txBps / 8000),
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

export function build24hHistory(
  iface: NetInterface,
  now: number = Date.now()
): TrafficSample[] {
  const points = 24 * 60
  const cap = interfaceCapMap[iface.name] ?? 100_000_000
  const rng = mulberry32(hashName(iface.name))
  const samples: TrafficSample[] = []

  if (!iface.running || iface.disabled) {
    for (let i = 0; i < points; i++) {
      samples.push(emptySample(now - (points - i) * 60_000))
    }
    return samples
  }

  let rx = cap * 0.1
  let tx = cap * 0.07

  for (let i = 0; i < points; i++) {
    const t = now - (points - i) * 60_000
    const date = new Date(t)
    const hour = date.getHours()
    const dayCurve =
      0.3 + 0.7 * Math.max(0, Math.sin(((hour - 6) / 18) * Math.PI))
    const target = cap * dayCurve

    rx += (target * 0.5 - rx) * 0.05 + (rng() - 0.5) * cap * 0.05
    tx += (target * 0.35 - tx) * 0.05 + (rng() - 0.5) * cap * 0.04

    rx = clamp(rx, cap * 0.02, cap * 0.85)
    tx = clamp(tx, cap * 0.01, cap * 0.7)

    samples.push({
      timestamp: t,
      rxBps: Math.round(rx),
      txBps: Math.round(tx),
      rxPps: Math.round(rx / 8000),
      txPps: Math.round(tx / 8000),
    })
  }

  return samples
}

export const HISTORY_WINDOW_MS = DAY_MS

function hashName(name: string): number {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function peakRx(samples: TrafficSample[]): number {
  return samples.reduce((m, s) => Math.max(m, s.rxBps), 0)
}

export function peakTx(samples: TrafficSample[]): number {
  return samples.reduce((m, s) => Math.max(m, s.txBps), 0)
}

export const LIVE_INTERVAL_MS = 2000
export const LIVE_MAX_POINTS = 60

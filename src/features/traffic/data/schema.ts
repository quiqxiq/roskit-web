import { z } from 'zod'

export const interfaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  mtu: z.string(),
  running: z.boolean(),
  disabled: z.boolean(),
  comment: z.string(),
})
export type NetInterface = z.infer<typeof interfaceSchema>

export const trafficSampleSchema = z.object({
  timestamp: z.number(),
  rxBps: z.number(),
  txBps: z.number(),
  rxPps: z.number(),
  txPps: z.number(),
})
export type TrafficSample = z.infer<typeof trafficSampleSchema>

export type TrafficMode = 'live' | 'history'

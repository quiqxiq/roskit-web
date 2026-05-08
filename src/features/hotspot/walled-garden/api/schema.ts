import { z } from 'zod'

// Mirror of docs/openapi/components/schemas/hotspot.yaml#/WalledGardenRecord
//
// Host-level walled-garden rule — exempts an HTTP/HTTPS hostname (e.g.
// `youtube.com`) from hotspot redirection. Operates at the application
// layer via the hotspot's own walled-garden table.
export const WalledGardenRecordSchema = z
  .object({
    '.id': z.string(),
    'dst-host': z.string().optional(),
    'dst-port': z.string().optional(),
    'src-address': z.string().optional(),
    protocol: z.string().optional(),
    action: z.enum(['allow', 'deny']).optional(),
    comment: z.string().optional(),
    disabled: z.enum(['true', 'false']).optional(),
    server: z.string().optional(),
  })
  .passthrough()
export type WalledGardenRecord = z.infer<typeof WalledGardenRecordSchema>

// Mirror of WalledGardenIPRecord — IP/firewall-level rule. Distinct
// from the host-level table because RouterOS implements them on
// different layers (NAT vs hotspot).
export const WalledGardenIPRecordSchema = z
  .object({
    '.id': z.string(),
    'dst-address': z.string().optional(),
    'dst-port': z.string().optional(),
    protocol: z.string().optional(),
    action: z.enum(['accept', 'drop']).optional(),
    comment: z.string().optional(),
    disabled: z.enum(['true', 'false']).optional(),
  })
  .passthrough()
export type WalledGardenIPRecord = z.infer<typeof WalledGardenIPRecordSchema>

// Free-form key/value bodies for both POST endpoints.
export const WalledGardenMutationSchema = z.record(z.string(), z.string())
export type WalledGardenMutation = z.infer<typeof WalledGardenMutationSchema>

import { BUILTIN_TEMPLATES } from './builtin-defaults'
import { type PrintTemplate } from './schema'

const SEED_TS = new Date('2025-01-01T00:00:00.000Z')

export const globalTemplatesSeed: PrintTemplate[] = BUILTIN_TEMPLATES.map(
  (b) => ({
    id: b.id,
    tenantId: null,
    name: b.name,
    type: b.type,
    isBuiltin: true,
    header: b.header,
    row: b.row,
    footer: b.footer,
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  })
)

export function emptyTemplate(): Omit<
  PrintTemplate,
  'id' | 'createdAt' | 'updatedAt'
> {
  return {
    tenantId: null,
    name: '',
    type: '',
    isBuiltin: false,
    header: '',
    row: '',
    footer: '',
  }
}

// Mock variables untuk preview iframe — dipakai oleh composePreview helper.
export const PREVIEW_VARS_BASE: Record<string, string> = {
  hotspotName: 'Bintang WiFi',
  username: 'alpha-7k2',
  password: 'q9z-bx4',
  price: '5000',
  validity: '7d',
  limitUptime: '2h',
  limitBytesTotal: '500MB',
  dnsName: 'bintang.local',
  comment: '',
  timeStamp: new Date().toLocaleString('en-GB'),
  // logo & qrCode fallback ringan supaya preview tetap render
  logo:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="30"><rect width="80" height="30" fill="#000"/><text x="40" y="20" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">LOGO</text></svg>'
    ),
  qrCode:
    '<img alt="qr" class="qrcode" src="data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><g fill="#000"><rect x="6" y="6" width="14" height="14"/><rect x="40" y="6" width="14" height="14"/><rect x="6" y="40" width="14" height="14"/><rect x="22" y="22" width="6" height="6"/><rect x="32" y="32" width="6" height="6"/><rect x="22" y="38" width="4" height="4"/><rect x="38" y="22" width="4" height="4"/></g></svg>'
    ) +
    '" />',
}


import { type PrintTemplate } from './schema'

const now = new Date()

export const globalTemplatesSeed: PrintTemplate[] = [
  {
    id: 'g-default-header',
    tenantId: null,
    name: 'Default · Header',
    type: 'default',
    part: 'header',
    content: `<div style="font-family:sans-serif;text-align:center;padding:8px;">
  <h2>{{HotspotName}}</h2>
  <p style="font-size:11px;color:#555;">{{DNSName}} · {{Phone}}</p>
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-default-row',
    tenantId: null,
    name: 'Default · Row',
    type: 'default',
    part: 'row',
    content: `<div class="voucher" style="border:1px dashed #888;padding:8px;margin:4px;font-family:monospace;">
  <div><b>User:</b> {{Username}}</div>
  <div><b>Pass:</b> {{Password}}</div>
  <div><b>Profile:</b> {{Profile}}</div>
  <div><b>Price:</b> {{Currency}} {{Price}}</div>
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-default-footer',
    tenantId: null,
    name: 'Default · Footer',
    type: 'default',
    part: 'footer',
    content: `<div style="text-align:center;font-size:10px;color:#888;padding:6px;">
  Generated {{GeneratedAt}} · {{HotspotName}}
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-qr-header',
    tenantId: null,
    name: 'QR · Header',
    type: 'qr',
    part: 'header',
    content: `<div style="text-align:center;padding:6px;">
  <h3>{{HotspotName}} — Scan & Connect</h3>
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-qr-row',
    tenantId: null,
    name: 'QR · Row',
    type: 'qr',
    part: 'row',
    content: `<div class="voucher-qr" style="border:1px solid #ccc;padding:6px;margin:4px;display:flex;gap:8px;align-items:center;">
  <img src="{{QRImageUrl}}" alt="qr" width="80" height="80" />
  <div style="font-family:monospace;font-size:11px;">
    <div>{{Username}} / {{Password}}</div>
    <div>{{Profile}} · {{Currency}}{{Price}}</div>
  </div>
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-qr-footer',
    tenantId: null,
    name: 'QR · Footer',
    type: 'qr',
    part: 'footer',
    content: `<div style="text-align:center;font-size:10px;color:#888;padding:4px;">
  WPA2: {{WiFiSSID}} / {{WiFiPassword}}
</div>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'g-small-row',
    tenantId: null,
    name: 'Small · Row',
    type: 'small',
    part: 'row',
    content: `<div style="border-bottom:1px dashed #ccc;padding:4px;font-family:monospace;font-size:10px;">
  {{Username}}/{{Password}} · {{Profile}} · {{Currency}}{{Price}}
</div>`,
    createdAt: now,
    updatedAt: now,
  },
]

export function emptyTemplate(): Omit<
  PrintTemplate,
  'id' | 'createdAt' | 'updatedAt'
> {
  return {
    tenantId: null,
    name: '',
    type: 'default',
    part: 'row',
    content: '',
  }
}

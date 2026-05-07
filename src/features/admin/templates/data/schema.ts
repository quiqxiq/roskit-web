// PrintTemplate (global default) — selaras dengan @/internal/models/print_template.go
// tenantId === null artinya template global default; di-copy saat tenant baru dibuat.

export type PrintTemplatePart = 'header' | 'row' | 'footer'
export type PrintTemplateType = 'default' | 'qr' | 'small'

export type PrintTemplate = {
  id: string
  tenantId: string | null
  name: string
  type: PrintTemplateType
  part: PrintTemplatePart
  content: string
  createdAt: Date
  updatedAt: Date
}

export const partOptions: { value: PrintTemplatePart; label: string }[] = [
  { value: 'header', label: 'Header' },
  { value: 'row', label: 'Row' },
  { value: 'footer', label: 'Footer' },
]

export const typeOptions: { value: PrintTemplateType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'qr', label: 'QR Code' },
  { value: 'small', label: 'Small' },
]

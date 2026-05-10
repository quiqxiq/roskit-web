// PrintTemplate — 1 entry = 1 template lengkap (header + row + footer).
// Built-in templates (Default/Small/Thermal) di-seed dari @/web/template/*.txt
// dan tidak bisa di-delete (hanya edit + reset). User bisa add custom template
// dengan free-text type identifier.
//
// Mapping ke backend `print_templates` (yang punya kolom `part` per row) ditunda
// — lihat plan: Backend wiring deferred.

export type PrintTemplate = {
  id: string
  name: string
  type: string
  isBuiltin: boolean
  header: string
  row: string
  footer: string
  createdAt: Date
  updatedAt: Date
}

export type PreviewVarianceMode = 'vc' | 'up'

# Feature Pages Implementation — Notepad

## 2026-05-13T18:31 Session Start
- Plan: feature-pages.md
- Pattern: Follow hotspot/users/ canonical structure
- SSE: Use existing useSSE hook from src/lib/api/sse.ts
- Router API: Already complete in src/features/routers/api/
- Traffic: Components exist but use mock data — need real API + SSE

### Key Conventions (inherited)
- Query key pattern: `[domain, resource, ...identifiers, filters?]`
- Service pattern: `apiClient.get<Envelope<T>>()` + `unwrap(res.data)`
- Dialog pattern: Zustand store with mode + selected entity
- Page pattern: useActiveRouterId() → query → render + empty states
- SSE pattern: useSSE<T>(path, onEvent, { getToken })

### Tech Stack
- TanStack Router, TanStack Query, Zustand, ShadCN UI, Recharts
- Zod for schemas, vitest for testing

### 2026-05-14 Routers Dialog Store
- Created `src/features/routers/store/routers-dialog-store.ts`
- Pattern: Zustand `create<T>()((set) => ({...}))` following users-dialog-store.ts
- Mode type: `'closed' | 'create' | 'edit' | 'delete' | 'test' | 'migrate'`
- `closed` string (not null) as default/"off" state per task spec
- Single `selectedRouter: RouterPublicView | null` entity (no `ids` array needed)
- TypeScript compiles clean

### 2026-05-14 T2 — Data layer refactor (traffic)
- Removed all faker/mock data from `src/features/traffic/data/data.ts`
- NetInterface in `data/schema.ts` now a plain type (no Zod schema — replaced by api/ InterfaceRecordSchema)
- Added `macAddress?: string` from API's `mac-address`
- running/disabled converted from `'true'|'false'` string to `boolean` in the transformer
- Kept `comment` field (RouterOS passthrough) — accessed via `(record as Record<string, string>).comment`
- Transformers: `interfaceToNetInterface(InterfaceRecord): NetInterface`, `telemetryToTrafficSample(event): TrafficSample`
- `emptySample()` retained for initial state
- TypeScript compiles clean, zero faker references remain in traffic feature/

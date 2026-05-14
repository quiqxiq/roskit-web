# Feature Pages Implementation: Routers CRUD + Traffic SSE Integration

## TL;DR

> **Quick Summary**: Build the Routers management page (full CRUD table with create/edit/delete/test/migrate dialogs) and replace Traffic's mock data with real-time SSE integration plus an interface detail Sheet panel. Report and Voucher pages are already complete.
> 
> **Deliverables**:
> - Routers CRUD page (table + 5 dialogs) under Admin section
> - Traffic SSE integration (replace faker data with real API + telemetry stream)
> - Traffic interface detail Sheet (queues, DHCP leases, NAT rules)
> - Network API layer (service.ts, queries.ts, schema.ts)
> - Updated sidebar with Routers entry
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: T1 (network schema) → T5 (traffic SSE) → T8 (detail panel)

---

## Context

### Original Request
"Implementasi seperti yang ada pada hotspot/users/ pada bagian routers/, dan traffic/ — karena masih perlu components dan lainnya karena masih tidak ada pages. Traffic seharusnya menggunakan SSE realtime."

### Interview Summary
**Key Discussions**:
- Routers: Full CRUD (list, create, edit, delete, test connection, migrate) — user chose "Full CRUD (Recommended)"
- Report/Voucher: User requested verification — both are complete, no work needed
- Traffic: SSE integration + interface detail panel (Sheet) — user chose "SSE + interface detail panel"
- UI Pattern: Follow hotspot/users (DataTable + ShadCN dialogs + Zustand stores)
- Test Strategy: Tests after implementation
- Sidebar: Routers goes under Admin section
- Detail Panel: Side panel / Sheet (Recommended)

**Research Findings**:
- `src/features/routers/api/` already has complete service.ts, queries.ts, schema.ts (CRUD + test + migrate)
- `src/features/traffic/` has 4 UI components using mock/faker data — no real API layer
- `src/lib/api/sse.ts` provides `useSSE<T>(path, onEvent, opts)` hook with token auth via query param + exponential backoff
- `useHotspotUsersStream` in `src/features/hotspot/users/api/queries.ts` is the canonical SSE usage pattern
- Network API endpoints in OpenAPI: listInterfaces, getInterfaceTraffic, listPools, listQueues, listNATRules, listDHCPLeases
- Traffic SSE endpoints: `/routers/:routerId/traffic/:interface` (telemetry stream)
- `src/stores/active-router-store.ts` provides `useActiveRouterId()` — all router-scoped features use this

### Metis Review
**Identified Gaps** (addressed):
- Router form fields: Auto-resolved — schema.ts has CreateRouterRequest and UpdateRouterRequest with full field definitions
- Test connection response: Auto-resolved — ConnectionTestResult schema exists with connected, latency_ms, routeros_version, board_model, identity
- Migrate scope: Will be a simple file_path input dialog — no upload, just server path
- SSE endpoint format: Auto-resolved — `/routers/{routerId}/traffic/{interface}` for telemetry
- Empty states: Follow existing pattern like "No router selected" in hotspot/users
- Error handling: Use existing `parseAPIError()` pattern from auth
- Telemetry data shape: TelemetryEvent = { measurement, tags, fields, timestamp } per sse.yaml

---

## Work Objectives

### Core Objective
Build the Routers admin page with full CRUD functionality and replace Traffic's mock data with real-time SSE-driven data, plus add an interface detail Sheet panel.

### Concrete Deliverables
- `src/features/routers/components/` — DataTable, dialogs, view models
- `src/features/routers/data/` — Column definitions, form schemas
- `src/features/routers/store/` — Dialog state management
- `src/features/routers/index.tsx` — Page component
- `src/routes/_authenticated/admin/routers.tsx` — Route file
- `src/components/layout/data/sidebar-data.ts` — Updated with Routers entry
- `src/features/traffic/api/service.ts` — Network API service
- `src/features/traffic/api/queries.ts` — TanStack Query hooks + SSE hook
- `src/features/traffic/api/schema.ts` — Zod schemas
- `src/features/traffic/index.tsx` — Updated to use real API
- `src/features/traffic/components/interface-detail-sheet.tsx` — Interface detail panel
- `src/lib/api/query-keys.ts` — New query keys for network/routers
- `src/features/traffic/data/` — Updated (remove faker, add real data transforms)

### Definition of Done
- [ ] Routers page lists all routers in a data table with sortable columns
- [ ] Create router dialog works (name, IP, port, username, password, notes)
- [ ] Edit router dialog pre-fills and saves changes
- [ ] Delete router dialog confirms and removes
- [ ] Test connection button returns latency, version, board model
- [ ] Traffic page shows real interfaces from selected router (not faker data)
- [ ] Traffic chart updates live via SSE telemetry stream
- [ ] Interface detail Sheet shows queues, DHCP leases, NAT rules for selected interface
- [ ] TypeScript check passes (`tsc --noEmit` zero errors)
- [ ] Lint passes (zero errors)

### Must Have
- Routers data table with all CRUD operations
- Traffic SSE integration replacing all mock/faker data
- Interface detail Sheet with queues, DHCP, NAT tabs
- Sidebar entry for Routers under Admin
- All Zod schemas matching OpenAPI spec
- `useSSE` hook integration for traffic telemetry (following hotspot/users pattern)

### Must NOT Have (Guardrails)
- NO changes to existing Report or Voucher pages (they are complete)
- NO new router selection wizard or onboarding flow — just a CRUD table
- NO custom chart library — reuse existing Recharts from traffic-chart.tsx
- NO mock/faker data remaining in traffic feature after SSE integration
- NO role-based access control for routers (not in scope)
- NO new SSE library — use existing `useSSE` hook from `src/lib/api/sse.ts`
- NO pagination for routers list (typically <20 routers, list endpoint returns all)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (bun test + vitest configured)
- **Automated tests**: YES (Tests after implementation)
- **Framework**: bun test / vitest
- **Agent-Executed QA**: ALWAYS (mandatory for all tasks regardless of test choice)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **CLI/TypeScript**: Use Bash (`tsc --noEmit`) — zero type errors
- **API**: Use Bash (curl) — test against mock/local endpoints

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation + scaffolding):
├── T1: Create network API layer (schema.ts, service.ts, queries.ts) [quick]
├── T2: Add query keys for network + routers to query-keys.ts [quick]
├── T3: Routers data layer (column defs, form schemas, view model) [quick]
├── T4: Routers dialog store (Zustand) [quick]
└── T5: Traffic schema refactor (remove faker, align with API types) [quick]

Wave 2 (After Wave 1 — core UI):
├── T6: Routers data table component [unspecified-high]
├── T7: Routers CRUD dialogs (create, edit, delete, test, migrate) [deep]
├── T8: Routers page + route + sidebar entry [quick]
├── T9: Traffic SSE integration (replace mock with real data) [deep]
└── T10: Traffic interface detail Sheet [unspecified-high]

Wave 3 (After Wave 2 — refinement + verification):
├── T11: Unit tests for Routers API layer [quick]
├── T12: Unit tests for Traffic API layer + SSE hooks [quick]
└── T13: E2E verification (TypeScript + lint) [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay

Critical Path: T1 → T9 → T10 → T13 → F3
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 5 (Wave 1 & 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| T1  | - | T5, T9, T10, T12 |
| T2  | - | T1 (query keys used in T1), T6, T7 |
| T3  | - | T6, T7 |
| T4  | - | T6, T7 |
| T5  | T1 | T9 |
| T6  | T2, T3 | T8 |
| T7  | T2, T3, T4 | T8 |
| T8  | T6, T7 | F3 |
| T9  | T1, T5 | T10 |
| T10 | T1, T9 | F3 |
| T11 | T2 | T13 |
| T12 | T1 | T13 |
| T13 | T11, T12 | F1-F4 |

### Agent Dispatch Summary

- **Wave 1**: 5 tasks — T1-T4 → `quick`, T5 → `quick`
- **Wave 2**: 5 tasks — T6 → `unspecified-high`, T7 → `deep`, T8 → `quick`, T9 → `deep`, T10 → `unspecified-high`
- **Wave 3**: 3 tasks — T11-T12 → `quick`, T13 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Create Network API Layer (schema.ts, service.ts, queries.ts)

  **What to do**:
  - Create `src/features/traffic/api/schema.ts` with Zod schemas for: `InterfaceRecordSchema`, `InterfaceTrafficSchema`, `QueueRecordSchema`, `NATRuleRecordSchema`, `DHCPLeaseRecordSchema`, `PoolRecordSchema` (matching OpenAPI `docs/openapi/components/schemas/network.yaml`)
  - Create `src/features/traffic/api/service.ts` with API functions: `listInterfaces(routerId)`, `getInterfaceTraffic(routerId, iface)`, `listQueues(routerId)`, `listNATRules(routerId)`, `listDHCPLeases(routerId)`, `listIPPools(routerId)`
  - Each service function follows the pattern: `apiClient.get<Envelope<T>>()` + `unwrap(res.data)` (match `src/features/hotspot/users/api/service.ts` pattern)
  - Create `src/features/traffic/api/queries.ts` with TanStack Query hooks: `useInterfaces(routerId)`, `useInterfaceTraffic(routerId, iface)`, `useQueues(routerId)`, `useNATRules(routerId)`, `useDHCPLeases(routerId)`, `useIPPools(routerId)` + SSE hook `useTrafficStream(routerId, iface)` following `useHotspotUsersStream` pattern from `src/features/hotspot/users/api/queries.ts`
  - SSE hook path: `/routers/${routerId}/traffic/${iface}` — parse TelemetryEvent from `src/features/hotspot/users/api/schema.ts` pattern or define local `TrafficTelemetryEvent` schema
  - All query hooks must use `enabled: routerId > 0` pattern (same as hotspot/users)
  - SSE hook must call `useSSE<TrafficTelemetryEvent>(path, onEvent, { getToken: () => accessToken })` pattern

  **Must NOT do**:
  - Do NOT modify existing `src/features/traffic/data/schema.ts` or `src/features/traffic/data/data.ts` yet (T5 handles that)
  - Do NOT create mock data or test fixtures
  - Do NOT add pagination to any network endpoint (backend returns full lists)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3, T4, T5)
  - **Blocks**: T5, T9, T10, T12
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/api/service.ts` — API service pattern (unwrap, Envelope, base URL construction)
  - `src/features/hotspot/users/api/queries.ts` — Query + SSE hook pattern (useQuery, useMutation, useSSE, query invalidation)
  - `src/features/hotspot/users/api/schema.ts` — Zod schema pattern (field-by-field with type exports)

  **API/Type References**:
  - `docs/openapi/components/schemas/network.yaml` — All network schemas (InterfaceRecord, InterfaceTraffic, PoolRecord, QueueRecord, NATRuleRecord, DHCPLeaseRecord)
  - `docs/openapi/paths/network.yaml` — All network endpoint paths and response shapes
  - `docs/openapi/paths/sse.yaml` — SSE telemetry endpoint (TelemetryEvent schema)
  - `docs/openapi/components/schemas/sse.yaml` — TelemetryEvent shape: { measurement, tags, fields, timestamp }

  **Test References**:
  - `src/features/hotspot/users/api/queries.ts:useHotspotUsersStream` — SSE hook pattern with token + onEvent callback

  **External References**:
  - `src/lib/api/sse.ts` — useSSE hook API (path, onEvent, opts)
  - `src/lib/api/query-keys.ts` — Query key naming convention (domain, resource, identifiers, filters)
  - `src/lib/api/client.ts` — apiClient base URL construction
  - `src/lib/api/unwrap.ts` — Envelope unwrapping pattern

  **WHY Each Reference Matters**:
  - `hotspot/users/api/` is the canonical pattern — copy its structure exactly for network API
  - `network.yaml` defines exact Zod schema shapes — must match field names/types precisely
  - `sse.yaml` defines TelemetryEvent — the traffic SSE stream emits objects matching this shape
  - `query-keys.ts` must be updated with new domain keys for proper cache invalidation

  **Acceptance Criteria**:

  **If TDD (tests enabled):** — N/A (tests after implementation, T11+T12)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: TypeScript compilation — API layer has no type errors
    Tool: Bash
    Preconditions: Project dependencies installed
    Steps:
      1. Run `npx tsc --noEmit` from project root
      2. Check for errors in src/features/traffic/api/*
    Expected Result: Zero TypeScript errors in traffic/api/ files
    Failure Indicators: Any type error referencing InterfaceRecord, InterfaceTraffic, or query hooks
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt

  Scenario: Zod schemas parse network YAML correctly
    Tool: Bash (node REPL)
    Preconditions: TypeScript compiles clean
    Steps:
      1. Verify InterfaceRecordSchema, InterfaceTrafficSchema, QueueRecordSchema, NATRuleRecordSchema, DHCPLeaseRecordSchema are all exported
      2. Verify service functions listInterfaces, getInterfaceTraffic, listQueues, listNATRules, listDHCPLeases are exported
      3. Verify query hooks useInterfaces, useInterfaceTraffic, useQueues, useNATRules, useDHCPLeases, useTrafficStream are exported
    Expected Result: All exports present and typed correctly
    Failure Indicators: Missing export, wrong type, import error
    Evidence: .sisyphus/evidence/task-1-exports-check.txt
  ```

  **Commit**: YES (groups with T2)
  - Message: `feat(network): add network API layer and query keys`
  - Files: `src/features/traffic/api/schema.ts`, `src/features/traffic/api/service.ts`, `src/features/traffic/api/queries.ts`

- [x] 2. Add Query Keys for Network + Routers to query-keys.ts

  **What to do**:
  - Add router-management query keys to `src/lib/api/query-keys.ts`: `routers()` (already exists), `router(id)` (already exists), plus confirm no duplicates
  - Add network domain query keys: `networkInterfaces(routerId)`, `interfaceTraffic(routerId, iface)`, `networkPools(routerId)`, `networkQueues(routerId)`, `natRules(routerId)`, `dhcpLeases(routerId)`
  - Add traffic SSE telemetry key pattern (for potential invalidation)
  - Follow existing naming pattern: `[domain, resource, ...identifiers, filters?]`

  **Must NOT do**:
  - Do NOT remove or rename existing query keys
  - Do NOT change any existing query key structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3, T4, T5)
  - **Blocks**: T6, T7 (routers queries need keys)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/lib/api/query-keys.ts:55-100` — Existing domain key structure (hotspot, ppp, network, system patterns)

  **WHY Each Reference Matters**:
  - Query key naming convention must be consistent for TanStack Query cache invalidation to work properly

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Query keys conform to naming pattern
    Tool: Bash
    Steps:
      1. Read src/lib/api/query-keys.ts
      2. Verify `networkInterfaces`, `interfaceTraffic`, `networkPools`, `networkQueues`, `natRules`, `dhcpLeases` keys exist
      3. Verify all new keys follow `[domain, resource, ...identifiers]` pattern
    Expected Result: All new keys present and properly formatted
    Evidence: .sisyphus/evidence/task-2-query-keys.txt

  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
    Expected Result: Zero TypeScript errors
    Evidence: .sisyphus/evidence/task-2-tsc-check.txt
  ```

  **Commit**: YES (groups with T1)
  - Message: `feat(network): add network API layer and query keys`
  - Files: `src/lib/api/query-keys.ts`

- [x] 3. Routers Data Layer (Column Definitions, Form Schemas, View Model)

  **What to do**:
  - Create `src/features/routers/data/schema.ts` with form validation schemas: `RouterFormSchema` (Zod object matching CreateRouterRequest: name, ip_address, api_port optional default 8728, api_username, password min 1, notes optional) and `RouterEditFormSchema` (matching UpdateRouterRequest: all fields optional except at least one must be present)
  - Create `src/features/routers/data/data.ts` with:
    - `routerColumns` — column definition array for DataTable (name, ip_address, api_port, api_username, status badge, last_seen_at relative time, notes preview)
    - Status badge mapping: connected=green, unknown=gray, disconnected=amber, error=red (match RouterStatus enum from schema.ts)
    - Export `routerStatusConfig` object mapping status → { label, color, variant }
  - Create `src/features/routers/components/view-model.ts` with `toRouterViewModel(router: RouterPublicView)` that transforms API response into display-friendly shape (formatted last_seen_at, status display, etc.)

  **Must NOT do**:
  - Do NOT create mock data — routers come from the real API
  - Do NOT create page component or dialogs (those come in T6/T7/T8)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T4, T5)
  - **Blocks**: T6, T7
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/data/data.ts` — Column definition pattern, filter options
  - `src/features/hotspot/users/data/schema.ts` — Zod schema for filters
  - `src/features/hotspot/users/components/view-model.ts` — View model transformer pattern

  **API/Type References**:
  - `src/features/routers/api/schema.ts` — Existing RouterPublicView, CreateRouterRequest, UpdateRouterRequest, RouterStatus, ConnectionTestResult, TestConnectionRequest schemas
  - `docs/openapi/paths/routers.yaml` — Router CRUD endpoints and response shapes
  - `docs/openapi/components/schemas/router.yaml` — RouterStatus enum values: unknown, connecting, connected, disconnected, auth_failed (note: schema.ts has 'error' not 'auth_failed', check which is current)

  **WHY Each Reference Matters**:
  - `routers/api/schema.ts` already defines all the types — data layer must use those types, not redefine them
  - `hotspot/users/data/` provides the exact column definition pattern to follow
  - View model pattern transforms raw API data into display shapes (relative dates, status badges)

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Router form schemas validate correctly
    Tool: Bash (node)
    Steps:
      1. Verify RouterFormSchema exists in src/features/routers/data/schema.ts
      2. Verify it has fields: name (min 1, max 100), ip_address (min 1, max 255), api_port (int, 1-65535, default 8728), api_username (min 1, max 64), password (min 1, max 128, required for create), notes (max 500, optional)
    Expected Result: All form fields and validations match OpenAPI spec
    Evidence: .sisyphus/evidence/task-3-form-schema.txt

  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
    Expected Result: Zero TypeScript errors
    Evidence: .sisyphus/evidence/task-3-tsc-check.txt
  ```

  **Commit**: YES (groups with T4)
  - Message: `feat(routers): add data layer and dialog store`
  - Files: `src/features/routers/data/schema.ts`, `src/features/routers/data/data.ts`, `src/features/routers/components/view-model.ts`

- [x] 4. Routers Dialog Store (Zustand)

  **What to do**:
  - Create `src/features/routers/store/routers-dialog-store.ts` with Zustand store for dialog state
  - Follow exact pattern from `src/features/hotspot/users/store/users-dialog-store.ts`
  - State shape: `{ mode: 'closed' | 'create' | 'edit' | 'delete' | 'test' | 'migrate', selectedRouter: RouterPublicView | null, open: (mode, router?) => void, close: () => void }`
  - Must support 5 dialog modes: create, edit, delete, test, migrate

  **Must NOT do**:
  - Do NOT create dialog components (T7 handles that)
  - Do NOT persist this store to localStorage (ephemeral UI state only)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3, T5)
  - **Blocks**: T7
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/store/users-dialog-store.ts` — Canonical dialog store pattern with mode + selectedRouter

  **WHY Each Reference Matters**:
  - Must match the exact store pattern (mode, selected entity, open/close) so dialog components follow the same convention

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Store exports work correctly
    Tool: Bash
    Steps:
      1. Verify `useRoutersDialogStore` is exported from `src/features/routers/store/routers-dialog-store.ts`
      2. Verify it has: mode (string union), selectedRouter (nullable), open (function), close (function)
    Expected Result: All exports and methods present
    Evidence: .sisyphus/evidence/task-4-store-check.txt
  ```

  **Commit**: YES (groups with T3)
  - Message: `feat(routers): add data layer and dialog store`
  - Files: `src/features/routers/store/routers-dialog-store.ts`

- [x] 5. Traffic Schema Refactor (Remove Faker, Align with API Types)

  **What to do**:
  - Refactor `src/features/traffic/data/schema.ts`: Keep `TrafficMode` type, update `NetInterface` to match `InterfaceRecord` from `src/features/traffic/api/schema.ts` (add `mac_address` field, change `id` to string `.id` format, align `running`/`disabled` types)
  - Update `TrafficSample` to match `TelemetryEvent.fields` shape from SSE spec: `{ timestamp: number, rxBps: number, txBps: number, rxPps: number, txPps: number }` — these map from the SSE `fields` object
  - Delete ALL faker/mock code from `src/features/traffic/data/data.ts`:
    - Remove `import { faker } from '@faker-js/faker'`
    - Remove `interfacesSeed` (hardcoded array)
    - Remove `interfaceCapMap` (hardcoded mapping)
    - Remove `nextLiveSample()` (random data generator)
    - Remove `build24hHistory()` (fake history builder)
    - Keep `emptySample()` helper — this is still useful for initialization
    - Add `interfaceToNetInterface(record: InterfaceRecord): NetInterface` transformer function
    - Add `telemetryToTrafficSample(event: TelemetryEvent): TrafficSample` transformer function
  - Remove `@faker-js/faker` from `package.json` dependencies IF no other feature uses it (grep for `@faker-js/faker` imports first — if other features use it, don't remove)

  **Must NOT do**:
  - Do NOT change the Traffic chart component's props interface (same `samples` and `mode` props work)
  - Do NOT remove or rename `TrafficMode` type — it's used by components
  - Do NOT modify `traffic-chart.tsx`, `traffic-mode-toggle.tsx`, `interface-select.tsx`, or `traffic-stats-row.tsx` yet (T9 handles integration)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3, T4)
  - **Blocks**: T9
  - **Blocked By**: T1 (needs api/schema.ts types)

  **References**:

  **Pattern References**:
  - `src/features/traffic/data/schema.ts` — Current schema (NetInterface, TrafficSample, TrafficMode)
  - `src/features/traffic/data/data.ts` — Current mock data (to be removed)

  **API/Type References**:
  - `src/features/traffic/api/schema.ts` (T1 creates this) — New InterfaceRecord, InterfaceTraffic, TelemetryEvent types
  - `docs/openapi/components/schemas/network.yaml` — InterfaceRecord, InterfaceTraffic fields
  - `docs/openapi/components/schemas/sse.yaml` — TelemetryEvent shape with measurement/tags/fields/timestamp

  **WHY Each Reference Matters**:
  - Schema must align with real API types so the transformer functions map correctly
  - Removing faker data is critical — the Traffic page must get data from real API, not mocks

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Faker dependency removal verified
    Tool: Bash
    Steps:
      1. Grep for `@faker-js/faker` in src/features/traffic/ — should return zero results
      2. Grep for `interfacesSeed` in src/features/traffic/ — should return zero results
      3. Grep for `nextLiveSample` in src/features/traffic/ — should return zero results
      4. Grep for `build24hHistory` in src/features/traffic/ — should return zero results
    Expected Result: Zero matches for all mock functions
    Failure Indicators: Any match means mock data still referenced
    Evidence: .sisyphus/evidence/task-5-no-mocks.txt

  Scenario: Transformer functions exist and compile
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
      2. Verify `interfaceToNetInterface` and `telemetryToTrafficSample` are exported from data.ts
    Expected Result: Zero TypeScript errors, both transformers exported
    Evidence: .sisyphus/evidence/task-5-tsc-check.txt
  ```

  **Commit**: YES
  - Message: `refactor(traffic): replace faker data with API-aligned types`
  - Files: `src/features/traffic/data/schema.ts`, `src/features/traffic/data/data.ts`

- [ ] 6. Routers Data Table Component

  **What to do**:
  - Create `src/features/routers/components/columns.tsx` — Column definitions using `@tanstack/react-table` (match pattern from `src/features/hotspot/users/components/columns.tsx`)
  - Columns: name (sortable), ip_address, api_port, api_username, status (badge with color), last_seen_at (relative time), actions (dropdown menu)
  - Status badge colors: connected=emerald, connecting=blue, unknown=gray, disconnected=amber, error/red
  - Create `src/features/routers/components/routers-table.tsx` — DataTable component that:
    - Uses `useRouters()` query hook (already exists in `src/features/routers/api/queries.ts`)
    - Renders loading/error/empty states
    - Shows "Add Router" button that opens create dialog via `useRoutersDialogStore`
    - Row actions: Edit, Test Connection, Delete (using dialog store dispatch)
  - Create `src/features/routers/components/data-table-row-actions.tsx` — DropdownMenu for row actions (edit, test, delete)
  - Handle "No router selected" empty state gracefully (same pattern as VoucherOverview)

  **Must NOT do**:
  - Do NOT create the page component (T8 does that)
  - Do NOT create dialog components (T7 does that)
  - Do NOT add server-side pagination (routers list is small, client-side only)
  - Do NOT add search/filter functionality (unnecessary for ~20 routers)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: T8
  - **Blocked By**: T2 (query keys), T3 (column defs and view model)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/components/columns.tsx` — Column definition pattern with DataTable
  - `src/features/hotspot/users/components/hotspot-users-table.tsx` — Table component pattern with loading/error/empty states
  - `src/features/hotspot/users/components/data-table-row-actions.tsx` — Row actions dropdown pattern

  **API/Type References**:
  - `src/features/routers/api/schema.ts` — RouterPublicView type, RouterStatus enum
  - `src/features/routers/api/queries.ts` — `useRouters()` hook (already exists, 30s refetch)
  - `src/features/routers/data/data.ts` — Column definition and status config (T3 creates this)

  **WHY Each Reference Matters**:
  - Must match the exact DataTable pattern from hotspot/users for consistency
  - useRouters already has 30s polling — no need to add manual refresh

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Routers table renders with data
    Tool: Playwright
    Preconditions: App running, authenticated, at least 1 router in DB
    Steps:
      1. Navigate to /admin/routers
      2. Wait for table to load
      3. Verify table headers: Name, IP Address, Port, Username, Status, Last Seen, Actions
      4. Verify at least 1 row visible with router data
    Expected Result: Table displays routers with all columns
    Failure Indicators: Empty table, missing columns, TypeScript error
    Evidence: .sisyphus/evidence/task-6-routers-table.png

  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
    Expected Result: Zero TypeScript errors
    Evidence: .sisyphus/evidence/task-6-tsc-check.txt
  ```

  **Commit**: YES (groups with T7)
  - Message: `feat(routers): add data table and CRUD dialogs`
  - Files: `src/features/routers/components/columns.tsx`, `src/features/routers/components/routers-table.tsx`, `src/features/routers/components/data-table-row-actions.tsx`

- [ ] 7. Routers CRUD Dialogs (Create, Edit, Delete, Test, Migrate)

  **What to do**:
  - Create `src/features/routers/dialogs/router-dialogs.tsx` — Dialog orchestrator that renders the correct dialog based on `useRoutersDialogStore().mode`
  - Create `src/features/routers/dialogs/router-mutate-drawer.tsx` — Slide-in drawer form for Create/Edit:
    - Fields: name (required), ip_address (required), api_port (default 8728), api_username (required), password (required for create, optional for edit), notes (optional)
    - Uses `useCreateRouter()` or `useUpdateRouter()` mutation based on mode
    - On success: close drawer, invalidate `qk.routers()` query
    - Password field: show/hide toggle, required on create, optional on edit with placeholder "Leave blank to keep current"
    - Test Connection button inside the form: calls `useTestRouterConnection()` before saving
  - Create `src/features/routers/dialogs/router-delete-dialog.tsx` — AlertDialog confirming deletion:
    - Shows router name and IP
    - Uses `useDeleteRouter()` mutation
    - On success: close dialog, invalidate routers query
  - Create `src/features/routers/dialogs/router-test-dialog.tsx` — Dialog showing connection test results:
    - Shows: connected status, latency_ms, routeros_version, board_model, identity
    - Uses `useTestRouterConnection()` mutation (pre-existing from API layer)
    - Cancel button to dismiss
  - Create `src/features/routers/dialogs/router-migrate-dialog.tsx` — Simple dialog with file_path input:
    - Single text field for server file path (e.g., `/data/legacy/mikhmon/config.php`)
    - Uses `useMutation` calling `svc.migrateRouterConfig()`
    - Shows import summary on success: total, imported, skipped, errors

  **Must NOT do**:
  - Do NOT implement file upload UI — migrate only accepts a server-side file path string
  - Do NOT add router health monitoring or auto-refresh beyond what `useRouters()` already provides (30s polling)
  - Do NOT create separate route pages for each dialog — they're all modals/drawers on the list page

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T3 column defs + T4 dialog store)
  - **Parallel Group**: Wave 2
  - **Blocks**: T8
  - **Blocked By**: T2 (query keys), T3 (form schemas), T4 (dialog store)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/dialogs/user-dialogs.tsx` — Dialog orchestrator pattern (renders based on store mode)
  - `src/features/hotspot/users/dialogs/user-mutate-drawer.tsx` — Drawer form pattern with create/edit modes
  - `src/features/hotspot/users/dialogs/user-delete-dialog.tsx` — Delete confirmation dialog pattern

  **API/Type References**:
  - `src/features/routers/api/queries.ts` — `useCreateRouter`, `useUpdateRouter`, `useDeleteRouter`, `useTestRouterConnection` hooks (all pre-existing)
  - `src/features/routers/api/schema.ts` — CreateRouterRequest, UpdateRouterRequest, TestConnectionRequest, ConnectionTestResult types
  - `src/features/routers/api/service.ts` — `migrateRouterConfig()` function
  - `src/features/routers/data/schema.ts` — RouterFormSchema, RouterEditFormSchema (T3 creates these)

  **WHY Each Reference Matters**:
  - Dialog pattern must match hotspot/users for consistency
  - All mutation hooks already exist — just need UI wiring
  - Migrate endpoint is unusual (server path, not upload) — don't over-engineer it

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Create router dialog submits correctly
    Tool: Playwright
    Preconditions: App running, authenticated, on /admin/routers
    Steps:
      1. Click "Add Router" button
      2. Fill name: "test-router", ip_address: "192.168.1.1", api_username: "admin", password: "test123"
      3. Click Submit
      4. Verify success toast or table refresh
    Expected Result: New router appears in table
    Failure Indicators: Form validation error, API error, dialog doesn't close
    Evidence: .sisyphus/evidence/task-7-create-router.png

  Scenario: Test connection dialog displays results
    Tool: Playwright
    Preconditions: App running, authenticated, router exists in table
    Steps:
      1. Click row action menu → Test Connection
      2. Wait for results
      3. Verify latency, version, board model displayed
    Expected Result: Connection test results shown in dialog
    Failure Indicators: Dialog shows error, no results displayed
    Evidence: .sisyphus/evidence/task-7-test-connection.png

  Scenario: Delete router dialog confirms and removes
    Tool: Playwright
    Steps:
      1. Click row action menu → Delete
      2. Verify router name shown in confirmation
      3. Click Confirm
      4. Verify router removed from table
    Expected Result: Router deleted, table refreshes
    Evidence: .sisyphus/evidence/task-7-delete-router.png
  ```

  **Commit**: YES (groups with T6)
  - Message: `feat(routers): add data table and CRUD dialogs`
  - Files: `src/features/routers/dialogs/router-dialogs.tsx`, `src/features/routers/dialogs/router-mutate-drawer.tsx`, `src/features/routers/dialogs/router-delete-dialog.tsx`, `src/features/routers/dialogs/router-test-dialog.tsx`, `src/features/routers/dialogs/router-migrate-dialog.tsx`

- [ ] 8. Routers Page Component + Route + Sidebar Entry

  **What to do**:
  - Create `src/features/routers/index.tsx` — Page component that composes:
    - `RoutersTable` component
    - `RouterDialogs` component
    - Page header with title "Routers" and description "Manage your MikroTik routers"
    - Uses `useActiveRouterId()` pattern for router-scoped data (though routers table itself doesn't need a selected router)
  - Create `src/routes/_authenticated/admin/routers.tsx` — Route file:
    ```tsx
    import { createFileRoute } from '@tanstack/react-router'
    import { Routers } from '@/features/routers'

    export const Route = createFileRoute('/_authenticated/admin/routers')({
      component: Routers,
    })
    ```
  - Update `src/components/layout/data/sidebar-data.ts` — Add Routers entry under "Admin" group:
    ```tsx
    { title: 'Routers', url: '/admin/routers', icon: Server }
    ```
    (Import `Server` from lucide-react)

  **Must NOT do**:
  - Do NOT modify the authenticated layout route (no changes needed)
  - Do NOT add a separate router detail page (all CRUD is via dialogs on the list page)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (blocked by T6, T7)
  - **Blocks**: F3 (manual QA)
  - **Blocked By**: T6 (table component), T7 (dialogs)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/index.tsx` — Page component pattern (header + table + dialogs)
  - `src/routes/_authenticated/hotspot/users.tsx` — Route file pattern
  - `src/components/layout/data/sidebar-data.ts` — Sidebar navigation structure

  **WHY Each Reference Matters**:
  - Must match page layout pattern for consistency
  - Sidebar entry must be added to the Admin group (not Main)

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Routers page accessible from sidebar
    Tool: Playwright
    Steps:
      1. Click "Admin" section in sidebar
      2. Click "Routers" entry
      3. Verify URL is /admin/routers
      4. Verify page header shows "Routers"
    Expected Result: Routers page loads with header
    Evidence: .sisyphus/evidence/task-8-sidebar-nav.png

  Scenario: Route file compiles
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
    Expected Result: Zero TypeScript errors
    Evidence: .sisyphus/evidence/task-8-tsc-check.txt
  ```

  **Commit**: YES
  - Message: `feat(routers): add page component, route, and sidebar entry`
  - Files: `src/features/routers/index.tsx`, `src/routes/_authenticated/admin/routers.tsx`, `src/components/layout/data/sidebar-data.ts`

- [ ] 9. Traffic SSE Integration (Replace Mock with Real Data)

  **What to do**:
  - Rewrite `src/features/traffic/index.tsx` to use real API data instead of faker:
    - Replace `interfacesSeed` with `useInterfaces(routerId ?? 0)` hook
    - Replace mock `selectedInterface` with real interface selection from API data
    - Replace `build24hHistory()` and `nextLiveSample()` with SSE-driven data via `useTrafficStream(routerId, selectedIface)`
    - Add `runningCount` calculation from real interface data (filter by running && !disabled)
    - Keep existing UI layout and chart components — just swap data sources
  - Update `src/features/traffic/components/interface-select.tsx`:
    - Make it generic enough to accept `InterfaceRecord[]` from API (or `NetInterface[]` via transformer)
    - May need to update the `NetInterface` type in schema.ts to match `InterfaceRecord` fields
  - Update `src/features/traffic/components/traffic-stats-row.tsx`:
    - Accept real `TrafficSample` from SSE stream (already compatible — just verify field alignment)
  - Add loading/error/empty states for when no router is selected or no interfaces found
  - Add "No router selected" empty state (same pattern as VoucherOverview)
  - Wire SSE data flow:
    1. User selects router (from `useActiveRouterId()`)
    2. `useInterfaces()` fetches available interfaces
    3. Auto-select first running interface
    4. `useTrafficStream(routerId, selectedIface)` starts SSE connection
    5. Incoming telemetry updates chart data via state
    6. History mode: switch from SSE to `useInterfaceTraffic()` REST snapshot

  **Must NOT do**:
  - Do NOT modify the chart component's visual appearance
  - Do NOT remove the live/history mode toggle (keep `TrafficMode` type)
  - Do NOT add new dependencies — use existing `useSSE` hook and Recharts

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T1, T5)
  - **Parallel Group**: Wave 2
  - **Blocks**: T10
  - **Blocked By**: T1 (API layer), T5 (schema refactor)

  **References**:

  **Pattern References**:
  - `src/features/hotspot/users/index.tsx` — Page pattern: `useActiveRouterId()` → query → render + empty states
  - `src/features/hotspot/users/api/queries.ts:useHotspotUsersStream` — SSE hook pattern with `useSSE()`
  - `src/features/voucher/index.tsx` — "No router selected" empty state pattern

  **API/Type References**:
  - `src/features/traffic/api/queries.ts` (T1 creates) — `useInterfaces()`, `useInterfaceTraffic()`, `useTrafficStream()`
  - `src/features/traffic/data/data.ts` (T5 refactored) — `interfaceToNetInterface()`, `telemetryToTrafficSample()`, `emptySample()`
  - `src/lib/api/sse.ts` — `useSSE<T>(path, onEvent, opts)` hook

  **WHY Each Reference Matters**:
  - Must follow exact SSE pattern from hotspot/users for consistency
  - VoucherOverview's "No router selected" pattern is the canonical empty state

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Traffic page shows real interface list
    Tool: Playwright
    Preconditions: App running, authenticated, router selected with interfaces
    Steps:
      1. Navigate to /traffic
      2. Verify interface selector shows real interface names (not faker data)
      3. Select a different interface
      4. Verify chart updates
    Expected Result: Real interface data displayed, chart responds to selection
    Evidence: .sisyphus/evidence/task-9-traffic-real-data.png

  Scenario: SSE stream connects and updates chart
    Tool: Playwright
    Preconditions: Router running, SSE endpoint accessible
    Steps:
      1. Navigate to /traffic
      2. Verify "Live" mode is active
      3. Wait 5 seconds for SSE data
      4. Verify chart shows real-time data points
    Expected Result: Chart updates with live data points from SSE
    Evidence: .sisyphus/evidence/task-9-sse-live.png

  Scenario: No router selected shows empty state
    Tool: Playwright
    Preconditions: App running, authenticated, no router selected
    Steps:
      1. Navigate to /traffic
      2. Verify empty state message displayed
    Expected Result: "No router selected" or similar message, no crash
    Evidence: .sisyphus/evidence/task-9-no-router.png
  ```

  **Commit**: YES
  - Message: `feat(traffic): integrate SSE realtime data stream`
  - Files: `src/features/traffic/index.tsx`, `src/features/traffic/components/interface-select.tsx`, `src/features/traffic/components/traffic-stats-row.tsx`

- [ ] 10. Traffic Interface Detail Sheet (Queues, DHCP, NAT)

  **What to do**:
  - Create `src/features/traffic/components/interface-detail-sheet.tsx` — Side panel (Sheet) component that opens when clicking an interface:
    - Uses ShadCN `Sheet` component (`@/components/ui/sheet`)
    - Three tabs: Queues, DHCP Leases, NAT Rules
    - Each tab uses the corresponding query hook: `useQueues(routerId)`, `useDHCPLeases(routerId)`, `useNATRules(routerId)`
    - Shows loading skeletons while data fetches
    - Shows empty state when no data for that tab
    - Sheet has selected interface name in header
  - Create supporting sub-components if needed:
    - `queues-table.tsx` — Simple table showing QueueRecord data (name, target, max-limit, burst-limit, disabled)
    - `dhcp-leases-table.tsx` — Simple table showing DHCPLeaseRecord (address, mac-address, host-name, server, status)
    - `nat-rules-table.tsx` — Simple table showing NATRuleRecord (chain, action, out-interface, comment, disabled)
  - Update `src/features/traffic/index.tsx` to add the Sheet trigger:
    - Add a button/row-click handler on the interface selector or chart to open the Sheet
    - Pass selected interface name and `routerId` to the Sheet
  - Wrap the detail Sheet in the Traffic page so it opens as an overlay panel

  **Must NOT do**:
  - Do NOT add CRUD operations for queues, DHCP, or NAT — these are read-only views
  - Do NOT create a separate page/route for interface details — it's a Sheet overlay only
  - Do NOT add search/filter to these detail tables (they're small datasets)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T9 for traffic page to add Sheet trigger)
  - **Parallel Group**: Wave 2 (can start after T1 + T9)
  - **Blocks**: F3 (manual QA)
  - **Blocked By**: T1 (API layer), T9 (traffic page integration)

  **References**:

  **Pattern References**:
  - `src/components/ui/sheet.tsx` — ShadCN Sheet component for side panel
  - `src/features/hotspot/users/components/hotspot-users-table.tsx` — Table with loading/empty states pattern

  **API/Type References**:
  - `src/features/traffic/api/queries.ts` (T1 creates) — `useQueues()`, `useDHCPLeases()`, `useNATRules()`
  - `src/features/traffic/api/schema.ts` (T1 creates) — QueueRecord, DHCPLeaseRecord, NATRuleRecord types
  - `docs/openapi/components/schemas/network.yaml` — QueueRecord, NATRuleRecord, DHCPLeaseRecord field definitions

  **WHY Each Reference Matters**:
  - Sheet component for consistent overlay panel UX
  - Query hooks already created in T1 — just need UI wiring
  - Network schemas define exact table columns needed

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Interface detail Sheet opens and shows tabs
    Tool: Playwright
    Preconditions: App running, authenticated, router selected, on /traffic page
    Steps:
      1. Click on an interface in the selector or click "Details" button
      2. Verify Sheet panel opens from right side
      3. Verify 3 tabs visible: Queues, DHCP Leases, NAT Rules
      4. Click each tab and verify data loads
    Expected Result: Sheet opens with 3 tabs, each showing relevant data
    Failure Indicators: Sheet doesn't open, tabs missing, data fails to load
    Evidence: .sisyphus/evidence/task-10-detail-sheet.png

  Scenario: Sheet shows empty state when no data
    Tool: Playwright
    Preconditions: Router with no queues/DHCP/NAT configured
    Steps:
      1. Open interface detail Sheet
      2. Switch to each tab
      3. Verify "No data" or empty state shown for empty tabs
    Expected Result: Graceful empty state, no crash
    Evidence: .sisyphus/evidence/task-10-empty-state.png
  ```

  **Commit**: YES
  - Message: `feat(traffic): add interface detail sheet panel`
  - Files: `src/features/traffic/components/interface-detail-sheet.tsx`, `src/features/traffic/components/queues-table.tsx`, `src/features/traffic/components/dhcp-leases-table.tsx`, `src/features/traffic/components/nat-rules-table.tsx`, `src/features/traffic/index.tsx` (update)

- [ ] 11. Unit Tests for Routers API Layer

  **What to do**:
  - Create `src/features/routers/api/queries.test.ts`:
    - Test `useRouters()` returns data from API
    - Test `useCreateRouter()` mutation calls service and invalidates cache
    - Test `useUpdateRouter()` mutation calls service and invalidates cache
    - Test `useDeleteRouter()` mutation calls service and invalidates cache
    - Test `useTestRouterConnection()` mutation calls service
  - Follow test pattern from `src/stores/auth-store.test.ts` (existing test file)

  **Must NOT do**:
  - Do NOT test UI components (only API layer)
  - Do NOT set up Playwright (unit tests only)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T12)
  - **Parallel Group**: Wave 3
  - **Blocks**: T13
  - **Blocked By**: T2 (query keys used in tests)

  **References**:
  - `src/stores/auth-store.test.ts` — Existing test pattern
  - `src/features/routers/api/queries.ts` — Functions being tested

  **Acceptance Criteria**:

  **QA Scenarios:**
  ```
  Scenario: Routers API tests pass
    Tool: Bash
    Steps:
      1. Run `npx vitest run src/features/routers/api/queries.test.ts`
    Expected Result: All tests pass (5+ tests, 0 failures)
    Evidence: .sisyphus/evidence/task-11-test-results.txt
  ```

  **Commit**: YES (groups with T12)
  - Message: `test: add unit tests for routers and traffic API layers`
  - Files: `src/features/routers/api/queries.test.ts`

- [ ] 12. Unit Tests for Traffic API Layer + SSE Hooks

  **What to do**:
  - Create `src/features/traffic/api/queries.test.ts`:
    - Test `useInterfaces(routerId)` returns interface data
    - Test `useInterfaceTraffic(routerId, iface)` returns traffic snapshot
    - Test `useQueues(routerId)` returns queue data
    - Test SSE hook `useTrafficStream` status transitions (idle → connecting → open)
  - Follow test pattern from `src/stores/auth-store.test.ts`

  **Must NOT do**:
  - Do NOT test UI components (only API layer)
  - Do NOT set up Playwright

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T11)
  - **Parallel Group**: Wave 3
  - **Blocks**: T13
  - **Blocked By**: T1 (API layer being tested)

  **References**:
  - `src/features/traffic/api/queries.ts` — Functions being tested
  - `src/lib/api/sse.ts` — SSE hook being tested

  **Acceptance Criteria**:

  **QA Scenarios:**
  ```
  Scenario: Traffic API tests pass
    Tool: Bash
    Steps:
      1. Run `npx vitest run src/features/traffic/api/queries.test.ts`
    Expected Result: All tests pass (5+ tests, 0 failures)
    Evidence: .sisyphus/evidence/task-12-test-results.txt
  ```

  **Commit**: YES (groups with T11)
  - Message: `test: add unit tests for routers and traffic API layers`
  - Files: `src/features/traffic/api/queries.test.ts`

- [ ] 13. E2E Verification (TypeScript + Lint)

  **What to do**:
  - Run `npx tsc --noEmit` — must pass with zero errors
  - Run lint check — must pass with zero errors
  - Run `npx vitest run` — all tests must pass
  - Verify no `@faker-js/faker` imports remain in traffic feature
  - Verify all new files exist and have correct exports
  - Check sidebar-data.ts has Routers entry

  **Must NOT do**:
  - Do NOT fix any issues found — just report them for T6-T10 to fix

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after T11, T12)
  - **Blocks**: F1-F4
  - **Blocked By**: T11, T12

  **References**:
  - Project package.json for test/lint commands

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: TypeScript compiles clean
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit` from project root
    Expected Result: Exit code 0, zero errors
    Evidence: .sisyphus/evidence/task-13-tsc.txt

  Scenario: Lint passes
    Tool: Bash
    Steps:
      1. Run `npx eslint src/ --max-warnings 0`
    Expected Result: Exit code 0, zero warnings
    Evidence: .sisyphus/evidence/task-13-lint.txt

  Scenario: All tests pass
    Tool: Bash
    Steps:
      1. Run `npx vitest run`
    Expected Result: All tests pass
    Evidence: .sisyphus/evidence/task-13-tests.txt

  Scenario: No faker imports in traffic feature
    Tool: Bash
    Steps:
      1. Grep for `faker` in src/features/traffic/
    Expected Result: Zero matches
    Evidence: .sisyphus/evidence/task-13-no-faker.txt
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + lint. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task. Test cross-task integration. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec. Check "Must NOT do" compliance. Detect cross-task contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **T1+T2**: `feat(network): add network API layer and query keys` — src/features/traffic/api/*, src/lib/api/query-keys.ts
- **T3+T4**: `feat(routers): add data layer and dialog store` — src/features/routers/data/*, src/features/routers/store/*
- **T5**: `refactor(traffic): replace faker data with API-aligned types` — src/features/traffic/data/*
- **T6+T7**: `feat(routers): add data table and CRUD dialogs` — src/features/routers/components/*
- **T8**: `feat(routers): add page component, route, and sidebar entry` — src/features/routers/index.tsx, src/routes/*, src/components/layout/data/sidebar-data.ts
- **T9**: `feat(traffic): integrate SSE realtime data stream` — src/features/traffic/index.tsx, src/features/traffic/components/*
- **T10**: `feat(traffic): add interface detail sheet panel` — src/features/traffic/components/interface-detail-sheet.tsx
- **T11+T12**: `test: add unit tests for routers and traffic API layers` — src/features/routers/api/*.test.ts, src/features/traffic/api/*.test.ts
- **T13**: `chore: verify TypeScript and lint pass` — (no files, verification only)

---

## Success Criteria

### Verification Commands
```bash
# TypeScript check — ZERO errors
npx tsc --noEmit

# Lint check — ZERO errors
npx eslint src/ --max-warnings 0

# Unit tests — ALL pass
npx vitest run
```

### Final Checklist
- [ ] Routers table displays all routers with status indicators
- [ ] Create/Edit/Delete dialogs work correctly
- [ ] Test Connection dialog shows latency, version, board model
- [ ] Routers page is accessible via Admin sidebar
- [ ] Traffic chart uses real SSE data (no faker/mock remaining)
- [ ] Interface detail Sheet shows queues, DHCP, NAT for selected interface
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] TypeScript check passes
- [ ] Lint passes
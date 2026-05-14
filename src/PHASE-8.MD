# Phase 8 — Live Logs + Hotspot Follow-up (Inactive · Bindings · Cookies · Profile Mappings · Expired Monitor)

Migrate the System Log page to live SSE (all / hotspot / ppp channels) and finish the remaining hotspot surfaces — Inactive, Bindings management, Cookies, Profile Mappings — and wire the deferred "Setup Expired Monitor" actions on Profiles to the real backend.

---

## 0. Context snapshot

All API services and queries already exist (Phase 7 left them unwired):

- `features/hotspot/inactive/api/{service,queries,schema}.ts` — list + count
- `features/hotspot/bindings/api/{service,queries,schema}.ts` — list/add/update/remove/enable/disable
- `features/hotspot/cookies/api/{service,queries,schema}.ts` — list/remove
- `features/hotspot/profile-mappings/api/{service,queries,schema}.ts` — list/upsert/delete
- `useSSE` already supports `?token=` auth; backend SSE paths confirmed in `docs/openapi/paths/sse.yaml`:
  - `/routers/{rid}/logs/stream/all`
  - `/routers/{rid}/logs/stream/hotspot`
  - `/routers/{rid}/logs/stream/ppp`
  - `/routers/{rid}/sse/hotspot/inactive`
  - `/routers/{rid}/sse/hotspot/bindings`
- Profiles page row action `Setup Monitor / Remove Monitor` currently toasts `"Coming soon"` (`@/Users/masji/web/roskit/web/src/features/hotspot/profiles/components/data-table-row-actions.tsx:33-39`).
- System-level expire-monitor endpoints exist but have no UI yet:
  - `GET  /routers/{rid}/system/expire-monitor`
  - `POST /routers/{rid}/system/expire-monitor/deploy`
  - `POST /routers/{rid}/system/expire-monitor/remove`

---

## 1. Step plan

### Step 1 — System expire-monitor API hook (foundation)

Create the small system API surface that Profiles will consume.

- `features/system/expire-monitor/api/schema.ts` — Zod types for `ExpireMonitorStatus` + `DeployExpireMonitorRequest`.
- `features/system/expire-monitor/api/service.ts` — `getExpireMonitorStatus`, `deployExpireMonitor(interval)`, `removeExpireMonitor`.
- `features/system/expire-monitor/api/queries.ts` — `useExpireMonitor`, `useDeployExpireMonitor`, `useRemoveExpireMonitor` using existing `qk.expireMonitor`.

No route yet — this is consumed inline by the Profiles page banner (Step 6).

---

### Step 2 — Log page migration to live SSE (3 channels)

Replace `features/log/data/data.ts` mock seed + `setInterval` with real SSE consumption.

- New `features/log/api/sse.ts`:
  - `useLogStream(routerId, channel: 'all' | 'hotspot' | 'ppp', onEntry, paused)` — picks the right SSE path, parses `LogEvent` JSON (`time`, `topics`, `message`, `router_id`), passes a normalized `LogEntry` to the caller. Uses existing `useSSE`. When `paused` is true the hook passes `null` path so `useSSE` parks the connection.
- `features/log/data/schema.ts`:
  - Keep `LogEntry` shape but replace `time: Date` parsing with a helper that handles RouterOS strings like `apr/30 10:11:12` (no year) and falls back to receipt time. Drop `LOG_TOPICS` static enum — topics are derived from incoming events.
- `features/log/data/data.ts`:
  - Delete `logEntriesSeed`, `makeLogEntry`, `LOG_STREAM_INTERVAL_MS`. Keep `LOG_MAX_ENTRIES`, `topicColor`, `filterLogs`.
- `features/log/index.tsx` rewrite:
  - Add a `channel` state (`'all' | 'hotspot' | 'ppp'`) rendered as a `Tabs` segmented control above the toolbar.
  - Buffer last `LOG_MAX_ENTRIES` entries in a ref-backed deque (FIFO eviction). Use a small `useReducer` so SSE callback stays stable.
  - Replace "Refresh" button → "Reconnect" (drops buffer + re-mounts the channel).
  - Keep `Pause/Resume` (parks SSE), `Clear` (drains buffer).
  - Show connection status pill (`open` / `connecting` / `closed`) sourced from `useSSE`.
- `features/log/components/log-toolbar.tsx`:
  - Replace `LOG_TOPICS` import with topics derived from the live buffer (`Array.from(new Set(entries.flatMap(e => e.topics)))`). Sort alphabetically.
- `features/log/components/log-table.tsx` — no functional change; verify topic colour fallback still works on unknown topics.

---

### Step 3 — Hotspot Inactive page

- Route: `routes/_authenticated/hotspot/inactive.tsx` (mirrors `users.tsx`).
- `features/hotspot/inactive/components/view-model.ts` — reuse `HotspotUserViewModel` from `users/components/view-model.ts` (inactive returns the same shape) and re-export with an alias.
- `features/hotspot/inactive/components/columns.tsx` — derived from `users/columns.tsx` but trim `Online/Offline` column (always offline by definition); add a `Last seen` column derived from `uptime` / `comment` parse when present.
- `features/hotspot/inactive/components/hotspot-inactive-table.tsx` — DataTable wrapper with search by name/comment, profile filter, mobile card renderer (mirror Users page).
- `features/hotspot/inactive/components/data-table-row-actions.tsx`:
  - Reuse Users mutations (`useEnableHotspotUser`, `useDisableHotspotUser`, `useDeleteHotspotUser`).
  - Add a `Force login` action stub that just navigates to the Users page filtered to that user (no backend op).
- `features/hotspot/inactive/api/queries.ts` — add `useHotspotInactiveStream(routerId)` that opens `/sse/hotspot/inactive`, debounces a `qc.invalidateQueries({ queryKey: qk.hotspotInactive(routerId) })` and the `qk.hotspotInactiveCount(routerId)` keys (≤ 500ms coalescing) on each event. Pattern mirrors `useHotspotActiveStream`.
- `features/hotspot/inactive/index.tsx` — page shell with `routerId` gating, header counters (total · last refresh), Refresh button, table, dialogs reused from `users/dialogs/*`.

---

### Step 4 — Hotspot Bindings page

- Route: `routes/_authenticated/hotspot/bindings.tsx`.
- `features/hotspot/bindings/components/view-model.ts` — derive `{ id, mac, address, type: 'regular'|'blocked'|'bypassed', disabled: boolean, comment }` from `IPBindingRecord`.
- `features/hotspot/bindings/components/columns.tsx`:
  - MAC, Address, Type (badge: regular=secondary, blocked=destructive, bypassed=default), Disabled (toggle switch tied to enable/disable mutations), Comment, Actions.
- `features/hotspot/bindings/components/hotspot-bindings-table.tsx` — search by MAC/address/comment, type filter (tabs: All · Regular · Blocked · Bypassed), bulk select.
- `features/hotspot/bindings/components/data-table-row-actions.tsx`:
  - Edit → opens mutate drawer
  - Enable/Disable → calls `useEnable/DisableIPBinding`
  - Copy MAC / Copy IP
  - Delete → opens delete dialog
- `features/hotspot/bindings/dialogs/binding-mutate-drawer.tsx` — controlled drawer for add/edit. Fields: `mac-address`, `address`, `to-address`, `server`, `type` (Select), `disabled` (Switch), `comment`. Submits via `useAddIPBinding` / `useUpdateIPBinding`.
- `features/hotspot/bindings/dialogs/binding-delete-dialog.tsx` — confirm + async bulk delete + toast (mirror Users delete dialog pattern).
- `features/hotspot/bindings/store/bindings-dialog-store.ts` — Zustand slice (`open(kind, payload?)`, `close()`) like `hosts-dialog-store`.
- `features/hotspot/bindings/api/queries.ts` — add `useHotspotBindingsStream(routerId)` invalidating `qk.hotspotBindings(routerId)` on each `/sse/hotspot/bindings` event (debounced).
- `features/hotspot/bindings/index.tsx` — page shell + dialogs.
- **Update `features/hotspot/hosts/dialogs/make-binding-dialog.tsx`**: after creating a binding, show a toast with a `<Link to='/hotspot/bindings'>` action so the operator can jump to the new page.

---

### Step 5 — Hotspot Cookies page

- Route: `routes/_authenticated/hotspot/cookies.tsx`.
- `features/hotspot/cookies/components/view-model.ts` — passthrough `{ id, user, mac, address }`.
- `features/hotspot/cookies/components/columns.tsx` — User, MAC, Address, Actions.
- `features/hotspot/cookies/components/hotspot-cookies-table.tsx` — search by user/mac/address, bulk select.
- `features/hotspot/cookies/components/data-table-row-actions.tsx` — Copy MAC, Remove (with confirm). Bulk Remove handled at page level.
- `features/hotspot/cookies/dialogs/cookie-delete-dialog.tsx` — bulk async delete + toast.
- `features/hotspot/cookies/store/cookies-dialog-store.ts` — `delete` only.
- `features/hotspot/cookies/index.tsx` — page shell. Header note: *"Removing a cookie forces re-authentication on the next request."*

---

### Step 6 — Profile Mappings page + Expired Monitor wiring

> **Clarification (confirmed with operator):** "Expired Monitor" is the **global** RouterOS scheduler `Mikhmon-Expire-Monitor`. Backend already injects the full RouterOS script via `POST /system/expire-monitor/deploy` (verified at `internal/roskit/adapter/service/scheduler.go` + `services/system_service.go`). It is **not** related to the per-profile `:put (",...)` on-login snippet that the `hasExpiredMonitor` derive helper currently detects — that snippet is the **sale-recording** webhook, owned by the page-level `Sync from RouterOS` flow.

Three surfaces:

**6a. New Profile Mappings page**

- Route: `routes/_authenticated/hotspot/profile-mappings.tsx` (keep URL under `/hotspot` for operator mental model even though it's DB-backed).
- `features/hotspot/profile-mappings/components/view-model.ts` — passthrough with formatted price (`Intl.NumberFormat('id-ID')`) and pretty `exp_mode` label (reusing `_shared` formatter).
- `features/hotspot/profile-mappings/components/columns.tsx` — Profile, Price, Selling price, Validity, Exp mode, Lock user, Lock server, Actions.
- `features/hotspot/profile-mappings/components/profile-mappings-table.tsx` — search by profile name, exp-mode filter.
- `features/hotspot/profile-mappings/dialogs/mapping-mutate-drawer.tsx`:
  - Form fields match `UpdateMappingRequest`. Profile-name is read-only when editing.
  - When opened from the Profiles page for a profile without a mapping, the drawer pre-populates `profile_name` and submits via `useUpsertProfileMapping`.
- `features/hotspot/profile-mappings/dialogs/mapping-delete-dialog.tsx` — confirm + delete via `useDeleteProfileMapping`.
- `features/hotspot/profile-mappings/store/mappings-dialog-store.ts` — `add | edit | delete`.
- `features/hotspot/profile-mappings/index.tsx` — page shell with note: *"These mappings enrich `/hotspot/profiles` with pricing & validity. Use Sync from RouterOS on the Profiles page to import from existing on-login scripts."*

**6b. System Expired Monitor banner on Profiles page**

- Add a `Card` between the Profiles header and the table inside `features/hotspot/profiles/index.tsx`:
  - Source: `useExpireMonitor(routerId)`.
  - Shows `deployed: Yes/No`, `interval`, `last-run` (relative time), and a small RouterOS-style scheduler hint.
  - Actions:
    - When `!deployed` → `Deploy Expired Monitor` button opens a small inline form. **Default interval = `1m`** (matches the legacy mikhmon `00:01:00`). Submit calls `useDeployExpireMonitor` with `{ interval }`.
    - When `deployed` → `Remove Expired Monitor` button → `useRemoveExpireMonitor` (with confirm).
  - On mutation success invalidates `qk.expireMonitor(routerId)`.
- Banner is collapsed by default once `deployed === true` (just shows a green "Deployed · interval 1m" pill); expanded when not deployed so the call-to-action is obvious.

**6c. Drop the per-row Setup/Remove Monitor action**

The current `data-table-row-actions.tsx` action was **conceptually wrong** — it was named "Expired Monitor" but actually toggled the per-profile sale-recording snippet. Now that the global Expired Monitor scheduler has a real home (6b), and the per-profile `:put` snippet is owned by `Sync from RouterOS` (page-level button), there is no per-row action left. Cleanup:

- Delete the `Setup Monitor / Remove Monitor` `DropdownMenuItem` from `features/hotspot/profiles/components/data-table-row-actions.tsx`.
- Drop the `Bell` / `BellOff` lucide imports from that file.
- Update the Profiles header copy in `features/hotspot/profiles/index.tsx`:
  - From: `{totalCount} profiles · {monitorCount} with active expired monitor`
  - To:   `{totalCount} profiles · {recordingCount} with sale-recording installed`
- Optionally rename `hasExpiredMonitor` → `hasSaleRecording` in `features/hotspot/_shared/derive.ts` (one symbol, three call sites). Keeps the derive helper honest.

---

### Step 7 — Sidebar + route wiring

- `components/layout/data/sidebar-data.ts` — under the existing **Hotspot** collapsible, add new items in this order: `Users · Profiles · Active · Inactive · Hosts · Bindings · Cookies · Profile Mappings`.
- `components/layout/data/use-sidebar-data.ts` — extend the badge logic so the Hotspot parent badge keeps showing `activeSessions`. No per-child badges (keeps Phase 7 contract).
- New route files (TanStack Router file-based):
  - `routes/_authenticated/hotspot/inactive.tsx`
  - `routes/_authenticated/hotspot/bindings.tsx`
  - `routes/_authenticated/hotspot/cookies.tsx`
  - `routes/_authenticated/hotspot/profile-mappings.tsx`
- Run vite once to regenerate `routeTree.gen.ts`.

---

### Step 8 — Verification

- `pnpm -C web tsc --noEmit`
- `pnpm -C web lint`
- `pnpm -C web build`
- Smoke-check the new pages with a mocked router (no backend changes required for this phase).

---

## 2. Out of scope (call out, do not implement)

- Walled Garden + Walled Garden IP page (`features/hotspot/walled-garden/` is empty).
- Hotspot Servers list page (`features/hotspot/servers/` is empty).
- Traffic page migration (still on mock — separate scope).
- System schedulers / scripts / dashboard pages.
- Backend changes for a single-profile expired-monitor install endpoint.

These remain as candidates for Phase 9.

---

## 3. File-count estimate

| Area | New | Modified | Deleted |
|---|---|---|---|
| System expire-monitor API | 3 | 0 | 0 |
| Log SSE migration | 1 | 4 | 0 (data.ts shrinks) |
| Inactive page | 6 | 0 | 0 |
| Bindings page | 8 | 1 (hosts make-binding toast) | 0 |
| Cookies page | 6 | 0 | 0 |
| Profile Mappings page | 6 | 0 | 0 |
| Profiles Expired Monitor wiring | 0 | 2 | 0 |
| Sidebar + routes | 4 | 2 | 0 |
| **Total** | **34** | **9** | **0** |

---

## 4. Risk + open questions

- **SSE `time` field has no year** — entries received around midnight may render as the previous year. Mitigation: store `receivedAt: Date.now()` per entry, use that for display; show RouterOS `time` only in a tooltip.
- **Inactive list size** — large deployments may return thousands of rows. We keep client-side pagination (matches Users page). If perf bites, follow up with server-side cursors in Phase 9.
- **Bulk delete on Bindings** — RouterOS `.id` values shift after deletes; the API service accepts only one id per request. We serialize with `Promise.all` but bail and toast on the first failure.
- **Per-profile "Setup Monitor" runs sync-profiles globally** — clear in copy, but operators should know it touches every profile. If this is unacceptable, push a backend change to Phase 9.


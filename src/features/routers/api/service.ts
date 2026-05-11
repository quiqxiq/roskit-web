import { apiClient } from '@/lib/api/client'
import type { Envelope, MessageResult } from '@/lib/api/types'
import { unwrap } from '@/lib/api/unwrap'
import type {
  ConnectionTestResult,
  CreateRouterRequest,
  RouterPublicView,
  TestConnectionRequest,
  UpdateRouterRequest,
} from './schema'

const base = '/routers'

// GET /routers — admin-readable list of all configured routers. The
// backend background watcher updates `status` / `last_seen_at` every 10s.
export async function listRouters(): Promise<RouterPublicView[]> {
  const res = await apiClient.get<Envelope<RouterPublicView[]>>(base)
  return unwrap(res.data)
}

// GET /routers/:id — single router. The route is gated by the router-
// ownership middleware, but in this single-tenant build that just means
// "must exist and not be soft-deleted".
export async function getRouter(id: number): Promise<RouterPublicView> {
  const res = await apiClient.get<Envelope<RouterPublicView>>(`${base}/${id}`)
  return unwrap(res.data)
}

// POST /routers — backend tests the connection synchronously before
// persisting; failure here means "wrong creds or unreachable", not
// "server error". After save, the router is registered with the
// orchestrator engine so streaming workers start automatically.
export async function createRouter(
  body: CreateRouterRequest,
): Promise<RouterPublicView> {
  const res = await apiClient.post<Envelope<RouterPublicView>>(base, body)
  return unwrap(res.data)
}

// PUT /routers/:id — partial update. Re-tests the connection when any
// of {ip_address, api_port, api_username, password} change, and re-
// registers the orchestrator entry on success.
export async function updateRouter(
  id: number,
  body: UpdateRouterRequest,
): Promise<RouterPublicView> {
  const res = await apiClient.put<Envelope<RouterPublicView>>(
    `${base}/${id}`,
    body,
  )
  return unwrap(res.data)
}

// DELETE /routers/:id — soft delete. Removes the orchestrator entry.
// VoucherSale records keep `router_id` but have `OnDelete:SET NULL` so
// they remain visible (with router_id=null) in the report endpoints.
export async function deleteRouter(id: number): Promise<void> {
  await apiClient.delete<Envelope<MessageResult>>(`${base}/${id}`)
}

// POST /routers/:id/test — verify creds without persisting. Useful for
// the "Test Connection" button in an edit form. The path id is required
// by the ownership middleware but the stored credentials are NOT used —
// the body's creds are dialed instead.
export async function testRouterConnection(
  id: number,
  body: TestConnectionRequest,
): Promise<ConnectionTestResult> {
  const res = await apiClient.post<Envelope<ConnectionTestResult>>(
    `${base}/${id}/test`,
    body,
  )
  return unwrap(res.data)
}

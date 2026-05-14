# Decisions

## Sidebar placement: Admin section
- Routers goes under Admin group in sidebar-data.ts
- Icon: Server from lucide-react

## Traffic detail panel: Sheet (not separate page)
- Side panel overlay with tabs for queues, DHCP, NAT
- Read-only views, no CRUD

## Migrate dialog: Simple server path input
- Backend expects `file_path` string, not file upload
- No browser file picker needed

## Empty states
- Follow VoucherOverview "No router selected" pattern
- Same ServerOff icon + text pattern

## Test connection
- Uses pre-existing useTestRouterConnection hook
- Shows connected, latency_ms, routeros_version, board_model, identity

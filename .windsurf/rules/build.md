---
trigger: manual
---

## Build Notes and Recent Fixes

### What was fixed
- Added `cabin_class` to the Supabase select in `server/services/flightService.ts` so returned rows satisfy the `Flight` type (prevents TS build failure).
- Updated zod enums in `server/actions/savePassengers.ts` to use Zod v4-friendly `{ error: '...' }` instead of `errorMap`.
- Aligned form state with literal unions (`PassengerPayload`) to avoid widening `string` values that break type checks.

### Takeaways
- Keep DB selects in sync with TypeScript types. If a type requires a field, include it in the query.
- Share payload/types between server actions and UI. Don’t redeclare shapes with looser types.
- Zod v4 enum options: use `{ error: '...' }` (not `errorMap`).
- Avoid widening unions in UI handlers (cast select values to the union type).

### Quick pre-push checklist
- Run `npm run build` locally.
- For any schema/type change, update Supabase `select` columns to match required fields.
- Reuse exported payload/types (e.g., zod `infer` types) in components and actions.
- Verify enums/literal unions in form state aren’t widened to `string`.
- If a build error mentions “missing property” on a type, check that the query or payload includes that property.
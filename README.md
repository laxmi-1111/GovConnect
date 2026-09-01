# GovConnect — Citizen Portal (Phase 1)

A working Vite + React + TypeScript + Tailwind build of the citizen-facing app from
`GovConnect_Feature_Research_Frontend.pdf`. Everything runs on realistic mock data in
`src/lib/mockData.ts` and `src/context/AppDataContext.tsx` — there is no backend yet, but
every flow is genuinely interactive (state updates, not static screens).

## Run it

```
npm install
npm run dev
```

Open the printed localhost URL. Log in with any 10-digit number, any 6-digit OTP
(`000000` is wired to show the OTP-failure state on purpose), then any 4-digit PIN.

## What's built

- **Login** — number → OTP → PIN, with resend timer, verifying/error states.
- **Service catalog** (`/`) — search + department filters, popular row, 8 seeded
  Maharashtra services (Revenue, Education, Labour, Health, Municipal).
- **Dynamic application form** (`/apply/:serviceId`) — fields are generated from each
  service's schema in `mockData.ts`, not hand-coded per page. Fields already verified by
  another department render read-only with a "fetched from X — verified" badge and an
  "Edit instead" override. This is the **once-only** principle from the spec.
- **Consent gate** — when a service needs data from another department, the form inserts
  a mandatory Allow/Deny step before the citizen can continue; submit stays disabled until
  every item is decided. This is the **consent-first** pattern from the spec.
- **Payment step** — inserted automatically for services with a fee, with
  idle/processing/success/failed states and retry-without-refilling.
- **My Consents** (`/consents`) — full consent history with one-tap revoke.
- **My Documents** (`/documents`) — the document vault, verified/pending/expired.
- **My Applications** (`/applications` + detail) — combined list across departments,
  shared `Timeline` component, certificate download (generates a real downloadable file)
  once a certificate is issued.
- **Grievances** (`/grievances` + detail) — file a grievance, track it on the same
  `Timeline` component used for applications, star-rating feedback once resolved.
- **Notifications** (`/notifications`) — unread badge, mark-as-read / mark-all-read.
- **Profile** (`/profile`) — editable details (address edits show a re-verification
  notice), language switch, linked-documents summary, per-event notification-channel
  matrix.
- **Shared states** — `StatusBadge`, `EmptyState`, `ErrorBanner`, `Skeleton` are reused
  everywhere so loading/empty/error always look the same, per the spec's cross-cutting
  section 4.5.
- **Bilingual scaffold** — `LanguageContext` + `src/lib/translations.ts` demonstrate the
  EN/MR switch structurally (nav labels, headings). Not every string is wired yet — see
  Next steps.

## Design notes

Palette and type are in `tailwind.config.js`: a navy/marigold pairing (not a generic SaaS
blue) with IBM Plex Sans — chosen because it has a matching Devanagari weight, which
matters for a Marathi-first government app. Status colour (verified green / stale
marigold / unavailable red) is used consistently across badges, documents and timelines
so it becomes a learned visual language rather than decoration.

## Next steps (not in this phase)

1. **Admin / official dashboard** — none of the 9 admin-dashboard features from the spec
   are built yet (queue, unified beneficiary view, adapter health monitor, audit log,
   analytics, etc.). This was left for a second pass so this phase could go deep on the
   citizen-facing flows instead of shallow on everything.
2. **Real backend** — everything currently lives in `AppDataContext`'s React state and
   resets on refresh. Swapping in real API calls means replacing the functions in that
   one file; no page should need to change.
3. **Full i18n coverage** — every user-facing string should move into
   `translations.ts` (currently nav + a handful of labels are wired).
4. **Accessibility pass** — the spec calls for WCAG 2.1 AA; this phase has keyboard
   focus rings and labelled inputs but hasn't had a full screen-reader pass.
5. **Offline-safe drafts** — the spec asks for locally saved form drafts on drop
   connections; not implemented yet.

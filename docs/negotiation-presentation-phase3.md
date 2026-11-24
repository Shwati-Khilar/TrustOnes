# Phase 3 handoff — invitations, proposals and negotiations

Phase 3 starts from the uncommitted S2, Phase 1 and Phase 2 tree on `feature/s2-projects-invites-proposals`, at S10 commit `c7a1e51980e84e3d734d11197407b9f8b4f59082`. The comparison baseline was captured from the Phase 2 production build before application edits.

## What changed

| Screen | Client | Freelancer |
| --- | --- | --- |
| Inbox | `/client/offers` | `/freelancer/invites` |
| Offer detail and agreement | `/client/offers/[id]` | `/freelancer/offers/[id]` |

Both inboxes show the latest revision, project, named roles, type, status, response owner, amount, duration and last activity. They support search by project or participant, type and status filters, project-specific links and 24-row pagination. Counts use the same participant and filter predicates as results. Most recently updated threads appear first, with a stable ID tie-breaker.

The detail header identifies the initiator and both parties. The latest terms, proposed changes, accepted terms and historical versions use persisted revisions. Every previous revision can be expanded with the keyboard. The latest revision has a timeline link to its complete terms. Original proposal cover letters and later negotiation notes have separate labels. Scope, notes and letters use the Phase 1 safe rich-text renderer. Phase 2 avatars supply real participant images and an initials fallback.

The client can follow the owned project and visible freelancer profile. The freelancer sees eligible project navigation and the assigned deal room after acceptance. A linked agreement shows the selected freelancer, accepted amount, duration, scope, acceptance instant and contract deadline. An imported accepted proposal without a linked assignment retains its recorded offer status. The UI only labels a published listing deadline as advertised. Timestamps use en-GB in UTC. Monetary values use the existing INR formatter.

## Response and authorization contract

The existing versioned PATCH, project lock, turn checks, immutable offer revisions and single assignment remain authoritative. Response controls use the latest recipient, initiator and canonical status. The read also checks whether a published project can still exchange terms. For example, an expired pending invitation may still be rejected, while acceptance and countering are unavailable.

Successful mutations replace the displayed history with the server response. A failed action refreshes authoritative state and preserves error feedback. Consequential actions require confirmation. A stale tab gets HTTP 409 when it attempts to accept an old revision. There is no background polling or push subscription. Both parties can reload the same persisted history.

## Verification and evidence

- 38 Node tests passed. These comprise 19 S1/S10 integration tests, 12 S2 integration tests, four Phase 1 presentation tests and three Phase 3 presentation tests.
- The six existing S2 browser scenarios exercise public proposals, direct invitations, counters in both directions, approval, rejection, withdrawal, stale-tab recovery and a single winning assignment.
- The Phase 3 browser fixture checks separate client and freelancer sessions, both initiator roles, revision senders, a fractional INR proposal, UTC timestamps, distinct scope and cover letter, keyboard-accessible history, filtered inboxes, long and unbroken text, expired offers, legacy accepted offers and private-thread exclusion for two unrelated accounts.
- The Phase 1 project browser suite passed at all three sizes. The Phase 2 directory/profile suite passed after the fixture served its test avatar to both signed-in sessions. The S10 browser suite passed for client and freelancer settings, password changes, support, social accounts and admin triage.
- The production build generated 57/57 static pages. ESLint reported zero errors and 13 pre-existing warnings. The existing stylesheet import-order warning remains.
- The local comparison gallery is `%TEMP%\TrustOnes-phase3-negotiations\visual-review.html`. It contains 18 before/after pairs across 1440 × 900, 820 × 1180 and 390 × 844. It covers both inboxes, a client reviewing a proposal, a freelancer reviewing a counteroffer and both parties' accepted agreements. The desktop detail pairs the latest terms with response controls. Narrow viewports stack these sections. The persisted history remains available below the current terms.
- The evidence uses Chrome and isolated local PostgreSQL databases. For reproduction, run the repository's `npm test` with its disposable test fixture, then `node tests/negotiation-presentation-browser.mjs` against a production build. Set `PHASE3_EVIDENCE` to retain screenshots and use `--baseline` with an earlier build to capture comparison images.

## Changed files relative to the Phase 2 checkpoint

| Area | Files |
| --- | --- |
| Shared marketplace components | `src/components/marketplace/MarketViews.jsx`, `NegotiationDetail.jsx`, `NegotiationInbox.jsx`, `OfferForm.jsx`, `negotiation.module.css` in that directory |
| Data and formatting | `src/services/marketplace.service.js`, `src/lib/negotiation-presentation.js` |
| Automated tests | `package.json`, `tests/marketplace.test.mjs`, `tests/negotiation-presentation.test.mjs` |
| Browser tests | `tests/negotiation-presentation-browser.mjs`, `tests/s2-browser.mjs`, `tests/freelancer-discovery-browser.mjs` |
| Handoff | `docs/negotiation-presentation-phase3.md` |

## Phase 4 starting point

Start attachment design from the participant-scoped negotiation read and the immutable offer revision that owns each attachment. The current timeline already supplies a place to present revision-specific evidence. Define upload, storage, retention and authorized download behavior before adding controls. The existing `docs/s2-assignment-contract.md` remains the interface for assignment, milestones and funding. Phase 3 adds no schema migration or dependency.

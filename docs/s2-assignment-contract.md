# S2 assignment contract for S3 and S4

S2 ends when the current offer recipient accepts and the database assigns one freelancer. Both portals read the same project, negotiation and revision. S3 owns detailed agreements, deal rooms and milestone planning. S4 owns verified sandbox funding.

## Read the agreement

Use an authenticated, active, email-verified client or freelancer. Scope the project query by the session's role and ID. For the client require project.clientId to match. For the freelancer require project.freelancerId to match. Load acceptedOffer and acceptedOffer.negotiation alongside the authorized project. The existing freelancer deal-room query also requires the assignment. Knowing a project, negotiation or offer ID grants no additional access.

| Consumer needs | Authoritative value |
| --- | --- |
| Project, owner and assignee | Project.id, clientId, freelancerId |
| Lifecycle and exposure | Project.status becomes ACTIVE. Project.visibility and publishedAt retain the publication policy. |
| Accepted proposal or invitation | Project.acceptedOffer.negotiationId identifies the existing Proposal row. Proposal.kind records PROPOSAL or INVITATION. |
| Accepted version | Project.acceptedOfferId and OfferRevision.version. Proposal.version is the last version in that thread. |
| Amount and currency | OfferRevision.amount is Decimal(12,2), currency is INR. Project.budget mirrors the accepted amount for existing milestone services. Preserve decimal precision during validation and persistence. |
| Delivery | OfferRevision.days is a positive whole number. Project.acceptedAt is the acceptance instant and Project.deadline is that instant plus the agreed number of 24-hour days. Use UTC in integrations. |
| Scope and note | OfferRevision.scope and note. The listing description and original cover letter can differ from the agreement. |
| Original listing | Project.advertisedBudget and advertisedDeadline snapshot the listing upon acceptance. |
| Audit trail | OfferRevision.negotiationId, version, senderId, recipientId, createdAt, amount, currency, days, scope and note. The database rejects update and delete. |

Before S2, projects could already have assignments, milestones and simulated funding. Those rows keep their original status, budget, deadline and assignee. A null acceptedOfferId means the S2 acceptance evidence is unavailable. A migrated proposal's first revision copies the old bid, duration and cover letter, using the linked listing description for context. Never treat that description as proof of agreed scope. Preserve existing workspaces and show historical terms as unavailable where appropriate.

## Lifecycle and authorization

1. An owner creates an OPEN project with publishedAt null (a draft). Publishing fixes visibility. A published PUBLIC listing is discoverable while open, future-dated and unassigned and its owner is eligible. PRIVATE listings are invitation-only. Active, verified freelancers whose S10 profile visibility permits discovery can be invited. Availability is a self-reported filter. A missing professional profile shows available account information only.
2. The client sends an invitation or the freelancer submits an application. Each starts a distinct Proposal row and immutable version 1. One pending thread per project/freelancer and one lifetime freelancer application per pair are enforced by partial unique indexes. A client can send a fresh invitation after a prior negotiation closes.
3. Only the current recipient may counter, accept or reject. The originator may withdraw a pending thread. Mutations require the expected positive integer version. A counter increments the version and swaps sender and recipient. Both participants retain read access to their own history. An unrelated candidate cannot read it.
4. Edit, publish, cancel, negotiate and assign take a project row lock inside a database transaction. Pending negotiations block ordinary listing edits. Acceptance checks both participants, the deadline and latest version, conditionally claims an open unassigned project, records the winning revision, and closes other pending threads. Cancellation closes all pending threads. Terminal negotiations cannot be acted upon.
5. A losing candidate can read their own closed history. The winner and owner alone may consume the agreement for milestone planning. Keep S1 role and account-state checks on every route.

## HTTP contracts

Paths below are relative to /api. JSON identity comes from the session. Valid monetary inputs are positive INR values with at most ten integral and two fractional digits. Prefer decimal strings. An offer accepts 1–3650 delivery days, nonempty scope up to 8000 characters, and an optional note up to 4000 characters. List pages contain up to 24 results.

| Method and path | Caller and input | Successful result |
| --- | --- | --- |
| GET or POST /projects | Client. Creation requires title, description, category, budget and future deadline. Optional skills and visibility. | Owner's projects or a new draft in project (201). |
| GET or PATCH /projects/{id} | Owner. Edit sends the listing form fields used at creation. | project, including assignment on detail reads. |
| POST /projects/{id}/publish | Owner, visibility PUBLIC or PRIVATE. | data contains the published project. |
| PATCH /projects/{id}/cancel | Owner, open project. | Cancelled project. |
| GET /directory/freelancers and /directory/freelancers/{id} | Client. List supports q, availability, page. | data contains items/page/hasNext or the public professional projection. |
| GET /discovery/projects and /discovery/projects/{id} | Freelancer. List supports q, category, min, max, by and page. | Eligible public listings or one authorized listing. Own negotiation summaries accompany results. |
| POST /projects/{id}/proposals | Freelancer. bidAmount, estimatedDays, coverLetter and optional scope. | proposal with the first offer (201). |
| GET /projects/{id}/proposals | Owner. | proposals submitted to that project. |
| POST /projects/{id}/invitations | Owner. freelancerId, amount, days, scope, optional note. | data contains the invitation and first offer (201). |
| GET /negotiations | Participant. Optional projectId, status, search and page. | data.items includes the latest offer for each thread, plus page and hasNext. |
| GET /negotiations/{id} | Participant. | data includes the negotiated history in increasing version order. |
| PATCH /negotiations/{id} | Participant. action and version. COUNTER also needs new amount, days, scope and optional note. Other actions are ACCEPT, REJECT or WITHDRAW. | Updated negotiation and history. |
| GET /freelancer/invites | Freelancer. Optional status, search and page. | Combined negotiation page, direct invitations, proposal summaries and proposal statistics. |
| PATCH /proposals/{id}/accept | Owning client. Legacy route accepts proposal version 1 only. | proposal and assigned project. Use the versioned route for counteroffers. |

The marketplace endpoints return success and data. Existing project and proposal routes retain their named envelopes. Validation returns 400, missing authentication 401, disallowed role or turn 403, another user's private resource 404, and a stale version or incompatible state 409. After a conflict reload the history before deciding whether to act.

## Downstream implementation notes

S3 can attach a structured agreement and milestone plan to the authorized project and accepted revision. Preserve the accepted commercial terms and immutable history. Use Project.budget for the existing milestone cap and Project.deadline for delivery. Keep plan revisions separate from offer revisions. Coordinate migrations with the database owner and preserve the two partial unique indexes and immutability trigger in future generated migrations.

Assignment creates no milestones, payment orders, funding records, payouts or transfers. Existing explicit simulation writes a SIMULATED provider record. Its success, proposal acceptance, milestone approval and a project budget establish no settled funds or withdrawable balance. S4 needs provider verification, amount/currency validation, replay-safe idempotency and reconciliation before exposing verified funding. The owner-facing deletion endpoint locks the milestone and permits deletion only while it is pending and has no funding or submissions. Direct database deletion through existing downstream cascading relationships can still erase evidence. Protect funded records in every downstream mutation and retain an audit trail before extending the funding workflow.


The four S2 foreign keys use ON DELETE RESTRICT and ON UPDATE NO ACTION. They are projects.acceptedOfferId → offer_revisions.id, offer_revisions.negotiationId → proposals.id, and offer_revisions.senderId and recipientId → users.id. Prisma declares these rules explicitly. The preserved database references do not require rewriting any deployed migration.

## Phase 4 file evidence for S3 and S5

For the accepted assignment, the owner or assignee reads `GET /api/negotiations/{negotiationId}`. Match `data.project.acceptedOfferId` to `data.offers[].id`. That revision's `attachments` are the accepted evidence. The other revisions retain their own historical files. `data.project.references` contains intentionally shared project references for the eligible freelancer. Scope, amounts and delivery still come from the accepted revision. A legacy agreement can lack an accepted revision or files.

The owner-only project detail read returns `project.evidence` with client-only and shared references. The authorized freelancer listing detail returns `data.evidence` with shared references only. Publication alone grants no file access. Private listings use the existing private invitation or assignment rules. Client-only references never enter the shared agreement projection. The participant's own historical revision files remain available after rejection, withdrawal, assignment or closure.

## Developer B implementation checklist

1. Resolve the current account through the S1 guard. For a project-led integration, load the project by ID **and** the session's owner or assignee ID. Read the accepted revision by the project's foreign key. For a thread-led integration use the participant endpoint below. A closed competing thread is readable history and cannot supply an assignment.
2. Carry the project ID, owner ID, assigned freelancer ID and revision ID into the S3 agreement. Use the revision's amount, currency, days, scope and attachments and the project's persisted deadline. The agreement shown to both parties uses the shared references projection. A client-only reference may appear in the owner's private project view.
3. Keep legacy assigned projects usable when the revision ID is null. Distinguish the original bid, cover letter and listing metadata from the final agreement. Where terms are unavailable, show that explicitly.

```js
// After a successful authenticated GET /api/negotiations/{id}
const { data: thread } = responseBody;
const { project, offers } = thread;
const accepted = offers.find(offer => offer.id === project.acceptedOfferId);
if (thread.status === "ACCEPTED" && accepted) {
  // This projection is shared by the owner and the assigned freelancer.
  const agreement = {
    projectId: project.id, clientId: project.clientId, freelancerId: thread.freelancerId,
    revisionId: accepted.id, version: accepted.version, amount: accepted.amount,
    currency: accepted.currency, days: accepted.days, deadline: project.deadline,
    scope: accepted.scope, files: accepted.attachments, references: project.references,
  };
  // Pass agreement to the authorized deal-room view.
}
```

**Milestone allocation.** The total planned milestone amount must be at most the accepted INR amount, mirrored in `Project.budget`. On edits, exclude the milestone being replaced from the existing sum. Creation currently checks project ownership, ACTIVE status and a due date within the project deadline. S3 should independently require the assignment when exposing its agreement workflow. The existing edit service excludes COMPLETED and CANCELLED projects. Its aggregate and write are separate statements, as are those in creation. S3 must serialize allocations per project and use decimal arithmetic before relying on this cap under concurrent writes. S2's assignment lock covers acceptance only.

**Funding and deletion.** S4 owns verified sandbox funding. Before crediting any sandbox milestone, verify its project, amount, currency and provider result and reconcile repeat callbacks. The existing simulation ledger records the explicit simulation. The owner delete route locks and checks the milestone, but direct deletes and downstream cascades can still erase financial or submission evidence. Preserve both when revising or removing a plan. Acceptance alone never authorizes a payout.

File metadata gives an opaque attachment ID, filename, media type, byte count, uploader name, audience and creation instant. Retrieve bytes through `GET /api/attachments/{id}`, metadata through `?view=metadata`, and validated image previews through `?view=preview`. Every request rechecks the current session and resource membership. Storage keys and private bucket URLs stay server-side.

Uploads use the existing business mutation routes. JSON clients continue to send their original inputs. An attachment-bearing request uses multipart with one JSON `payload` and repeated files keyed by audience. Project forms use `CLIENT_ONLY` or `PROJECT_VIEWERS`. Revision forms use `PARTICIPANTS`. Supply the application Origin and a UUID `X-Evidence-Batch` header, reused for a retry of the same file submission. Project acceptance itself takes no files. Earlier evidence can be referenced in negotiation text, but only the accepted revision's associations are identified as accepted evidence.

Files are retained with restricted foreign keys and immutable bindings. A PostgreSQL transaction writes bytes and associations with their project or revision. A verified storage worker can relocate committed bytes once to a pinned, private bucket version. Use `docs/attachment-phase4.md` for the policy and deployment contract. S3 can consume the authorized read directly. A future S5 implementation can reuse format validation and private storage behind its own submission authorization, retention and lifecycle. Deliverables belong to separate submission records.

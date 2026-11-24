# Phase 4 handoff — private pre-contract evidence

## Recovery and scope

The baseline was the uncommitted S2 and Phase 1–3 tree on `feature/s2-projects-invites-proposals`, at `c7a1e51980e84e3d734d11197407b9f8b4f59082`. The pre-change source archive, SHA-256 inventory and Git status are in `%TEMP%\TrustOnes-phase4-evidence`. The archive excludes ignored files. The existing submission attachment model stores links/metadata for downstream work. Phase 4 has its own private storage and record associations.

## Upload lifecycle

The browser holds the selected File objects and local thumbnails until the user submits the form. Selection supports a file picker, drag-and-drop, removal and per-reference audience selection. The upload displays byte-transfer progress, then a saving state until the server confirms the business mutation. An interrupted form can be retried. Clearing a selection releases its preview URLs. Closing the page discards the local selection.

The attachment API accepts a bounded multipart request on the existing project create/edit, proposal, invitation and counteroffer endpoints. The authenticated server checks the canonical application Origin and the custom batch header. It reads a single JSON payload plus typed file parts, validates the bytes, and calls the existing owner/participant mutation. The database transaction creates the project or immutable revision and stores the original bytes and metadata together. Version, eligibility, duplicate and count checks run before commit. A failed save rolls back its files. There is no server-side temporary file and no orphan sweep. An already committed batch conflicts on replay. Refresh the project or inbox after a lost response before retrying.

| File context | Readers |
| --- | --- |
| Client-only project reference, the form default | Owning client |
| Explicitly shared project reference | Owner and currently eligible listing viewers, including the assignee |
| Invitation, proposal or counteroffer revision | Owning client and that thread's freelancer, including terminal history |
| Accepted revision | Same participants, through the exact accepted offer ID |

The owner can append project references before assignment when normal listing edits are eligible. Saved references and their visibility are immutable. Each new revision has its own supporting files. The shared agreement distinguishes accepted revision files, history and general references. The S3/S5 read contract is in `docs/s2-assignment-contract.md`.

## Validation and delivery

The defaults are 10 MiB per file, 24 MiB per multipart request including framing, ten files across a project brief and five per revision. Set `EVIDENCE_FILE_BYTES`, `EVIDENCE_REQUEST_BYTES`, `EVIDENCE_BRIEF_COUNT` and `EVIDENCE_REVISION_COUNT` as positive integers. The server ceilings are 10 MiB, 32 MiB, ten and five respectively. `GET /api/attachments/policy` returns the effective limits to an authorized form. Up to four multipart requests per app process can be in validation at once. Size, part and expansion limits apply to actual content.

Validation checks filename length and controls, extension, declared MIME, signature or container structure. Sharp decodes static JPEG, PNG and WebP with a pixel ceiling. PDFs require a PDF header, end marker and plausible cross-reference offset. DOCX files require a well-formed Open Packaging Convention container, matching Word main-part declaration and relationship, valid XML, checked CRCs and bounded expansion. This intentionally restricted DOCX subset excludes macros, embedded binaries, external templates, executable fields, DTDs and unsupported media. Some otherwise valid Office documents and animated images will be rejected.

Downloads pass through the authenticated app. Images support inline previews. PDF and DOCX use attachment disposition. The route sets the validated media type, no-store, same-origin resource policy, nosniff and a sandboxed content policy. PostgreSQL stores an SHA-256 digest of the original bytes. Format checks do not establish that a file is malware-free. Add scanning/quarantine before use in an environment that requires it. Configure rate limits, account quotas and coordinated body limits at the deployment ingress. There is no browser PDF or DOCX renderer.

## Database and storage operations

The additive migration `20261123000000_collaboration_attachments` introduces `EvidenceAudience`, `collaboration_attachments` and `private_file_objects`. The metadata has restrictive project, uploader, revision and private-object foreign keys. Project/audience and revision indexes support authorized reads. A unique uploader/batch/position tuple protects against duplicate evidence. A database guard checks revision sender, project and creation transaction. Post-commit changes to associations and deletion of committed content are blocked. Project-reference inserts also lock the project and check its protected state.

**PostgreSQL storage.** The default needs only the existing durable private PostgreSQL service. Protect its role, transport, backups and encryption at rest. Budget for file bytes in storage, WAL and backups. The app does not write documents into a public directory or depend on a server's local filesystem.

**Private versioned object storage.** Optionally run `node scripts/offload-evidence.mjs` from a trusted worker with the same database. Each run processes at most 50 committed objects. Set `EVIDENCE_S3_BUCKET`, `EVIDENCE_S3_REGION` (or `AWS_REGION`) and optionally `EVIDENCE_S3_ENDPOINT` for a compatible private HTTPS endpoint. Use the SDK's workload-identity credential chain. A loopback HTTP endpoint is supported for disposable tests. The worker and app must use the same storage account, region and endpoint.

Enable bucket versioning, block public access, require TLS and encryption, and retain the referenced versions. Scope the worker to PutObject/GetObject on `precontract/v1/*` and the app to GetObjectVersion. Supply equivalent KMS permissions if using a customer-managed key. Configure lifecycle rules to retain referenced noncurrent versions. Server-generated UUID keys exclude user filenames. The client never receives bucket credentials, versions or object URLs.

The worker conditionally writes a committed object, reads it back, verifies length and SHA-256, then atomically records the exact non-null bucket version and clears the database byte copy. A failed verification leaves the PostgreSQL copy intact. An interrupted copy can be retried against the same key. After relocation, the read path requests only that version and rechecks length and digest before releasing it. Missing or corrupt external bytes produce a controlled storage-unavailable response for authorized readers. Schedule the worker only when using this deployment mode. Monitor failed runs, bucket version retention and backup restoration together. Routine application operations retain committed evidence indefinitely. Governed deletion or retention expiry needs a separate operational policy.

## Verification checkpoint

Run the Node suites with `npm test` against a disposable PostgreSQL service. The Phase 4 Chrome harness is `node tests/evidence-browser.mjs`. Set `PHASE4_EVIDENCE` to retain screenshots. The fixture uses separate real sessions and private storage inside its own randomly named database. The object-store integration test uses a signed, local versioned-protocol fixture. A live cloud bucket is outside this verification. Review captures and logs in `%TEMP%\TrustOnes-phase4-evidence`.

### Review results

- All 45 automated tests passed with zero failures and zero skips. The 38 previous tests were retained. Seven Phase 4 tests cover schema upgrade, project audiences, validation and rollback, rejected proposal DOCX evidence, invitation/counter/acceptance history, private bucket offload and JPEG/WebP authorization.
- Prisma validation and client generation passed. A fresh disposable PostgreSQL database applied all 12 migrations. Prisma reported no schema difference. Upgrade fixtures retained an existing accepted S2 revision and assignment, plus earlier funding and submission records.
- Six Phase 4 browser scenarios passed. The client and freelancer opened the same accepted evidence. The test compared a downloaded PDF byte-for-byte, verified a real image preview, and checked denied URLs from unrelated sessions. Six screens were captured at desktop 1440 × 900, tablet 820 × 1180 and mobile 390 × 844. The local gallery is `%TEMP%\TrustOnes-phase4-evidence\visual-review.html`.
- All six existing S2 Chrome scenarios passed, as did the S10 client, freelancer and admin checks and the Phase 1, 2 and 3 browser regressions.
- The production build generated 58/58 static pages. ESLint returned zero errors and 13 existing warnings. The existing stylesheet import-order warning remains.

### Files changed relative to the Phase 3 checkpoint

- `docs/attachment-phase4.md`
- `docs/s2-assignment-contract.md`
- `package-lock.json`
- `package.json`
- `prisma/migrations/20261123000000_collaboration_attachments/migration.sql`
- `prisma/schema.prisma`
- `scripts/offload-evidence.mjs`
- `src/app/api/attachments/[id]/route.js`
- `src/app/api/attachments/policy/route.js`
- `src/app/api/negotiations/[negotiationId]/route.js`
- `src/app/api/projects/[projectId]/invitations/route.js`
- `src/app/api/projects/[projectId]/proposals/route.js`
- `src/app/api/projects/[projectId]/route.js`
- `src/app/api/projects/route.js`
- `src/app/client/projects/[projectId]/edit/page.jsx`
- `src/components/client/project/ProjectOverview.jsx`
- `src/components/client/project/ProjectsForm.jsx`
- `src/components/marketplace/EvidenceFiles.jsx`
- `src/components/marketplace/MarketViews.jsx`
- `src/components/marketplace/NegotiationDetail.jsx`
- `src/components/marketplace/OfferForm.jsx`
- `src/lib/account-api.js`
- `src/lib/evidence-error.js`
- `src/lib/evidence-policy.js`
- `src/lib/private-object-store.mjs`
- `src/services/evidence-format.js`
- `src/services/evidence-storage.js`
- `src/services/evidence-upload.js`
- `src/services/marketplace.service.js`
- `src/services/project.service.js`
- `src/services/proposal.service.js`
- `tests/evidence-browser.mjs`
- `tests/evidence-samples.mjs`
- `tests/evidence.test.mjs`
- `tests/freelancer-discovery-browser.mjs`

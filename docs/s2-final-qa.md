# Final S2 integration review

**Scope.** Review of the S2 working tree on `feature/s2-projects-invites-proposals`, based on S10 commit `c7a1e51980e84e3d734d11197407b9f8b4f59082` and S1 integration `3537eb2`. This review used the local production build, independent authenticated sessions, disposable PostgreSQL databases and a local versioned-object protocol fixture.

## Acceptance and coverage

| Surface | Evidence and result |
| --- | --- |
| Public assignment | Draft with a structured brief, client-only PDFs and shared image → publication → freelancer discovery → proposal with document → client inbox and real professional profile → client counter with a new PDF → freelancer acceptance. Both participants returned identical history and shared references. The owner project recorded the assignee, and the assigned freelancer opened the active deal room. A separate public journey verifies client acceptance of a freelancer-authored offer. |
| Private assignment | Real freelancer directory → profile → eligible private listing → invitation with PDF → downloaded bytes matched → freelancer and client counters with distinct PDFs → acceptance. Both portals retained the same final and historical evidence. Unrelated users were denied. |
| Assignment integrity | Version checks, a project-row lock, a conditional assignment and immutable revisions protect the transition. Concurrent acceptance, competing candidates, cancellation and stale responses were exercised. Rejection, withdrawal and closure retain participant history. |
| Project and talent presentation | Five project views and four directory/profile views at desktop, tablet and mobile. Long briefs retain structure, previews are bounded, listing dates use UTC and client cards have one primary detail action. Full, sparse and empty freelancer profiles reflect stored fields and invitation eligibility. |
| Negotiation presentation | Six views across three sizes cover role labels, current terms, historical revisions, scope, note/cover letter, dates and fractional INR. Inbox links reach the appropriate project, history and professional profile. Stale tabs refresh authoritative state. |
| S1 and S10 | Credential and role gates, pending/suspended accounts, reset expiry and reuse, session invalidation, Google callback/onboarding, client and freelancer profile edits, sparse PATCH, independent preferences, password change, requester-only support and admin triage. Social-account UI uses local fixtures. |
| Business data | Checked mounted page/layout imports and portal services against the route-by-route static-data audit. Dashboards/directory use persisted records, financial history identifies simulation and future-feature screens use empty or unavailable states. Legacy unmounted design fixtures still need review before reuse. |
| Evidence access | Metadata, image preview and download use the same current-account and resource checks. Client-only is the project form default. A shared reference requires listing access. Negotiation documents require the owning client or that thread's freelancer, including after closure. IDs and publication alone grant no access to private evidence. |

## Findings corrected in Phase 5

The assigned freelancer's deal room previously displayed whole rupees and the initial cover letter as agreement scope. Its timeline could attribute acceptance to the wrong party and date assignment at draft creation. The view now reads scope from the accepted revision, uses the persisted acceptance instant and shows the agreed amount to the paise. Older assignments retain available proposal notes with an explicit historical label. Freelancer service display strings and mounted project/milestone fallbacks share the INR formatter. The expanded document-bearing browser journey compares both session responses and verifies the price and scope rendered after opening the deal room. The original build failed the fractional-price assertion.

## Evidence storage review

- Busboy enforces bounded multipart fields and file counts. The request reader checks total bytes as they arrive. Defaults are 10 MiB per file, 24 MiB per request, ten references and five files per revision. Origin and batch validation precede persistence. Restricted names exclude paths, controls and device names. Object keys derive from generated UUIDs.
- The server cross-checks extension, MIME and content. It decodes static images, bounds DOCX expansion and validates its XML/package relationships. PDF validation checks structure only. PDF and DOCX download as attachments. Image preview and download responses set no-store, nosniff, same-origin resource policy and sandboxed CSP.
- PostgreSQL initially holds the bytes. Metadata and bytes commit in the same transaction as the draft or revision. Duplicate batches, stale versions and failed changes roll back. Database triggers and restricted foreign keys preserve original evidence. One accepted revision identifies its own attachments.
- Offload uploads only committed objects, conditionally writes the generated key, then reads back and verifies byte count and SHA-256. A conditional database update pins the version before releasing database bytes. A failed transfer keeps database bytes usable. A lost acknowledgement can leave an external copy pending reconciliation. Retry the worker and compare committed rows and pinned versions before any provider-side cleanup. There is no automatic orphan deletion. Missing pinned bytes return a service error for authorized readers.
- Check private bucket access, encryption, IAM, versioning, retention, backups and recovery in the intended deployment. The local fixture tested the protocol and failure handling. Live provider policy, malware detection, load capacity and ingress limits require separate deployment verification. Before accepting untrusted production documents, quarantine uploads and release only after a successful scan. Establish account quotas and ingress limits.

## Reproduction and evidence

Use the installed Node runtime and dependencies. Start a separate loopback PostgreSQL cluster with a role allowed to create disposable databases. Set `S1_TEST_PG_URL` to that cluster and override `DATABASE_URL` for verification. Keep the development connection out of the test environment. Build before browser tests because they start the production server.

| Check | Final result |
| --- | --- |
| Prisma validate and generate | Passed, Prisma Client 7.8.0 |
| Fresh deployment | All 12 migrations deployed with Prisma. Schema diff empty. |
| Prior S2 upgrade | Deployed first 11 migrations, inserted an accepted assignment and deployed migration 12. Preserved assignee, ACTIVE status, accepted scope and amount. Schema diff empty. Integration fixtures separately checked historical submissions, simulated funding and legacy proposals. |
| Automated suite | 45 passed, zero failed, skipped or cancelled. 19 auth/account/integration, 7 evidence, 12 marketplace, 3 negotiation presentation and 4 project presentation. |
| Browser suites | Six production browser scripts: S2 A–F, S10 (client, freelancer, admin and social controls), Phase 1 (5 views × 3 sizes), Phase 2 (4 × 3), Phase 3 (6 × 3), Phase 4 (A–F, 6 × 3). |
| Browser evidence | 113 PNGs: 42 S2, 8 S10, 15 Phase 1, 12 Phase 2, 18 Phase 3, 18 Phase 4. Open `%TEMP%\TrustOnes-final-S2-qa\visual-review.html` for full-resolution images. |
| Build and lint | Production build generated 58/58 static pages. One existing CSS import-order warning. ESLint returned zero errors and 13 existing warnings. |
| Git checks | Empty index, zero unresolved entries, ignored and untracked local environment file. The inventory excludes the unrelated landing component deletion. |

```powershell
node node_modules/prisma/build/index.js validate
node node_modules/prisma/build/index.js generate
node node_modules/next/dist/bin/next build
npm test
node tests/s2-browser.mjs
node tests/s10-browser.mjs
node tests/project-presentation-browser.mjs
node tests/freelancer-discovery-browser.mjs
node tests/negotiation-presentation-browser.mjs
node tests/evidence-browser.mjs
node node_modules/eslint/bin/eslint.js .
git diff --check
```

## Development database

The read-only ledger comparison found 12 repository migrations, 12 applied, zero pending, zero failed, zero unknown and zero checksum differences. No development deployment is needed for this checkout. Both deployment rehearsals above used separate disposable databases.

For a later checkout with pending migrations, run the following from the repository in a **fresh development shell**. Select the same host, port, user and database as the project's configured Prisma datasource. Use its required TLS settings. Pick a backup directory on a protected volume with enough free space. The native tools prompt for the password.

```powershell
$pgBin = 'C:\Program Files\PostgreSQL\18\bin'
$dbHost = Read-Host 'Development PostgreSQL host'
$dbPort = Read-Host 'Port'
$dbUser = Read-Host 'User'
$dbName = Read-Host 'Development database name'
$backupDir = Read-Host 'Existing protected backup directory'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive = Join-Path $backupDir "trustones-$stamp.dump"
$conn = @('--host', $dbHost, '--port', $dbPort, '--username', $dbUser, '--password')
& "$pgBin\pg_dump.exe" @conn --dbname $dbName --format=custom --file $archive
if ($LASTEXITCODE) { throw 'Backup failed' }
& "$pgBin\pg_restore.exe" --list $archive | Out-Null
if ($LASTEXITCODE) { throw 'Unreadable backup' }
$restoreDb = 'trustones_restore_' + [guid]::NewGuid().ToString('N')
& "$pgBin\createdb.exe" @conn --template=template0 $restoreDb
if ($LASTEXITCODE) { throw 'Could not create a separate restore database' }
& "$pgBin\pg_restore.exe" @conn --dbname $restoreDb --exit-on-error --single-transaction --no-owner --no-acl $archive
if ($LASTEXITCODE) { throw 'Restore rehearsal failed' }
```

Also retain PostgreSQL roles/grants and deployment secrets through the environment's secured backup process. Preserve all pinned private object versions and encryption keys when offload has run. Verify representative assignments and downloads on the restored copy. Coordinate a maintenance window and review each pending SQL migration. Confirm the Prisma status output identifies the intended development host and database before deploying.

```powershell
node node_modules/prisma/build/index.js migrate status
# Continue only after reviewing the expected pending migrations and backup.
node node_modules/prisma/build/index.js migrate deploy
if ($LASTEXITCODE) { throw 'Deployment failed. Inspect migration status before retrying.' }
node node_modules/prisma/build/index.js migrate status
if ($LASTEXITCODE) { throw 'Unexpected migration status after deployment' }
node node_modules/prisma/build/index.js generate
```

## Manual acceptance checklist

- [ ] In separate client and freelancer sessions, publish a public draft with a long brief, a client-only file and a shared file. Check the public card, full brief, deadline and both audiences.
- [ ] Submit a supported document with a proposal, open the real candidate profile, counter using fractional INR and accept as the current recipient. Compare final price, scope, deadline, revision and files across both portals and the assigned deal room.
- [ ] Use the directory to invite a professional to a private listing. Exchange counteroffers with different files. Reopen each historical revision after acceptance. Check one assignment and denied unrelated access.
- [ ] Reject, withdraw and race two candidates on a separate fixture. Reopen stale tabs, check the winning agreement and losing candidate's own closed history.
- [ ] Review desktop, tablet and mobile evidence. Check keyboard navigation, form errors, sparse profiles, empty inboxes, compact cards and the distinction between current and historical terms.
- [ ] Verify both roles' sparse profile/settings edits, password change and fresh sign-in. File support requests and triage as admin. Check empty business screens and the sandbox ledger.
- [ ] Before integrating downstream funding, verify backup recovery including offloaded objects, upload quarantine policy and concurrent milestone allocation safeguards.

## Integration decision

**READY WITH KNOWN LIMITATIONS** for local S2 sandbox integration review. Use the [Developer B agreement contract](s2-assignment-contract.md) for authorized reads, allocation rules, legacy rows and funding boundaries. The [complete file inventory](s2-change-inventory.md) identifies review groups. No new feature or migration was introduced by Phase 5.

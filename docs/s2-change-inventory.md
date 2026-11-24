# S2 working-tree inventory

129 proposed files relative to S10: 55 modified and 74 new. The index is empty. The separate unstaged deletion of `src/components/landing/Workflow.jsx` is excluded.

## Review and commit sequence

Review the four groups below in order. The final source files span several refinement phases. For a buildable integration point, stage the explicitly reviewed paths and make one atomic local S2 commit after approval. Splitting these groups into independent commits requires moving dependent imports and their callers together and rebuilding each intermediate revision.

Review both SQL migrations in order. The ten previously committed migrations are unchanged. The manifest adds the pinned S3 client, busboy, saxes, sharp and yauzl for attachment handling, updates the lockfile and expands the test script. Phase 5 adds no dependency.

Exclude the ignored environment file, build output, generated Prisma client in node_modules, disposable cluster, test credentials, raw uploaded bytes and screenshot evidence. Check the staged path list against this inventory, run `git diff --cached --check`, inspect the staged diff and recheck the unrelated deletion before committing.

## 1. Dependencies, migrations, services and API routes

| Change | File |
| --- | --- |
| Modified | `package-lock.json` |
| Modified | `package.json` |
| New | `prisma/migrations/20261122000000_marketplace/migration.sql` |
| New | `prisma/migrations/20261123000000_collaboration_attachments/migration.sql` |
| Modified | `prisma/schema.prisma` |
| New | `scripts/offload-evidence.mjs` |
| New | `src/app/api/attachments/[id]/route.js` |
| New | `src/app/api/attachments/policy/route.js` |
| New | `src/app/api/directory/freelancers/[workerId]/route.js` |
| New | `src/app/api/directory/freelancers/route.js` |
| New | `src/app/api/discovery/projects/[projectId]/route.js` |
| New | `src/app/api/discovery/projects/route.js` |
| Modified | `src/app/api/freelancer/invites/route.js` |
| New | `src/app/api/negotiations/[negotiationId]/route.js` |
| New | `src/app/api/negotiations/route.js` |
| New | `src/app/api/projects/[projectId]/invitations/route.js` |
| Modified | `src/app/api/projects/[projectId]/proposals/route.js` |
| New | `src/app/api/projects/[projectId]/publish/route.js` |
| Modified | `src/app/api/projects/[projectId]/route.js` |
| Modified | `src/app/api/projects/route.js` |
| Modified | `src/lib/account-api.js` |
| New | `src/lib/evidence-error.js` |
| New | `src/lib/evidence-policy.js` |
| New | `src/lib/negotiation-presentation.js` |
| New | `src/lib/private-object-store.mjs` |
| New | `src/lib/project-presentation.js` |
| New | `src/services/evidence-format.js` |
| New | `src/services/evidence-storage.js` |
| New | `src/services/evidence-upload.js` |
| Modified | `src/services/freelancer-dashboard.service.js` |
| Modified | `src/services/freelancer-deal-room.service.js` |
| Modified | `src/services/freelancer-invite.service.js` |
| Modified | `src/services/freelancer-milestone.service.js` |
| Modified | `src/services/freelancer-notification.service.js` |
| Modified | `src/services/freelancer-profile.service.js` |
| Modified | `src/services/freelancer-project.service.js` |
| Modified | `src/services/freelancer-submission.service.js` |
| Modified | `src/services/freelancer-wallet.service.js` |
| New | `src/services/marketplace.service.js` |
| Modified | `src/services/milestone.service.js` |
| Modified | `src/services/project.service.js` |
| Modified | `src/services/proposal.service.js` |
| New | `src/services/service-result.js` |

## 2. Mounted pages, components and styles

| Change | File |
| --- | --- |
| Modified | `src/app/admin/dashboard/page.jsx` |
| Modified | `src/app/client/dashboard/page.jsx` |
| Modified | `src/app/client/disputes/page.jsx` |
| Modified | `src/app/client/escrow/page.jsx` |
| New | `src/app/client/freelancers/[workerId]/page.jsx` |
| New | `src/app/client/freelancers/error.jsx` |
| New | `src/app/client/freelancers/loading.jsx` |
| Modified | `src/app/client/freelancers/page.jsx` |
| Modified | `src/app/client/messages/page.jsx` |
| Modified | `src/app/client/notifications/page.jsx` |
| New | `src/app/client/offers/[id]/page.jsx` |
| New | `src/app/client/offers/error.jsx` |
| New | `src/app/client/offers/loading.jsx` |
| New | `src/app/client/offers/page.jsx` |
| Modified | `src/app/client/projects/[projectId]/edit/page.jsx` |
| Modified | `src/app/client/projects/[projectId]/page.jsx` |
| Modified | `src/app/client/projects/page.jsx` |
| Modified | `src/app/client/reviews/page.jsx` |
| Modified | `src/app/freelancer/dashboard/page.jsx` |
| New | `src/app/freelancer/discover/[projectId]/page.jsx` |
| New | `src/app/freelancer/discover/error.jsx` |
| New | `src/app/freelancer/discover/loading.jsx` |
| New | `src/app/freelancer/discover/page.jsx` |
| Modified | `src/app/freelancer/disputes/page.jsx` |
| New | `src/app/freelancer/invites/error.jsx` |
| New | `src/app/freelancer/invites/loading.jsx` |
| Modified | `src/app/freelancer/invites/page.jsx` |
| New | `src/app/freelancer/offers/[id]/page.jsx` |
| New | `src/app/freelancer/offers/error.jsx` |
| New | `src/app/freelancer/offers/loading.jsx` |
| Modified | `src/app/freelancer/reviews/page.jsx` |
| Modified | `src/app/freelancer/wallet/page.jsx` |
| Modified | `src/app/page.js` |
| Modified | `src/components/client/ClientDashboard.jsx` |
| Modified | `src/components/client/ClientSidebar.jsx` |
| Modified | `src/components/client/ClientTopNav.jsx` |
| New | `src/components/client/project/ProjectOverview.jsx` |
| Modified | `src/components/client/project/ProjectSummaryCard.jsx` |
| Modified | `src/components/client/project/ProjectsForm.jsx` |
| Modified | `src/components/freelancer/FreelancerDashboardHome.jsx` |
| Modified | `src/components/freelancer/FreelancerDealRoomDetail.jsx` |
| Modified | `src/components/freelancer/FreelancerDealRoomsPage.jsx` |
| Modified | `src/components/freelancer/FreelancerMessagesPage.jsx` |
| Modified | `src/components/freelancer/FreelancerMilestonesPage.jsx` |
| Modified | `src/components/freelancer/FreelancerNotificationsPage.jsx` |
| Modified | `src/components/freelancer/FreelancerProfilePage.jsx` |
| Modified | `src/components/freelancer/FreelancerProjectsPage.jsx` |
| Modified | `src/components/freelancer/FreelancerSidebar.jsx` |
| Modified | `src/components/freelancer/FreelancerTopbar.jsx` |
| Modified | `src/components/landing/LandingPage.jsx` |
| New | `src/components/marketplace/DiscoveryProjectCard.jsx` |
| New | `src/components/marketplace/EvidenceFiles.jsx` |
| New | `src/components/marketplace/MarketError.jsx` |
| New | `src/components/marketplace/MarketLoading.jsx` |
| New | `src/components/marketplace/MarketViews.jsx` |
| New | `src/components/marketplace/MobileMarketNav.jsx` |
| New | `src/components/marketplace/NegotiationDetail.jsx` |
| New | `src/components/marketplace/NegotiationInbox.jsx` |
| New | `src/components/marketplace/OfferForm.jsx` |
| New | `src/components/marketplace/ProfessionalAvatar.jsx` |
| New | `src/components/marketplace/ProjectDescription.jsx` |
| New | `src/components/marketplace/SandboxLedger.jsx` |
| New | `src/components/marketplace/TalentDiscovery.jsx` |
| New | `src/components/marketplace/Unavailable.jsx` |
| New | `src/components/marketplace/negotiation.module.css` |
| New | `src/components/marketplace/talent.module.css` |

## 3. Automated and browser coverage

| Change | File |
| --- | --- |
| Modified | `tests/auth-fixture.mjs` |
| Modified | `tests/auth.test.mjs` |
| New | `tests/evidence-browser.mjs` |
| New | `tests/evidence-samples.mjs` |
| New | `tests/evidence.test.mjs` |
| New | `tests/freelancer-discovery-browser.mjs` |
| New | `tests/marketplace.test.mjs` |
| New | `tests/negotiation-presentation-browser.mjs` |
| New | `tests/negotiation-presentation.test.mjs` |
| New | `tests/project-presentation-browser.mjs` |
| New | `tests/project-presentation.test.mjs` |
| New | `tests/s2-browser.mjs` |

## 4. Handoff and QA documentation

| Change | File |
| --- | --- |
| New | `docs/attachment-phase4.md` |
| New | `docs/freelancer-discovery-phase2.md` |
| New | `docs/negotiation-presentation-phase3.md` |
| New | `docs/project-presentation-phase1.md` |
| New | `docs/s2-assignment-contract.md` |
| New | `docs/s2-change-inventory.md` |
| New | `docs/s2-final-qa.md` |
| New | `docs/s2-static-data-audit.md` |

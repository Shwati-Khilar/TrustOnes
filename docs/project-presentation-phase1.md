# Phase 1 handoff — project presentation and discovery

The baseline is the reviewed, uncommitted S2 working tree on `feature/s2-projects-invites-proposals`, based on S10 commit `c7a1e51980e84e3d734d11197407b9f8b4f59082`.

## Presentation contract

- Treat a project description as authored text. Create and edit preserve its line breaks. Full briefs support paragraphs, headings, emphasis, numbered and bulleted lists, and HTTP(S) links. Raw HTML stays text. The renderer implements this subset without a new dependency.
- Use `ProjectDescription` for a full brief and `projectPreview` for a card. The discovery preview has a 220-character upper bound and a three-line visual limit. Skills, budget, deadline and the primary action sit outside the preview.
- Format calendar metadata with `projectDate` in UTC. The advertised date, a date the author mentions in prose and an agreed delivery date have different meanings. A date-only discovery filter includes that entire UTC day. An unrelated edit preserves an existing timestamp's time of day.
- `Project.budget` and `Project.deadline` follow the S2 assignment contract. Active views also show the original listing snapshot where it exists. Milestone allocation sums planned milestone amounts. Approved work value sums approved milestones. Neither calculation measures a payment.
- The owner-scoped project detail read adds `offerActivity` with counts of proposals, invitations and pending negotiations. The owner list adds a pending-negotiation count to determine edit eligibility. Existing authorization and mutation contracts still apply.
- The active client page links to the accepted agreement and its existing milestone workspace. The assigned freelancer has a separate authorized deal-room route. The reference-documents area reports attachment availability; stored links in an authored brief are distinct from uploaded evidence.

## Manual acceptance

1. Save a multiline brief containing a heading, a numbered list, bullets, emphasis and a web link. Reopen the edit form and verify that the original text is intact.
2. Use separate client and freelancer sessions. Find the published project, open the compact card and compare its structured deadline with the owner view. Try a browser west of UTC.
3. Open More filters with the keyboard, apply a deadline, then use the View project link. Check budgets and actions at mobile, tablet and desktop widths.
4. On an open owner project, check publication, activity and available management actions. On an active project, follow the agreement and milestone links. Verify the original listing and agreed delivery are distinguishable.
5. Run the Node suites through `npm test`. The Phase 1 browser harness is `node tests/project-presentation-browser.mjs`. It uses the existing disposable PostgreSQL fixture and Playwright setup. Set `PHASE1_EVIDENCE` to retain screenshots. The `--baseline` option captures a prior production build.

## Phase 2 starting point

The client freelancer directory and professional details are the `Discovery` client branch and `Professional` in `MarketViews.jsx`. The freelancer-side project card now lives in `DiscoveryProjectCard.jsx`. Phase 2 can change the professional presentation independently. Keep the S10 visibility preference, public profile projection and S2 invitation eligibility in the existing services. Use the stored availability value and profile image or initials. The S2 assignment contract remains the downstream interface.

## Verified checkpoint

The final production build generated 57/57 pages. All 33 Node tests passed, including the existing 29 integration tests and four presentation tests. All six S2 browser scenarios passed. The S10 client, freelancer and admin regression checks passed. ESLint reported zero errors and 13 existing warnings. The build retained the existing CSS import-order warning.

The Phase 1 browser harness verified multiline create/edit round trips, a fractional INR budget, keyboard search and filter navigation, accepted-agreement and milestone navigation, safe links and the date discrepancy. Five screens were captured before and after at three sizes. The local gallery is in `%TEMP%/TrustOnes-phase1-presentation/visual-review.html`. Phase 1 added no dependencies or migrations.

### Files changed during Phase 1

- `docs/project-presentation-phase1.md`
- `package.json`
- `src/app/client/projects/[projectId]/edit/page.jsx`
- `src/app/client/projects/[projectId]/page.jsx`
- `src/app/client/projects/page.jsx`
- `src/components/client/ClientDashboard.jsx`
- `src/components/client/project/ProjectOverview.jsx`
- `src/components/client/project/ProjectSummaryCard.jsx`
- `src/components/client/project/ProjectsForm.jsx`
- `src/components/freelancer/FreelancerDashboardHome.jsx`
- `src/components/freelancer/FreelancerDealRoomDetail.jsx`
- `src/components/freelancer/FreelancerProjectsPage.jsx`
- `src/components/marketplace/DiscoveryProjectCard.jsx`
- `src/components/marketplace/MarketViews.jsx`
- `src/components/marketplace/NegotiationDetail.jsx`
- `src/components/marketplace/OfferForm.jsx`
- `src/components/marketplace/ProjectDescription.jsx`
- `src/lib/project-presentation.js`
- `src/services/freelancer-dashboard.service.js`
- `src/services/freelancer-deal-room.service.js`
- `src/services/freelancer-invite.service.js`
- `src/services/freelancer-milestone.service.js`
- `src/services/freelancer-project.service.js`
- `src/services/marketplace.service.js`
- `src/services/project.service.js`
- `tests/project-presentation-browser.mjs`
- `tests/project-presentation.test.mjs`

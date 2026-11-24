# Phase 2 handoff — freelancer discovery and professional profiles

The baseline was the uncommitted S2 and Phase 1 working tree on `feature/s2-projects-invites-proposals`, at S10 commit `c7a1e51980e84e3d734d11197407b9f8b4f59082`. Recovery found the directory, public profile, invitation integration, tests and initial production build in place. The browser run had stopped at the availability filter. Finishing work gave the filter an explicit label, shared the project eligibility query, added a direct project-creation link, and verified the completed workflow.

## Product and data contract

- The client directory has one submitted search form, case-insensitive name/title/skill matching, availability filtering, a filtered result count and 24 results per page. Cards show the persisted image or initials, professional title, a two-line biography preview, up to three skills, location, experience, starting price and eligible actions. Skill overflow is indicated on the card and the full list is available on the profile.
- The professional profile shows the public S10 projection. Full biography, skills, education and HTTP(S) portfolio links appear when supplied. Images that fail to decode fall back to initials. The lack of review data is displayed as **Unrated**. The projection excludes email, phone, credentials, settings and support history. Directory and detail reads require an active, verified, visible freelancer.
- `BUSY_OPEN` is one persisted enum. The UI renders **Availability · Busy** and **Invitations · Open to offers**. Other availability values do not imply an invitation preference.
- The directory Invite action and profile project selector share an owner-scoped read. A project must be published, open, unassigned and before its deadline, with no pending negotiation for this pair. An empty selector is replaced with links to create or manage projects and review negotiations. The existing S2 mutation still validates and locks the project at submission.
- The profile links directly to its invitation form. Sending opens the existing negotiation with confirmation. The recipient sees the persisted invitation in the freelancer inbox. No schema, migration or dependency changes were needed.

## Review evidence

The browser gallery is `%TEMP%\TrustOnes-phase2-professionals\visual-review.html`. It contains 12 before/after pairs across desktop (1440 × 900), tablet (820 × 1180) and mobile (390 × 844). Each pair uses the same disposable profile data and covers the directory, complete profile, sparse profile or empty search. The image-equipped fixture uses a studio mark. Real user photos use the same image path.

At desktop width, three cards share a row and the invitation form sits beside the professional details. At tablet width the directory has two columns. On mobile the filters and cards stack, and a header action jumps directly to the invitation form. The old mobile directory put three summary boxes before the search. The new design brings the search and first result into the initial viewport. Browser assertions check both page width and the bounds of cards and form controls.

## Verification

- 34 Node tests passed, with zero failures or skips. These comprise 19 S1/S10 checks, 11 S2 checks and four Phase 1 presentation checks. The directory tests cover pagination totals and owner-specific eligibility before publication, after invitation and after withdrawal.
- The Phase 2 Chrome scenario uses separate signed-in client and freelancer sessions. It updates an S10 profile, searches by partial skill, filters by keyboard, checks both busy/open labels, submits an invitation to a private project and opens it as the recipient. It also checks the missing and broken image cases, omitted optional sections, the unrated state, private phone exclusion and the unavailable-project fallback.
- The Phase 1 browser suite covers five views at three sizes. The S10 browser suite covers both roles, fresh login after password change, social-account controls and admin support triage. The S2 browser suite covers six existing proposal, invitation and assignment scenarios.
- The production build generated 57/57 static pages. ESLint returned zero errors and 13 existing warnings. The existing stylesheet import-order warning remains in the build.
- Browser evidence is from Chrome. External portfolio destinations and third-party image availability are outside the fixture. Screenshots and logs are local temporary artifacts.

## Changed files relative to Phase 1

| Area | Files |
| --- | --- |
| Directory routes | `src/app/client/freelancers/error.jsx`, `src/app/client/freelancers/loading.jsx` |
| Invitation receipt | `src/app/client/offers/[id]/page.jsx` |
| Client navigation | `src/components/client/ClientTopNav.jsx` |
| Presentation and form | `src/components/marketplace/MarketViews.jsx`, `OfferForm.jsx`, `ProfessionalAvatar.jsx`, `TalentDiscovery.jsx`, `talent.module.css` in that directory |
| Eligible projects and filtered totals | `src/services/marketplace.service.js` |
| Tests | `tests/freelancer-discovery-browser.mjs`, `tests/marketplace.test.mjs` |
| Handoff | `docs/freelancer-discovery-phase2.md` |

## Phase 3 starting point

The client and freelancer offer-detail routes already open the same persisted, versioned negotiation. Begin a future presentation pass at `src/components/marketplace/NegotiationDetail.jsx` and the existing response controls in `OfferForm.jsx`. Use `docs/s2-assignment-contract.md` for assignment semantics and the six S2 browser scenarios as the regression baseline. Phase 2 is uncommitted for developer review.

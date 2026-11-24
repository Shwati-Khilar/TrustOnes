# S2 production-data audit and acceptance checks

The audit follows mounted routes and their data sources. A new account on an empty marketplace has no projects, offers, approvals, payment history or reviews. The signed-in account itself is a real database record. An eligible professional can appear in the directory before completing optional profile fields.

| Surface | Source or behavior | What the user sees |
| --- | --- | --- |
| Landing, registration, login, recovery and onboarding | Product copy, artwork and S1 authentication | Role-specific registration, project discovery and negotiation. Funding is described as simulation. |
| Client dashboard | Owner-scoped projects, milestones and marketplace counts | Project budgets, approved work and outstanding negotiations. No invented recommendations or trust score. |
| Client project list, create, edit and detail | Owned Project, Proposal, OfferRevision and Milestone rows | Draft/publication status, assigned professional and accepted terms. Existing milestone actions remain available where eligible. |
| Client directory and professional detail | Active, verified freelancers and public S10 fields with visibility preference applied | Name, professional fields and invitation action. No invented rating, earnings or portfolio. |
| Client offers and freelancer invitations/offers | Participant-scoped negotiations and revisions | Original offer, sender, date, counteroffers, current turn and terminal history. |
| Freelancer project discovery and detail | Eligible published public listings, invited private detail or own assignment | Real project, client name, budget, deadline, skills and proposal action. |
| Freelancer dashboard, assigned projects, deal rooms and milestones | Session-scoped projects, proposals, milestones and submissions | Project activity and milestones, including zero/empty states. Project value and approved work describe work, not cash held. |
| Freelancer notifications | Activity derived from owned proposals, milestones and projects | Read state is local. Persistent notification delivery is a future feature. |
| Client notifications and messaging | Unavailable state | No simulated notification feed or chat transcript. |
| Freelancer messaging | Own project/deal-room list | Project context and links. Message sending is unavailable. |
| Client escrow and freelancer wallet | Participant-scoped PaymentTransaction rows with provider SIMULATED | Simulated milestone funding history or an empty history. No spendable balance or withdrawal action. |
| Client and freelancer reviews and disputes | Unavailable states | No invented reviewers, dispute cases, ratings or settlement outcomes. |
| Client and freelancer profiles, settings and support | S10 account, preference, profile and support services | Persisted account fields, requester-owned tickets and password controls. |
| Admin dashboard and support | Database account and active-project counts, admin-only ticket triage | Real counts and ticket history. Disputes are marked unavailable. |

Legacy unmounted components still contain design fixtures, including the client freelancer, escrow, notification and dispute data modules. The mounted routes above use live data or explicit unavailable states. Recheck the source when reusing an older component. Legitimate static content includes labels, navigation, form choices, artwork and instructional copy.

## Manual acceptance checklist

Use two active verified freelancers, a verified client, and separate browser sessions on a disposable database.

- Create and edit a draft. Confirm it is absent from freelancer discovery. Publish it as public, search by skill and submit a proposal. Accept from the client account. Open the project on both sides.
- Publish a private project. Invite one freelancer for INR 15,000 and 15 days. Counter at INR 20,000 and 20 days, counter back at INR 18,000 and 20 days, then accept. Reload both histories and verify the same scope, three revisions and final price. Check that the unrelated freelancer cannot discover the private project.
- On another public project, counter a freelancer proposal from the client portal. Accept from the freelancer portal and open the assigned deal room.
- Reject an invitation, invite a different freelancer, then withdraw that invitation. Revisit both histories. Both should be closed to further action.
- Submit competing applications. Accept one. Confirm the other is closed and cannot open the winner's deal room. The automated suite also races requests on independent sessions.
- Open both dashboards, projects, directory, messages, disputes, reviews and finance before creating business records. Verify empty or unavailable states. Check simulated history independently of assignment.
- Inspect the desktop and mobile views at 1440 × 900 and 390 × 844. Use the mobile menu to reach discovery and negotiations. Verify profile/settings navigation, support ticket triage, password change and fresh sign-in.

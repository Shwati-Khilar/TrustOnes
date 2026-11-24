CREATE TYPE "ListingVisibility" AS ENUM ('PRIVATE','PUBLIC');
CREATE TYPE "NegotiationKind" AS ENUM ('PROPOSAL','INVITATION');
ALTER TYPE "ProposalStatus" ADD VALUE 'CLOSED';
ALTER TABLE projects ADD COLUMN visibility "ListingVisibility" NOT NULL DEFAULT 'PRIVATE',
  ADD COLUMN "publishedAt" TIMESTAMP(3), ADD COLUMN skills TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN "advertisedBudget" DECIMAL(12,2), ADD COLUMN "advertisedDeadline" TIMESTAMP(3),
  ADD COLUMN "acceptedOfferId" TEXT, ADD COLUMN "acceptedAt" TIMESTAMP(3);
ALTER TABLE proposals ADD COLUMN kind "NegotiationKind" NOT NULL DEFAULT 'PROPOSAL',
  ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE offer_revisions (
  id TEXT NOT NULL PRIMARY KEY, "negotiationId" TEXT NOT NULL REFERENCES proposals(id) ON DELETE RESTRICT,
  version INTEGER NOT NULL, "senderId" TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  "recipientId" TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount DECIMAL(12,2) NOT NULL, days INTEGER NOT NULL, scope TEXT NOT NULL, note TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("negotiationId",version)
);
-- Snapshot only terms recorded by the legacy proposal. Do not infer a legacy contract or publish listings.
INSERT INTO offer_revisions (id,"negotiationId",version,"senderId","recipientId",amount,days,scope,note,"createdAt")
SELECT 'legacy-' || p.id,p.id,1,p."freelancerId",j."clientId",p."bidAmount",p."estimatedDays",j.description,p."coverLetter",p."createdAt"
FROM proposals p JOIN projects j ON j.id=p."projectId";
ALTER TABLE projects ADD CONSTRAINT "projects_acceptedOfferId_fkey" FOREIGN KEY ("acceptedOfferId") REFERENCES offer_revisions(id) ON DELETE RESTRICT;
CREATE UNIQUE INDEX "projects_acceptedOfferId_key" ON projects("acceptedOfferId");
CREATE INDEX "projects_visibility_status_publishedAt_idx" ON projects(visibility,status,"publishedAt");
-- Keep every existing record; allow an invitation after a previous negotiation has ended.
DROP INDEX "proposals_projectId_freelancerId_key";
CREATE UNIQUE INDEX proposals_one_pending_pair ON proposals("projectId","freelancerId") WHERE status='PENDING';
CREATE UNIQUE INDEX proposals_one_application ON proposals("projectId","freelancerId") WHERE kind='PROPOSAL';
CREATE FUNCTION keep_offer_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Offer revisions are immutable'; END $$;
CREATE TRIGGER immutable_offer BEFORE UPDATE OR DELETE ON offer_revisions FOR EACH ROW EXECUTE FUNCTION keep_offer_revision();

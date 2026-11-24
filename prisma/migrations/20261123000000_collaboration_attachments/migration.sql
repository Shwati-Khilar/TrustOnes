CREATE TYPE "EvidenceAudience" AS ENUM ('CLIENT_ONLY','PROJECT_VIEWERS','PARTICIPANTS');
CREATE TABLE private_file_objects (
  id UUID PRIMARY KEY, bytes BYTEA, bucket TEXT, version TEXT,
  CHECK ((bytes IS NOT NULL AND bucket IS NULL AND version IS NULL)
      OR (bytes IS NULL AND bucket IS NOT NULL AND version IS NOT NULL))
);
CREATE TABLE collaboration_attachments (
  id UUID PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE NO ACTION,
  "revisionId" TEXT REFERENCES offer_revisions(id) ON DELETE RESTRICT ON UPDATE NO ACTION,
  "uploaderId" TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE NO ACTION,
  audience "EvidenceAudience" NOT NULL,
  filename TEXT NOT NULL, "mediaType" TEXT NOT NULL, "byteSize" INTEGER NOT NULL CHECK ("byteSize">0),
  digest TEXT NOT NULL, "batchId" UUID NOT NULL, position INTEGER NOT NULL CHECK (position>=0),
  "storageKey" UUID NOT NULL REFERENCES private_file_objects(id) ON DELETE RESTRICT ON UPDATE NO ACTION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (("revisionId" IS NOT NULL) = (audience='PARTICIPANTS'))
);
CREATE UNIQUE INDEX "collaboration_attachments_storageKey_key" ON collaboration_attachments("storageKey");
CREATE UNIQUE INDEX "collaboration_attachments_uploaderId_batchId_position_key" ON collaboration_attachments("uploaderId","batchId",position);
CREATE INDEX "collaboration_attachments_projectId_revisionId_audience_idx" ON collaboration_attachments("projectId","revisionId",audience);
CREATE INDEX "collaboration_attachments_revisionId_idx" ON collaboration_attachments("revisionId");

CREATE FUNCTION check_evidence_parent() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."revisionId" IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM offer_revisions r JOIN proposals n ON n.id=r."negotiationId"
      WHERE r.id=NEW."revisionId" AND n."projectId"=NEW."projectId" AND r."senderId"=NEW."uploaderId"
        AND r.xmin=pg_current_xact_id()::xid) THEN
      RAISE EXCEPTION 'Evidence requires a matching newly created revision';
    END IF;
  ELSE
    PERFORM 1 FROM projects p WHERE p.id=NEW."projectId" AND p."clientId"=NEW."uploaderId"
      AND p.status='OPEN' AND p."freelancerId" IS NULL AND p."acceptedOfferId" IS NULL FOR UPDATE;
    IF NOT FOUND OR EXISTS (SELECT 1 FROM proposals n WHERE n."projectId"=NEW."projectId" AND n.status='PENDING') THEN
      RAISE EXCEPTION 'Project references are protected';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER evidence_parent BEFORE INSERT ON collaboration_attachments FOR EACH ROW EXECUTE FUNCTION check_evidence_parent();
CREATE FUNCTION preserve_collaboration_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Committed collaboration evidence is immutable';
END $$;
CREATE TRIGGER preserve_evidence BEFORE UPDATE OR DELETE ON collaboration_attachments FOR EACH ROW EXECUTE FUNCTION preserve_collaboration_evidence();
-- Permit precisely one verified offload. A sealed bucket version cannot be replaced.
CREATE FUNCTION protect_file_location() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='UPDATE' AND OLD.id=NEW.id AND OLD.bytes IS NOT NULL AND NEW.bytes IS NULL
     AND NEW.bucket IS NOT NULL AND NEW.version IS NOT NULL AND NEW.version <> 'null' THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Committed file content and location are protected';
END $$;
CREATE TRIGGER preserve_file_bytes BEFORE UPDATE OR DELETE ON private_file_objects FOR EACH ROW EXECUTE FUNCTION protect_file_location();

import pg from "pg";
import { copyToPrivateBucket,privateBucketClient } from "../src/lib/private-object-store.mjs";

const bucket=process.env.EVIDENCE_S3_BUCKET;
if(!bucket || !process.env.DATABASE_URL) throw new Error("Supply DATABASE_URL and EVIDENCE_S3_BUCKET to the offload worker.");
const db=new pg.Pool({connectionString:process.env.DATABASE_URL});
const client=privateBucketClient();
let count=0;
try {
  const {rows}=await db.query('SELECT id FROM private_file_objects WHERE bytes IS NOT NULL ORDER BY id LIMIT 50');
  for(const {id} of rows) {
    const {rows:[file]}=await db.query('SELECT o.id,o.bytes,a.digest,a."byteSize" FROM private_file_objects o JOIN collaboration_attachments a ON a."storageKey"=o.id WHERE o.id=$1 AND o.bytes IS NOT NULL',[id]);
    if(!file) continue;
    const version=await copyToPrivateBucket(client,bucket,file);
    const saved=await db.query('UPDATE private_file_objects SET bytes=NULL,bucket=$2,version=$3 WHERE id=$1 AND bytes IS NOT NULL',[id,bucket,version]);
    count+=saved.rowCount;
  }
  console.log("Verified object versions recorded:",count);
} catch {
  console.error("Offload stopped. Check private bucket access, versioning and database connectivity. Pending bytes remain in PostgreSQL.");
  process.exitCode=1;
} finally { client.destroy(); await db.end(); }

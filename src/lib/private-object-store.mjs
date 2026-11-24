import { createHash } from "node:crypto";
import { S3Client,GetObjectCommand,PutObjectCommand } from "@aws-sdk/client-s3";

export function privateBucketClient() {
  const endpoint=process.env.EVIDENCE_S3_ENDPOINT;
  if(endpoint) {
    const url=new URL(endpoint);
    const local=["localhost","127.0.0.1","[::1]"].includes(url.hostname);
    if((url.protocol!=="https:" && !(local && url.protocol==="http:")) || url.username || url.password) {
      throw new Error("Private storage requires a trusted HTTPS endpoint.");
    }
  }
  return new S3Client({region:process.env.EVIDENCE_S3_REGION || process.env.AWS_REGION || "us-east-1",
    endpoint,forcePathStyle:!!endpoint,maxAttempts:2});
}

const objectKey=id=>"precontract/v1/"+id;

async function verifiedRead(client,location,file,signal) {
  const result=await client.send(new GetObjectCommand(location),{abortSignal:signal});
  const body=result.Body;
  try {
    if (!body || result.ContentLength!==file.byteSize) throw new Error("Object size mismatch.");
    const chunks=[]; let size=0;
    for await(const chunk of body) {
      size+=chunk.length;
      if(size>file.byteSize) throw new Error("Object exceeds declared size.");
      chunks.push(chunk);
    }
    const bytes=Buffer.concat(chunks);
    if(size!==file.byteSize || createHash("sha256").update(bytes).digest("hex")!==file.digest) throw new Error("Object verification failed.");
    return {bytes,version:result.VersionId};
  } finally { body?.destroy?.(); }
}

export async function readBucketFile(file) {
  const storage=file.object, client=privateBucketClient();
  try {
    return (await verifiedRead(client,{Bucket:storage.bucket,Key:objectKey(storage.id),VersionId:storage.version},file,AbortSignal.timeout(30000))).bytes;
  } finally { client.destroy(); }
}

// Called only for an already committed object. Repeating an interrupted copy
// verifies the existing object before the caller records its exact version.
export async function copyToPrivateBucket(client,bucket,file) {
  const location={Bucket:bucket,Key:objectKey(file.id)};
  const signal=AbortSignal.timeout(90000);
  try {
    await client.send(new PutObjectCommand({...location,IfNoneMatch:"*",Body:file.bytes,
      ContentType:"application/octet-stream",ChecksumSHA256:Buffer.from(file.digest,"hex").toString("base64")}),{abortSignal:signal});
  } catch(error) {
    if(error.$metadata?.httpStatusCode!==412) throw error;
  }
  const {version}=await verifiedRead(client,location,file,signal);
  if(!version || version==="null") throw new Error("A versioned private bucket is required.");
  return version;
}

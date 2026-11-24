import sharp from "sharp";
import yauzl from "yauzl";
import { SaxesParser } from "saxes";
import { crc32 } from "node:zlib";
import { posix } from "node:path";
import { EvidenceError } from "@/lib/evidence-error";
import { evidenceTypes } from "@/lib/evidence-policy";

const reject = () => { throw new EvidenceError("The file format is invalid or unsupported.",415); };
const mainType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml";
const wordNS="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const packageNS="http://schemas.openxmlformats.org/package/2006/";
const imageExt=/\.(png|jpe?g|webp)$/i;

export function validateFilename(name) {
  if (!name || Buffer.byteLength(name)>180 || name!==name.trim() || /[<>:"/\\|?*\p{Cc}\p{Cf}]/u.test(name) ||
      /^[.]/.test(name) || /[. ]$/.test(name) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(name)) {
    throw new EvidenceError("Choose a simple filename without paths or control characters.");
  }
}

async function verifyImage(bytes,extension) {
  const expected=extension==="jpg" ? "jpeg" : extension;
  const img=sharp(bytes,{limitInputPixels:16000000,failOn:"warning"});
  const meta=await img.metadata();
  if (meta.format!==expected || (meta.pages || 1)!==1) reject();
  await img.stats(); // Force a full decode with the pixel limit in effect.
  return meta.width*meta.height;
}

function inspectXml(name,bytes,state) {
  const parser=new SaxesParser({xmlns:true});
  let root=true;
  parser.on("doctype",reject);
  parser.on("opentag",node=>{
    if (node.uri===wordNS && ["altChunk","object","control","instrText","fldSimple"].includes(node.local)) reject();
    const attr=key=>node.attributes[key]?.value || "";
    if (root) {
      if (name==="word/document.xml") state.document=node.uri===wordNS && node.local==="document";
      if (name==="[Content_Types].xml" && !(node.uri===packageNS+"content-types" && node.local==="Types")) reject();
      if (name.endsWith(".rels") && !(node.uri===packageNS+"relationships" && node.local==="Relationships")) reject();
      root=false;
    }
    if (name==="[Content_Types].xml") {
      if (/macroenabled|vbaproject|activex|oleobject|javascript/i.test(attr("ContentType"))) reject();
      if (node.uri===packageNS+"content-types" && node.local==="Override" && attr("PartName")==="/word/document.xml") {
        if (attr("ContentType")!==mainType) reject();
        state.main=true;
      }
    }
    if (name.endsWith(".rels") && node.local==="Relationship") {
      const target=attr("Target"), type=attr("Type");
      if (/oleObject|vbaProject|attachedTemplate|aFChunk|activeX|package$/i.test(type)) reject();
      if (attr("TargetMode")==="External") {
        if (!type.endsWith("/hyperlink") || !/^https?:\/\//i.test(target)) reject();
      } else {
        if (!target || /[\\:%?#]/.test(target)) reject();
        const base=posix.dirname(posix.dirname(name));
        const part=posix.normalize(target.startsWith("/") ? target.slice(1) : posix.join(base,target));
        if (part.startsWith("../")) reject();
        state.targets.add(part);
        if (name==="_rels/.rels" && type==="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" && part==="word/document.xml") state.rootLink=true;
      }
    }
  });
  parser.write(new TextDecoder("utf-8",{fatal:true}).decode(bytes)).close();
}

async function verifyDocx(bytes) {
  if (!bytes.subarray(0,4).equals(Buffer.from([80,75,3,4]))) reject();
  const zip=await yauzl.fromBufferPromise(bytes,{strictFileNames:true});
  const seen=new Set(),state={targets:new Set()};
  let total=0,pixels=0;
  try {
    if (zip.entryCount>256) reject();
    for await (const entry of zip.eachEntry()) {
      const name=entry.fileName;
      if (seen.has(name.toLowerCase()) || entry.isEncrypted() || ![0,8].includes(entry.compressionMethod) ||
          /[\x00-\x1f\\:%]/.test(name) || /(^|\/)(embeddings|activeX|vba[^/]*)(\/|$)/i.test(name)) reject();
      seen.add(name.toLowerCase());
      if (name.endsWith("/") && entry.uncompressedSize===0) continue;
      const xml=name.endsWith(".xml") || name.endsWith(".rels");
      if (!xml && !imageExt.test(name)) reject();
      total+=entry.uncompressedSize;
      if (entry.uncompressedSize>12*1048576 || total>32*1048576 || entry.uncompressedSize>Math.max(65536,entry.compressedSize*150)) reject();
      const chunks=[]; let size=0;
      for await (const chunk of await zip.openReadStreamPromise(entry)) {
        size+=chunk.length;
        if (size>entry.uncompressedSize) reject();
        chunks.push(chunk);
      }
      const part=Buffer.concat(chunks);
      if (crc32(part)!==entry.crc32) reject();
      if (xml) inspectXml(name,part,state);
      else {
        pixels+=await verifyImage(part,name.split(".").pop().toLowerCase());
        if(pixels>32000000) reject();
      }
    }
    if (!state.main || !state.document || !state.rootLink || [...state.targets].some(name=>!seen.has(name.toLowerCase()))) reject();
  } finally { zip.close(); }
}

export async function validateEvidence(name,mime,bytes) {
  validateFilename(name);
  const ext=name.split(".").pop().toLowerCase();
  if (!Object.hasOwn(evidenceTypes,ext) || mime!==evidenceTypes[ext] || !bytes.length) reject();
  try {
    if (ext==="docx") await verifyDocx(bytes);
    else if (ext==="pdf") {
      if (!/^%PDF-(1\.[0-7]|2\.0)\b/.test(bytes.toString("latin1",0,12))) reject();
      const end=/startxref\s+(\d+)\s+%%EOF\s*$/.exec(bytes.toString("latin1",Math.max(0,bytes.length-2048)));
      if (!end || Number(end[1])>=bytes.length || !/^(xref\b|\d+\s+\d+\s+obj\b)/.test(bytes.toString("latin1",Number(end[1]),Number(end[1])+45))) reject();
    } else await verifyImage(bytes,ext);
  } catch { reject(); }
}

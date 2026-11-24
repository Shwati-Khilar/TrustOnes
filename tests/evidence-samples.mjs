import sharp from "sharp";
import { crc32 } from "node:zlib";

export function pdf(text="Project references") {
  const content="BT /F1 12 Tf 50 700 Td ("+text+") Tj ET";
  const objects=["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    "<< /Length "+content.length+" >>\nstream\n"+content+"\nendstream","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let out="%PDF-1.4\n"; const offsets=[];
  objects.forEach((obj,i)=>{offsets.push(out.length);out+=(i+1)+" 0 obj\n"+obj+"\nendobj\n";});
  const start=out.length;
  out+="xref\n0 6\n0000000000 65535 f \n"+offsets.map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("");
  return Buffer.from(out+"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n"+start+"\n%%EOF\n");
}

export function image(format="png") {
  return sharp({create:{width:64,height:48,channels:3,background:"#985e43"}}).toFormat(format).toBuffer();
}

export function docx() {
  const entries=[
    ["[Content_Types].xml",'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels",'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml",'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Technical approach</w:t></w:r></w:p></w:body></w:document>'],
  ];
  const local=[],central=[]; let offset=0;
  for(const [key,text] of entries) {
    const name=Buffer.from(key),data=Buffer.from(text),crc=crc32(data);
    const l=Buffer.alloc(30),c=Buffer.alloc(46);
    l.writeUInt32LE(0x04034b50); l.writeUInt16LE(20,4); l.writeUInt32LE(crc,14);
    l.writeUInt32LE(data.length,18); l.writeUInt32LE(data.length,22); l.writeUInt16LE(name.length,26);
    c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20,4); c.writeUInt16LE(20,6); c.writeUInt32LE(crc,16);
    c.writeUInt32LE(data.length,20); c.writeUInt32LE(data.length,24); c.writeUInt16LE(name.length,28); c.writeUInt32LE(offset,42);
    local.push(l,name,data); central.push(c,name); offset+=l.length+name.length+data.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length,8); end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, FileText, Paperclip, X } from "lucide-react";
import { defaultEvidenceLimits, evidenceTypes, fileSize } from "@/lib/evidence-policy";

const panel="min-w-0 rounded-2xl border border-[#dfd2c2] bg-[#fffaf2] p-4";
const subtle="text-xs leading-5 text-[#685243]";
const typeLabel=file=>file.filename.split(".").pop().toUpperCase();

export function EvidenceList({files=[],title="Reference documents",empty}) {
  if (!files.length && !empty) return null;
  return <section className="min-w-0 space-y-2" aria-label={title}>
    <h3 className="text-sm font-bold text-[#513424]">{title} <span className="font-normal">({files.length})</span></h3>
    {!files.length && <p className={subtle}>{empty}</p>}
    <ul className="grid gap-2">{files.map(file=>{
      const url="/api/attachments/"+file.id;
      return <li key={file.id} className="flex min-w-0 flex-wrap items-center gap-3 rounded-xl border border-[#e3d5c5] bg-white px-3 py-2">
        {file.mediaType.startsWith("image/") ? <a href={url+"?view=preview"} target="_blank" rel="noreferrer" aria-label={"Preview "+file.filename}><Image unoptimized width={48} height={48} className="h-12 w-12 rounded object-cover" src={url+"?view=preview"} alt=""/></a> : <FileText aria-hidden="true" size={24}/>}
        <div className="min-w-0 flex-1 basis-32"><p className="break-all text-sm font-semibold">{file.filename}</p>
          <p className={subtle}>{typeLabel(file)} · {fileSize(file.byteSize)} · {file.uploader?.name}</p>
          <p className={subtle}>{({CLIENT_ONLY:"Client only",PROJECT_VIEWERS:"Eligible project viewers",PARTICIPANTS:"Negotiation participants"})[file.audience]}</p></div>
        <a className="inline-flex min-h-11 items-center gap-1 rounded px-2 text-sm font-semibold text-[#703923] underline" href={url} download aria-label={"Download "+file.filename}><Download size={15}/> Download</a>
      </li>;
    })}</ul></section>;
}

export function useEvidenceSelection() {
  const [items,setItems]=useState([]),[progress,setProgress]=useState(null);
  const token=useRef(null);
  const previews=useRef(new Map());
  useEffect(()=>{
    const urls=previews.current;
    return ()=>{for(const url of urls.values()) URL.revokeObjectURL(url); urls.clear();};
  },[]);
  function change(next) {
    const urls=previews.current;
    for(const [id,url] of urls) {
      if(!next.some(item=>item.id===id)) { URL.revokeObjectURL(url); urls.delete(id); }
    }
    const selected=next.map(item=>{
      if(!item.file.type.startsWith("image/")) return item;
      if(!urls.has(item.id)) urls.set(item.id,URL.createObjectURL(item.file));
      return {...item,preview:urls.get(item.id)};
    });
    token.current=null; setItems(selected); setProgress(null);
  }
  async function submit(url,method,payload) {
    if (!items.length) return fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const form=new FormData();
    form.set("payload",JSON.stringify(payload));
    for(const {file,audience} of items) form.append(audience,file,file.name);
    token.current ||= crypto.randomUUID();
    setProgress(0);
    try {
      return await new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest();
        xhr.open(method,url);
        xhr.setRequestHeader("X-Evidence-Batch",token.current);
        xhr.upload.onprogress=e=>{if(e.lengthComputable) setProgress(Math.round(e.loaded/e.total*100));};
        xhr.onload=()=>resolve(new Response(xhr.responseText,{status:xhr.status}));
        xhr.onerror=xhr.onabort=()=>reject(new Error("Upload interrupted. Check the saved record before retrying."));
        xhr.send(form);
      });
    } finally { setProgress(null); }
  }
  return {items,change,progress,submit};
}

export function EvidencePicker({selection,brief=false,disabled=false,existing=0}) {
  const [limits,setLimits]=useState(defaultEvidenceLimits),[error,setError]=useState("");
  const {items,change,progress}=selection;
  const max=brief?limits.briefCount:limits.revisionCount;
  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/attachments/policy",{signal:controller.signal}).then(r=>r.json()).then(data=>{if(data.data)setLimits(data.data);}).catch(()=>{});
    return ()=>controller.abort();
  },[]);
  function add(files) {
    if(disabled) return;
    const chosen=Array.from(files);
    if(existing+items.length+chosen.length>max) return setError("This resource allows up to "+max+" files.");
    for(const file of chosen) {
      const ext=file.name.split(".").pop().toLowerCase();
      if(!Object.hasOwn(evidenceTypes,ext) || evidenceTypes[ext]!==file.type) return setError("Choose a JPG, PNG, WebP, PDF or DOCX file.");
      if(!file.size || file.size>limits.fileBytes) return setError("Each file must be nonempty and at most "+fileSize(limits.fileBytes)+".");
    }
    if([...items.map(i=>i.file),...chosen].reduce((s,f)=>s+f.size,0)>=limits.requestBytes) return setError("The combined files exceed the request limit.");
    setError(""); change([...items,...chosen.map(file=>({file,id:crypto.randomUUID(),audience:brief?"CLIENT_ONLY":"PARTICIPANTS"}))]);
  }
  return <fieldset disabled={disabled} className={panel+" sm:col-span-2"} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();add(e.dataTransfer.files);}}>
    <legend className="px-1 text-sm font-bold text-[#623b29]">{brief?"Project reference files":"Supporting files"}</legend>
    <label className="block text-sm"><span className="flex items-center gap-1 font-semibold"><Paperclip size={16}/> Choose files or drop them here</span>
      <input className="mt-2 block w-full min-w-0 text-sm file:mr-2 file:rounded-lg file:bg-[#eee0cf] file:px-3 file:py-2" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.docx" onChange={e=>{add(e.target.files);e.target.value="";}}/></label>
    <p className={subtle}>JPG, PNG, WebP, PDF or DOCX · {fileSize(limits.fileBytes)} each · {max} files maximum</p>
    {items.length>0 && <ul className="mt-2 space-y-2">{items.map(item=><li key={item.id} className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg bg-white p-2">
      {item.preview && <Image unoptimized src={item.preview} alt="" width={40} height={40} className="h-10 w-10 rounded object-cover"/>}
      <span className="min-w-0 flex-1 basis-28 break-all text-sm">{item.file.name} · {fileSize(item.file.size)}</span>
      {brief && <select aria-label={"Access for "+item.file.name} value={item.audience} className="max-w-full rounded border p-2 text-xs" onChange={e=>change(items.map(i=>i===item?{...i,audience:e.target.value}:i))}>
        <option value="CLIENT_ONLY">Client only</option><option value="PROJECT_VIEWERS">Eligible project viewers</option></select>}
      <button type="button" aria-label={"Remove "+item.file.name} className="min-h-11 px-2" onClick={()=>change(items.filter(i=>i!==item))}><X size={16}/></button></li>)}</ul>}
    {error && <p role="alert" className="mt-2 text-sm text-[#91312c]">{error}</p>}
    {progress!==null && <p role="status" className="text-sm">{progress<100?"Uploading "+progress+"%":"Saving files and terms…"} <progress value={progress} max={100}/></p>}
  </fieldset>;
}

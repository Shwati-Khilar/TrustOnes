import assert from "node:assert/strict";
import test from "node:test";
import { descriptionBlocks, inlineParts, projectDate, projectMoney, projectPreview } from "../src/lib/project-presentation.js";

test("project briefs retain paragraphs, line breaks, headings and numbered or bulleted requirements", () => {
  const source = "Opening line\r\nSecond line\r\n\r\n## Requirements\n3. Layout\n4. Typography\n   in two sizes\n- Files\n- Guide";
  assert.deepEqual(descriptionBlocks(source), [
    {kind:"paragraph",text:"Opening line\nSecond line"},
    {kind:"heading",level:2,text:"Requirements"},
    {kind:"ol",start:3,items:["Layout","Typography\nin two sizes"]},
    {kind:"ul",start:1,items:["Files","Guide"]},
  ]);
  assert.deepEqual(descriptionBlocks(" \n "),[]);
  assert.equal(inlineParts("A **bold** and *italic* line").filter(x=>typeof x==="object").map(x=>x.kind).join(","),"strong,em");
});

test("project links allow HTTP(S) and keep HTML and unsupported schemes inert", () => {
  const parts = inlineParts('<i>literal</i> [guide](https://example.invalid/guide) [invalid](javascript:example) [local](file:///example)');
  assert.deepEqual(parts.filter(p=>p.kind==="a").map(p=>p.href),["https://example.invalid/guide"]);
  assert.ok(parts.some(p=>typeof p==="string" && p.includes("<i>literal</i>")));
});

test("compact previews strip supported markup, collapse whitespace and bound even unbroken words", () => {
  assert.equal(projectPreview("## Heading\n\n**Strong**\n- [Guide](https://example.invalid)"),"Heading Strong Guide");
  assert.equal(projectPreview(""),"No description provided.");
  assert.equal(projectPreview("X".repeat(500)).length,220);
  assert.ok(projectPreview("One phrase ".repeat(100)).endsWith("…"));
});

test("date-only and timestamp metadata use the UTC calendar day; INR retains fractions", () => {
  assert.equal(projectDate("2026-12-23"),"23 Dec 2026");
  assert.equal(projectDate("2026-12-23T23:59:59Z"),"23 Dec 2026");
  assert.equal(projectDate("2026-12-23T00:15:00+05:30"),"22 Dec 2026");
  assert.equal(projectDate(null),"Unspecified");
  assert.equal(projectMoney("48000.50"),"₹48,000.50");
});

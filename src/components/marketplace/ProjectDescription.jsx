import { descriptionBlocks, inlineParts } from "@/lib/project-presentation";

function inline(parts) {
  return parts.map((part, key) => {
    if (typeof part === "string") return part;
    if (part.kind === "br") return <br key={key}/>;
    if (part.kind === "a") return <a key={key} href={part.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-current/50 underline-offset-2">{inline(part.children)}</a>;
    const Tag = part.kind;
    return <Tag key={key}>{inline(part.children)}</Tag>;
  });
}

export default function ProjectDescription({ text, className = "" }) {
  const blocks = descriptionBlocks(text);
  return <div data-project-description className={"min-w-0 space-y-3 text-[15px] leading-7 [overflow-wrap:anywhere] " + className}>
    {!blocks.length && <p>No description provided.</p>}
    {blocks.map((block, key) => {
      if (block.items) {
        const List = block.kind;
        return <List key={key} start={List === "ol" ? block.start : undefined} className={"space-y-1 pl-6 marker:font-semibold " + (List === "ol" ? "list-decimal" : "list-disc")}>
          {block.items.map((item,i) => <li key={i}>{inline(inlineParts(item))}</li>)}
        </List>;
      }
      if (block.kind === "heading") {
        const Heading = "h" + Math.min(6, block.level + 2);
        return <Heading key={key} className="pt-2 text-base font-bold">{inline(inlineParts(block.text))}</Heading>;
      }
      return <p key={key}>{inline(inlineParts(block.text))}</p>;
    })}
  </div>;
}

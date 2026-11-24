const calendar = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
});
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger",
});

export function projectDate(value) {
  const day = value && new Date(value);
  return day && Number.isFinite(day.getTime()) ? calendar.format(day) : "Unspecified";
}

export function projectMoney(value) {
  return value != null && Number.isFinite(Number(value)) ? rupees.format(value) : "Unspecified";
}

// Empty aggregates in the portal summaries represent zero recorded INR.
export function formatCurrency(value) {
  return projectMoney(value ?? 0);
}

// Deliberately small Markdown vocabulary. Unrecognized syntax stays ordinary text.
const listItem = /^\s*(?:(\d{1,9})[.)]|[-+*])\s+(.+)$/;
export function descriptionBlocks(source = "") {
  const blocks = [];
  for (const line of (source || "").replace(/\r\n?/g, "\n").split("\n")) {
    if (!line.trim()) {
      if (blocks.at(-1)?.kind !== "space") blocks.push({ kind: "space" });
      continue;
    }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    const item = listItem.exec(line);
    const previous = blocks.at(-1);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
    } else if (item) {
      const kind = item[1] ? "ol" : "ul";
      if (previous?.kind === kind) previous.items.push(item[2]);
      else blocks.push({ kind, start: Number(item[1] || 1), items: [item[2]] });
    } else if (previous?.items && /^\s+/.test(line)) {
      previous.items[previous.items.length - 1] += "\n" + line.trimStart();
    } else if (previous?.kind === "paragraph") {
      previous.text += "\n" + line;
    } else blocks.push({ kind: "paragraph", text: line });
  }
  return blocks.filter(b => b.kind !== "space");
}

function webLink(value) {
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol) && /^https?:\/\//i.test(value)) return url.href;
  } catch { /* Keep an invalid destination as text. */ }
  return null;
}

export function inlineParts(text, depth = 0) {
  if (depth >= 4) return [text];
  const syntax = /\[([^\]\n]+)\]\(([^()\s]+)\)|(\*\*|__)(?=\S)(.+?)\3|(?<!\w)([*_])(?=\S)([^*\n_]+?)\5(?!\w)|https?:\/\/[^\s<>]+|\n/g;
  let offset = 0;
  const parts = [];
  for (const match of text.matchAll(syntax)) {
    parts.push(text.slice(offset, match.index));
    offset = match.index + match[0].length;
    if (match[1]) {
      const href = webLink(match[2]);
      parts.push(href ? {kind:"a", href, children:[match[1]]} : match[1]);
    } else if (match[3] || match[5]) {
      parts.push({kind: match[3] ? "strong" : "em", children:inlineParts(match[4] || match[6], depth + 1)});
    } else if (match[0] === "\n") {
      parts.push({kind:"br"});
    } else {
      const address = match[0].replace(/[.,;!?)]*$/, "");
      const href = webLink(address);
      parts.push(href ? {kind:"a", href, children:[address]} : address, match[0].slice(address.length));
    }
  }
  return [...parts, text.slice(offset)];
}

function plain(parts) {
  return parts.map(part => typeof part === "string" ? part : part.children ? plain(part.children) : " ").join("");
}
export function projectPreview(description, limit = 220) {
  const text = descriptionBlocks(description).flatMap(block => block.items || [block.text])
    .map(line => plain(inlineParts(line))).join(" ").replace(/\s+/g," ").trim();
  if (!text) return "No description provided.";
  if (text.length <= limit) return text;
  const head = text.slice(0, limit - 1);
  return (head.replace(/\s+\S*$/, "") || head) + "…";
}

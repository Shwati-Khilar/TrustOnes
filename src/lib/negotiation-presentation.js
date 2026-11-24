const instant = new Intl.DateTimeFormat("en-GB", {
  timeZone:"UTC", day:"numeric", month:"short", year:"numeric",
  hour:"2-digit", minute:"2-digit", hourCycle:"h23",
});

export const statusLabels = {
  PENDING:"Pending", ACCEPTED:"Accepted", REJECTED:"Rejected", WITHDRAWN:"Withdrawn", CLOSED:"Closed",
};

export function offerTime(value) {
  const date = value && new Date(value);
  return date && Number.isFinite(date.getTime()) ? instant.format(date)+" UTC" : "Time unavailable";
}

export function deliveryDays(days) {
  return days+" "+(days === 1 ? "day" : "days");
}

export function party(thread, id) {
  if (id === thread.freelancerId) return {role:"Freelancer", person:thread.freelancer};
  if (id === thread.project.clientId) return {role:"Client", person:thread.project.client};
  return null;
}

export function threadOrigin(thread) {
  return thread.kind === "INVITATION" ? "Client" : "Freelancer";
}

export function responseOwner(thread, latest) {
  if (thread.status !== "PENDING" || !latest) return null;
  return party(thread,latest.recipientId);
}

export function noteLabel(kind, version) {
  return kind === "PROPOSAL" && version === 1 ? "Cover letter" : "Negotiation note";
}

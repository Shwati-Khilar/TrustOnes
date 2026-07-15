"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  ImagePlus,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

const conversations = [
  {
    id: "conv-1",
    client: "Cara Wilson",
    clientEmail: "cara@trustones.demo",
    project: "TrustOnes Client Portal",
    projectId: "trustones-client-portal",
    status: "ACTIVE",
    avatar: "C",
    unread: 2,
    lastMessage:
      "Please prioritize backend API integration before the submission review flow.",
    lastTime: "10:30 AM",
    budget: "₹42,000",
    deadline: "30 Jun 2026",
    funded: "₹18,500",
  },
  {
    id: "conv-2",
    client: "MedLink Labs",
    clientEmail: "ops@medlinklabs.com",
    project: "Healthcare Appointment UI",
    projectId: "healthcare-dashboard-ui",
    status: "ACCEPTED",
    avatar: "M",
    unread: 1,
    lastMessage:
      "Can you check the mobile layout once before we confirm the milestone?",
    lastTime: "Yesterday",
    budget: "₹30,000",
    deadline: "10 Jul 2026",
    funded: "₹6,000",
  },
  {
    id: "conv-3",
    client: "Ananya Studio",
    clientEmail: "hello@ananyastudio.in",
    project: "Portfolio Website Redesign",
    projectId: "portfolio-redesign",
    status: "NEGOTIATING",
    avatar: "A",
    unread: 0,
    lastMessage: "Let us finalize the revision count before moving ahead.",
    lastTime: "2 days ago",
    budget: "₹12,500",
    deadline: "02 Jul 2026",
    funded: "₹0",
  },
];

const messagesByConversation = {
  "conv-1": [
    {
      id: 1,
      type: "system",
      text: "Milestone Backend API Integration was marked as funded.",
      time: "09:45 AM",
    },
    {
      id: 2,
      sender: "Cara Wilson",
      role: "client",
      text: "Please prioritize backend API integration before the submission review flow.",
      time: "10:30 AM",
      mine: false,
    },
    {
      id: 3,
      sender: "You",
      role: "freelancer",
      text: "Sure, I’ll complete and submit the API integration milestone first.",
      time: "10:35 AM",
      mine: true,
    },
    {
      id: 4,
      sender: "Cara Wilson",
      role: "client",
      text: "Great. Please also mention the endpoints connected in your submission notes.",
      time: "10:38 AM",
      mine: false,
    },
  ],
  "conv-2": [
    {
      id: 1,
      sender: "MedLink Labs",
      role: "client",
      text: "Can you check the mobile layout once before we confirm the milestone?",
      time: "Yesterday",
      mine: false,
    },
    {
      id: 2,
      sender: "You",
      role: "freelancer",
      text: "Yes, I’ll review the spacing and send a quick update.",
      time: "Yesterday",
      mine: true,
    },
  ],
  "conv-3": [
    {
      id: 1,
      sender: "Ananya Studio",
      role: "client",
      text: "Let us finalize the revision count before moving ahead.",
      time: "2 days ago",
      mine: false,
    },
  ],
};

const activityNotes = [
  {
    id: 1,
    title: "Payment verified",
    text: "Backend API Integration milestone is now funded.",
    time: "09:45 AM",
    icon: Wallet,
  },
  {
    id: 2,
    title: "Deal room active",
    text: "Project workspace is active and ready for submissions.",
    time: "Yesterday",
    icon: Handshake,
  },
  {
    id: 3,
    title: "Deadline approaching",
    text: "Next milestone deadline is tomorrow.",
    time: "2 days ago",
    icon: CalendarClock,
  },
];

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    ACCEPTED: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    NEGOTIATING: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.ACTIVE
      }`}
    >
      {status}
    </span>
  );
}

export default function FreelancerMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState("conv-1");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const query = searchTerm.toLowerCase();

      return (
        conversation.client.toLowerCase().includes(query) ||
        conversation.project.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  const activeMessages = messagesByConversation[selectedConversationId] || [];

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Messages
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Keep every client conversation project-linked.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Discuss scope, milestones, submissions, and clarifications with
            clients while keeping communication connected to the deal room.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
          <Bell size={18} />
          3 unread messages
        </button>
      </section>

      <section className="grid min-h-[720px] gap-6 xl:grid-cols-[360px_1fr_340px]">
        <aside className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Conversations
            </h2>
            <p className="mt-1 text-sm font-medium text-[#9b7a64]">
              Project-based client chats
            </p>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3">
            <Search size={17} className="text-[#9b7a64]" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
            />
          </div>

          <div className="space-y-3">
            {filteredConversations.map((conversation) => {
              const active = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full rounded-[1.4rem] border p-4 text-left transition ${
                    active
                      ? "border-[#6f2e1c] bg-[#fff7ed] shadow-sm"
                      : "border-[#eadfd2] bg-[#fffaf3] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        active
                          ? "bg-[#6f2e1c] text-white"
                          : "bg-white text-[#6f2e1c]"
                      }`}
                    >
                      {conversation.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-black text-[#24130c]">
                          {conversation.client}
                        </h3>

                        <span className="shrink-0 text-[11px] font-bold text-[#b79d88]">
                          {conversation.lastTime}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs font-bold text-[#9b7a64]">
                        {conversation.project}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7c6858]">
                        {conversation.lastMessage}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <StatusBadge status={conversation.status} />

                        {conversation.unread > 0 && (
                          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#6f2e1c] px-2 text-[11px] font-black text-white">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-h-[720px] flex-col overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-white/80 shadow-sm">
          <div className="border-b border-[#eadfd2] bg-[#fffaf3] p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6f2e1c] text-base font-black text-white">
                  {selectedConversation?.avatar}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                      {selectedConversation?.client}
                    </h2>
                    <StatusBadge status={selectedConversation?.status} />
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                    {selectedConversation?.project}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#b79d88]">
                    {selectedConversation?.clientEmail}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                  <Handshake size={17} />
                  Deal Room
                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#eadfd2] bg-white text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {activeMessages.map((message) => {
              if (message.type === "system") {
                return (
                  <div
                    key={message.id}
                    className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-full border border-[#eadfd2] bg-[#fffaf3] px-4 py-2 text-xs font-bold text-[#7c6858]"
                  >
                    <ShieldCheck size={14} className="text-[#047857]" />
                    {message.text}
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.mine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[76%] rounded-[1.4rem] px-4 py-3 shadow-sm ${
                      message.mine
                        ? "bg-[#6f2e1c] text-white"
                        : "border border-[#eadfd2] bg-[#fffaf3] text-[#24130c]"
                    }`}
                  >
                    <p className="text-sm leading-6">{message.text}</p>

                    <div
                      className={`mt-2 flex items-center gap-2 text-[11px] font-bold ${
                        message.mine ? "text-white/55" : "text-[#b79d88]"
                      }`}
                    >
                      <Clock3 size={12} />
                      {message.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#eadfd2] bg-[#fffaf3] p-4">
            <div className="flex items-end gap-3">
              <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                <Paperclip size={19} />
              </button>

              <button className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white text-[#6f2e1c] transition hover:bg-[#fff7ed] sm:flex">
                <ImagePlus size={19} />
              </button>

              <textarea
                rows={1}
                placeholder="Write a message about scope, milestones, or submission..."
                className="min-h-12 flex-1 resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
              />

              <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
                <Send size={19} />
              </button>
            </div>
          </div>
        </main>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Project Context
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[#fffaf3] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                  Project
                </p>
                <p className="mt-1 text-sm font-black text-[#24130c]">
                  {selectedConversation?.project}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                    Budget
                  </p>
                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {selectedConversation?.budget}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                    Funded
                  </p>
                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {selectedConversation?.funded}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#fffaf3] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                  Deadline
                </p>
                <p className="mt-1 text-sm font-black text-[#24130c]">
                  {selectedConversation?.deadline}
                </p>
              </div>
            </div>

            <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] text-sm font-black text-white transition hover:bg-[#5b2416]">
              Open Deal Room
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Keep it inside.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Project-linked communication helps create a clean proof trail for
              scope, revisions, deadlines, and disputes.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Discuss milestone changes here",
                "Avoid scattered external proof",
                "Keep payment questions visible",
                "Use deal room for final actions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#f4b454]" />
                  <p className="text-sm font-semibold text-white/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Recent Room Activity
            </h2>

            <div className="mt-5 space-y-4">
              {activityNotes.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                      <Icon size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-[#24130c]">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-[#7c6858]">
                        {activity.text}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#b79d88]">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
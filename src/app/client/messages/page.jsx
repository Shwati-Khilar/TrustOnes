"use client";

import { useState } from "react";
import { MessageSquare, Search, Send } from "lucide-react";

const initialConversations = [
  {
    id: "c1",
    name: "Ada Chen",
    project: "E-Commerce Platform",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    messages: [
      {
        id: "m1",
        from: "them",
        text: "I pushed the checkout flow update. Could you review the preview link I shared?",
        time: "10:24 AM",
      },
      {
        id: "m2",
        from: "me",
        text: "Looks good. I will approve the milestone once the payment step is tested.",
        time: "10:31 AM",
      },
      {
        id: "m3",
        from: "them",
        text: "Perfect, testing it now and I will send the final note shortly.",
        time: "10:36 AM",
      },
    ],
  },
  {
    id: "c2",
    name: "Marco Rivera",
    project: "Logo Design",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    messages: [
      {
        id: "m4",
        from: "them",
        text: "Uploaded three logo directions to the milestone submission.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "c3",
    name: "Priya Nair",
    project: "Mobile App MVP",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    messages: [
      {
        id: "m5",
        from: "them",
        text: "Can we extend the second milestone by two days? The API sandbox was down.",
        time: "2 days ago",
      },
    ],
  },
];

export default function ClientMessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  const visibleConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSend(event) {
    event.preventDefault();

    const text = draft.trim();

    if (!text) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: `local-${Date.now()}`,
                  from: "me",
                  text,
                  time: new Date().toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : conversation
      )
    );

    setDraft("");
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
          Inbox
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
          Messages
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
          Discuss scope, share previews, and keep a written record of every
          project decision.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-3 py-2">
            <Search size={16} className="text-[#7c6858]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#806049]"
            />
          </div>

          <div className="mt-4 space-y-2">
            {visibleConversations.map((conversation) => {
              const active = conversation.id === activeId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20"
                      : "hover:bg-[#f3eadf]"
                  }`}
                >
                  <img
                    src={conversation.image}
                    alt={conversation.name}
                    className="h-10 w-10 shrink-0 rounded-xl border border-[#eadfd2] object-cover"
                  />

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-black ${
                        active ? "text-white" : "text-[#24130c]"
                      }`}
                    >
                      {conversation.name}
                    </p>

                    <p
                      className={`truncate text-xs font-semibold ${
                        active ? "text-white/65" : "text-[#7c6858]"
                      }`}
                    >
                      {conversation.project}
                    </p>
                  </div>
                </button>
              );
            })}

            {visibleConversations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#d7c3b2] p-4 text-center text-sm font-bold text-[#7c6858]">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col rounded-[2rem] border border-[#eadfd2] bg-white/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eadfd2] px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.image}
                alt={activeConversation.name}
                className="h-10 w-10 rounded-xl border border-[#eadfd2] object-cover"
              />

              <div>
                <p className="text-sm font-black text-[#24130c]">
                  {activeConversation.name}
                </p>

                <p className="text-xs font-semibold text-[#7c6858]">
                  {activeConversation.project}
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#b45309]">
              <MessageSquare size={14} />
              Escrow protected
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {activeConversation.messages.map((message) => {
              const mine = message.from === "me";

              return (
                <div
                  key={message.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      mine
                        ? "bg-[#6f2e1c] text-white"
                        : "border border-[#eadfd2] bg-[#fffaf3] text-[#2b1810]"
                    }`}
                  >
                    <p>{message.text}</p>

                    <p
                      className={`mt-1 text-[11px] font-semibold ${
                        mine ? "text-white/55" : "text-[#7c6858]"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-[#eadfd2] px-6 py-4"
          >
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message..."
              className="w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#806049] focus:border-[#6f2e1c]"
            />

            <button
              type="submit"
              className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-4 text-sm font-black text-white transition hover:bg-[#5b2416]"
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

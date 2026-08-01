"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Handshake,
  Inbox,
  MessageSquare,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

function StatusBadge({ status }) {
  const value = String(status || "ACTIVE");

  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    OPEN: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CANCELLED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        styles[value] || styles.ACTIVE
      }`}
    >
      {value.split("_").join(" ")}
    </span>
  );
}

function getProjectTitle(room) {
  return room?.title || room?.project?.title || room?.projectTitle || "Deal Room";
}

function getClientName(room) {
  return (
    room?.client?.name ||
    room?.clientName ||
    room?.client ||
    room?.project?.client?.name ||
    "Client"
  );
}

function getClientEmail(room) {
  return room?.client?.email || room?.clientEmail || room?.project?.client?.email || "";
}

function getBudget(room) {
  return (
    room?.budgetDisplay ||
    room?.budget ||
    room?.amountDisplay ||
    room?.summary?.budgetDisplay ||
    "₹0"
  );
}

function getFunded(room) {
  return (
    room?.fundedAmountDisplay ||
    room?.approvedAmountDisplay ||
    room?.summary?.approvedAmountDisplay ||
    "₹0"
  );
}

function getDeadline(room) {
  return (
    room?.deadlineDisplay ||
    room?.deadline ||
    room?.dueDateDisplay ||
    room?.summary?.deadlineDisplay ||
    "No deadline"
  );
}

function getRoomId(room) {
  return room?.id || room?.projectId || room?.project?.id;
}

function getInitial(value) {
  return String(value || "C").charAt(0).toUpperCase();
}

export default function FreelancerMessagesPage() {
  const [roomsData, setRoomsData] = useState({
    dealRooms: [],
    stats: {},
  });
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDealRooms() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/freelancer/deal-rooms", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load deal rooms.");
        }

        const data = result.data || {};
        const rooms = data.dealRooms || data.rooms || data.projects || [];

        if (!ignore) {
          setRoomsData({
            ...data,
            dealRooms: rooms,
          });

          if (rooms.length > 0) {
            setSelectedRoomId(getRoomId(rooms[0]));
          }
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load deal rooms.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDealRooms();

    return () => {
      ignore = true;
    };
  }, []);

  const rooms = roomsData.dealRooms || [];

  const filteredRooms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return rooms;

    return rooms.filter((room) => {
      return (
        getProjectTitle(room).toLowerCase().includes(query) ||
        getClientName(room).toLowerCase().includes(query) ||
        getClientEmail(room).toLowerCase().includes(query)
      );
    });
  }, [rooms, searchTerm]);

  const selectedRoom =
    filteredRooms.find((room) => getRoomId(room) === selectedRoomId) ||
    filteredRooms[0] ||
    null;

  const selectedRoomHref = selectedRoom
    ? `/freelancer/deal-rooms/${getRoomId(selectedRoom)}`
    : "/freelancer/deal-rooms";

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading project-linked messages...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#24130c]">
            Unable to load messages
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#b91c1c]">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

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
            Real message storage is not added yet. This page now shows
            conversation-ready deal rooms instead of fake static messages.
          </p>
        </div>

        <Link
          href="/freelancer/deal-rooms"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Handshake size={18} />
          Open Deal Rooms
        </Link>
      </section>

      <section className="grid min-h-[720px] gap-6 xl:grid-cols-[360px_1fr_340px]">
        <aside className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Conversation-Ready Rooms
            </h2>

            <p className="mt-1 text-sm font-medium text-[#9b7a64]">
              Active project workspaces
            </p>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3">
            <Search size={17} className="text-[#9b7a64]" />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects or clients..."
              className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
            />
          </div>

          <div className="space-y-3">
            {filteredRooms.map((room) => {
              const roomId = getRoomId(room);
              const active = roomId === selectedRoomId;
              const clientName = getClientName(room);

              return (
                <button
                  type="button"
                  key={roomId}
                  onClick={() => setSelectedRoomId(roomId)}
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
                      {getInitial(clientName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-black text-[#24130c]">
                          {clientName}
                        </h3>

                        <MessageSquare size={15} className="text-[#b79d88]" />
                      </div>

                      <p className="mt-1 truncate text-xs font-bold text-[#9b7a64]">
                        {getProjectTitle(room)}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7c6858]">
                        Message thread will be available after Message model/API
                        is added.
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <StatusBadge status={room.status || "ACTIVE"} />
                        <span className="text-[11px] font-black text-[#9b7a64]">
                          0 unread
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredRooms.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-6 text-center">
                <Inbox size={24} className="mx-auto text-[#6f2e1c]" />

                <h3 className="mt-4 text-lg font-black text-[#24130c]">
                  No rooms found
                </h3>

                <p className="mt-2 text-sm text-[#7c6858]">
                  Active deal rooms will appear here after client assignment.
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-h-[720px] flex-col overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-white/80 shadow-sm">
          <div className="border-b border-[#eadfd2] bg-[#fffaf3] p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6f2e1c] text-base font-black text-white">
                  {getInitial(getClientName(selectedRoom))}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                      {getClientName(selectedRoom)}
                    </h2>

                    <StatusBadge status={selectedRoom?.status || "ACTIVE"} />
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                    {getProjectTitle(selectedRoom)}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#b79d88]">
                    {getClientEmail(selectedRoom) || "Client email not shown"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={selectedRoomHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                >
                  <Handshake size={17} />
                  Deal Room
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-xl rounded-[2rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                <MessageSquare size={28} />
              </div>

              <h3 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                Messaging backend is not connected yet
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#7c6858]">
                I removed the fake static conversations. This page now shows
                project-linked rooms only. Real chat needs `Conversation`,
                `Message`, and attachment models after submit-work flow is
                completed.
              </p>

              <Link
                href={selectedRoomHref}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
              >
                Open Deal Room
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#eadfd2] bg-[#fffaf3] p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white p-4">
              <ShieldCheck size={18} className="shrink-0 text-[#047857]" />

              <p className="text-sm font-semibold text-[#7c6858]">
                Message sending is disabled until the real Message API is added.
                This prevents fake UI behavior.
              </p>
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
                  {getProjectTitle(selectedRoom)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {getBudget(selectedRoom)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                    Funded
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {getFunded(selectedRoom)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#fffaf3] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                  Deadline
                </p>

                <p className="mt-1 text-sm font-black text-[#24130c]">
                  {getDeadline(selectedRoom)}
                </p>
              </div>
            </div>

            <Link
              href={selectedRoomHref}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] text-sm font-black text-white transition hover:bg-[#5b2416]"
            >
              Open Deal Room
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Keep it inside.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Project-linked communication will create a clean proof trail for
              scope, revisions, deadlines, and disputes once the Message model is
              added.
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
              Next Message Module
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "Conversation",
                  text: "One thread per active deal room.",
                  icon: Handshake,
                },
                {
                  title: "Message",
                  text: "Text messages with sender, project, timestamps.",
                  icon: MessageSquare,
                },
                {
                  title: "Attachments",
                  text: "Proof files and safe project communication evidence.",
                  icon: Wallet,
                },
                {
                  title: "Activity logs",
                  text: "Used later in disputes and admin review.",
                  icon: CalendarClock,
                },
              ].map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.title} className="flex gap-4">
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
                        Later
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
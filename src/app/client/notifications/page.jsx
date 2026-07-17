"use client";

import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

import NotificationHero from "@/components/client/NotificationContents/NotificationHero";
import NotificationStats from "@/components/client/NotificationContents/NotificationStats";
import NotificationCenter from "@/components/client/NotificationContents/NotificationCenter";
import NotificationSidebar from "@/components/client/NotificationContents/NotificationSidebar";

export default function NotificationsPage() {
  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">

        <div className="p-8">

          <NotificationHero />

          <div className="mt-6">
            <NotificationStats />
          </div>

          {/* THIS GOES HERE */}

          <div className="grid grid-cols-[2fr_0.9fr] gap-6 mt-6">

            <NotificationCenter />

            <NotificationSidebar />

          </div>

        </div>

      </main>
    </>
  );
}
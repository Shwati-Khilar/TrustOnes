"use client";

import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

import SettingsHero from "@/components/client/SettingsContents/SettingsHero";
import SettingsContent from "@/components/client/SettingsContents/SettingsContent";

export default function SettingsPage() {
  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-8">

          <SettingsHero />

          <SettingsContent />

        </div>
      </main>
    </>
  );
}
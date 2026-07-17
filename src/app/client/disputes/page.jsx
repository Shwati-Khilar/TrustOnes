"use client";

import ClientSidebar from "../../../components/client/ClientSidebar";
import ClientTopNav from "../../../components/client/ClientTopNav";

import DisputeHero from "../../../components/client/DisputeContents/DisputeHero";
import DisputeStats from "../../../components/client/DisputeContents/DisputeStats";
import DisputeTable from "../../../components/client/DisputeContents/DisputeTable";

import { disputes } from "../../../components/client/DisputeContents/DisputeData";

export default function DisputesPage() {
  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-8">

          <DisputeHero />

          <DisputeStats />

          <DisputeTable
            disputes={disputes}
          />

        </div>
      </main>
    </>
  );
}
"use client";


import DisputeHero from "../../../components/client/DisputeContents/DisputeHero";
import DisputeStats from "../../../components/client/DisputeContents/DisputeStats";
import DisputeTable from "../../../components/client/DisputeContents/DisputeTable";

import { disputes } from "../../../components/client/DisputeContents/DisputeData";

export default function DisputesPage() {
  return (
    <>



      <section>
        <div className="p-8">

          <DisputeHero />

          <DisputeStats />

          <DisputeTable
            disputes={disputes}
          />

        </div>
      </section>
    </>
  );
}
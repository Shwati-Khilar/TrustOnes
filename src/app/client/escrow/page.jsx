"use client";

import { useState } from "react";

import ClientSidebar from "../../../components/client/ClientSidebar";
import ClientTopNav from "../../../components/client/ClientTopNav";

import EscrowHero from "../../../components/client/EscrowContents/EscrowHero";
import EscrowStats from "../../../components/client/EscrowContents/EscrowStats";
import EscrowTable from "../../../components/client/EscrowContents/EscrowTable";
import EscrowInsights from "../../../components/client/EscrowContents/EscrowInsights";
import TransactionHistory from "../../../components/client/EscrowContents/TransactionHistory";

import { escrows } from "../../../components/client/EscrowContents/EscrowData";

export default function EscrowPage() {

    const [activeStatus, setActiveStatus] =
        useState("All");

    const filteredEscrows =
        activeStatus === "All"
            ? escrows
            : escrows.filter(
                (e) => e.status === activeStatus
            );

    return (
        <>
            <ClientSidebar />
            <ClientTopNav />

            <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">

                <div className="p-8">

                    <EscrowHero />

                    <EscrowStats />

                    <EscrowInsights />

                    <EscrowTable
                        escrows={filteredEscrows}
                        activeStatus={activeStatus}
                        setActiveStatus={setActiveStatus}
                    />

                    <TransactionHistory />

                </div>

            </main>
        </>
    );
}
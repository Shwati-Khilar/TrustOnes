"use client";

export default function MarketError({ reset }) {
  return (
    <section className="space-y-3 rounded-2xl border border-[#eadfd2] bg-white/80 p-5" role="alert">
      <h2 className="text-xl font-bold">Unable to load this workspace</h2>
      <p>Try again to load the latest project information.</p>
      <button onClick={reset} className="rounded-xl bg-[#6f2e1c] px-4 py-2 font-bold text-white">Try again</button>
    </section>
  );
}

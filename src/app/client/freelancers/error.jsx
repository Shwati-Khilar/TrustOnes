"use client";

export default function DirectoryError({reset}) {
  return <section role="alert" className="space-y-3 rounded-2xl border border-[#dfd1be] bg-[#fffdf8] p-5">
    <h2 className="text-xl font-bold">Unable to load freelancer information</h2>
    <button onClick={reset} className="rounded-xl bg-[#753b28] px-4 py-3 font-semibold text-white">Try again</button>
  </section>;
}

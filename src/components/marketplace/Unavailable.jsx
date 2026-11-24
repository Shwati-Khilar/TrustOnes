export default function Unavailable({title,description}) {
  return <section className="mx-auto max-w-[1480px] space-y-5"><h1 className="text-3xl font-black tracking-tight text-[#24130c]">{title}</h1>
    <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-7 shadow-sm"><p className="font-semibold text-[#7c6858]">{description}</p></div></section>;
}

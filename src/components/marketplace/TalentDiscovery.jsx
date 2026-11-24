import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, MapPin, Search, Send } from "lucide-react";
import { projectMoney } from "@/lib/project-presentation";
import ProfessionalAvatar from "./ProfessionalAvatar";
import OfferForm from "./OfferForm";
import s from "./talent.module.css";

const availability = { AVAILABLE:"Available", BUSY_OPEN:"Busy", NOT_AVAILABLE:"Not available" };

function Availability({value}) {
  return <div className={s.status}>
    <span data-state={value}><small>Availability</small> <b>{availability[value] || "Unspecified"}</b></span>
    {value === "BUSY_OPEN" && <span><small>Invitations</small> <b>Open to offers</b></span>}
  </div>;
}

function portfolioLinks(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap(entry => {
    try {
      const url = new URL(entry.url);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return [];
      return [{url:url.href, host:url.hostname, label:entry.label?.trim() || url.hostname}];
    } catch { return []; }
  });
}

function Skills({skills = [], compact = false}) {
  if (!skills.length) return null;
  const visible = compact ? skills.slice(0, 3) : skills;
  return <ul className={s.skills} aria-label="Skills">
    {visible.map((skill,i) => <li key={i}>{skill}</li>)}
    {skills.length > visible.length && <li aria-label={(skills.length-visible.length)+" more skills"}>+{skills.length-visible.length}</li>}
  </ul>;
}

function Experience({value}) {
  if (!value) return null;
  return <span><BriefcaseBusiness size={15} aria-hidden="true"/>{value[0]+value.slice(1).toLowerCase()} level</span>;
}

function Location({value}) {
  return value && <span><MapPin size={15} aria-hidden="true"/>{value}</span>;
}

function FreelancerCard({worker}) {
  const profile = worker.freelancerProfile || {};
  const name = worker.name || "Freelancer";
  const href = "/client/freelancers/"+worker.id;
  return <article className={s.card}>
    <div className={s.identity}><ProfessionalAvatar name={name} image={worker.image}/>
      <div><h2>{name}</h2><p>{profile.professionalTitle || "Freelancer"}</p></div>
    </div>
    <div className={s.cardBody}>
      <Availability value={profile.availability}/>
      {profile.bio && <p className={s.excerpt}>{profile.bio}</p>}
      <Skills skills={profile.skills} compact/>
      <div className={s.meta}><Experience value={profile.experienceLevel}/><Location value={profile.location}/></div>
    </div>
    <footer className={s.cardFoot}>
      {profile.startingPrice != null && <p>Starting from <strong>{projectMoney(profile.startingPrice)}</strong></p>}
      <div className={s.actions}>
        <Link href={href} className={s.primary}>View profile <ArrowRight size={15}/></Link>
        {worker.canInvite && <Link href={href+"#invite"} className={s.secondary}><Send size={14}/> Invite</Link>}
      </div>
    </footer>
  </article>;
}

export function TalentDirectory({query, data, error, pager}) {
  const filtered = Boolean(query.q || query.availability || query.page);
  return <div className={s.surface}>
    <header className={s.intro}><h1>Find freelancers</h1><p>Explore professional profiles and invite talent to your project.</p></header>
    <form className={s.search} action="/client/freelancers" role="search">
      <label>Name, title or skill<div className={s.searchInput}><Search size={18}/><input type="search" name="q" defaultValue={query.q} maxLength={150} placeholder="Search freelancers"/></div></label>
      <div className={s.filter}><label htmlFor="directory-availability">Availability</label><select id="directory-availability" name="availability" defaultValue={query.availability || ""}>
        <option value="">All availabilities</option><option value="AVAILABLE">Available</option><option value="BUSY_OPEN">Busy, open to offers</option><option value="NOT_AVAILABLE">Not available</option></select></div>
      <button className={s.primary}>Search</button>
    </form>
    {error && <div role="alert" className={s.panel}>{error} <Link href="/client/freelancers">Reset filters</Link></div>}
    {data && <>
      <div className={s.results}><strong>{data.total} {data.total === 1 ? "freelancer" : "freelancers"}</strong>
        {filtered && <Link href="/client/freelancers">Clear filters</Link>}</div>
      {data.items.length ? <div className={s.grid}>{data.items.map(worker => <FreelancerCard key={worker.id} worker={worker}/>)}</div> :
        <section className={s.panel}><h2>{data.total ? "No profiles on this page" : "No matching freelancers"}</h2>
          <p>{data.total ? "Use the page links to return to earlier results." : filtered ? "Try another name, skill or availability." : "Visible professional profiles will appear here."}</p></section>}
      {pager}
    </>}
  </div>;
}

export function ProfessionalProfile({worker, projects}) {
  const p = worker.freelancerProfile || {};
  const name = worker.name || "Freelancer";
  const links = portfolioLinks(p.portfolioLinks);
  return <div className={s.surface}>
    <Link href="/client/freelancers" className={s.back}><ArrowLeft size={16}/> Freelancer directory</Link>
    <header className={s.hero}>
      <div className={s.identity}><ProfessionalAvatar large name={name} image={worker.image}/>
        <div><h1>{name}</h1><p>{p.professionalTitle || "Freelancer"}</p></div></div>
      <div className={s.heroFoot}><div className={s.meta}><Location value={p.location}/><Experience value={p.experienceLevel}/></div>
        {projects.length > 0 && <a className={s.heroAction} href="#invite"><Send size={16}/> Invite to project</a>}</div>
    </header>
    <div className={s.columns}>
      <article className={s.sections}>
        <section><h2>Professional details</h2><Availability value={p.availability}/>
          <dl className={s.facts}>{p.startingPrice != null && <div><dt>Starting price</dt><dd>{projectMoney(p.startingPrice)}</dd></div>}
            <div><dt>Reviews</dt><dd>Unrated</dd></div></dl></section>
        {p.bio && <section><h2>About</h2><p className={s.bio}>{p.bio}</p></section>}
        {p.skills?.length > 0 && <section><h2>Skills and expertise</h2><Skills skills={p.skills}/></section>}
        {links.length > 0 && <section><h2>Portfolio</h2><ul className={s.portfolio}>{links.map(({url,host,label},i) =>
          <li key={i}><a href={url} target="_blank" rel="noopener noreferrer"><span><strong>{label}</strong><small>{host}</small></span><ArrowUpRight size={18}/></a></li>)}</ul></section>}
        {p.educationHighlight && <section><h2>Education</h2><p>{p.educationHighlight}</p></section>}
      </article>
      <section id="invite" tabIndex={-1} className={s.invite}><h2>Invite to a project</h2>
        {projects.length ? <><p>Choose your published project and share the terms with {name}.</p>
          <OfferForm mode="invitation" portal="client" workerId={worker.id} projects={projects}/></> :
          <><p>You have no eligible published projects for this freelancer.</p>
            <div className={s.emptyActions}><Link href="/client/projects/create">Create a project</Link><Link href="/client/projects">Manage projects</Link><Link href="/client/offers">View negotiations</Link></div></>}
      </section>
    </div>
  </div>;
}

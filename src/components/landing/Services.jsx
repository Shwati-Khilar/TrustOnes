'use client';
import { useEffect, useRef } from 'react';

const services = [
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>),
    title: 'Full-Stack Development',
    desc: 'Scalable, high-performance web applications built with the latest modern frameworks.',
  },
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 10c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/></svg>),
    title: 'AI Integration',
    desc: 'Leveraging LLMs and generative AI to automate workflows and enhance user experiences.',
  },
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8.5L4.5 10 7 11.5M13 8.5l2.5 1.5L13 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 7.5l-1 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
    title: 'UI/UX Craftsmanship',
    desc: 'Pixel-perfect interfaces designed for maximum conversion and user satisfaction.',
  },
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2L3 5.5v5c0 4 2.8 7.7 7 8.5 4.2-.8 7-4.5 7-8.5v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    title: 'API Architectures',
    desc: 'Robust, secure, and well-documented API systems for seamless data flow.',
  },
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M2 6l8-3 8 3v7l-8 4-8-4V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 3v14M2 6l8 4 8-4" stroke="currentColor" strokeWidth="1.5"/></svg>),
    title: 'Cloud Deployment',
    desc: 'Automated CI/CD pipelines and infrastructure scaling on AWS, Vercel, or GCP.',
  },
  {
    icon: (<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M2 11h3l2.5-7 3 13 2.5-6H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    title: 'Real-Time Apps',
    desc: 'Sub-second latency experiences using WebSockets and serverless edge functions.',
  },
];

export default function Services() {
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }, { threshold: 0.1 });
    [headRef.current, gridRef.current].forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" style={{ background: 'var(--bg)', padding: '110px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--gold)', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)', marginBottom: 12,
          }}>What We Do</p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 12,
          }}>Precision Services</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto' }}>
            Specialized engineering for ambitious digital products.
          </p>
        </div>

        {/* 3-col grid with better spacing */}
        <div ref={gridRef} className="reveal reveal-delay-1" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {services.map((s, i) => (
            <div
              key={s.title}
              className="service-card card-lift"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 18,
                padding: '32px 28px',
                cursor: 'default',
              }}
            >
              {/* Icon */}
              <div
                className="service-icon"
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-primary)', marginBottom: 20,
                }}
              >
                {s.icon}
              </div>
              {/* Number */}
              <div style={{
                fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
                letterSpacing: '0.06em', marginBottom: 7, fontFamily: 'var(--font-display)',
              }}>0{i + 1}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.01em',
              }}>{s.title}</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {s.desc}
              </p>
              {/* Bottom arrow */}
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}>
                  <svg width="11" height="11" fill="none" viewBox="0 0 11 11">
                    <path d="M2 5.5h7M6 3l2.5 2.5L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const stats = [
  { value: '10+', label: 'Projects Delivered' },
  { value: '14d', label: 'Avg. Delivery' },
  { value: '99%', label: 'Performance Score' },
  { value: '24/7', label: 'Support' },
];

const bars = [30, 50, 38, 65, 48, 72, 55, 85, 60, 92, 70, 88];

export default function Hero() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current, statsRef.current];
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }, { threshold: 0.1 });
    els.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: 'var(--bg)', padding: '72px 32px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        {/* Two-col */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, marginBottom: 0 }}>

          {/* Left */}
          <div ref={leftRef} className="reveal" style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'var(--gold-bg)', border: '1px solid #e8d89a',
              borderRadius: 20, padding: '5px 13px', marginBottom: 24,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }}/>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--gold)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
              }}>Pioneering Digital Innovation</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4.5vw, 58px)',
              fontWeight: 800, color: 'var(--text-primary)',
              letterSpacing: '-0.035em', lineHeight: 1.05,
              marginBottom: 20,
            }}>
              Building Modern<br />
              Digital{' '}
              <span style={{
                color: 'var(--gold)',
                display: 'inline-block',
              }}>Experiences</span>
              <br />That Scale
            </h1>

            <p style={{
              fontSize: 15, color: 'var(--text-secondary)',
              lineHeight: 1.72, maxWidth: 380, marginBottom: 36,
              fontFamily: 'var(--font-body)',
            }}>
              High-performance engineering for the next generation of startups.
              We specialize in AI integration, lightning-fast web apps, and
              world-class UI design.
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link href="/projects" className="btn-press" style={{
                padding: '12px 26px', fontSize: 14, fontWeight: 700,
                background: 'var(--gold)', color: '#ffffff',
                borderRadius: 10, textDecoration: 'none',
                fontFamily: 'var(--font-display)', letterSpacing: '0.01em',
              }}>
                View Projects
              </Link>
              <Link href="/call" style={{
                padding: '12px 26px', fontSize: 14, fontWeight: 500,
                background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 10, textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c09535'; e.currentTarget.style.background = 'var(--gold-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Book a Call
              </Link>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div ref={rightRef} className="reveal reveal-delay-2" style={{ width: 420, flexShrink: 0 }}>
            <div style={{
              background: '#191714',
              borderRadius: 22, border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              overflow: 'hidden', padding: '22px 22px 26px',
            }}>
              {/* Window dots */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
                ))}
              </div>

              {/* Top label */}
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'var(--font-display)' }}>
                Analytics Overview · Q4 2024
              </div>

              {/* Chart */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 88, marginBottom: 18 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i >= 9
                      ? `linear-gradient(to top, #c09535, rgba(192,149,53,0.35))`
                      : 'rgba(255,255,255,0.06)',
                    borderRadius: '4px 4px 0 0',
                    transition: `height 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s`,
                  }}/>
                ))}
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
                {[
                  { label: 'Revenue', val: '$124k', change: '+12%', up: true },
                  { label: 'Users',   val: '48.2k', change: '+8%',  up: true },
                  { label: 'Churn',   val: '1.2%',  change: '-0.3%',up: false },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 10, padding: '11px 12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f5f2ec', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: s.up ? '#c09535' : '#e07070', marginTop: 3, fontWeight: 600 }}>{s.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="reveal reveal-delay-3" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          borderTop: '1px solid var(--border)',
          marginTop: 60,
        }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stat-item" style={{
              textAlign: 'center', padding: '28px 0',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              cursor: 'default',
            }}>
              <div className="stat-val" style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                color: 'var(--text-primary)', letterSpacing: '-0.04em',
              }}>{s.value}</div>
              <div style={{
                fontSize: 11, color: 'var(--text-muted)', marginTop: 5,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
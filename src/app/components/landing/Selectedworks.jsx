'use client';
import Link from 'next/link';

export default function SelectedWorks() {
  return (
    <section id="case-studies" style={{ background: '#ebe8e3', padding: '96px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              color: '#1a1814', letterSpacing: '-0.03em', marginBottom: 6,
            }}>Selected Works</h2>
            <p style={{ fontSize: 13, color: '#a09d98', fontFamily: 'var(--font-body)' }}>A glimpse into our engineering vault.</p>
          </div>
          <Link href="/portfolio" style={{
            padding: '8px 16px', fontSize: 11, fontWeight: 600,
            border: '1px solid #ccc9c2', borderRadius: 8, textDecoration: 'none',
            color: '#6b6860', letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)', background: 'transparent',
          }}>
            View Full Portfolio
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Large card — Lumina AI Suite */}
          <div style={{
            background: '#1c2333',
            borderRadius: 18, padding: '32px 28px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(78,205,196,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}/>
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(78,205,196,0.1)',
                border: '1px solid rgba(78,205,196,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                  <path d="M4 7a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3h-4l-3 3-3-3H7a3 3 0 01-3-3V7z" stroke="#4ecdc4" strokeWidth="1.5"/>
                  <circle cx="10" cy="12" r="1.5" fill="#4ecdc4"/>
                  <circle cx="14" cy="12" r="1.5" fill="#4ecdc4"/>
                  <circle cx="18" cy="12" r="1.5" fill="#4ecdc4"/>
                </svg>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <span style={{ background: '#b8922a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.05em' }}>NEW</span>
                <span style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(240,237,232,0.7)', fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 4 }}>Next.js</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#f0ede8', marginBottom: 6 }}>Lumina AI Suite</div>
              <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.45)', lineHeight: 1.55 }}>End-to-end AI content platform with real-time generation and collaborative editing.</p>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Ether Wallet */}
            <div style={{
              background: '#ffffff', borderRadius: 18, padding: '24px 24px',
              border: '1px solid #dedad4',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              flex: 1,
            }}>
              <div>
                <span style={{ background: '#fdf6e8', color: '#b8922a', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#1a1814', marginTop: 10, marginBottom: 6 }}>Ether Wallet</div>
                <p style={{ fontSize: 12, color: '#9a9690', lineHeight: 1.55, maxWidth: 200 }}>Real-time crypto asset tracker with biometric security integration.</p>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '1px solid #e0dcd6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="#6b6860" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Bottom two */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              {/* Social Hub */}
              <div style={{
                background: '#ffffff', borderRadius: 18, padding: '22px 20px',
                border: '1px solid #dedad4',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1a1814', marginBottom: 6 }}>Social Hub</div>
                <p style={{ fontSize: 12, color: '#9a9690', lineHeight: 1.55, marginBottom: 12 }}>Scalable social app engine with real-time notifications.</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {['React', 'Supabase'].map(t => (
                    <span key={t} style={{ background: '#f0ede8', color: '#6b6860', fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Design Systems */}
              <div style={{
                background: '#1c2333', borderRadius: 18, padding: '22px 20px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#f0ede8', lineHeight: 1.1, marginBottom: 8 }}>Design<br/>Systems</div>
                <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', lineHeight: 1.5, marginBottom: 14 }}>Building consistent visual languages for enterprise platforms.</p>
                <button style={{
                  background: '#b8922a', color: '#fff', border: 'none',
                  padding: '7px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-display)', width: 'fit-content',
                }}>Case Study</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
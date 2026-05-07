'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#ebe8e3', borderTop: '1px solid #dedad4', padding: '60px 28px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
              color: '#1a1814', letterSpacing: '0.06em', marginBottom: 12,
            }}>
              TECH<span style={{ color: '#b8922a' }}>_FORGE</span>
            </div>
            <p style={{ fontSize: 13, color: '#9a9690', lineHeight: 1.65, maxWidth: 220, fontFamily: 'var(--font-body)' }}>
              Engineered for the future of digital commerce and high-performance applications.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {['tw', 'gh'].map(s => (
                <div key={s} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: '1px solid #dedad4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ccc9c2' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: '#1a1814', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Company</div>
            {['About', 'Process', 'Work', 'Blog'].map(item => (
              <Link key={item} href="#" style={{ display: 'block', fontSize: 13, color: '#9a9690', textDecoration: 'none', marginBottom: 10, fontFamily: 'var(--font-body)' }}>{item}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: '#1a1814', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <Link key={item} href="#" style={{ display: 'block', fontSize: 13, color: '#9a9690', textDecoration: 'none', marginBottom: 10, fontFamily: 'var(--font-body)' }}>{item}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: '#1a1814', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Newsletter</div>
            <p style={{ fontSize: 13, color: '#9a9690', marginBottom: 14, lineHeight: 1.55, fontFamily: 'var(--font-body)' }}>Stay updated with our latest tech releases.</p>
            <div style={{ display: 'flex', gap: 0 }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1, padding: '9px 12px', fontSize: 12,
                  background: '#ffffff', border: '1px solid #dedad4',
                  borderRight: 'none', borderRadius: '8px 0 0 8px',
                  color: '#1a1814', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button style={{
                padding: '9px 14px', fontSize: 12, fontWeight: 700,
                background: '#1a1814', color: '#ffffff', border: 'none',
                borderRadius: '0 8px 8px 0', cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}>Join</button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #dedad4', paddingTop: 22, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#a09d98', fontFamily: 'var(--font-body)' }}>
            © 2024 TECH_FORGE. Engineered for the Future. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
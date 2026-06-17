'use client';
import Link from 'next/link';

export default function CTA() {
  return (
    <section style={{ background: '#f0ede8', padding: '0 28px 80px' }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        background: '#1a1814',
        borderRadius: 22, padding: '88px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 50px)',
          fontWeight: 800, letterSpacing: '-0.03em',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          <span style={{ color: '#f0ede8' }}>{"Let's Build Something"}</span>
          <br />
          <span style={{ color: '#b8922a' }}>Amazing Together</span>
        </h2>
        <p style={{
          fontSize: 15, color: 'rgba(240,237,232,0.45)',
          maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.65,
          fontFamily: 'var(--font-body)',
        }}>
          Ready to scale your next digital product? Our engineering team is standing by.
        </p>
        <Link href="/contact" style={{
          display: 'inline-block',
          padding: '14px 32px', fontSize: 14, fontWeight: 700,
          background: '#b8922a', color: '#ffffff',
          borderRadius: 10, textDecoration: 'none',
          fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
        }}>
          Schedule Your Free Consultation
        </Link>
      </div>
    </section>
  );
}
'use client';

const logos = [
  {
    name: 'Vertex',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    name: 'Prism',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Nova',
    icon: (
      <svg width="20" height="16" fill="none" viewBox="0 0 20 16">
        <path d="M2 8C2 8 5 8 8 8C11 8 14 8 18 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M12 4C12 4 14 6 14 8C14 10 12 12 12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M8 4C8 4 6 6 6 8C6 10 8 12 8 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Circle',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
];

export default function LogoStrip() {
  return (
    <section style={{ background: '#f5f4f0', borderTop: '1px solid #e4e2dc', borderBottom: '1px solid #e4e2dc', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#9c9a93', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
          Built for Modern Freelancers &amp; Clients
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          {logos.map(logo => (
            <div key={logo.name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#9c9a93', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em',
            }}>
              {logo.icon}
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

const steps = [
  {
    number: '1',
    title: 'Agreement',
    description: 'Scope and milestones are defined in the Deal Room.',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 8h8M7 11h5M7 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Verification',
    description: 'Funds are verified and held securely for active milestones.',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="4" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 6V5a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Submission',
    description: 'Work is submitted through version-controlled channels.',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="4" y="3" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8h6M8 11h6M8 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 1v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Release',
    description: 'Upon approval, funds are immediately released.',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7.5 11l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(30px, 4vw, 46px)',
            fontWeight: 400, color: '#111110',
            letterSpacing: '-0.03em', marginBottom: 16,
          }}>
            A structured execution layer
          </h2>
          <p style={{ fontSize: 16, color: '#6b6960', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            From agreement to final payment, every step is protected, logged, and verifiable.
          </p>
        </div>

        {/* Steps grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {steps.map((step, i) => (
            <div key={step.number} style={{
              background: '#ffffff',
              border: '1px solid #e4e2dc',
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
            }}>
              {/* Connector line between cards (visual only) */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: -9, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 18, height: 1, background: '#e4e2dc',
                  zIndex: 1,
                  display: 'none', // hidden on mobile, shown via CSS below
                }} className="step-connector" />
              )}

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#f5f4f0', border: '1px solid #e4e2dc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#111110', marginBottom: 18,
              }}>
                {step.icon}
              </div>

              <div style={{ fontSize: 13, color: '#9c9a93', fontWeight: 600, marginBottom: 6 }}>
                {step.number}. {step.title}
              </div>
              <p style={{ fontSize: 14, color: '#6b6960', lineHeight: 1.55 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
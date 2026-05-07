'use client';

const steps = [
  { num: '01', title: 'Discovery', desc: 'Deep dive into your goals.' },
  { num: '02', title: 'Strategy', desc: 'Defining the roadmap.' },
  { num: '03', title: 'Design', desc: 'High-fidelity UI design.' },
  { num: '04', title: 'Code', desc: 'Agile engineering.' },
  { num: '05', title: 'QA', desc: 'Stress-testing & launch.' },
  { num: '06', title: 'Launch', desc: 'Go live & iterate.' },
];

export default function Workflow() {
  return (
    <section style={{ background: '#f0ede8', padding: '96px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          color: '#1a1814', letterSpacing: '-0.03em',
          textAlign: 'center', marginBottom: 56,
        }}>The Forge Workflow</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 0, position: 'relative' }}>
          {/* connector line */}
          <div style={{
            position: 'absolute', top: 18, left: '8%', right: '8%', height: 1,
            background: '#dedad4', zIndex: 0,
          }}/>

          {steps.map((s, i) => (
            <div key={s.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i === 0 ? '#b8922a' : '#f0ede8',
                border: `1px solid ${i === 0 ? '#b8922a' : '#dedad4'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
                fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                color: i === 0 ? '#fff' : '#a09d98',
              }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: '#1a1814', marginBottom: 5 }}>{s.title}</div>
              <p style={{ fontSize: 11, color: '#a09d98', lineHeight: 1.5, padding: '0 8px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
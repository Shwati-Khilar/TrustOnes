'use client';

const stack = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Vercel'];

export default function TechStack() {
  return (
    <section style={{ background: '#f0ede8', padding: '56px 28px', borderTop: '1px solid #dedad4', borderBottom: '1px solid #dedad4' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          color: '#a09d98', textTransform: 'uppercase',
          fontFamily: 'var(--font-display)', marginBottom: 28,
        }}>Vetted Tech Stack</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          {stack.map((item, i) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              color: '#a09d98', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-body)',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i % 2 === 0 ? '#dedad4' : '#c8c4be',
              }}/>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
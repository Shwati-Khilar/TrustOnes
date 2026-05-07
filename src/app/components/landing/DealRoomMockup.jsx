'use client';

export default function DealRoomMockup() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e4e2dc',
      borderRadius: 24,
      boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)',
      padding: 24,
      maxWidth: 720,
      margin: '0 auto',
    }}>
      {/* Browser chrome dots */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
        {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Left panel */}
        <div style={{ flex: 1, border: '1px solid #e4e2dc', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111110', letterSpacing: '-0.02em' }}>Acme Corp Rebrand</div>
              <div style={{ fontSize: 12, color: '#9c9a93', marginTop: 3 }}>Deal Room #892-A</div>
            </div>
            <span style={{
              background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', padding: '3px 10px', borderRadius: 20,
              border: '1px solid #bbf7d0', textTransform: 'uppercase',
            }}>Active</span>
          </div>

          <div style={{ fontSize: 12, color: '#9c9a93', fontWeight: 500, marginBottom: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            Milestones
          </div>

          {/* Milestone 1 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', border: '1px solid #e4e2dc', borderRadius: 10, marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: '#111110',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="11" height="8" fill="none" viewBox="0 0 11 8">
                  <path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111110' }}>Discovery Phase</div>
                <div style={{ fontSize: 12, color: '#9c9a93', marginTop: 2 }}>$2,500.00</div>
              </div>
            </div>
            <span style={{ background: '#f5f5f5', color: '#444', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase' }}>Paid</span>
          </div>

          {/* Milestone 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', border: '2px solid #2563eb', borderRadius: 10, background: 'rgba(37,99,235,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#2563eb', flexShrink: 0,
              }}>2</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111110' }}>Initial Concepts</div>
                <div style={{ fontSize: 12, color: '#9c9a93', marginTop: 2 }}>$5,000.00</div>
              </div>
            </div>
            <span style={{
              background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 6, border: '1px solid #bbf7d0',
              display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase',
            }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" stroke="#16a34a" strokeWidth="1.2"/>
                <path d="M3 5l1.5 1.5L7 3.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Funded
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 190, border: '1px solid #e4e2dc', borderRadius: 16, padding: 16, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111110', marginBottom: 16 }}>Activity</div>
          {[
            { dot: '#2563eb', label: 'V2 Design Submitted', time: '2 hours ago', active: true },
            { dot: '#d1d5db', label: 'Funds Escrowed', time: 'Yesterday', active: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: item.active ? '#111110' : '#6b6960' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#9c9a93', marginTop: 2 }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const links = ['Services', 'Case Studies', 'Preview', 'Pricing'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(238,234,228,0.95)' : 'rgba(238,234,228,0.7)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid #d8d4cc' : '1px solid transparent',
      transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '0 32px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: '#c09535',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
              <path d="M7 1l1.8 3.6L13 5.1l-3 2.9.7 4.1L7 10.1l-3.7 2 .7-4.1L1 5.1l4.2-.5L7 1z" fill="#fff"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            color: '#18160f', letterSpacing: '-0.01em',
          }}>
            Trust<span style={{ color: '#c09535' }}>ones</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {links.map((label, i) => (
            <Link key={label} href={`#${label.toLowerCase().replace(' ', '-')}`}
              className="nav-link"
              style={{
                padding: '7px 14px', fontSize: 13.5,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? '#18160f' : '#635f57',
                fontFamily: 'var(--font-body)',
                borderBottom: i === 0 ? '1.5px solid #c09535' : '1.5px solid transparent',
              }}>
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/contact"
          className="btn-press"
          style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 700,
            background: '#c09535', color: '#ffffff',
            borderRadius: 9, textDecoration: 'none',
            fontFamily: 'var(--font-display)', letterSpacing: '0.01em',
          }}>
          Start a Project
        </Link>
      </div>
    </nav>
  );
}
import React from 'react';
import Link from 'next/link';
import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      padding: '44px 0 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '36px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '9px',
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <ChefHat size={17} />
              </div>
              <span className="heading-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Masakin</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.65', maxWidth: '280px' }}>
              Platform berbagi resep masakan Nusantara dan internasional. Masak lebih mudah dan menyenangkan setiap hari.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Kategori
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Link href="/?category_id=1" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Sarapan</Link>
              <Link href="/?category_id=2" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Makan Siang</Link>
              <Link href="/?category_id=3" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Makan Malam</Link>
              <Link href="/?category_id=4" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Dessert</Link>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Navigasi
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Link href="/" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Beranda</Link>
              <Link href="/recipe/create" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Tulis Resep</Link>
              <Link href="/my-recipes" style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Resep Saya</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '10px',
          fontSize: '0.8rem', color: 'var(--text-subtle)',
        }}>
          <p>© 2026 Masakin.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Dibuat dengan <Heart size={13} color="var(--color-accent-rose)" fill="var(--color-accent-rose)" /> untuk pecinta kuliner.
          </p>
        </div>
      </div>
    </footer>
  );
}

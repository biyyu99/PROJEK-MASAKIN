import React from 'react';
import Link from 'next/link';
import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      padding: '48px 0 24px 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--color-primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ChefHat size={20} />
              </div>
              <span className="heading-display" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                Masakin
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '320px' }}>
              Platform berbagi resep masakan Nusantara dan Internasional. Masak lebih mudah, lezat, dan menyenangkan setiap hari.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
              Kategori Populer
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <Link href="/?category_id=1">Sarapan</Link>
              <Link href="/?category_id=2">Makan Siang</Link>
              <Link href="/?category_id=3">Makan Malam</Link>
              <Link href="/?category_id=4">Dessert</Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
              Navigasi Cepat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <Link href="/">Beranda Resep</Link>
              <Link href="/recipe/create">Tulis Resep Baru</Link>
              <Link href="/my-recipes">Koleksi Resep Saya</Link>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.84rem',
          color: 'var(--text-muted)'
        }}>
          <p>© 2026 Masakin. Hak Cipta Dilindungi.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Dibuat dengan <Heart size={14} color="var(--color-accent-red)" fill="var(--color-accent-red)" /> untuk para pecinta kuliner.
          </p>
        </div>
      </div>
    </footer>
  );
}

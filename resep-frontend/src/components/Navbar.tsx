'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ChefHat, PlusCircle, LogOut, BookOpen, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial = saved || 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav className="navbar-glass">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '16px' }}>

        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px',
            borderRadius: '10px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <ChefHat size={20} />
          </div>
          <span className="heading-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Masakin
          </span>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle tema"
            className="btn btn-ghost"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-full)' }}
          >
            {theme === 'dark'
              ? <Sun size={17} color="#d4a853" />
              : <Moon size={17} color="var(--text-muted)" />
            }
          </button>

          {/* Write CTA */}
          <Link
            href={user ? '/recipe/create' : '#'}
            onClick={(e) => { if (!user) { e.preventDefault(); openAuthModal('login'); } }}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={16} />
            <span>Tulis Resep</span>
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
              >
                <div style={{
                  width: '26px', height: '26px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <>
                  <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                  <div className="animate-fade-in" style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '210px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '6px',
                    zIndex: 100,
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{user.email}</p>
                    </div>

                    <Link
                      href="/my-recipes"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-main)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <BookOpen size={15} color="var(--color-primary)" />
                      <span>Resep Saya</span>
                    </Link>

                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--color-accent-rose)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-rose-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={15} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => openAuthModal('login')} className="btn btn-ghost btn-sm">
                Masuk
              </button>
              <button onClick={() => openAuthModal('register')} className="btn btn-secondary btn-sm">
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

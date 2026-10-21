'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCategoriesApi, getRecipesApi } from '../lib/api';
import { Category, Recipe, Pagination } from '../types';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Utensils,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 12, total: 0, total_pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const activeDifficulty = (searchParams.get('difficulty') as 'mudah' | 'sedang' | 'sulit') || undefined;
  const activeSort = (searchParams.get('sort') as 'newest' | 'oldest' | 'fastest') || 'newest';
  const activePage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRecipesApi({
        page: activePage, limit: 12,
        search: searchParams.get('search') || undefined,
        category_id: activeCategory,
        difficulty: activeDifficulty,
        sort: activeSort,
      });
      setRecipes(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load recipes', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [activePage, activeCategory, activeDifficulty, activeSort, searchParams]);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);

  const updateFilters = (params: { [key: string]: string | number | undefined }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') current.delete(key);
      else current.set(key, String(value));
    });
    if (!('page' in params)) current.delete('page');
    const query = current.toString();
    router.push(`/${query ? `?${query}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || undefined });
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        padding: '64px 0 48px 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'linear-gradient(180deg, rgba(193, 116, 68, 0.06) 0%, transparent 100%)',
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>

          {/* Eyebrow */}
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            marginBottom: '16px',
          }}>
            Koleksi Resep Nusantara
          </p>

          {/* Heading */}
          <h1 className="heading-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: '1.2',
            marginBottom: '16px',
            color: 'var(--text-main)',
          }}>
            Inspirasi Masakan
            <br />
            <em style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Dari Dapur ke Meja Makan</em>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: '1.7',
            marginBottom: '36px',
            maxWidth: '520px',
            marginInline: 'auto',
          }}>
            Temukan resep favorit, langkah memasak yang jelas, dan bagikan kreasi dapurmu kepada sesama pecinta kuliner.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 6px 6px 18px',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '580px',
            margin: '0 auto',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }}
          >
            <Search size={19} style={{ color: 'var(--text-subtle)', marginRight: '10px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Cari resep… (Rendang, Soto, Ayam Bakar)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                outline: 'none', color: 'var(--text-main)',
                fontSize: '0.95rem', minWidth: '100px',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px', flexShrink: 0, fontSize: '0.88rem' }}>
              Cari
            </button>
          </form>
        </div>
      </section>

      {/* ── Catalog ── */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '28px', scrollbarWidth: 'none' }}>
          <button
            onClick={() => updateFilters({ category_id: undefined })}
            className={`category-pill${activeCategory === undefined ? ' active' : ''}`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category_id: cat.id })}
              className={`category-pill${activeCategory === cat.id ? ' active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          marginBottom: '28px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Utensils size={15} color="var(--color-primary)" />
            <strong style={{ color: 'var(--text-main)' }}>{pagination.total}</strong>&nbsp;resep ditemukan
            {searchParams.get('search') && ` · "${searchParams.get('search')}"`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Filter size={14} color="var(--text-subtle)" />
              <select
                value={activeDifficulty || ''}
                onChange={(e) => updateFilters({ difficulty: e.target.value || undefined })}
                className="form-select"
                style={{ padding: '5px 10px', fontSize: '0.82rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="">Semua Kesulitan</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <SlidersHorizontal size={14} color="var(--text-subtle)" />
              <select
                value={activeSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="form-select"
                style={{ padding: '5px 10px', fontSize: '0.82rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="fastest">Masak Tercepat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid / States */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '14px' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Memuat resep…</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}>
              {recipes.map((recipe, i) => (
                <div key={recipe.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => updateFilters({ page: pagination.page - 1 })}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page <= 1 ? 0.4 : 1, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={15} /> Sebelumnya
                </button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 8px' }}>
                  {pagination.page} / {pagination.total_pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => updateFilters({ page: pagination.page + 1 })}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page >= pagination.total_pages ? 0.4 : 1, cursor: pagination.page >= pagination.total_pages ? 'not-allowed' : 'pointer' }}
                >
                  Selanjutnya <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '480px', margin: '0 auto',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <Utensils size={26} />
            </div>
            <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
              Belum Ada Resep
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {searchParams.get('search') || activeCategory
                ? 'Coba kata kunci atau kategori lain.'
                : 'Jadilah yang pertama membagikan resepmu!'}
            </p>
            <button
              onClick={() => { if (user) router.push('/recipe/create'); else openAuthModal('login'); }}
              className="btn btn-primary"
            >
              <PlusCircle size={17} /> Tulis Resep
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

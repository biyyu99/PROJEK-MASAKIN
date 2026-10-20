'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCategoriesApi, getRecipesApi } from '../lib/api';
import { Category, Recipe, Pagination } from '../types';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Sparkles, 
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
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const activeDifficulty = (searchParams.get('difficulty') as 'mudah' | 'sedang' | 'sulit') || undefined;
  const activeSort = (searchParams.get('sort') as 'newest' | 'oldest' | 'fastest') || 'newest';
  const activePage = Number(searchParams.get('page') || 1);

  // Fetch categories once
  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRecipesApi({
        page: activePage,
        limit: 12,
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

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const updateFilters = (params: { [key: string]: string | number | undefined }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    // Reset page to 1 when changing filters other than page itself
    if (!('page' in params)) {
      current.delete('page');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/${query}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || undefined });
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '72px 0 56px 0',
        background: 'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.12) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <Sparkles size={16} />
            <span>Koleksi Resep Pilihan Komunitas</span>
          </div>

          <h1 className="heading-display" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            lineHeight: '1.15',
            marginBottom: '20px',
            letterSpacing: '-0.03em'
          }}>
            Inspirasi Masakan Harian <br />
            <span style={{
              background: 'var(--color-primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dari Dapur Nusantara
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '36px',
            maxWidth: '620px',
            marginInline: 'auto'
          }}>
            Temukan resep favorit, langkah memasak yang jelas, serta bagikan resep karya terbaikmu kepada sesama pecinta kuliner.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 8px 6px 20px',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '640px',
            margin: '0 auto',
            transition: 'border-color 0.2s'
          }}>
            <Search size={22} style={{ color: 'var(--color-primary)', marginRight: '12px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Mau masak apa hari ini? (contoh: Rendang, Ayam Geprek, Nasi Goreng...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '1rem',
                minWidth: '120px'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '12px 24px', flexShrink: 0 }}
            >
              Cari Resep
            </button>
          </form>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="container" style={{ padding: '40px 24px 80px 24px' }}>
        {/* Category Pills Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => updateFilters({ category_id: undefined })}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeCategory === undefined ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
              background: activeCategory === undefined ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: activeCategory === undefined ? '#ffffff' : 'var(--text-main)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Semua Resep
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category_id: cat.id })}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeCategory === cat.id ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                background: activeCategory === cat.id ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: activeCategory === cat.id ? '#ffffff' : 'var(--text-main)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            <Utensils size={18} color="var(--color-primary)" />
            <span>
              Menampilkan <strong style={{ color: 'var(--text-main)' }}>{pagination.total}</strong> resep
              {searchParams.get('search') && ` untuk pencarian "${searchParams.get('search')}"`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={activeDifficulty || ''}
                onChange={(e) => updateFilters({ difficulty: e.target.value || undefined })}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="">Semua Kesulitan</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                value={activeSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="fastest">Masak Tercepat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
            <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Memuat resep lezat...</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '32px'
              }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => updateFilters({ page: pagination.page - 1 })}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page <= 1 ? 0.5 : 1, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={16} />
                  Sebelumnya
                </button>

                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0 12px' }}>
                  Halaman {pagination.page} dari {pagination.total_pages}
                </span>

                <button
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => updateFilters({ page: pagination.page + 1 })}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page >= pagination.total_pages ? 0.5 : 1, cursor: pagination.page >= pagination.total_pages ? 'not-allowed' : 'pointer' }}
                >
                  Selanjutnya
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '72px 24px',
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Utensils size={30} />
            </div>
            <h3 className="heading-display" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
              Belum Ada Resep yang Sesuai
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {searchParams.get('search') || activeCategory
                ? 'Coba ganti kata kunci pencarian atau pilih kategori lain untuk menemukan inspirasi masakan.'
                : 'Jadilah yang pertama menulis dan membagikan resep masakan favoritmu kepada dunia!'}
            </p>
            <button
              onClick={() => {
                if (user) {
                  router.push('/recipe/create');
                } else {
                  openAuthModal('login');
                }
              }}
              className="btn btn-primary"
            >
              <PlusCircle size={18} />
              Tulis Resep Sekarang
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
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

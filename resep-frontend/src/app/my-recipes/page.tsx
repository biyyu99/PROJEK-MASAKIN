'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getMyRecipesApi, deleteRecipeApi } from '../../lib/api';
import { Recipe, Pagination } from '../../types';
import { 
  BookOpen, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Users, 
  Sparkles, 
  Loader2,
  UtensilsCrossed,
  AlertCircle
} from 'lucide-react';

export default function MyRecipesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMyRecipes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getMyRecipesApi();
      setRecipes(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMyRecipes();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, loadMyRecipes]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRecipeApi(deleteTarget.id);
      setDeleteTarget(null);
      loadMyRecipes();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Gagal menghapus resep');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', gap: '16px' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Memuat koleksi resep Anda...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '520px' }}>
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
          <BookOpen size={32} />
        </div>
        <h2 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
          Kelola Resep Masakan Anda
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Silakan masuk ke akun Anda untuk melihat, mengedit, atau menghapus resep yang telah Anda terbitkan.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn btn-primary">
          Masuk ke Akun
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 96px 24px' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '36px',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
            <Sparkles size={16} />
            <span>DAPUR PRIBADI ANDA</span>
          </div>
          <h1 className="heading-display" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
            Koleksi Resep Saya
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Total <strong>{pagination.total}</strong> resep telah Anda publikasikan di Masakin.
          </p>
        </div>

        <Link href="/recipe/create" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Tulis Resep Baru</span>
        </Link>
      </div>

      {/* Recipe List */}
      {recipes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {recipes.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image banner */}
              <div style={{
                position: 'relative',
                height: '180px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UtensilsCrossed size={42} style={{ opacity: 0.3, color: 'var(--color-primary)' }} />
                )}

                {item.category_name && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge badge-primary" style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                      {item.category_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="heading-display" style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {item.description || 'Tidak ada deskripsi singkat.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', marginTop: 'auto' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--color-primary)" />
                    {item.cook_time_minutes} mnt
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} color="var(--color-primary)" />
                    {item.servings} porsi
                  </span>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {item.difficulty}
                  </span>
                </div>

                {/* Actions: View, Edit, Delete */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <Link
                    href={`/recipe/${item.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={15} />
                    <span>Lihat</span>
                  </Link>

                  <Link
                    href={`/recipe/${item.id}/edit`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }}
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-accent-red)', padding: '6px 10px' }}
                    title="Hapus Resep"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
            <BookOpen size={30} />
          </div>
          <h3 className="heading-display" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
            Anda Belum Memiliki Resep
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Mulai bagikan kreasi masakan Anda sekarang! Setiap resep yang Anda buat dapat Anda kelola dan edit kapan saja.
          </p>
          <Link href="/recipe/create" className="btn btn-primary">
            <PlusCircle size={18} />
            Tulis Resep Pertama
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-accent-red-bg)',
              color: 'var(--color-accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Trash2 size={28} />
            </div>

            <h3 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
              Hapus Resep Ini?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
              Resep <strong>&ldquo;{deleteTarget.title}&rdquo;</strong> akan dihapus permanen.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

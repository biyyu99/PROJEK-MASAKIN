'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getRecipeDetailApi, deleteRecipeApi } from '../../../lib/api';
import { RecipeDetail } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  UtensilsCrossed
} from 'lucide-react';

function RecipeDetailContent() {
  const params = useParams<{ id: string }>();
  const recipeId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    getRecipeDetailApi(recipeId)
      .then((res) => setRecipe(res.data))
      .catch((err) => setError(err.message || 'Resep tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [recipeId]);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDelete = async () => {
    if (!recipe) return;
    setDeleting(true);
    try {
      await deleteRecipeApi(recipe.id);
      router.push('/my-recipes');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Gagal menghapus resep');
      }
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', gap: '16px' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Memuat detail resep...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '520px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-accent-red-bg)',
          color: 'var(--color-accent-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <AlertCircle size={32} />
        </div>
        <h2 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
          Resep Tidak Ditemukan
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || 'Resep yang kamu cari mungkin telah dihapus atau tidak tersedia.'}
        </p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // CHECK OWNERSHIP
  const isOwner = user !== null && user.id === recipe.author_id;

  return (
    <div style={{ paddingBottom: '96px' }}>
      {/* Top Navigation */}
      <div style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} />
            <span>Kembali ke Jelajah</span>
          </Link>

          {/* Action buttons ONLY FOR OWNER */}
          {isOwner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href={`/recipe/${recipe.id}/edit`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={15} color="var(--color-primary)" />
                <span>Edit Resep</span>
              </Link>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-accent-red)' }}
              >
                <Trash2 size={15} />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Recipe Header */}
      <div className="container" style={{ maxWidth: '960px', paddingTop: '40px' }}>
        {/* Ownership Notice Banner */}
        {isOwner ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            color: 'var(--color-primary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '28px'
          }}>
            <ShieldCheck size={18} />
            <span>Anda adalah pemilik resep ini. Anda memiliki hak akses penuh untuk mengedit dan memperbarui resep.</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            marginBottom: '28px'
          }}>
            <ChefHat size={16} color="var(--color-primary)" />
            <span>Resep ini dibuat oleh <strong style={{ color: 'var(--text-main)' }}>{recipe.author_name}</strong>. Hanya pembuat resep yang berwenang untuk mengedit.</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {recipe.category_name && (
            <span className="badge badge-primary">{recipe.category_name}</span>
          )}
          <span className={`badge ${
            recipe.difficulty === 'mudah' ? 'badge-easy' : recipe.difficulty === 'sedang' ? 'badge-medium' : 'badge-hard'
          }`}>
            Tingkat {recipe.difficulty}
          </span>
          {isOwner && (
            <span className="badge badge-owner">
              <Sparkles size={12} />
              Koleksi Anda
            </span>
          )}
        </div>

        <h1 className="heading-display" style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          lineHeight: '1.2',
          marginBottom: '16px',
          color: 'var(--text-main)'
        }}>
          {recipe.title}
        </h1>

        {recipe.description && (
          <p style={{
            fontSize: '1.08rem',
            color: 'var(--text-muted)',
            lineHeight: '1.7',
            marginBottom: '28px'
          }}>
            {recipe.description}
          </p>
        )}

        {/* Quick Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          background: 'var(--bg-surface)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Waktu Memasak</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{recipe.cook_time_minutes} Menit</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Porsi Penyajian</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{recipe.servings} Porsi</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Penulis Resep</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{recipe.author_name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Diterbitkan</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                {new Date(recipe.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </strong>
            </div>
          </div>
        </div>

        {/* Recipe Image Banner */}
        <div style={{
          width: '100%',
          height: 'clamp(280px, 45vw, 480px)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          marginBottom: '48px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <UtensilsCrossed size={64} style={{ opacity: 0.3, marginBottom: '12px', color: 'var(--color-primary)' }} />
              <p style={{ fontSize: '0.95rem' }}>Foto Sajian Resep Rumahan</p>
            </div>
          )}
        </div>

        {/* Recipe Two Columns: Ingredients & Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Ingredients Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--color-primary)'
            }}>
              <h2 className="heading-display" style={{ fontSize: '1.4rem' }}>
                Bahan-Bahan ({recipe.ingredients.length})
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Centang saat menyiapkan
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recipe.ingredients.map((item, index) => {
                const checked = checkedIngredients[index] || false;
                return (
                  <div
                    key={index}
                    onClick={() => toggleIngredient(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: checked ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {checked ? (
                        <CheckCircle2 size={19} color="var(--color-accent-green)" />
                      ) : (
                        <Circle size={19} color="var(--text-subtle)" />
                      )}
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        textDecoration: checked ? 'line-through' : 'none',
                        color: checked ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: checked ? 'var(--text-muted)' : 'var(--color-primary)',
                      background: checked ? 'transparent' : 'var(--color-primary-light)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--color-primary)'
            }}>
              <h2 className="heading-display" style={{ fontSize: '1.4rem' }}>
                Langkah Memasak ({recipe.steps.length})
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Ikuti tahapannya
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recipe.steps.map((step, index) => {
                const checked = checkedSteps[index] || false;
                return (
                  <div
                    key={index}
                    onClick={() => toggleStep(index)}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: checked ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                      border: checked ? '1px solid var(--color-accent-green)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: checked ? 'var(--color-accent-green)' : 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      {checked ? '✓' : step.step_number || index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.65',
                        color: checked ? 'var(--text-muted)' : 'var(--text-main)',
                        textDecoration: checked ? 'line-through' : 'none'
                      }}>
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
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
              Resep <strong>&ldquo;{recipe.title}&rdquo;</strong> beserta semua bahan dan langkahnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
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

export default function RecipeDetailPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
      </div>
    }>
      <RecipeDetailContent />
    </Suspense>
  );
}

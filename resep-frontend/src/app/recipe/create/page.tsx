'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { getCategoriesApi, createRecipeApi } from '../../../lib/api';
import { Category, Ingredient } from '../../../types';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  AlertCircle, 
  Loader2, 
  ChefHat, 
  Sparkles,
  ImageIcon
} from 'lucide-react';

export default function CreateRecipePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [cookTime, setCookTime] = useState<number>(30);
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<'mudah' | 'sedang' | 'sulit'>('mudah');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '' },
    { name: '', quantity: '' },
  ]);

  const [steps, setSteps] = useState<string[]>(['', '']);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: '', quantity: '' }]);
  };

  const updateIngredient = (index: number, field: 'name' | 'quantity', value: string) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, '']);
  };

  const updateStep = (index: number, value: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title.trim() || title.length < 3) {
      setError('Judul resep minimal 3 karakter');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() && ing.quantity.trim());
    if (validIngredients.length === 0) {
      setError('Masukkan minimal 1 bahan beserta takarannya');
      return;
    }

    const validSteps = steps.filter((s) => s.trim().length > 0);
    if (validSteps.length === 0) {
      setError('Masukkan minimal 1 langkah memasak');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      formData.append('cook_time_minutes', String(cookTime));
      formData.append('servings', String(servings));
      formData.append('difficulty', difficulty);

      if (categoryId) {
        formData.append('category_id', String(categoryId));
      }

      formData.append('ingredients', JSON.stringify(validIngredients));
      formData.append('steps', JSON.stringify(validSteps));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await createRecipeApi(formData);
      router.push(`/recipe/${res.data.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal membuat resep');
      }
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
      </div>
    );
  }

  // Not logged in gate
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
          <ChefHat size={32} />
        </div>
        <h2 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
          Masuk untuk Menulis Resep
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Untuk membagikan resep masakanmu dan mengelolanya di kemudian hari, silakan login ke akunmu terlebih dahulu.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn btn-primary">
          Masuk ke Akun
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 24px 96px 24px' }}>
      <Link href="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <ArrowLeft size={16} />
        <span>Batal & Kembali</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Sparkles size={20} color="var(--color-primary)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Kreasi Kuliner
        </span>
      </div>

      <h1 className="heading-display" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
        Tulis Resep Baru
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Bagikan racikan bumbu dan langkah memasak agar orang lain bisa menikmati masakan lezat buatanmu.
      </p>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent-red-bg)',
          color: 'var(--color-accent-red)',
          marginBottom: '28px',
          fontSize: '0.92rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card: Basic Info */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px'
        }}>
          <h2 className="heading-display" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
            1. Informasi Dasar
          </h2>

          <div className="form-group">
            <label className="form-label">Judul Resep <span style={{ color: 'var(--color-accent-red)' }}>*</span></label>
            <input
              type="text"
              required
              placeholder="Contoh: Rendang Daging Sapi Empuk Khas Padang"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cerita / Deskripsi Singkat</label>
            <textarea
              placeholder="Ceritakan keistimewaan rasa masakan ini atau tips rahasia membuatnya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Kategori Masakan</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                className="form-select"
              >
                <option value="">Pilih Kategori (Opsional)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Waktu Masak (Menit)</label>
              <input
                type="number"
                min={1}
                max={1000}
                required
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Porsi (Orang)</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tingkat Kesulitan</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['mudah', 'sedang', 'sulit'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: difficulty === level ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                    background: difficulty === level ? 'var(--color-primary-light)' : 'var(--bg-card)',
                    color: difficulty === level ? 'var(--color-primary)' : 'var(--text-main)',
                    fontWeight: difficulty === level ? 700 : 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Foto Masakan (Opsional)</label>
            {imagePreview ? (
              <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn btn-danger btn-sm"
                  style={{ position: 'absolute', top: '12px', right: '12px' }}
                >
                  <Trash2 size={15} />
                  Hapus Foto
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 20px',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: 'var(--bg-input)',
                transition: 'border-color 0.2s'
              }}>
                <Upload size={32} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
                <span style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>Pilih foto hasil masakan</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Format PNG, JPG, atau WebP (Maks. 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Card: Ingredients */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 className="heading-display" style={{ fontSize: '1.25rem' }}>
              2. Bahan-Bahan
            </h2>
            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              Tambah Bahan
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ingredients.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Nama bahan (contoh: Daging sapi)"
                  value={item.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  className="form-input"
                  style={{ flex: 2 }}
                />
                <input
                  type="text"
                  placeholder="Takaran (contoh: 500 gram)"
                  value={item.quantity}
                  onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="btn btn-ghost"
                  style={{ padding: '10px', color: 'var(--color-accent-red)', opacity: ingredients.length <= 1 ? 0.3 : 1 }}
                  disabled={ingredients.length <= 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Steps */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 className="heading-display" style={{ fontSize: '1.25rem' }}>
              3. Langkah-Langkah Memasak
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              Tambah Langkah
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((instruction, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                  marginTop: '6px'
                }}>
                  {idx + 1}
                </div>
                <textarea
                  placeholder={`Langkah ke-${idx + 1}: Jelaskan proses dan instruksi memasak...`}
                  value={instruction}
                  onChange={(e) => updateStep(idx, e.target.value)}
                  className="form-textarea"
                  rows={2}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="btn btn-ghost"
                  style={{ padding: '10px', color: 'var(--color-accent-red)', opacity: steps.length <= 1 ? 0.3 : 1, marginTop: '6px' }}
                  disabled={steps.length <= 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
          <Link href="/" className="btn btn-secondary btn-lg">
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Menerbitkan Resep...</span>
              </>
            ) : (
              <span>Terbitkan Resep Sekarang</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

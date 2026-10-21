'use client';

import React from 'react';
import Link from 'next/link';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, ChefHat, UtensilsCrossed } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === recipe.author_id;

  const getDifficultyBadge = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'mudah':  return <span className="badge badge-easy">Mudah</span>;
      case 'sedang': return <span className="badge badge-medium">Sedang</span>;
      case 'sulit':  return <span className="badge badge-hard">Sulit</span>;
      default:       return null;
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="recipe-card" style={{ position: 'relative' }}>
      {/* Image */}
      <div style={{
        position: 'relative', width: '100%', height: '196px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #e8ddd3 0%, #f5ede4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="recipe-card-img"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-subtle)' }}>
            <UtensilsCrossed size={36} style={{ opacity: 0.5, color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>Masakan Rumahan</span>
          </div>
        )}

        {/* Category */}
        {recipe.category_name && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
            <span style={{
              display: 'inline-block',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.73rem', fontWeight: 600,
              background: 'rgba(250, 246, 241, 0.9)',
              color: 'var(--text-main)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(232, 221, 211, 0.6)',
            }}>
              {recipe.category_name}
            </span>
          </div>
        )}

        {/* Owner badge */}
        {isOwner && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
            <span className="badge badge-owner">Resepmu</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '8px' }}>
          {getDifficultyBadge(recipe.difficulty)}
        </div>

        <h3 className="heading-display" style={{
          fontSize: '1.05rem', lineHeight: '1.4',
          marginBottom: '6px', color: 'var(--text-main)',
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {recipe.title}
        </h3>

        {recipe.description && (
          <p style={{
            fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.55',
            marginBottom: '14px', flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {recipe.description}
          </p>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="var(--color-primary)" />
              {recipe.cook_time_minutes} mnt
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={13} color="var(--color-primary)" />
              {recipe.servings} porsi
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, color: 'var(--text-subtle)' }}>
            <ChefHat size={13} />
            {recipe.author_name}
          </span>
        </div>
      </div>

      <style jsx>{`
        .recipe-card:hover .recipe-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </Link>
  );
}

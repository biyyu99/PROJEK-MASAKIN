'use client';

import React from 'react';
import Link from 'next/link';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, ChefHat, Sparkles, UtensilsCrossed } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === recipe.author_id;

  const getDifficultyBadge = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'mudah':
        return <span className="badge badge-easy">Mudah</span>;
      case 'sedang':
        return <span className="badge badge-medium">Sedang</span>;
      case 'sulit':
        return <span className="badge badge-hard">Sulit</span>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="recipe-card" style={{ position: 'relative' }}>
      {/* Recipe Image / Cover */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '210px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            className="recipe-card-img"
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)'
          }}>
            <UtensilsCrossed size={44} style={{ opacity: 0.4, color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}>Masakan Rumahan</span>
          </div>
        )}

        {/* Category Tag */}
        {recipe.category_name && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2
          }}>
            <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              {recipe.category_name}
            </span>
          </div>
        )}

        {/* Owner Tag */}
        {isOwner && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2
          }}>
            <span className="badge badge-owner" style={{ backdropFilter: 'blur(8px)', background: 'rgba(249, 115, 22, 0.9)', color: '#fff' }}>
              <Sparkles size={13} />
              Resep Anda
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {getDifficultyBadge(recipe.difficulty)}
        </div>

        <h3 className="heading-display" style={{
          fontSize: '1.2rem',
          lineHeight: '1.35',
          marginBottom: '8px',
          color: 'var(--text-main)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {recipe.title}
        </h3>

        {recipe.description && (
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {recipe.description}
          </p>
        )}

        {/* Footer info: time, servings, author */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={15} color="var(--color-primary)" />
              {recipe.cook_time_minutes} mnt
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={15} color="var(--color-primary)" />
              {recipe.servings} porsi
            </span>
          </div>

          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500, color: 'var(--text-main)' }}>
            <ChefHat size={14} color="var(--text-subtle)" />
            {recipe.author_name}
          </span>
        </div>
      </div>
      <style jsx>{`
        .recipe-card:hover .recipe-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  );
}

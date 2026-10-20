import { Category, Recipe, RecipeDetail, RecipeListResponse, User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('resep_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('resep_token', token);
  } else {
    localStorage.removeItem('resep_token');
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Don't set Content-Type if body is FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.errors?.[0]?.message ||
      data?.message ||
      'Terjadi kesalahan pada server';
    throw new Error(errorMsg);
  }

  return data as T;
}

// Auth API
export async function loginApi(email: string, password: string) {
  return apiRequest<{ message: string; data: { user: User; token: string } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function registerApi(name: string, email: string, password: string) {
  return apiRequest<{ message: string; data: { user: User; token: string } }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }
  );
}

export async function getProfileApi() {
  return apiRequest<{ data: User }>('/users/me');
}

export async function updateProfileApi(name: string) {
  return apiRequest<{ message: string; data: User }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

// Categories API
export async function getCategoriesApi() {
  return apiRequest<{ data: Category[] }>('/categories');
}

// Recipes API
export interface ListRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  difficulty?: 'mudah' | 'sedang' | 'sulit';
  max_time?: number;
  sort?: 'newest' | 'oldest' | 'fastest';
}

export async function getRecipesApi(params: ListRecipesParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.category_id) searchParams.set('category_id', params.category_id.toString());
  if (params.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params.max_time) searchParams.set('max_time', params.max_time.toString());
  if (params.sort) searchParams.set('sort', params.sort);

  const qs = searchParams.toString();
  return apiRequest<RecipeListResponse>(`/recipes${qs ? `?${qs}` : ''}`);
}

export async function getMyRecipesApi(params: ListRecipesParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.sort) searchParams.set('sort', params.sort);

  const qs = searchParams.toString();
  return apiRequest<RecipeListResponse>(`/users/me/recipes${qs ? `?${qs}` : ''}`);
}

export async function getRecipeDetailApi(id: number | string) {
  return apiRequest<{ data: RecipeDetail }>(`/recipes/${id}`);
}

export async function createRecipeApi(formData: FormData) {
  return apiRequest<{ message: string; data: RecipeDetail }>('/recipes', {
    method: 'POST',
    body: formData,
  });
}

export async function updateRecipeApi(id: number | string, formData: FormData) {
  return apiRequest<{ message: string; data: RecipeDetail }>(`/recipes/${id}`, {
    method: 'PUT',
    body: formData,
  });
}

export async function deleteRecipeApi(id: number | string) {
  return apiRequest<{ message: string }>(`/recipes/${id}`, {
    method: 'DELETE',
  });
}

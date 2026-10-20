export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  recipe_count?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Step {
  step_number: number;
  instruction: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  cook_time_minutes: number;
  servings: number;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  category_id: number | null;
  category_name?: string | null;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

export interface RecipeDetail extends Recipe {
  ingredients: Ingredient[];
  steps: Step[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface RecipeListResponse {
  data: Recipe[];
  pagination: Pagination;
}

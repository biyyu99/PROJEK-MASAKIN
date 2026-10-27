-- ============================================================
-- Schema Database: Masakin (Recipe App)
-- Jalankan file ini di Aiven (Query Editor) atau phpMyAdmin
-- ============================================================

-- Gunakan database yang sudah dibuat di Aiven / lokal
-- CREATE DATABASE IF NOT EXISTS recipe_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE recipe_app;

-- ------------------------------------------------------------
-- Tabel: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL,
  password      VARCHAR(255)    NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabel: categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data kategori
INSERT IGNORE INTO categories (name) VALUES
  ('Makanan Utama'),
  ('Camilan'),
  ('Minuman'),
  ('Dessert'),
  ('Sarapan'),
  ('Sup & Soto'),
  ('Salad'),
  ('Vegetarian');

-- ------------------------------------------------------------
-- Tabel: recipes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipes (
  id                  INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  user_id             INT UNSIGNED      NOT NULL,
  category_id         INT UNSIGNED      NULL,
  title               VARCHAR(150)      NOT NULL,
  description         TEXT              NULL,
  cook_time_minutes   SMALLINT UNSIGNED NOT NULL,
  servings            TINYINT UNSIGNED  NOT NULL,
  difficulty          ENUM('mudah','sedang','sulit') NOT NULL DEFAULT 'mudah',
  image_url           VARCHAR(512)      NULL,
  image_public_id     VARCHAR(255)      NULL,
  created_at          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_recipes_user_id     (user_id),
  KEY idx_recipes_category_id (category_id),
  KEY idx_recipes_created_at  (created_at),
  FULLTEXT KEY ft_recipes_search (title, description),
  CONSTRAINT fk_recipes_user     FOREIGN KEY (user_id)     REFERENCES users (id)      ON DELETE CASCADE,
  CONSTRAINT fk_recipes_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabel: recipe_ingredients
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  recipe_id  INT UNSIGNED  NOT NULL,
  name       VARCHAR(150)  NOT NULL,
  quantity   VARCHAR(80)   NOT NULL,
  position   TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_ingredients_recipe_id (recipe_id),
  CONSTRAINT fk_ingredients_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabel: recipe_steps
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_steps (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  recipe_id    INT UNSIGNED  NOT NULL,
  step_number  TINYINT UNSIGNED NOT NULL,
  instruction  TEXT          NOT NULL,
  PRIMARY KEY (id),
  KEY idx_steps_recipe_id (recipe_id),
  CONSTRAINT fk_steps_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

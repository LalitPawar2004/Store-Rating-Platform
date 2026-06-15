-- MySQL 8+
CREATE DATABASE IF NOT EXISTS rating_platform;
USE rating_platform;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('admin','user','owner') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60)
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(120),
  address VARCHAR(400),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
);

-- Seed data
INSERT INTO users (name, email, password_hash, address, role) VALUES
('System Administrator Account', 'admin@platform.test', '$2a$12$KIXnC0e1YqQe4mGzQZQeOu7vQ9bYw8yXyXyXyXyXyXyXyXyXyXyXy', 'Pune, Maharashtra, India', 'admin'),
('Normal User For Testing Purpose', 'user@test.com', '$2a$12$KIXnC0e1YqQe4mGzQZQeOu7vQ9bYw8yXyXyXyXyXyXyXyXyXyXyXy', 'Pune, Maharashtra', 'user'),
('Store Owner Demo Account Here', 'owner@test.com', '$2a$12$KIXnC0e1YqQe4mGzQZQeOu7vQ9bYw8yXyXyXyXyXyXyXyXyXyXyXy', 'Mumbai, Maharashtra', 'owner');

-- Password for all seeds is Admin@123 (replace hash in production)

INSERT INTO stores (name, email, address, owner_id) VALUES
('Pune Coffee House', 'coffee@pune.test', 'FC Road, Pune', 3),
('Maharashtra Mart', 'mart@test.com', 'Kothrud, Pune', 3);

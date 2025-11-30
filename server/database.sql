CREATE DATABASE IF NOT EXISTS ecommerce_db;

USE ecommerce_db;

-- Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features (for product attributes)
CREATE TABLE features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    feature_name VARCHAR(100),
    feature_value VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- Addresses
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Order Items
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- Reviews
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    user_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Carts
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- Feature Images
CREATE TABLE feature_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
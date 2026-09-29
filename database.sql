-- ===================================================
-- StyleSense Database Creation & Sample Data Script
-- Database: stylesense
-- ===================================================

CREATE DATABASE IF NOT EXISTS stylesense;
USE stylesense;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wardrobe Table
CREATE TABLE IF NOT EXISTS wardrobe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    pattern VARCHAR(50) DEFAULT 'Solid',
    season VARCHAR(50) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    image VARCHAR(255) DEFAULT 'default_item.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Style Preferences Table
CREATE TABLE IF NOT EXISTS style_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    style VARCHAR(50) DEFAULT 'Casual',
    favorite_color VARCHAR(50) DEFAULT 'Blue',
    preferred_fit VARCHAR(50) DEFAULT 'Regular',
    preferred_occasion VARCHAR(50) DEFAULT 'Casual',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Saved Outfits Table
CREATE TABLE IF NOT EXISTS saved_outfits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    top_id INT,
    bottom_id INT,
    shoes_id INT,
    accessory_id INT,
    occasion VARCHAR(50),
    style VARCHAR(50),
    score INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Style Quiz Table
CREATE TABLE IF NOT EXISTS style_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    answer1 VARCHAR(100),
    answer2 VARCHAR(100),
    answer3 VARCHAR(100),
    answer4 VARCHAR(100),
    answer5 VARCHAR(100),
    result VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===================================================
-- Sample Data Insertion
-- Password for demo user: "password123" (pbkdf2:sha256 hashed)
-- ===================================================

INSERT INTO users (id, name, email, password) VALUES 
(1, 'Sophia Bennett', 'sophia@example.com', 'scrypt:32768:8:1$u7xK3l9A$924376483477174e92bbdf44246876bf7d86f784e27f1c1ecbcbf64a66a1a457')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Wardrobe Items
INSERT INTO wardrobe (id, user_id, category, item_name, color, pattern, season, occasion, image) VALUES 
(1, 1, 'Top', 'White Oversized Linen Shirt', 'White', 'Solid', 'Hot', 'Casual', 'top_white_shirt.jpg'),
(2, 1, 'Top', 'Black Cotton Crewneck Tee', 'Black', 'Solid', 'Normal', 'College', 'top_black_tee.jpg'),
(3, 1, 'Top', 'Beige Knit Sweater', 'Beige', 'Solid', 'Cold', 'Casual', 'top_beige_sweater.jpg'),
(4, 1, 'Top', 'Navy Blue Tailored Blazer', 'Blue', 'Solid', 'Normal', 'Interview', 'top_navy_blazer.jpg'),
(5, 1, 'Bottom', 'Light Wash Straight Jeans', 'Blue', 'Solid', 'Normal', 'College', 'bottom_light_jeans.jpg'),
(6, 1, 'Bottom', 'Black Tailored Trousers', 'Black', 'Solid', 'Normal', 'Formal', 'bottom_black_trousers.jpg'),
(7, 1, 'Bottom', 'Beige Chino Shorts', 'Beige', 'Solid', 'Hot', 'Casual', 'bottom_beige_shorts.jpg'),
(8, 1, 'Jacket', 'Classic Denim Jacket', 'Blue', 'Solid', 'Normal', 'Casual', 'jacket_denim.jpg'),
(9, 1, 'Shoes', 'White Leather Sneakers', 'White', 'Solid', 'Normal', 'Casual', 'shoes_white_sneakers.jpg'),
(10, 1, 'Shoes', 'Black Oxford Dress Shoes', 'Black', 'Solid', 'Normal', 'Formal', 'shoes_black_oxfords.jpg'),
(11, 1, 'Accessories', 'Minimal Silver Watch', 'Silver', 'Solid', 'Normal', 'College', 'accessory_watch.jpg'),
(12, 1, 'Bag', 'Brown Leather Crossbody Bag', 'Brown', 'Solid', 'Normal', 'Casual', 'bag_brown_crossbody.jpg')
ON DUPLICATE KEY UPDATE item_name=item_name;

-- Sample Style Preferences
INSERT INTO style_preferences (id, user_id, style, favorite_color, preferred_fit, preferred_occasion) VALUES 
(1, 1, 'Minimal', 'White', 'Oversized', 'College')
ON DUPLICATE KEY UPDATE style=style;

-- Sample Saved Outfits
INSERT INTO saved_outfits (id, user_id, top_id, bottom_id, shoes_id, accessory_id, occasion, style, score) VALUES 
(1, 1, 1, 5, 9, 11, 'College', 'Casual', 9),
(2, 1, 4, 6, 10, 11, 'Interview', 'Formal', 10)
ON DUPLICATE KEY UPDATE occasion=occasion;

-- Sample Style Quiz Result
INSERT INTO style_quiz (id, user_id, answer1, answer2, answer3, answer4, answer5, result) VALUES 
(1, 1, 'Comfortable clothes', 'Neutral colors', 'Sneakers', 'College / Casual', 'Minimal aesthetic', 'Minimalist')
ON DUPLICATE KEY UPDATE result=result;

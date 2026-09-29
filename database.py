import os
import sqlite3
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    try:
        import pymysql as mysql
        MYSQL_AVAILABLE = True
    except ImportError:
        MYSQL_AVAILABLE = False

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
DB_NAME = os.environ.get('DB_NAME', 'stylesense')

USE_MYSQL = False

def get_db_connection():
    global USE_MYSQL
    # Try MySQL first
    if MYSQL_AVAILABLE:
        try:
            conn = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                autocommit=True
            )
            USE_MYSQL = True
            return conn
        except Exception:
            pass

    # SQLite fallback mode for smooth out-of-the-box local testing
    USE_MYSQL = False
    conn = sqlite3.connect('stylesense.db')
    conn.row_factory = sqlite3.Row
    return conn

def execute_query(query, params=(), fetch_one=False, fetch_all=False, commit=True):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Adjust placeholders if SQLite fallback (%s to ?)
    if not USE_MYSQL:
        query = query.replace('%s', '?')
        # SQLite replace ON DUPLICATE KEY UPDATE with OR IGNORE or handle
        if 'ON DUPLICATE KEY UPDATE' in query:
            query = query.split('ON DUPLICATE KEY UPDATE')[0]
            if 'INSERT INTO' in query:
                query = query.replace('INSERT INTO', 'INSERT OR IGNORE INTO')
    
    try:
        cursor.execute(query, params)
        result = None
        if fetch_one:
            res = cursor.fetchone()
            if res:
                result = dict(res) if not USE_MYSQL else dict(zip(cursor.column_names, res))
        elif fetch_all:
            res = cursor.fetchall()
            if res:
                if not USE_MYSQL:
                    result = [dict(row) for row in res]
                else:
                    columns = cursor.column_names
                    result = [dict(zip(columns, row)) for row in res]
            else:
                result = []
        else:
            if commit and not USE_MYSQL:
                conn.commit()
            if query.strip().upper().startswith('INSERT'):
                result = cursor.lastrowid
            else:
                result = cursor.rowcount
        return result
    finally:
        cursor.close()
        conn.close()

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if USE_MYSQL:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.execute(f"USE {DB_NAME}")
    
    # Create tables
    tables = [
        """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
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
        """,
        """
        CREATE TABLE IF NOT EXISTS style_preferences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            style VARCHAR(50) DEFAULT 'Casual',
            favorite_color VARCHAR(50) DEFAULT 'Blue',
            preferred_fit VARCHAR(50) DEFAULT 'Regular',
            preferred_occasion VARCHAR(50) DEFAULT 'Casual',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """,
        """
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
        """,
        """
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
        """
    ]
    
    for t in tables:
        if not USE_MYSQL:
            t = t.replace('INT AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT')
        cursor.execute(t)
    
    if not USE_MYSQL:
        conn.commit()
        
    cursor.close()
    conn.close()

    # Seed sample data if empty
    user_count = execute_query("SELECT COUNT(*) as count FROM users", fetch_one=True)
    count_val = user_count['count'] if user_count else 0
    if count_val == 0:
        seed_sample_data()

from werkzeug.security import generate_password_hash

def seed_sample_data():
    # Demo User password is 'password123'
    demo_pass = generate_password_hash('password123')
    user_id = execute_query(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        ('Sophia Bennett', 'sophia@example.com', demo_pass)
    )
    if not user_id or user_id <= 0:
        user_id = 1

    sample_items = [
        (user_id, 'Top', 'White Oversized Linen Shirt', 'White', 'Solid', 'Hot', 'Casual', 'top_white_shirt.jpg'),
        (user_id, 'Top', 'Black Cotton Crewneck Tee', 'Black', 'Solid', 'Normal', 'College', 'top_black_tee.jpg'),
        (user_id, 'Top', 'Beige Knit Sweater', 'Beige', 'Solid', 'Cold', 'Casual', 'top_beige_sweater.jpg'),
        (user_id, 'Top', 'Navy Blue Tailored Blazer', 'Blue', 'Solid', 'Normal', 'Interview', 'top_navy_blazer.jpg'),
        (user_id, 'Bottom', 'Light Wash Straight Jeans', 'Blue', 'Solid', 'Normal', 'College', 'bottom_light_jeans.jpg'),
        (user_id, 'Bottom', 'Black Tailored Trousers', 'Black', 'Solid', 'Normal', 'Formal', 'bottom_black_trousers.jpg'),
        (user_id, 'Bottom', 'Beige Chino Shorts', 'Beige', 'Solid', 'Hot', 'Casual', 'bottom_beige_shorts.jpg'),
        (user_id, 'Jacket', 'Classic Denim Jacket', 'Blue', 'Solid', 'Normal', 'Casual', 'jacket_denim.jpg'),
        (user_id, 'Shoes', 'White Leather Sneakers', 'White', 'Solid', 'Normal', 'Casual', 'shoes_white_sneakers.jpg'),
        (user_id, 'Shoes', 'Black Oxford Dress Shoes', 'Black', 'Solid', 'Normal', 'Formal', 'shoes_black_oxfords.jpg'),
        (user_id, 'Accessories', 'Minimal Silver Watch', 'Silver', 'Solid', 'Normal', 'College', 'accessory_watch.jpg'),
        (user_id, 'Bag', 'Brown Leather Crossbody Bag', 'Brown', 'Solid', 'Normal', 'Casual', 'bag_brown_crossbody.jpg')
    ]

    for item in sample_items:
        execute_query(
            """INSERT INTO wardrobe 
               (user_id, category, item_name, color, pattern, season, occasion, image) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            item
        )

    execute_query(
        "INSERT INTO style_preferences (user_id, style, favorite_color, preferred_fit, preferred_occasion) VALUES (%s, %s, %s, %s, %s)",
        (user_id, 'Minimalist', 'White', 'Oversized', 'College')
    )

    execute_query(
        "INSERT INTO saved_outfits (user_id, top_id, bottom_id, shoes_id, accessory_id, occasion, style, score) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (user_id, 1, 5, 9, 11, 'College', 'Casual', 9)
    )

    execute_query(
        "INSERT INTO style_quiz (user_id, answer1, answer2, answer3, answer4, answer5, result) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (user_id, 'Comfortable clothes', 'Neutral colors', 'Sneakers', 'College', 'Minimalist', 'Minimalist')
    )

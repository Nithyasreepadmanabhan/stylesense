# StyleSense – AI Outfit & Personal Style Assistant 👗✨

StyleSense is a web application designed to help users manage their digital wardrobe, discover their personal style, receive outfit recommendations, analyze color combinations, and save curated outfit looks.

Built using a simple technology stack (**HTML5, CSS3, JavaScript, Bootstrap 5, Python Flask, and MySQL DBMS**), this project is structured for easy setup, execution, and presentation during college viva / project reviews.

---

## 🌟 Key Features

1. **Authentication System**: User Registration and Login with session management and Werkzeug password hashing.
2. **Interactive Dashboard**: Overview of wardrobe statistics, saved outfits, current aesthetic archetype, and daily fashion tips.
3. **Digital Wardrobe (CRUD)**:
   - Add clothing items with custom categories, colors, patterns, seasons, occasions, and photo uploads.
   - Edit and delete items.
   - Filter items dynamically by **Category**, **Color**, **Season**, and **Occasion**.
4. **Style AI Outfit Generator**:
   - Algorithmic recommendation scoring engine evaluating occasion (+3), aesthetic style (+3), weather compatibility (+2), and color harmony (+2).
   - Generates complete outfit combinations with Style Score out of 10 and detailed "Why It Works" rationale.
5. **Color Harmony Assistant**:
   - Palette picker for 10 fashion colors displaying best matching colors, styling insights, and outfit templates.
6. **Find My Style Quiz**:
   - 5-question step-by-step assessment identifying user style archetypes (*Minimalist, Casual, Elegant, Streetwear, Sporty, Traditional, Y2K*).
7. **Outfit Analyzer**:
   - Input top, bottom, shoe colors, and target occasion to calculate an instant outfit score with pros and improvement tips.
8. **Saved Outfits Lookbook**:
   - Save recommended outfit combinations and manage saved looks.
9. **User Profile**:
   - Track wardrobe metrics and personalize style preferences.

---

## 🛠️ Project Structure

```
StyleSense/
│
├── app.py                  # Main Flask web server & route handlers
├── database.py             # MySQL database connection manager & fallback engine
├── database.sql            # MySQL table creation & sample data script
├── requirements.txt        # Python package dependencies
├── README.md               # Project documentation
│
├── templates/              # Jinja2 HTML Templates
│   ├── layout.html         # Base template with Bootstrap 5 & Navigation
│   ├── login.html          # Login view
│   ├── register.html       # User registration view
│   ├── home.html           # Main dashboard
│   ├── wardrobe.html       # Wardrobe gallery & filters
│   ├── add_clothing.html   # Add clothing form
│   ├── edit_clothing.html  # Edit clothing form
│   ├── style_ai.html       # Outfit recommendation input form
│   ├── outfit_result.html  # Recommended outfit result view
│   ├── style_quiz.html     # Find My Style 5-step quiz
│   ├── color_assistant.html# Color matching assistant
│   ├── outfit_analyzer.html# Outfit color & occasion evaluator
│   ├── saved_outfits.html  # Saved outfits lookbook
│   └── profile.html        # Profile & style preferences
│
└── static/
    ├── css/
    │   └── style.css       # Custom fashion design system & styles
    ├── js/
    │   └── script.js       # Client-side filtering & interaction scripts
    └── uploads/            # Uploaded clothing image storage
```

---

## 🚀 How to Set Up & Run

### 1. Prerequisites
- Python 3.8+ installed
- MySQL Server & MySQL Workbench installed (or XAMPP / phpMyAdmin)

### 2. Install Python Dependencies
Open your terminal in the project directory and run:

```bash
pip install -r requirements.txt
```

### 3. Create & Import MySQL Database
1. Open **MySQL Workbench** (or phpMyAdmin).
2. Create a new query tab and open `database.sql`.
3. Execute the SQL script. This will:
   - Create the database `stylesense`.
   - Create tables: `users`, `wardrobe`, `style_preferences`, `saved_outfits`, and `style_quiz`.
   - Insert realistic sample data for testing.

### 4. Configure Database Connection (Optional)
By default, `database.py` connects to MySQL at `localhost` with user `root` and no password. 

If your MySQL credentials differ, set environment variables or modify `database.py`:
```python
DB_HOST = "localhost"
DB_USER = "your_mysql_user"
DB_PASSWORD = "your_mysql_password"
DB_NAME = "stylesense"
```

*(Note: `database.py` also features an automatic fallback mode for zero-friction demonstration if MySQL server is offline).*

### 5. Start Flask Server
Run the application using:

```bash
python app.py
```

### 6. Access the Website
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

### 🔑 Demo Login Credentials
- **Email**: `sophia@example.com`
- **Password**: `password123`

*(Or register a new account anytime!)*

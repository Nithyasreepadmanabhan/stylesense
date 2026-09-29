import os
import random
from functools import wraps
from flask import (Flask, render_template, request, redirect, url_for, 
                   session, flash, jsonify)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import database as db

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'stylesense_secret_key_college_project_2026')

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize database tables on startup
db.init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('home'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        # Basic Validation
        if not name or not email or not password:
            flash('All fields are required.', 'danger')
            return render_template('register.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')

        # Check existing user
        existing_user = db.execute_query(
            "SELECT id FROM users WHERE email = %s", (email,), fetch_one=True
        )
        if existing_user:
            flash('Email address is already registered. Please login.', 'warning')
            return redirect(url_for('login'))

        # Hash password & Save
        hashed_pw = generate_password_hash(password)
        user_id = db.execute_query(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed_pw)
        )
        
        # Create initial style preferences
        if user_id:
            db.execute_query(
                "INSERT INTO style_preferences (user_id, style, favorite_color, preferred_fit, preferred_occasion) VALUES (%s, %s, %s, %s, %s)",
                (user_id, 'Casual', 'Blue', 'Regular', 'Casual')
            )

        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please enter both email and password.', 'danger')
            return render_template('login.html')

        user = db.execute_query(
            "SELECT * FROM users WHERE email = %s", (email,), fetch_one=True
        )

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            flash(f"Welcome back, {user['name']}! 👋", 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# ==========================================
# HOME & DASHBOARD
# ==========================================

@app.route('/home')
@login_required
def home():
    user_id = session['user_id']
    
    # Metrics
    wardrobe_count_res = db.execute_query(
        "SELECT COUNT(*) as cnt FROM wardrobe WHERE user_id = %s", (user_id,), fetch_one=True
    )
    wardrobe_count = wardrobe_count_res['cnt'] if wardrobe_count_res else 0

    saved_count_res = db.execute_query(
        "SELECT COUNT(*) as cnt FROM saved_outfits WHERE user_id = %s", (user_id,), fetch_one=True
    )
    saved_count = saved_count_res['cnt'] if saved_count_res else 0

    pref = db.execute_query(
        "SELECT style FROM style_preferences WHERE user_id = %s", (user_id,), fetch_one=True
    )
    current_style = pref['style'] if pref and pref.get('style') else 'Casual / Minimalist'

    # Recent saved outfits
    recent_saved = db.execute_query(
        """SELECT s.*, 
                  t.item_name as top_name, 
                  b.item_name as bottom_name, 
                  sh.item_name as shoes_name
           FROM saved_outfits s
           LEFT JOIN wardrobe t ON s.top_id = t.id
           LEFT JOIN wardrobe b ON s.bottom_id = b.id
           LEFT JOIN wardrobe sh ON s.shoes_id = sh.id
           WHERE s.user_id = %s 
           ORDER BY s.id DESC LIMIT 3""", (user_id,), fetch_all=True
    )

    # Quick Fashion Tips
    tips = [
        "Monochrome magic: Wearing different shades of the same color creates a sleek, elongated silhouette.",
        "Rule of Thirds: Tucking in your shirt creates a 1/3 to 2/3 ratio that visually enhances height and proportions.",
        "Anchor with neutrals: Match vibrant colored tops with classic neutral bottoms like dark jeans or beige chinos.",
        "Shoes set the tone: The right pair of clean sneakers can turn formal trousers into chic everyday streetwear.",
        "Layer with purpose: Adding a structured blazer or denim jacket instantly elevates a basic white t-shirt."
    ]
    today_tip = random.choice(tips)

    return render_template('home.html', 
                           user_name=session.get('user_name'),
                           wardrobe_count=wardrobe_count,
                           saved_count=saved_count,
                           current_style=current_style,
                           recent_saved=recent_saved or [],
                           today_tip=today_tip)

# ==========================================
# DIGITAL WARDROBE (CRUD)
# ==========================================

@app.route('/wardrobe')
@login_required
def wardrobe():
    user_id = session['user_id']
    items = db.execute_query(
        "SELECT * FROM wardrobe WHERE user_id = %s ORDER BY id DESC", (user_id,), fetch_all=True
    )
    return render_template('wardrobe.html', items=items or [])

@app.route('/wardrobe/add', methods=['GET', 'POST'])
@login_required
def add_clothing():
    if request.method == 'POST':
        item_name = request.form.get('item_name', '').strip()
        category = request.form.get('category', '')
        color = request.form.get('color', '')
        pattern = request.form.get('pattern', 'Solid')
        season = request.form.get('season', 'Normal')
        occasion = request.form.get('occasion', 'Casual')

        if not item_name or not category or not color:
            flash('Item Name, Category, and Color are required fields.', 'danger')
            return render_template('add_clothing.html')

        # Handle image upload
        image_filename = 'default_item.jpg'
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Ensure unique filename
                image_filename = f"user_{session['user_id']}_{random.randint(1000,9999)}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

        db.execute_query(
            """INSERT INTO wardrobe 
               (user_id, category, item_name, color, pattern, season, occasion, image) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (session['user_id'], category, item_name, color, pattern, season, occasion, image_filename)
        )
        flash(f'Added "{item_name}" to your digital wardrobe! ✨', 'success')
        return redirect(url_for('wardrobe'))

    return render_template('add_clothing.html')

@app.route('/wardrobe/edit/<int:item_id>', methods=['GET', 'POST'])
@login_required
def edit_clothing(item_id):
    user_id = session['user_id']
    item = db.execute_query(
        "SELECT * FROM wardrobe WHERE id = %s AND user_id = %s", (item_id, user_id), fetch_one=True
    )
    if not item:
        flash('Wardrobe item not found.', 'danger')
        return redirect(url_for('wardrobe'))

    if request.method == 'POST':
        item_name = request.form.get('item_name', '').strip()
        category = request.form.get('category', '')
        color = request.form.get('color', '')
        pattern = request.form.get('pattern', 'Solid')
        season = request.form.get('season', 'Normal')
        occasion = request.form.get('occasion', 'Casual')

        image_filename = item['image']
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                image_filename = f"user_{user_id}_{random.randint(1000,9999)}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

        db.execute_query(
            """UPDATE wardrobe 
               SET item_name=%s, category=%s, color=%s, pattern=%s, season=%s, occasion=%s, image=%s 
               WHERE id=%s AND user_id=%s""",
            (item_name, category, color, pattern, season, occasion, image_filename, item_id, user_id)
        )
        flash(f'Updated "{item_name}" successfully!', 'success')
        return redirect(url_for('wardrobe'))

    return render_template('edit_clothing.html', item=item)

@app.route('/wardrobe/delete/<int:item_id>', methods=['POST', 'GET'])
@login_required
def delete_clothing(item_id):
    user_id = session['user_id']
    db.execute_query("DELETE FROM wardrobe WHERE id = %s AND user_id = %s", (item_id, user_id))
    flash('Item removed from wardrobe.', 'info')
    return redirect(url_for('wardrobe'))

# ==========================================
# STYLE AI / OUTFIT RECOMMENDATION ENGINE
# ==========================================

COLOR_HARMONY = {
    'White': ['Black', 'Blue', 'Beige', 'Brown', 'Green', 'Red', 'Pink'],
    'Black': ['White', 'Blue', 'Beige', 'Red', 'Grey', 'Green', 'Yellow'],
    'Blue': ['White', 'Beige', 'Black', 'Brown', 'Grey'],
    'Beige': ['White', 'Blue', 'Black', 'Brown', 'Green'],
    'Brown': ['White', 'Beige', 'Blue', 'Green'],
    'Green': ['White', 'Black', 'Beige', 'Brown'],
    'Red': ['White', 'Black', 'Blue'],
    'Grey': ['White', 'Black', 'Blue', 'Pink'],
    'Pink': ['White', 'Grey', 'Black', 'Blue'],
    'Yellow': ['Black', 'White', 'Blue']
}

@app.route('/style-ai')
@login_required
def style_ai():
    return render_template('style_ai.html')

@app.route('/recommend-outfit', methods=['POST', 'GET'])
@login_required
def recommend_outfit():
    if request.method == 'POST':
        target_occasion = request.form.get('occasion', 'Casual')
        target_style = request.form.get('style', 'Casual')
        target_weather = request.form.get('weather', 'Normal')
    else:
        target_occasion = request.args.get('occasion', 'Casual')
        target_style = request.args.get('style', 'Casual')
        target_weather = request.args.get('weather', 'Normal')

    user_id = session['user_id']
    
    # Fetch user items
    tops = db.execute_query("SELECT * FROM wardrobe WHERE user_id = %s AND category = 'Top'", (user_id,), fetch_all=True) or []
    bottoms = db.execute_query("SELECT * FROM wardrobe WHERE user_id = %s AND category = 'Bottom'", (user_id,), fetch_all=True) or []
    shoes = db.execute_query("SELECT * FROM wardrobe WHERE user_id = %s AND category = 'Shoes'", (user_id,), fetch_all=True) or []
    accessories = db.execute_query("SELECT * FROM wardrobe WHERE user_id = %s AND category IN ('Accessories', 'Jacket', 'Bag')", (user_id,), fetch_all=True) or []

    # Fallback preset items if user's wardrobe is empty or incomplete
    default_top = {'id': 0, 'item_name': f'Classic {target_style} Shirt', 'category': 'Top', 'color': 'White', 'season': target_weather, 'occasion': target_occasion, 'image': 'top_white_shirt.jpg'}
    default_bottom = {'id': 0, 'item_name': 'Tailored Trousers / Jeans', 'category': 'Bottom', 'color': 'Blue', 'season': target_weather, 'occasion': target_occasion, 'image': 'bottom_light_jeans.jpg'}
    default_shoes = {'id': 0, 'item_name': 'Versatile Leather Sneakers', 'category': 'Shoes', 'color': 'White', 'season': target_weather, 'occasion': target_occasion, 'image': 'shoes_white_sneakers.jpg'}
    default_acc = {'id': 0, 'item_name': 'Minimalist Wristwatch', 'category': 'Accessories', 'color': 'Silver', 'season': target_weather, 'occasion': target_occasion, 'image': 'accessory_watch.jpg'}

    if not tops: tops = [default_top]
    if not bottoms: bottoms = [default_bottom]
    if not shoes: shoes = [default_shoes]
    if not accessories: accessories = [default_acc]

    best_combination = None
    max_score = -1

    # Simple Recommendation Algorithm (Combinatorial Point Scoring Engine)
    for top in tops:
        for bottom in bottoms:
            for shoe in shoes:
                score = 0
                
                # 1. Occasion Match (+3)
                if top.get('occasion') == target_occasion: score += 1
                if bottom.get('occasion') == target_occasion: score += 1
                if shoe.get('occasion') == target_occasion: score += 1

                # 2. Weather Match (+2)
                if top.get('season') in [target_weather, 'Normal']: score += 1
                if bottom.get('season') in [target_weather, 'Normal']: score += 1

                # 3. Color Harmony Match (+2)
                top_color = top.get('color', 'White')
                bottom_color = bottom.get('color', 'Blue')
                compatible_colors = COLOR_HARMONY.get(top_color, ['White', 'Black', 'Blue', 'Beige'])
                if bottom_color in compatible_colors or top_color == bottom_color:
                    score += 2

                # 4. Style Bonus (+2)
                if target_style.lower() in (top.get('item_name', '') + bottom.get('item_name', '')).lower() or target_style in ['Casual', 'Minimal']:
                    score += 2

                if score > max_score:
                    max_score = score
                    acc = random.choice(accessories) if accessories else default_acc
                    best_combination = (top, bottom, shoe, acc)

    # Normalize Score to 10-point scale (7/10 to 10/10)
    final_score = min(10, max(7, round(7 + (max_score / 10) * 3)))

    top_item, bottom_item, shoe_item, acc_item = best_combination

    why_it_works = f"The {top_item['color'].lower()} {top_item['item_name'].lower()} pairs cleanly with the {bottom_item['color'].lower()} {bottom_item['item_name'].lower()} and {shoe_item['item_name'].lower()}. This neutral-harmonious color tone and proportion match perfectly for a {target_occasion.lower()} event in {target_weather.lower()} weather."

    return render_template('outfit_result.html',
                           top=top_item,
                           bottom=bottom_item,
                           shoes=shoe_item,
                           accessory=acc_item,
                           occasion=target_occasion,
                           style=target_style,
                           weather=target_weather,
                           score=final_score,
                           why_it_works=why_it_works)

@app.route('/save-outfit', methods=['POST'])
@login_required
def save_outfit():
    top_id = request.form.get('top_id')
    bottom_id = request.form.get('bottom_id')
    shoes_id = request.form.get('shoes_id')
    acc_id = request.form.get('accessory_id')
    occasion = request.form.get('occasion', 'Casual')
    style = request.form.get('style', 'Casual')
    score = request.form.get('score', 9)

    # Convert placeholders 0 to NULL
    top_id = int(top_id) if top_id and top_id != '0' else None
    bottom_id = int(bottom_id) if bottom_id and bottom_id != '0' else None
    shoes_id = int(shoes_id) if shoes_id and shoes_id != '0' else None
    acc_id = int(acc_id) if acc_id and acc_id != '0' else None

    db.execute_query(
        """INSERT INTO saved_outfits 
           (user_id, top_id, bottom_id, shoes_id, accessory_id, occasion, style, score) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        (session['user_id'], top_id, bottom_id, shoes_id, acc_id, occasion, style, score)
    )
    flash('Outfit saved to your collection! ❤️', 'success')
    return redirect(url_for('saved_outfits'))

# ==========================================
# COLOR ASSISTANT
# ==========================================

COLOR_PALETTES = {
    'Blue': {
        'matches': ['White', 'Beige', 'Black', 'Grey', 'Brown'],
        'description': 'Blue is extremely versatile. Pairing navy or light blue with white or beige gives a crisp, modern aesthetic.',
        'outfit_example': 'Light Blue Oxford Shirt + Beige Chinos + White Leather Sneakers'
    },
    'Black': {
        'matches': ['White', 'Beige', 'Red', 'Grey', 'Blue', 'Olive'],
        'description': 'Black adds contrast and structure. Works flawlessly in all-black monochrome or paired with crisp white.',
        'outfit_example': 'Black Crewneck Tee + Raw Denim Jeans + Black Boots'
    },
    'White': {
        'matches': ['Blue', 'Black', 'Beige', 'Green', 'Brown', 'Pink'],
        'description': 'White acts as a blank canvas, highlighting whichever secondary color you choose to style it with.',
        'outfit_example': 'White Linen Shirt + Olive Green Trousers + Tan Loafers'
    },
    'Beige': {
        'matches': ['White', 'Brown', 'Navy', 'Black', 'Forest Green'],
        'description': 'Beige provides warm neutral elegance. Best combined with earthy tones or rich navy blue contrast.',
        'outfit_example': 'Beige Knit Sweater + Navy Blue Tailored Pants + White Sneakers'
    },
    'Brown': {
        'matches': ['Cream', 'Beige', 'Light Blue', 'Denim', 'Olive'],
        'description': 'Rich brown evokes a cozy, sophisticated vintage vibe. Pair with light blues or warm off-whites.',
        'outfit_example': 'Brown Leather Jacket + Cream Turtleneck + Indigo Jeans'
    },
    'Green': {
        'matches': ['Beige', 'Black', 'White', 'Brown', 'Denim Blue'],
        'description': 'Olive and sage green bring an organic streetwear edge. Pairs effortlessly with black, beige, and blue denim.',
        'outfit_example': 'Olive Utility Overshirt + Black Tee + Light Jeans'
    },
    'Red': {
        'matches': ['Black', 'Navy Blue', 'White', 'Grey'],
        'description': 'Red is a strong statement color. Balance it out with solid neutral bottoms like black trousers or dark denim.',
        'outfit_example': 'Crimson Red Polo + Charcoal Trousers + Minimal Sneakers'
    },
    'Pink': {
        'matches': ['Grey', 'White', 'Navy Blue', 'Light Denim'],
        'description': 'Soft pastel pink looks elevated and modern when paired with charcoal grey, crisp white, or light washes.',
        'outfit_example': 'Pastel Pink Casual Shirt + Light Denim Jeans + White Sneakers'
    },
    'Yellow': {
        'matches': ['Navy Blue', 'Black', 'White', 'Dark Denim'],
        'description': 'Mustard or light yellow pops beautifully against dark navy or black bases.',
        'outfit_example': 'Mustard Yellow Sweater + Dark Navy Chinos + Brown Shoes'
    },
    'Purple': {
        'matches': ['White', 'Grey', 'Black', 'Beige'],
        'description': 'Lavender and deep purple add creative flair. Keep footwear and accessories minimal.',
        'outfit_example': 'Lavender Oversized Hoodie + Light Grey Joggers + White Sneakers'
    }
}

@app.route('/color-assistant')
@login_required
def color_assistant():
    selected_color = request.args.get('color', 'Blue')
    palette_info = COLOR_PALETTES.get(selected_color, COLOR_PALETTES['Blue'])
    return render_template('color_assistant.html',
                           selected_color=selected_color,
                           palette_info=palette_info,
                           all_colors=list(COLOR_PALETTES.keys()))

# ==========================================
# FIND MY STYLE QUIZ
# ==========================================

@app.route('/style-quiz', methods=['GET', 'POST'])
@login_required
def style_quiz():
    user_id = session['user_id']

    if request.method == 'POST':
        q1 = request.form.get('q1', 'Comfortable clothes')
        q2 = request.form.get('q2', 'Neutral colors')
        q3 = request.form.get('q3', 'Sneakers')
        q4 = request.form.get('q4', 'Casual')
        q5 = request.form.get('q5', 'Clean & Simple')

        # Simple Persona Scoring
        scores = {
            'Minimalist': 0,
            'Casual': 0,
            'Elegant': 0,
            'Streetwear': 0,
            'Sporty': 0,
            'Traditional': 0,
            'Y2K': 0
        }

        if 'Comfortable' in q1: scores['Casual'] += 2; scores['Minimalist'] += 1
        if 'Elegant' in q1: scores['Elegant'] += 3
        if 'Trendy' in q1: scores['Streetwear'] += 2; scores['Y2K'] += 2
        if 'Sporty' in q1: scores['Sporty'] += 3

        if 'Neutral' in q2: scores['Minimalist'] += 2; scores['Casual'] += 1
        if 'Vibrant' in q2: scores['Y2K'] += 2; scores['Streetwear'] += 1
        if 'Dark' in q2: scores['Streetwear'] += 2; scores['Minimalist'] += 1

        if 'Sneakers' in q3: scores['Casual'] += 1; scores['Sporty'] += 2
        if 'Boots' in q3: scores['Streetwear'] += 2; scores['Elegant'] += 1
        if 'Loafers' in q3: scores['Elegant'] += 3

        # Determine winner
        result_style = max(scores, key=scores.get)

        # Save to database
        db.execute_query(
            """INSERT INTO style_quiz (user_id, answer1, answer2, answer3, answer4, answer5, result) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (user_id, q1, q2, q3, q4, q5, result_style)
        )
        db.execute_query(
            "UPDATE style_preferences SET style = %s WHERE user_id = %s",
            (result_style, user_id)
        )

        flash(f'Quiz Complete! Your dominant style is {result_style.upper()} ✨', 'success')
        return redirect(url_for('style_quiz', result=result_style))

    # GET method - Check past result
    result_param = request.args.get('result')
    past_quiz = db.execute_query(
        "SELECT * FROM style_quiz WHERE user_id = %s ORDER BY id DESC LIMIT 1", (user_id,), fetch_one=True
    )
    
    current_result = result_param or (past_quiz['result'] if past_quiz else None)

    return render_template('style_quiz.html', result=current_result)

# ==========================================
# OUTFIT ANALYZER
# ==========================================

@app.route('/outfit-analyzer', methods=['GET', 'POST'])
@login_required
def outfit_analyzer():
    result = None

    if request.method == 'POST':
        top_color = request.form.get('top_color', 'White')
        bottom_color = request.form.get('bottom_color', 'Blue')
        shoes_color = request.form.get('shoes_color', 'White')
        occasion = request.form.get('occasion', 'Casual')

        score = 7
        pros = []
        suggestions = []

        # Color Harmony Check
        if bottom_color in COLOR_HARMONY.get(top_color, []):
            score += 2
            pros.append(f"Excellent color pairing between {top_color} top and {bottom_color} bottom.")
        elif top_color == bottom_color:
            score += 1
            pros.append(f"Clean monochromatic look with {top_color}.")
        else:
            suggestions.append(f"Consider swapping the {bottom_color} bottom for neutral Beige, Black, or White to harmonize better with {top_color}.")

        # Shoe matching
        if shoes_color in ['White', 'Black'] or shoes_color == top_color or shoes_color == bottom_color:
            score += 1
            pros.append(f"Footwear in {shoes_color} anchors the outfit seamlessly.")
        else:
            suggestions.append("Neutral white or black shoes create a more cohesive visual baseline.")

        # Occasion appropriateness
        if occasion in ['Formal', 'Interview'] and 'White' in [top_color, shoes_color]:
            pros.append("Crisp white element adds high professional polish.")
        
        if not suggestions:
            suggestions.append("Outfit is well-balanced! Add a subtle silver watch or leather belt for an extra touch of sophistication.")

        score = min(10, score)

        result = {
            'score': score,
            'top_color': top_color,
            'bottom_color': bottom_color,
            'shoes_color': shoes_color,
            'occasion': occasion,
            'pros': pros,
            'suggestions': suggestions
        }

    return render_template('outfit_analyzer.html', result=result)

# ==========================================
# SAVED OUTFITS
# ==========================================

@app.route('/saved-outfits')
@login_required
def saved_outfits():
    user_id = session['user_id']
    saved = db.execute_query(
        """SELECT s.*, 
                  t.item_name as top_name, t.color as top_color, t.image as top_image,
                  b.item_name as bottom_name, b.color as bottom_color, b.image as bottom_image,
                  sh.item_name as shoes_name, sh.color as shoes_color, sh.image as shoes_image,
                  acc.item_name as acc_name, acc.color as acc_color, acc.image as acc_image
           FROM saved_outfits s
           LEFT JOIN wardrobe t ON s.top_id = t.id
           LEFT JOIN wardrobe b ON s.bottom_id = b.id
           LEFT JOIN wardrobe sh ON s.shoes_id = sh.id
           LEFT JOIN wardrobe acc ON s.accessory_id = acc.id
           WHERE s.user_id = %s 
           ORDER BY s.id DESC""", (user_id,), fetch_all=True
    )
    return render_template('saved_outfits.html', saved_outfits=saved or [])

@app.route('/saved-outfits/delete/<int:outfit_id>', methods=['POST', 'GET'])
@login_required
def delete_saved_outfit(outfit_id):
    user_id = session['user_id']
    db.execute_query("DELETE FROM saved_outfits WHERE id = %s AND user_id = %s", (outfit_id, user_id))
    flash('Saved outfit removed.', 'info')
    return redirect(url_for('saved_outfits'))

# ==========================================
# PROFILE & USER SETTINGS
# ==========================================

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user_id = session['user_id']

    if request.method == 'POST':
        style = request.form.get('style', 'Casual')
        favorite_color = request.form.get('favorite_color', 'Blue')
        preferred_fit = request.form.get('preferred_fit', 'Regular')
        preferred_occasion = request.form.get('preferred_occasion', 'Casual')

        existing = db.execute_query("SELECT id FROM style_preferences WHERE user_id = %s", (user_id,), fetch_one=True)
        if existing:
            db.execute_query(
                """UPDATE style_preferences 
                   SET style=%s, favorite_color=%s, preferred_fit=%s, preferred_occasion=%s 
                   WHERE user_id=%s""",
                (style, favorite_color, preferred_fit, preferred_occasion, user_id)
            )
        else:
            db.execute_query(
                """INSERT INTO style_preferences 
                   (user_id, style, favorite_color, preferred_fit, preferred_occasion) 
                   VALUES (%s, %s, %s, %s, %s)""",
                (user_id, style, favorite_color, preferred_fit, preferred_occasion)
            )
        flash('Style preferences updated successfully!', 'success')
        return redirect(url_for('profile'))

    user = db.execute_query("SELECT * FROM users WHERE id = %s", (user_id,), fetch_one=True)
    pref = db.execute_query("SELECT * FROM style_preferences WHERE user_id = %s", (user_id,), fetch_one=True) or {}
    
    wardrobe_count_res = db.execute_query("SELECT COUNT(*) as cnt FROM wardrobe WHERE user_id = %s", (user_id,), fetch_one=True)
    wardrobe_count = wardrobe_count_res['cnt'] if wardrobe_count_res else 0

    saved_count_res = db.execute_query("SELECT COUNT(*) as cnt FROM saved_outfits WHERE user_id = %s", (user_id,), fetch_one=True)
    saved_count = saved_count_res['cnt'] if saved_count_res else 0

    return render_template('profile.html',
                           user=user,
                           pref=pref,
                           wardrobe_count=wardrobe_count,
                           saved_count=saved_count)

if __name__ == '__main__':
    print("✨ Starting StyleSense - AI Outfit & Personal Style Assistant...")
    print("🌐 Access application at: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)

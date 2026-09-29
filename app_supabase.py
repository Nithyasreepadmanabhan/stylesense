"""
StyleSense Flask Backend - Supabase Migration
Uses Supabase PostgreSQL for data storage and Supabase Auth for authentication
"""

import os
import random
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from dotenv import load_dotenv
from supabase import create_client, Client
import jwt
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'stylesense_secret_key_college_project_2026')

# ============================================
# SUPABASE CONFIGURATION
# ============================================

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("⚠️  WARNING: Supabase environment variables not configured!")
    print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file")

# Initialize Supabase client with service role key (for backend operations)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ============================================
# AUTHENTICATION DECORATORS
# ============================================

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get current user from session"""
    if 'user_id' in session:
        return {
            'id': session['user_id'],
            'email': session.get('user_email'),
            'name': session.get('user_name')
        }
    return None

# ============================================
# AUTHENTICATION ROUTES
# ============================================

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

        # Validation
        if not name or not email or not password:
            flash('All fields are required.', 'danger')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')

        try:
            # Sign up user with Supabase Auth
            res = supabase.auth.sign_up({
                "email": email,
                "password": password,
            })

            if res and res.user:
                user_id = res.user.id

                # Create user profile in users table
                supabase.table('users').insert({
                    'id': user_id,
                    'name': name,
                    'email': email
                }).execute()

                # Create default style preferences
                supabase.table('style_preferences').insert({
                    'user_id': user_id,
                    'style': 'Casual',
                    'favorite_color': 'Blue',
                    'preferred_fit': 'Regular',
                    'preferred_occasion': 'Casual'
                }).execute()

                flash('Registration successful! Please log in.', 'success')
                return redirect(url_for('login'))
            else:
                flash('Registration failed. Please try again.', 'danger')

        except Exception as e:
            print(f"Registration error: {str(e)}")
            flash(f'Registration error: {str(e)}', 'danger')

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please enter both email and password.', 'danger')
            return render_template('login.html')

        try:
            # Sign in with Supabase Auth
            res = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

            if res and res.user:
                user_id = res.user.id

                # Get user profile
                user_data = supabase.table('users').select('*').eq('id', user_id).single().execute()

                if user_data and user_data.data:
                    # Set session
                    session['user_id'] = user_id
                    session['user_name'] = user_data.data.get('name')
                    session['user_email'] = user_data.data.get('email')

                    flash(f"Welcome back, {user_data.data.get('name')}! 👋", 'success')
                    return redirect(url_for('home'))
            else:
                flash('Invalid email or password. Please try again.', 'danger')

        except Exception as e:
            print(f"Login error: {str(e)}")
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    try:
        supabase.auth.sign_out()
    except Exception as e:
        print(f"Logout error: {str(e)}")

    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# ============================================
# HOME & DASHBOARD
# ============================================

@app.route('/home')
@login_required
def home():
    user_id = session['user_id']

    try:
        # Get wardrobe count
        wardrobe_result = supabase.table('wardrobe_items').select('count').eq('user_id', user_id).execute()
        wardrobe_count = len(wardrobe_result.data) if wardrobe_result.data else 0

        # Get saved outfits count
        outfits_result = supabase.table('saved_outfits').select('count').eq('user_id', user_id).execute()
        saved_count = len(outfits_result.data) if outfits_result.data else 0

        # Get style preferences
        pref_result = supabase.table('style_preferences').select('style').eq('user_id', user_id).single().execute()
        current_style = pref_result.data.get('style') if pref_result.data else 'Casual / Minimalist'

        # Fashion tips
        tips = [
            "Monochrome magic: Wearing different shades of the same color creates a sleek, elongated silhouette.",
            "Rule of Thirds: Tucking in your shirt creates a 1/3 to 2/3 ratio that visually enhances height and proportions.",
            "Anchor with neutrals: Match vibrant colored tops with classic neutral bottoms like dark jeans or beige chinos.",
            "Shoes set the tone: The right pair of clean sneakers can turn formal trousers into chic everyday streetwear.",
            "Layer with purpose: Adding a structured blazer or denim jacket instantly elevates a basic white t-shirt."
        ]
        today_tip = random.choice(tips)

    except Exception as e:
        print(f"Dashboard error: {str(e)}")
        wardrobe_count = 0
        saved_count = 0
        current_style = 'Casual'
        today_tip = "Loading style tips..."

    return render_template('home.html',
                          user_name=session.get('user_name'),
                          wardrobe_count=wardrobe_count,
                          saved_count=saved_count,
                          current_style=current_style,
                          today_tip=today_tip)

# ============================================
# DIGITAL WARDROBE OPERATIONS
# ============================================

@app.route('/wardrobe')
@login_required
def wardrobe():
    user_id = session['user_id']
    try:
        items_result = supabase.table('wardrobe_items').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        items = items_result.data if items_result.data else []
    except Exception as e:
        print(f"Wardrobe error: {str(e)}")
        items = []

    return render_template('wardrobe.html', items=items)

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
        style = request.form.get('style', 'Casual')

        if not item_name or not category or not color:
            flash('Item Name, Category, and Color are required.', 'danger')
            return render_template('add_clothing.html')

        try:
            # Insert into Supabase
            supabase.table('wardrobe_items').insert({
                'user_id': session['user_id'],
                'name': item_name,
                'category': category,
                'color': color,
                'pattern': pattern,
                'season': season,
                'occasion': occasion,
                'style': style
            }).execute()

            flash(f'Added "{item_name}" to your digital wardrobe! ✨', 'success')
            return redirect(url_for('wardrobe'))

        except Exception as e:
            print(f"Add item error: {str(e)}")
            flash(f'Error adding item: {str(e)}', 'danger')

    return render_template('add_clothing.html')

# ============================================
# API ENDPOINTS FOR OUTFIT RECOMMENDATIONS
# ============================================

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

@app.route('/api/recommend-outfit', methods=['POST'])
@login_required
def recommend_outfit():
    """AI-powered outfit recommendation engine"""
    user_id = session['user_id']
    data = request.get_json()

    occasion = data.get('occasion', 'Casual')
    style = data.get('style', 'Casual')
    weather = data.get('weather', 'Normal')

    try:
        # Fetch user's wardrobe items
        wardrobe_result = supabase.table('wardrobe_items').select('*').eq('user_id', user_id).execute()
        wardrobe = wardrobe_result.data if wardrobe_result.data else []

        # Filter by category
        tops = [w for w in wardrobe if w.get('category') == 'Top']
        bottoms = [w for w in wardrobe if w.get('category') == 'Bottom']
        shoes = [w for w in wardrobe if w.get('category') == 'Shoes']

        if not tops or not bottoms or not shoes:
            return jsonify({'error': 'Incomplete wardrobe. Please add more items.'}), 400

        # Simple recommendation algorithm
        best_combination = None
        max_score = -1

        for top in tops:
            for bottom in bottoms:
                for shoe in shoes:
                    score = 0

                    # Occasion match
                    if top.get('occasion') == occasion: score += 1
                    if bottom.get('occasion') == occasion: score += 1
                    if shoe.get('occasion') == occasion: score += 1

                    # Color harmony
                    top_color = top.get('color', 'White')
                    bottom_color = bottom.get('color', 'Blue')
                    compatible = COLOR_HARMONY.get(top_color, ['White', 'Black', 'Blue', 'Beige'])
                    if bottom_color in compatible: score += 2

                    if score > max_score:
                        max_score = score
                        best_combination = (top, bottom, shoe)

        if not best_combination:
            return jsonify({'error': 'No suitable combination found.'}), 400

        top, bottom, shoe = best_combination
        final_score = min(10, max(7, round(7 + (max_score / 10) * 3)))

        return jsonify({
            'top': top,
            'bottom': bottom,
            'shoes': shoe,
            'score': final_score,
            'occasion': occasion,
            'style': style
        })

    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    flash('Page not found.', 'danger')
    return redirect(url_for('home')), 404

@app.errorhandler(500)
def server_error(error):
    flash('An error occurred. Please try again.', 'danger')
    return redirect(url_for('home')), 500

# ============================================
# APPLICATION STARTUP
# ============================================

if __name__ == '__main__':
    print("✨ Starting StyleSense - Supabase Edition...")
    print(f"🌐 Supabase URL: {SUPABASE_URL}")
    print("🚀 Access application at: http://127.0.0.1:5000")
    print("\n⚠️  Make sure to:")
    print("   1. Set environment variables in .env file")
    print("   2. Run database migrations in Supabase SQL Editor")
    print("   3. Configure Authentication in Supabase Dashboard")

    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

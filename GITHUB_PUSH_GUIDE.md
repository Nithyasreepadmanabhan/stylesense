# 🔐 GitHub Push Guide - Permission Issue

## Problem
The repository is configured for `Nithyasreepadmanabhan` but the PC is logged in as `praanesh06`.

## Solution Options

### Option 1: Use SSH Key (Recommended for Friend's Account)
**If your friend has SSH key configured on their GitHub account:**

```bash
# Change remote to use SSH instead of HTTPS
git remote remove origin
git remote add origin git@github.com:Nithyasreepadmanabhan/stylesense.git

# Push to GitHub
git push -u origin main
```

**Setup SSH (if not already done):**
1. On friend's GitHub account → Settings → SSH and GPG keys
2. Check if SSH key exists (usually `~/.ssh/id_rsa.pub`)
3. If not, generate: `ssh-keygen -t rsa -b 4096`
4. Add public key to GitHub

### Option 2: Use Personal Access Token

1. Friend logs into their GitHub account
2. Go to Settings → Developer settings → Personal access tokens
3. Create new token with `repo` scope
4. Use token as password when pushing:

```bash
git push -u origin main
# When prompted for password, paste the token instead
```

### Option 3: Let Friend Push Directly

Have your friend run these commands on their computer:

```bash
# Clone the repo
git clone https://github.com/Nithyasreepadmanabhan/stylesense.git

# Navigate to directory
cd stylesense

# Add all the project files (copy the modified code)
# Then commit and push
git add .
git commit -m "Initial commit with Supabase integration"
git push origin main
```

### Option 4: Use Stored Credentials

```bash
# Clear stored credentials
git credential reject https://github.com

# Reconfigure git with friend's email
git config user.email "nithyasree@example.com"  # Friend's email
git config user.name "Nithyasreepadmanabhan"     # Friend's name

# When pushing, enter friend's GitHub username and personal access token
git push -u origin main
```

## Quick Commands

```bash
# Check current git config
git config --list | grep user

# Check current remote
git remote -v

# Change remote to SSH (if key configured)
git remote set-url origin git@github.com:Nithyasreepadmanabhan/stylesense.git

# Push to GitHub
git push -u origin main
```

## Current Repository Status

✅ Repository initialized locally
✅ 97 files staged and committed
✅ Commit hash: 3b16f92
✅ Branch: main
❌ Remote: Not connected (permission issue)

## Files Ready to Push

```
src/                        - React TypeScript components
supabase/migrations/       - Database schema
app_supabase.py           - Flask backend (Supabase version)
.env.example              - Environment template
README.md                 - Project documentation
package.json              - Node dependencies
requirements_supabase.txt - Python dependencies
```

## Next Steps

1. **Choose one of the solutions above**
2. **Execute the appropriate commands**
3. **Verify push:**
   ```bash
   git log --oneline origin/main
   ```

4. **Confirm on GitHub:**
   - Visit https://github.com/Nithyasreepadmanabhan/stylesense
   - You should see all the files uploaded

## Need Help?

- **SSH Key Issue?** Friend should check GitHub SSH keys section
- **Personal Access Token?** Friend should generate one with `repo` scope
- **Still failing?** Make sure friend's credentials are correct

---

**All code is committed and ready to push!**
Just need to authenticate with your friend's GitHub account.

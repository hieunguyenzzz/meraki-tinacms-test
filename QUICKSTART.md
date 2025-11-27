# TinaCMS Self-Hosted Backend - Quick Start

## ✅ Implementation Complete

All code and configuration files have been created. Now you need to complete the setup steps.

---

## 📋 What You Need to Do Next

### Step 1: Create GitHub OAuth App (5 minutes)

1. Visit: <https://github.com/settings/developers>
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Meraki TinaCMS (Dev)`
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. **Copy** the Client ID and Client Secret

### Step 2: Create GitHub Personal Access Token (3 minutes)

1. Visit: <https://github.com/settings/tokens>
2. Click **Generate new token (classic)**
3. Set:
   - **Note**: `TinaCMS Backend - Meraki`
   - **Scopes**: ✅ Check `repo` (full control)
4. Generate and **copy** the token (starts with `ghp_`)

### Step 3: Configure Environment Variables (5 minutes)

```bash
# Copy the example file
cp .env.local.example .env.local

# Generate secrets
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "TINA_TOKEN=$(openssl rand -base64 24)"

# Edit .env.local and fill in:
# - GITHUB_CLIENT_ID (from Step 1)
# - GITHUB_CLIENT_SECRET (from Step 1)
# - GITHUB_PERSONAL_ACCESS_TOKEN (from Step 2)
# - NEXTAUTH_SECRET (generated above)
# - TINA_TOKEN (generated above)
```

### Step 4: Start Docker Services (2 minutes)

```bash
# Start PostgreSQL and the application
docker-compose up -d

# View logs to verify everything started
docker-compose logs -f
```

### Step 5: Test the Setup (5 minutes)

1. Open browser: <http://localhost:3000>
2. Navigate to: <http://localhost:3000/admin>
3. Click **Sign in with GitHub**
4. Authorize the OAuth app
5. Edit some content and save
6. Check GitHub repo for new commits!

---

## 📁 Files Created

### Configuration Files

- ✅ `docker-compose.yml` - Docker services setup
- ✅ `.env.local.example` - Environment variables template
- ✅ `Dockerfile` - Multi-stage Docker build

### Backend Code

- ✅ `src/app/api/auth/[...nextauth]/route.ts` - Auth.js with GitHub OAuth
- ✅ `src/app/api/tina/[...routes]/route.ts` - TinaCMS GraphQL API
- ✅ `tina/config.ts` - Updated for backend mode

### Database

- ✅ `scripts/init-db.sql` - PostgreSQL schema initialization

### Documentation

- ✅ `DATABASE_SETUP.md` - Comprehensive setup guide
- ✅ `TINACMS_BACKEND_SPEC.md` - Technical specifications
- ✅ `QUICKSTART.md` - This file

---

## 🔧 Troubleshooting

### OAuth errors?

- Verify callback URL is exactly: `http://localhost:3000/api/auth/callback/github`
- Check Client ID and Secret are correct in `.env.local`

### Database won't start?

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Can't commit to GitHub?

- Verify Personal Access Token has `repo` scope
- Check token isn't expired
- Ensure GITHUB_OWNER and GITHUB_REPO are correct

---

## 📚 Full Documentation

For detailed information, see:

- **`DATABASE_SETUP.md`** - Complete setup, production deployment, backups
- **`TINACMS_BACKEND_SPEC.md`** - Architecture and decisions

---

## 🎯 Expected Result

Once setup is complete:

- ✅ Access TinaCMS admin at `/admin`
- ✅ Sign in with GitHub OAuth
- ✅ Edit content in bilingual (EN/VI) MDX files
- ✅ Changes automatically committed to GitHub
- ✅ Multi-user support with user tracking
- ✅ PostgreSQL database for sessions and metadata

---

## ⏱️ Total Setup Time: ~20 minutes

Good luck! 🚀

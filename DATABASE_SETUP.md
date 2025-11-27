# TinaCMS Self-Hosted Backend Setup Guide

This guide walks you through setting up the TinaCMS self-hosted backend with PostgreSQL, GitHub OAuth, and Docker.

## Prerequisites

- Docker & Docker Compose installed
- GitHub account with repository access
- Domain name (for production) or localhost (for development)
- Yarn 1.22.x installed locally

---

## Step 1: GitHub OAuth Application Setup

### Create GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - Or visit: https://github.com/settings/developers

2. Fill in the application details:
   ```
   Application name: Meraki TinaCMS (Dev)
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

3. Click **Register application**

4. **Save the credentials:**
   - Copy the **Client ID**
   - Generate and copy the **Client Secret**

### Create GitHub Personal Access Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - Or visit: https://github.com/settings/tokens

2. Click **Generate new token (classic)**

3. Configure token:
   ```
   Note: TinaCMS Backend - Meraki
   Expiration: No expiration (or custom)
   Scopes: ✅ repo (Full control of private repositories)
   ```

4. Generate and **save the token** (starts with `ghp_`)

---

## Step 2: Environment Configuration

### Create `.env.local` file

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

### Edit `.env.local` with your credentials:

```env
# Database (use these for local Docker development)
DATABASE_URL=postgresql://tinacms:tinacms_dev_password@localhost:5432/tinacms

# GitHub OAuth (from Step 1)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Repository details (already configured)
GITHUB_OWNER=hieunguyenzzz
GITHUB_REPO=meraki-tinacms-test
GITHUB_BRANCH=main

# Auth.js - Generate a secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# TinaCMS
TINA_PUBLIC_IS_LOCAL=false
TINA_TOKEN=$(openssl rand -base64 24)

# Optional: Restrict access to specific GitHub users
# ALLOWED_GITHUB_USERS=hieunguyenzzz,username2,username3
```

### Generate secrets:

```bash
# Generate NEXTAUTH_SECRET
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"

# Generate TINA_TOKEN
echo "TINA_TOKEN=$(openssl rand -base64 24)"
```

Copy the generated values into your `.env.local` file.

---

## Step 3: Start Docker Services

### Start PostgreSQL and the application:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### Verify PostgreSQL is running:

```bash
# Connect to PostgreSQL
docker exec -it meraki-tinacms-db psql -U tinacms -d tinacms

# Check tables (should see users, sessions, commits, content_locks)
\dt

# Exit
\q
```

---

## Step 4: Local Development (Without Docker)

If you prefer running locally without Docker:

### Install dependencies:

```bash
yarn install
```

### Start PostgreSQL separately:

```bash
# Option 1: Use Docker for database only
docker-compose up -d postgres

# Option 2: Use local PostgreSQL
# Update DATABASE_URL in .env.local to match your local instance
```

### Run database initialization:

```bash
# Connect to your database
psql -U tinacms -d tinacms -f scripts/init-db.sql
```

### Start development server:

```bash
yarn dev
```

---

## Step 5: First Login & Testing

### Access the application:

1. Open browser: http://localhost:3000
2. Navigate to admin: http://localhost:3000/admin
3. Click **Sign in with GitHub**
4. Authorize the OAuth application
5. You should be redirected back and authenticated

### Test content editing:

1. In TinaCMS admin, edit any content
2. Save changes
3. Check GitHub repository for new commits
4. Verify changes are committed with your GitHub user

### Troubleshooting:

**OAuth errors:**
- Verify callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
- Check Client ID and Secret are correct
- Ensure OAuth app is not disabled

**Database connection errors:**
- Verify PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL is correct
- View logs: `docker-compose logs postgres`

**Git commit errors:**
- Verify GITHUB_PERSONAL_ACCESS_TOKEN has `repo` scope
- Check token is not expired
- Ensure repository exists and you have write access

---

## Step 6: Production Deployment

### Update environment variables for production:

```env
# Update URLs to your domain
NEXTAUTH_URL=https://your-domain.com
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/callback/github

# Use strong passwords for database
DATABASE_URL=postgresql://prod_user:strong_password@db_host:5432/tinacms_prod

# Generate new secrets (never reuse development secrets!)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
TINA_TOKEN=$(openssl rand -base64 32)
```

### Update GitHub OAuth App:

1. Create a **new OAuth App** for production (don't reuse dev app)
2. Set production URLs:
   ```
   Homepage URL: https://your-domain.com
   Callback URL: https://your-domain.com/api/auth/callback/github
   ```

### Deploy with Docker:

```bash
# Build production image
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose -f docker-compose.yml up -d
```

### SSL/HTTPS Setup:

Use a reverse proxy like Nginx or Traefik with Let's Encrypt:

```nginx
# Nginx example
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 7: Database Backup & Maintenance

### Backup database:

```bash
# Create backup
docker exec meraki-tinacms-db pg_dump -U tinacms tinacms > backup-$(date +%Y%m%d).sql

# Restore backup
cat backup-20251124.sql | docker exec -i meraki-tinacms-db psql -U tinacms -d tinacms
```

### Scheduled backups (cron):

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

### Database maintenance:

```bash
# Vacuum database (optimize)
docker exec meraki-tinacms-db psql -U tinacms -d tinacms -c "VACUUM ANALYZE;"

# Check database size
docker exec meraki-tinacms-db psql -U tinacms -d tinacms -c "SELECT pg_size_pretty(pg_database_size('tinacms'));"
```

---

## User Management

### Add allowed users:

Edit `.env.local`:
```env
ALLOWED_GITHUB_USERS=hieunguyenzzz,editor1,editor2
```

Restart the application:
```bash
docker-compose restart app
```

### View current users:

```bash
docker exec -it meraki-tinacms-db psql -U tinacms -d tinacms -c "SELECT username, email, created_at FROM users;"
```

---

## Monitoring & Logs

### View application logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Monitor resource usage:

```bash
docker stats meraki-tinacms-app meraki-tinacms-db
```

---

## Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Issue: Database connection refused
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue: TinaCMS admin shows "Unauthorized"
- Verify you're signed in: Check top-right corner for GitHub avatar
- Check browser console for errors
- Verify NEXTAUTH_SECRET is set correctly

### Issue: Changes not committing to GitHub
- Check GITHUB_PERSONAL_ACCESS_TOKEN has `repo` scope
- Verify repository and branch names are correct
- Check application logs for Git errors

---

## Architecture Overview

```
┌──────────────────────────────────────┐
│  Client Browser                       │
│  - Access /admin for TinaCMS          │
│  - OAuth authentication flow          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Next.js Application (Port 3000)     │
│  - TinaCMS UI & GraphQL API          │
│  - Auth.js for authentication        │
│  - API routes for backend logic      │
└───────┬──────────────┬───────────────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────────┐
│  PostgreSQL  │  │  GitHub API      │
│  (Port 5432) │  │  - OAuth         │
│  - Users     │  │  - Git commits   │
│  - Sessions  │  │  - Repository    │
└──────────────┘  └──────────────────┘
```

---

## Next Steps

1. ✅ Complete initial setup
2. Test content editing workflow
3. Add team members to ALLOWED_GITHUB_USERS
4. Set up automated backups
5. Configure production deployment
6. Set up SSL certificates
7. Monitor application performance

---

## Support & Resources

- TinaCMS Docs: https://tina.io/docs/
- NextAuth.js Docs: https://next-auth.js.org/
- PostgreSQL Docs: https://www.postgresql.org/docs/

For project-specific questions, refer to:
- `TINACMS_BACKEND_SPEC.md` - Technical specifications
- `.github/copilot-instructions.md` - Development guidelines

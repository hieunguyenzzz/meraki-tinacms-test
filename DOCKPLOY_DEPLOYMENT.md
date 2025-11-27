# Deploying TinaCMS to Dockploy - Complete Guide

## 🚀 Overview

This guide walks you through deploying the Meraki TinaCMS project to **Dockploy**, a Docker-based deployment platform. You'll set up PostgreSQL, GitHub OAuth, and the Next.js application with TinaCMS backend.

---

## 📋 Prerequisites

- [ ] Dockploy account and server access
- [ ] Domain name pointed to your Dockploy server
- [ ] GitHub account with repository access
- [ ] SSH access to your Dockploy server (for initial setup)

**Estimated time: 30-45 minutes**

---

## Step 1: Create Production GitHub OAuth App

### 1.1 Create OAuth Application

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps**
   - URL: https://github.com/settings/developers

2. Click **New OAuth App** and fill in:
   ```
   Application name: Meraki TinaCMS (Production)
   Homepage URL: https://your-domain.com
   Authorization callback URL: https://your-domain.com/api/auth/callback/github
   ```
   
   ⚠️ **Important**: Replace `your-domain.com` with your actual domain!

3. Click **Register application**

4. **Save these credentials** (you'll need them in Step 3):
   - Client ID (starts with `Ov23...`)
   - Client Secret (click "Generate a new client secret")

### 1.2 Create GitHub Personal Access Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - URL: https://github.com/settings/tokens

2. Click **Generate new token (classic)**

3. Configure:
   ```
   Note: TinaCMS Production - Meraki
   Expiration: No expiration (or 1 year)
   Scopes: ✅ repo (Full control of private repositories)
   ```

4. Generate and **copy the token** (starts with `ghp_`)

---

## Step 2: Generate Security Secrets

Run these commands locally or on your server to generate secure secrets:

```bash
# Generate NEXTAUTH_SECRET (32+ characters)
openssl rand -base64 32

# Generate TINA_TOKEN (24+ characters)
openssl rand -base64 24

# Generate strong PostgreSQL password
openssl rand -base64 24
```

**Save all three values** - you'll need them in the next step.

---

## Step 3: Configure Dockploy Environment Variables

### In Dockploy Dashboard:

1. **Create New Application**
   - Type: Docker Compose
   - Repository: `https://github.com/hieunguyenzzz/meraki-tinacms-test`
   - Branch: `main`
   - Docker Compose File: `docker-compose.prod.yml`

2. **Set Environment Variables**

Click on "Environment Variables" and add these (use values from Steps 1 & 2):

```env
# Database
POSTGRES_USER=tinacms
POSTGRES_PASSWORD=<paste your generated DB password from Step 2>
POSTGRES_DB=tinacms

# GitHub OAuth (from Step 1.1)
GITHUB_CLIENT_ID=<your production OAuth Client ID>
GITHUB_CLIENT_SECRET=<your production OAuth Client Secret>
GITHUB_OWNER=hieunguyenzzz
GITHUB_REPO=meraki-tinacms-test
GITHUB_BRANCH=main

# GitHub Personal Access Token (from Step 1.2)
GITHUB_PERSONAL_ACCESS_TOKEN=<your production PAT>

# Auth.js
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<paste secret from Step 2>

# TinaCMS
TINA_PUBLIC_IS_LOCAL=false
TINA_TOKEN=<paste token from Step 2>

# User Access Control (optional but recommended)
ALLOWED_GITHUB_USERS=hieunguyenzzz,teammate1,teammate2

# Docker Settings
APP_PORT=3000
NODE_ENV=production
```

⚠️ **Replace placeholders:**
- `your-domain.com` → Your actual domain
- `<paste...>` → Values from Steps 1 & 2

---

## Step 4: Configure Domain & SSL

### 4.1 In Dockploy:

1. Go to **Domains** section
2. Add your domain: `your-domain.com`
3. Enable **SSL/TLS** (Dockploy usually handles this automatically)
4. Set port mapping: `80:3000` and `443:3000`

### 4.2 DNS Configuration:

Ensure your domain's DNS points to your Dockploy server:

```
Type: A Record
Name: @ (or subdomain)
Value: <your-dockploy-server-ip>
TTL: 300
```

Wait 5-10 minutes for DNS propagation.

---

## Step 5: Deploy the Application

### 5.1 Initial Deployment:

1. In Dockploy, click **Deploy** or **Build & Deploy**
2. Monitor the build logs for errors
3. Wait for build to complete (~5-10 minutes first time)

### 5.2 Verify Services:

Check that both containers are running:

```bash
# SSH into your Dockploy server
docker ps

# You should see:
# - meraki-tinacms-db-prod (PostgreSQL)
# - meraki-tinacms-app-prod (Next.js app)
```

### 5.3 Check Logs:

```bash
# View application logs
docker logs meraki-tinacms-app-prod

# View database logs
docker logs meraki-tinacms-db-prod

# Follow logs in real-time
docker logs -f meraki-tinacms-app-prod
```

---

## Step 6: Test the Deployment

### 6.1 Access the Application:

1. **Homepage**: `https://your-domain.com`
   - Should load without errors
   
2. **Health Check**: `https://your-domain.com/api/health`
   - Should return: `{"status":"healthy",...}`

3. **TinaCMS Admin**: `https://your-domain.com/admin`
   - Should show the TinaCMS login screen

### 6.2 Test Authentication:

1. Go to `https://your-domain.com/admin`
2. Click **Sign in with GitHub**
3. Authorize the OAuth application
4. You should be redirected back and authenticated

### 6.3 Test Content Editing:

1. Once logged in, edit any content
2. Save changes
3. Go to your GitHub repository
4. Check for new commits with your changes

---

## Step 7: Database Backup Setup

### 7.1 Manual Backup:

```bash
# SSH into your server
ssh user@your-dockploy-server

# Create backup
docker exec meraki-tinacms-db-prod pg_dump -U tinacms tinacms > backup-$(date +%Y%m%d).sql

# Download backup to local machine
scp user@your-server:~/backup-*.sql ./backups/
```

### 7.2 Automated Backups (Recommended):

Create a cron job on your server:

```bash
# Edit crontab
crontab -e

# Add this line (daily backup at 2 AM)
0 2 * * * docker exec meraki-tinacms-db-prod pg_dump -U tinacms tinacms > ~/backups/tinacms-$(date +\%Y\%m\%d).sql

# Keep only last 7 days
0 3 * * * find ~/backups/ -name "tinacms-*.sql" -mtime +7 -delete
```

---

## Step 8: Monitoring & Maintenance

### 8.1 Check Container Health:

```bash
# Container status
docker ps

# Resource usage
docker stats meraki-tinacms-app-prod meraki-tinacms-db-prod

# Health check
curl https://your-domain.com/api/health
```

### 8.2 View Logs:

```bash
# Recent logs
docker logs --tail 100 meraki-tinacms-app-prod

# Live logs
docker logs -f meraki-tinacms-app-prod

# Database logs
docker logs meraki-tinacms-db-prod
```

### 8.3 Restart Services:

```bash
# Restart app only
docker restart meraki-tinacms-app-prod

# Restart both services
docker-compose -f docker-compose.prod.yml restart
```

---

## 🔧 Troubleshooting

### Issue: "Failed loading TinaCMS assets"

**Cause**: Backend GraphQL API not responding

**Fix**:
```bash
# Check app logs for errors
docker logs meraki-tinacms-app-prod

# Verify environment variables are set
docker exec meraki-tinacms-app-prod env | grep TINA

# Restart the app
docker restart meraki-tinacms-app-prod
```

---

### Issue: OAuth Error "Redirect URI Mismatch"

**Cause**: GitHub OAuth callback URL doesn't match

**Fix**:
1. Go to your GitHub OAuth App settings
2. Ensure callback URL is: `https://your-domain.com/api/auth/callback/github`
3. Must be **exact match** (no trailing slash, https not http)
4. Update NEXTAUTH_URL in Dockploy environment variables

---

### Issue: Database Connection Refused

**Cause**: PostgreSQL not started or wrong credentials

**Fix**:
```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs meraki-tinacms-db-prod

# Verify connection from app
docker exec -it meraki-tinacms-app-prod sh
apk add postgresql-client
psql $DATABASE_URL
```

---

### Issue: 502 Bad Gateway

**Cause**: App container not running or crashed

**Fix**:
```bash
# Check container status
docker ps -a

# Check why it stopped
docker logs meraki-tinacms-app-prod

# Restart
docker restart meraki-tinacms-app-prod

# Rebuild if needed
cd /path/to/project
docker-compose -f docker-compose.prod.yml up -d --build
```

---

### Issue: Changes Not Committing to GitHub

**Cause**: Invalid GitHub Personal Access Token or missing permissions

**Fix**:
1. Verify token has `repo` scope at https://github.com/settings/tokens
2. Check token hasn't expired
3. Update token in Dockploy environment variables
4. Restart app: `docker restart meraki-tinacms-app-prod`

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│  Internet / Users                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Dockploy (SSL/TLS Termination)         │
│  - Domain: your-domain.com              │
│  - Ports: 80 → 443 (SSL)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Docker Container: meraki-tinacms-app   │
│  - Next.js 14 + TinaCMS                 │
│  - Port 3000                            │
│  - Auth.js + GitHub OAuth               │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌──────────────┐  ┌─────────────────┐
│  PostgreSQL  │  │  GitHub API     │
│  Container   │  │  - OAuth        │
│  Port 5432   │  │  - Git commits  │
└──────────────┘  └─────────────────┘
```

---

## 🎯 Post-Deployment Checklist

- [ ] Application accessible at your domain
- [ ] SSL certificate active (green padlock)
- [ ] Health check returns "healthy"
- [ ] Can sign in with GitHub OAuth
- [ ] Can edit content in TinaCMS admin
- [ ] Changes commit to GitHub repository
- [ ] Database backups configured
- [ ] Monitoring/logging set up
- [ ] Team members added to ALLOWED_GITHUB_USERS

---

## 🔄 Updating the Application

When you push code changes to GitHub:

1. **Automatic deployment** (if enabled in Dockploy):
   - Push to `main` branch
   - Dockploy detects changes and rebuilds

2. **Manual deployment**:
   - Go to Dockploy dashboard
   - Click **Deploy** or **Rebuild**
   - Monitor build logs

3. **Force rebuild**:
   ```bash
   # SSH into server
   cd /path/to/project
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

---

## 📚 Additional Resources

- **Dockploy Documentation**: Check your Dockploy dashboard for platform-specific guides
- **TinaCMS Docs**: https://tina.io/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **PostgreSQL Backup**: https://www.postgresql.org/docs/current/backup.html

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Website loads at `https://your-domain.com`
2. ✅ SSL certificate is active and valid
3. ✅ Can access TinaCMS admin at `/admin`
4. ✅ Can sign in with GitHub
5. ✅ Can edit and save content
6. ✅ Changes automatically commit to GitHub
7. ✅ Both Docker containers running healthy
8. ✅ Database backups configured

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker logs: `docker logs meraki-tinacms-app-prod`
3. Check Dockploy dashboard for build errors
4. Verify all environment variables are set correctly
5. Ensure GitHub OAuth callback URL matches exactly

---

**Good luck with your deployment! 🚀**

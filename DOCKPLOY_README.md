# Dockploy Deployment - Quick Reference

## 📦 Files for Production Deployment

### Configuration Files
- **`docker-compose.prod.yml`** - Production Docker Compose configuration
- **`.env.production.example`** - Template for production environment variables
- **`Dockerfile`** - Multi-stage Docker build (dev + production targets)

### Documentation
- **`DOCKPLOY_DEPLOYMENT.md`** - Complete step-by-step deployment guide
- **`DOCKPLOY_CHECKLIST.md`** - Deployment checklist to track progress

### API Endpoints
- **`/api/health`** - Health check endpoint for Docker monitoring
- **`/api/auth/[...nextauth]`** - GitHub OAuth authentication
- **`/api/tina/[...routes]`** - TinaCMS GraphQL backend (in progress)

---

## 🚀 Quick Start

### 1. Generate Secrets
```bash
# Run these commands and save the outputs
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 24  # TINA_TOKEN
openssl rand -base64 24  # POSTGRES_PASSWORD
```

### 2. Create GitHub OAuth App
- URL: https://github.com/settings/developers
- Callback: `https://your-domain.com/api/auth/callback/github`
- Save Client ID and Secret

### 3. Create Personal Access Token
- URL: https://github.com/settings/tokens
- Scope: `repo` (full control)
- Save token (starts with `ghp_`)

### 4. Configure Dockploy
- Repository: `https://github.com/hieunguyenzzz/meraki-tinacms-test`
- Branch: `main`
- Docker Compose: `docker-compose.prod.yml`
- Copy all variables from `.env.production.example`

### 5. Deploy
Click "Deploy" in Dockploy and monitor the build logs.

---

## 📋 Deployment Checklist

Follow `DOCKPLOY_CHECKLIST.md` for a complete step-by-step checklist.

**Key steps:**
1. ✅ GitHub OAuth App created
2. ✅ Personal Access Token generated
3. ✅ All secrets generated
4. ✅ Environment variables configured in Dockploy
5. ✅ Domain and SSL configured
6. ✅ Application deployed
7. ✅ Tests passed (auth, content editing, commits)
8. ✅ Backups configured

---

## 🔍 Verify Deployment

After deployment, check:

```bash
# Health check
curl https://your-domain.com/api/health
# Should return: {"status":"healthy",...}

# Container status
docker ps
# Should see: meraki-tinacms-app-prod, meraki-tinacms-db-prod

# App logs
docker logs -f meraki-tinacms-app-prod

# Database logs
docker logs -f meraki-tinacms-db-prod
```

---

## 🛠️ Common Issues

### "Failed loading TinaCMS assets"
- Ensure `TINA_PUBLIC_IS_LOCAL=false`
- Check app logs: `docker logs meraki-tinacms-app-prod`
- Verify all environment variables are set

### OAuth Error
- Verify callback URL: `https://your-domain.com/api/auth/callback/github`
- Must match GitHub OAuth app exactly
- Check `NEXTAUTH_URL` environment variable

### Database Connection Error
- Check PostgreSQL container is running: `docker ps`
- Verify `DATABASE_URL` format
- Check database logs: `docker logs meraki-tinacms-db-prod`

---

## 📖 Full Documentation

- **Complete Guide**: `DOCKPLOY_DEPLOYMENT.md`
- **Deployment Checklist**: `DOCKPLOY_CHECKLIST.md`
- **Database Setup**: `DATABASE_SETUP.md`
- **Quick Start**: `QUICKSTART.md`
- **Backend Spec**: `TINACMS_BACKEND_SPEC.md`

---

## 🎯 Architecture

```
Internet → Dockploy (SSL) → Next.js App (Port 3000)
                               ↓
                          PostgreSQL
                          GitHub API
```

**Services:**
- `meraki-tinacms-app-prod` - Next.js + TinaCMS
- `meraki-tinacms-db-prod` - PostgreSQL 16

**Volumes:**
- `postgres_data` - Database persistence

**Network:**
- `tinacms-network` - Internal Docker network

---

## 📞 Support

For detailed troubleshooting, see:
- `DOCKPLOY_DEPLOYMENT.md` - Section "🔧 Troubleshooting"
- Check Docker logs for specific error messages
- Verify all environment variables match `.env.production.example`

---

**Deployment Time:** ~30-45 minutes  
**Prerequisites:** Domain, GitHub account, Dockploy access

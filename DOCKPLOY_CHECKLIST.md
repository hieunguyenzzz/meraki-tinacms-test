# Dockploy Deployment Checklist

Use this checklist to ensure you complete all steps correctly.

---

## Pre-Deployment

### GitHub Setup
- [ ] Created production GitHub OAuth App
  - [ ] Homepage URL: `https://your-domain.com`
  - [ ] Callback URL: `https://your-domain.com/api/auth/callback/github`
  - [ ] Saved Client ID
  - [ ] Saved Client Secret

- [ ] Created GitHub Personal Access Token
  - [ ] Scope: `repo` (full control)
  - [ ] Token saved (starts with `ghp_`)

### Security Secrets
- [ ] Generated NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Generated TINA_TOKEN: `openssl rand -base64 24`
- [ ] Generated PostgreSQL password: `openssl rand -base64 24`
- [ ] All secrets saved securely

### Domain & DNS
- [ ] Domain name available
- [ ] DNS A record points to Dockploy server
- [ ] Waited 5-10 minutes for DNS propagation

---

## Dockploy Configuration

### Application Setup
- [ ] Created new application in Dockploy
- [ ] Set repository: `https://github.com/hieunguyenzzz/meraki-tinacms-test`
- [ ] Set branch: `main`
- [ ] Set Docker Compose file: `docker-compose.prod.yml`

### Environment Variables
Copy from `.env.production.example` and set:

#### Database
- [ ] `POSTGRES_USER=tinacms`
- [ ] `POSTGRES_PASSWORD=<your-generated-password>`
- [ ] `POSTGRES_DB=tinacms`

#### GitHub OAuth
- [ ] `GITHUB_CLIENT_ID=<from-oauth-app>`
- [ ] `GITHUB_CLIENT_SECRET=<from-oauth-app>`
- [ ] `GITHUB_OWNER=hieunguyenzzz`
- [ ] `GITHUB_REPO=meraki-tinacms-test`
- [ ] `GITHUB_BRANCH=main`
- [ ] `GITHUB_PERSONAL_ACCESS_TOKEN=<your-pat>`

#### Auth.js
- [ ] `NEXTAUTH_URL=https://your-domain.com`
- [ ] `NEXTAUTH_SECRET=<generated-secret>`

#### TinaCMS
- [ ] `TINA_PUBLIC_IS_LOCAL=false`
- [ ] `TINA_TOKEN=<generated-token>`

#### Access Control (Recommended)
- [ ] `ALLOWED_GITHUB_USERS=hieunguyenzzz,teammate1,teammate2`

#### Other
- [ ] `NODE_ENV=production`
- [ ] `APP_PORT=3000`

### Domain & SSL
- [ ] Added domain in Dockploy
- [ ] SSL/TLS enabled
- [ ] Port mapping configured (80:3000, 443:3000)

---

## Deployment

### Initial Deploy
- [ ] Clicked "Deploy" in Dockploy
- [ ] Build completed without errors
- [ ] Both containers started:
  - [ ] `meraki-tinacms-db-prod` (PostgreSQL)
  - [ ] `meraki-tinacms-app-prod` (Next.js)

### Verify Logs
- [ ] Checked app logs: `docker logs meraki-tinacms-app-prod`
- [ ] Checked DB logs: `docker logs meraki-tinacms-db-prod`
- [ ] No critical errors in logs

---

## Testing

### Basic Functionality
- [ ] Homepage loads: `https://your-domain.com`
- [ ] Health check works: `https://your-domain.com/api/health`
- [ ] Returns: `{"status":"healthy",...}`

### TinaCMS Admin
- [ ] Admin page loads: `https://your-domain.com/admin`
- [ ] Shows TinaCMS interface (no "Failed loading assets" error)

### Authentication
- [ ] Can click "Sign in with GitHub"
- [ ] GitHub OAuth popup appears
- [ ] Can authorize the application
- [ ] Redirected back to admin
- [ ] Logged in successfully (see GitHub avatar)

### Content Editing
- [ ] Can navigate content in TinaCMS
- [ ] Can edit a page/journal
- [ ] Can save changes
- [ ] Changes commit to GitHub repository
- [ ] Commit shows correct author (your GitHub user)

---

## Post-Deployment

### Backups
- [ ] Manual backup tested: `docker exec meraki-tinacms-db-prod pg_dump -U tinacms tinacms > backup.sql`
- [ ] Automated backup cron job configured
- [ ] Backup retention policy set (7 days)

### Monitoring
- [ ] Docker stats checked: `docker stats`
- [ ] Containers using reasonable resources
- [ ] Health check endpoint monitored
- [ ] Log rotation configured

### Security
- [ ] SSL certificate active (green padlock in browser)
- [ ] ALLOWED_GITHUB_USERS configured
- [ ] All secrets are production-specific (not reusing dev secrets)
- [ ] Database password is strong
- [ ] GitHub OAuth app is production-specific

### Documentation
- [ ] Team members know how to access admin
- [ ] Backup/restore procedures documented
- [ ] Deployment process documented for future updates

---

## Troubleshooting Completed

If you encountered issues, mark what you fixed:

- [ ] Fixed OAuth redirect URI mismatch
- [ ] Fixed database connection issues
- [ ] Fixed "Failed loading TinaCMS assets" error
- [ ] Fixed 502 Bad Gateway
- [ ] Fixed GitHub commit issues
- [ ] Other: ___________________________

---

## Sign-Off

- [ ] All tests passed
- [ ] Application is production-ready
- [ ] Team has been notified
- [ ] Backup schedule confirmed

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Production URL:** _______________

---

## Quick Commands Reference

```bash
# Check container status
docker ps

# View app logs
docker logs -f meraki-tinacms-app-prod

# View database logs
docker logs -f meraki-tinacms-db-prod

# Restart app
docker restart meraki-tinacms-app-prod

# Create backup
docker exec meraki-tinacms-db-prod pg_dump -U tinacms tinacms > backup-$(date +%Y%m%d).sql

# Check health
curl https://your-domain.com/api/health

# Check resource usage
docker stats
```

---

**Need help?** See `DOCKPLOY_DEPLOYMENT.md` for detailed troubleshooting.

# TinaCMS Self-Hosted Backend Specification

**Project**: Meraki Wedding Planner - TinaCMS Backend Setup  
**Date**: November 24, 2025  
**Status**: ✅ **IMPLEMENTATION COMPLETE - READY FOR TESTING**

---

## Requirements & Decisions

### 1. Hosting Environment

✅ **Docker** - Containerized deployment for easy server hosting

### 2. Database

✅ **PostgreSQL** - Production-ready relational database

**Why PostgreSQL:**

- Data persistence and integrity for production content
- Better for relational data (users, documents, branches, commits)
- Industry standard for CMS backends
- Excellent Docker integration
- Robust backup/restore capabilities

### 3. Authentication

✅ **Auth.js** (NextAuth.js v4)

- Integrated with Next.js 14 App Router
- GitHub OAuth provider configured
- Session management with JWT

### 4. Multi-User Support

✅ **Yes** - Multiple editors supported

- Database stores user sessions and permissions
- Optional user allowlist via ALLOWED_GITHUB_USERS
- Git commits tracked per user

### 5. Git Provider

✅ **GitHub**

- Repository: `hieunguyenzzz/meraki-tinacms-test`
- GitHub OAuth for authentication
- Personal Access Token for Git operations
- Auto-commits on content save

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Next.js 14 App (Frontend + TinaCMS UI)        │
│  - Pages: /[lang]/*                             │
│  - Admin: /admin                                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  TinaCMS Backend API (Self-Hosted)              │
│  - GraphQL API for content queries              │
│  - Git operations (commit, push, pull)          │
│  - Authentication via Auth.js                   │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│  PostgreSQL   │   │  GitHub API      │
│  - Users      │   │  - OAuth         │
│  - Sessions   │   │  - Commits       │
│  - Metadata   │   │  - File changes  │
└───────────────┘   └──────────────────┘
```

---

## Implementation Components

### Phase 1: Database Setup

- [ ] Create `docker-compose.yml` with PostgreSQL service
- [ ] Configure database connection settings
- [ ] Set up environment variables for DB credentials

### Phase 2: GitHub OAuth App

- [ ] Create GitHub OAuth App in repository settings
- [ ] Obtain Client ID and Client Secret
- [ ] Configure callback URL for Auth.js

### Phase 3: Auth.js Configuration

- [ ] Create `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Configure GitHub provider
- [ ] Set up session management
- [ ] Configure JWT secret

### Phase 4: TinaCMS Backend Configuration

- [ ] Update `tina/config.ts` with backend settings
- [ ] Configure database connection
- [ ] Set up Git provider integration
- [ ] Enable authentication in TinaCMS

### Phase 5: Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tinacms

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_OWNER=hieunguyenzzz
GITHUB_REPO=meraki-tinacms-test
GITHUB_BRANCH=main

# Auth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_random_secret

# TinaCMS
TINA_PUBLIC_IS_LOCAL=false
```

### Phase 6: Docker Setup

- [ ] Create Dockerfile for Next.js app
- [ ] Configure docker-compose.yml with app + database
- [ ] Set up volume mounts for development
- [ ] Configure networking between containers

### Phase 7: Testing & Deployment

- [ ] Test authentication flow
- [ ] Test content editing and Git commits
- [ ] Test multi-user scenarios
- [ ] Document deployment process for production server

---

## File Changes Required

### New Files

1. `docker-compose.yml` - Docker services configuration
2. `Dockerfile` - Next.js app container (update existing if present)
3. `.env.local.example` - Environment variables template
4. `src/app/api/auth/[...nextauth]/route.ts` - Auth.js configuration
5. `DATABASE_SETUP.md` - Database initialization guide

### Modified Files

1. `tina/config.ts` - Add backend configuration
2. `package.json` - May need additional dependencies
3. `.gitignore` - Ensure `.env.local` is ignored

---

## Security Considerations

- [ ] GitHub OAuth tokens stored securely
- [ ] Database credentials in environment variables only
- [ ] NEXTAUTH_SECRET properly generated (min 32 characters)
- [ ] HTTPS required for production deployment
- [ ] Database not exposed to public internet
- [ ] Regular backups of PostgreSQL data

---

## Next Steps

**Immediate action needed:**

1. **Database choice confirmation**: PostgreSQL or Redis?
2. After confirmation, proceed with implementation phases

**Estimated setup time**: 1-2 hours for initial setup + testing

---

## Questions/Notes

- **Production server details**: Where will you deploy? (VPS provider, specs)
- **Domain/SSL**: Do you have a domain for the production deployment?
- **Backup strategy**: How often should database backups run?
- **User management**: Who are the initial users that need access?

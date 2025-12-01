# Meraki Wedding Planner

A bilingual (English/Vietnamese) wedding photography portfolio built with [Next.js 14](https://nextjs.org/) and [TinaCMS](https://tina.io/).

## Features

- Bilingual content (EN/VI) with URL-based routing
- Wedding journal galleries
- Blog with rich text content
- Client testimonials
- Custom design system with responsive typography

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: TinaCMS (local, file-based)
- **Styling**: Tailwind CSS + Radix UI
- **Language**: TypeScript

## Local Development

**Requirements**: Node.js >= 18.0.0, Yarn 1.22.x

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. TinaCMS admin is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Build & Production

Build the project:

```bash
yarn build
```

Start production server:

```bash
yarn start
```

## Environment Variables

Copy `.env.example` to `.env` and configure as needed. For local development, TinaCMS runs in local mode without cloud credentials.

For production with GitHub-based editing, configure:
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GITHUB_PERSONAL_ACCESS_TOKEN` - Git operations
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` - Auth.js configuration

## Project Structure

```
src/app/[lang]/     # Pages with i18n routing (/en/*, /vi/*)
src/components/     # React components
tina/collections/   # TinaCMS schema definitions
content/            # MDX content files
```

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TinaCMS Docs](https://tina.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

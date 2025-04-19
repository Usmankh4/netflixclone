# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## How to Create a GitHub Repository and Push This Project

Follow these steps to initialize a local Git repository and push your Netflix clone to GitHub:

### 1. Initialize Git (if not already done)

Open a terminal in your project root and run:

```sh
git init
git add .
git commit -m "Initial commit: Netflix clone"
```

### 2. Create a New GitHub Repository

- Go to [GitHub](https://github.com/new)
- Name your repo (e.g., `netflixclone`)
- **Do NOT** initialize with a README, .gitignore, or license (your local project already has these)
- Click "Create repository"

### 3. Add the Remote and Push

Replace `YOUR_USERNAME` and `REPO_NAME` below with your GitHub username and the repo name you just created:

```sh
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Example:
```sh
git remote add origin https://github.com/Usmankh4/netflixclone.git
git branch -M main
git push -u origin main
```

After this, your code will be live on GitHub!

---

## Project Overview

This is a full-stack Netflix clone built with Next.js 14 (App Router, SSR), TypeScript, Prisma, Clerk authentication, PostgreSQL, and Stripe for subscriptions. It features:

- Authentication (sign up, sign in, email verification, profile management)
- Video streaming (with HLS support)
- User profiles and watch history
- Subscription management (Stripe)
- Netflix-style UI with responsive design
- Cloud-ready for Vercel, PlanetScale, or Railway

See the rest of this README for setup and deployment instructions.

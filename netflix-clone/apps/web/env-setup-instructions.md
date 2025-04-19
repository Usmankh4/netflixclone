# Environment Variables Setup for Netflix Clone

To set up authentication with Clerk, you need to create a `.env.local` file in the `apps/web` directory with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk OAuth providers (optional)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/browse
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/browse

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/netflix_clone"

# Stripe (for subscription payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## How to Get Clerk API Keys

1. Sign up for a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Go to the API Keys section in your dashboard
4. Copy the Publishable Key and Secret Key
5. Paste them in your `.env.local` file

## Setting Up the Database

1. Create a PostgreSQL database for your Netflix clone
2. Update the `DATABASE_URL` with your database credentials

## Setting Up Stripe (for Subscriptions)

1. Sign up for a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Update the Stripe environment variables in your `.env.local` file

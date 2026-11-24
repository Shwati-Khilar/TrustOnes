This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Authentication and portal access

Each portal and its business APIs require a current database identity with a verified email, `ACTIVE` status and the matching role. The proxy sends visitors without a session to login. Server layouts and API handlers enforce authorization independently. Client resources are scoped to their owner and freelancer reads use the session user ID.

Credentials registrations stay pending until email verification. Only a verified Google account with pending status and no assigned role can select CLIENT or FREELANCER, once. ADMIN is provisioned separately. Suspended accounts cannot enter portals or reactivate through verification, resend, password recovery or Google login. Email verification links expire after one hour, password reset links after 30 minutes. Request a fresh link if a pre-S1 password reset link is outstanding.

## Authentication integration tests

Set `S1_TEST_PG_URL` to a connection on a disposable PostgreSQL server with permission to create a database. The suite creates a randomly named database, applies the checked-in SQL migrations there, starts the production app and a local SMTP receiver, then removes its test database. It exercises the Google account callback and onboarding locally. The external Google consent flow requires a configured OAuth client and callback URL.

```sh
npx prisma generate
npm run build
npm test
```

The mailer uses its existing Gmail configuration by default. Set `SMTP_URL` to use a different SMTP transport. Keep local environment files outside Git and provision deployment secrets separately.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

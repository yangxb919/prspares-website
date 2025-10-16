# PRSPARES - Mobile Repair Parts Platform

PRSPARES is a modern e-commerce platform built with Next.js 14 for mobile repair parts and OEM components. We are a leading supplier based in Shenzhen Huaqiangbei, specializing in high-quality mobile repair parts.

## Features

- **Product Catalog**: Browse our extensive collection of mobile repair parts
- **Educational Content**: Repair guides and tutorials through our blog
- **Interactive Quizzes**: Test your mobile repair knowledge
- **Expert Support**: Professional repair guidance and technical support
- **OEM Quality**: Genuine OEM components with quality guarantees

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Icons**: Lucide React

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Data Model & Supabase

We maintain two separate tables to decouple raw price imports from formal product data:

- `public.product_prices` (raw/import): lightweight table sourced from CSV uploads
  - Columns: `id uuid`, `title`, `url`, `image`, `price numeric(12,2)`, `currency (ISO-4217)`, `slug`, `clicks`, `created_at`
  - RLS: authenticated can SELECT; only `service_role` can INSERT
  - Indexes: unique on `url`/`slug` (nullable), created_at, optional trigram on `title`

- `public.products` (formal/catalog): full product records used by admin UI and public site
  - Includes: `name`, `slug`, `sku`, pricing fields, stock, dimensions, `images` (json), `status` ('draft'|'publish'), timestamps
  - Triggers: auto-update `updated_at`, auto-generate `slug` when empty
  - RLS: public SELECT by default (adjust as needed), `service_role` can write

Run migration in Supabase SQL editor:

- `supabase/migrations/20251016_split_products.sql`
- Verify with: `supabase/verify_table.sql`

## Import APIs

- `POST /api/admin/prices/import` and `POST /api/admin/prices/import-simple`
  - Auth: require header `X-Admin-Token: <ADMIN_IMPORT_TOKEN>`
  - Env: `SUPABASE_SERVICE_ROLE`, `NEXT_PUBLIC_SUPABASE_URL`, `ADMIN_IMPORT_TOKEN`
  - Behavior: batch upsert into `public.product_prices` (conflict on `url`)

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE` (server only)
- `ADMIN_IMPORT_TOKEN` (server only, for import API)
- `SITE_URL` (for sitemap/robots)

Note: older `SUPABASE_SERVICE_KEY`/`SUPABASE_URL` fallbacks are deprecated and no longer required in modified APIs.

## Sitemap

`next-sitemap.config.js` now fetches product `slug` values from `public.products` at build time (status='publish'), merging with curated static paths.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

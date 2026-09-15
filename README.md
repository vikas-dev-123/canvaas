# Canvaas - Multi-Tenant Agency Management Platform

Canvaas is a comprehensive SaaS platform built with modern web technologies that enables agencies to manage multiple sub-accounts, create sales funnels, automate workflows, and track customer interactions. It features a complete CRM, pipeline management, ticket system, and white-label capabilities — with its own custom authentication, Razorpay billing, Redis-backed caching/rate limiting, and Cloudinary file storage.

## 🚀 Key Features

### Core Platform Features
- **Multi-Tenant Architecture**: Support for multiple agencies and sub-accounts
- **User Management**: Role-based access control (Agency Owner, Admin, Sub-account User/Guest)
- **Custom Authentication**: Self-hosted email/password auth with mandatory OTP two-step verification on every login, email verification on sign-up, and OTP-based forgot/reset password — no third-party auth provider
- **White-Label Support**: Customize platform branding for different agencies

### Agency Management
- Manage multiple sub-accounts
- Team member invitations and permissions management
- Agency-specific branding and customization
- Goal tracking and performance metrics

### Sales & Automation
- **Funnel Building**: Create and manage sales funnels with multiple pages
- **Pipeline Management**: Organize deals and leads in customizable pipelines and lanes
- **Ticket System**: Manage tasks and tickets within lanes with assignment and tagging
- **Contact Management**: Build and organize customer database with tagging system
- **Automation**: Create workflows triggered by contact form submissions
- **CRM Integration**: Track customer interactions and manage relationships

### Media & Assets
- Media library management per sub-account
- File upload capabilities via Cloudinary (signed, session-authenticated direct-to-cloud uploads)

### Payments & Subscriptions
- **Razorpay** subscription billing for the agency's own Canvaas plan (India-first payment gateway)
- Subscription management with plan upgrades and payment history
- Add-ons support for additional features
- Stripe is retained **only** for the sub-account "Connect" marketplace checkout (funnel product sales) — Canvaas's own billing no longer uses Stripe

### Performance & Reliability
- **Redis caching** (Upstash) for read-heavy queries — public funnel pages, agency/sub-account dashboards
- **Rate limiting** on authentication endpoints (login, signup, OTP resend, password reset) to block brute-force abuse
- Gracefully degrades to direct DB reads / no rate limiting if Redis isn't configured, so local dev works without it

### Notifications
- Real-time notification system
- Activity tracking across agencies

### Dashboard & Analytics
- Tremor-based analytics and charts
- Real-time data visualization
- Pipeline and performance metrics

## 📋 Table of Contents

- [Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Authentication System](#-authentication-system)
- [Billing (Razorpay)](#-billing-razorpay)
- [Caching & Rate Limiting](#-caching--rate-limiting)
- [File Uploads (Cloudinary)](#-file-uploads-cloudinary)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Key Features Explained](#-key-features-explained)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.5 with React 18
- **Styling**: TailwindCSS with custom animations
- **UI Components**: Radix UI (extensive component library)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context (via providers)
- **Tables**: TanStack React Table
- **Drag & Drop**: React Beautiful DnD
- **Charts**: Recharts & Tremor
- **Date Handling**: date-fns
- **Authentication**: Custom (email/password + OTP), session via signed JWT cookie
- **Toasts**: Sonner

### Backend
- **Database**: MySQL (Prisma ORM)
- **Authentication**: Custom — bcrypt password hashing, `jose`-signed session JWT, OTP codes emailed via Resend
- **Caching / Rate limiting**: Upstash Redis (`@upstash/redis`, `@upstash/ratelimit`)
- **File Upload**: Cloudinary (signed direct-to-cloud uploads)
- **Payment**: Razorpay (agency subscription billing) + Stripe (sub-account Connect marketplace checkout only)
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Language**: TypeScript
- **Linting**: ESLint
- **CSS Processing**: PostCSS
- **ORM**: Prisma
- **Themes**: Next Themes (dark/light mode support)

## 📁 Project Structure

```
canvaas/
├── app/                          # Next.js app directory
│   ├── (main)/                   # Main authenticated routes
│   │   ├── agency/               # Agency management pages
│   │   │   ├── (auth)/           # Sign-in, sign-up, forgot-password
│   │   │   ├── [agencyId]/       # Individual agency dashboards
│   │   │   └── all-subaccounts/  # Sub-account management
│   │   └── subaccount/           # Sub-account management pages
│   │       └── [subaccountId]/   # Individual sub-account dashboards
│   ├── [domain]/                 # Dynamic domain routing for funnels
│   ├── api/                      # API routes
│   │   ├── auth/                 # Custom auth: signup, login, OTP verify/resend, forgot/reset password, logout
│   │   ├── razorpay/             # Agency subscription billing (customer, subscription, webhook)
│   │   ├── stripe/               # Stripe Connect marketplace checkout only
│   │   └── cloudinary/           # Signed upload authorization
│   ├── site/                     # Public landing page
│   └── layout.tsx                # Root layout
├── components/                   # Reusable React components
│   ├── forms/                    # Form components (agency, funnel, subscription, etc.)
│   ├── global/                   # Global shared components (incl. file-upload.tsx)
│   ├── icons/                    # Icon components
│   ├── media/                    # Media management components
│   ├── sidebar/                  # Navigation sidebar
│   ├── site/                     # Public site components (nav, mobile nav, video hero)
│   └── ui/                       # Base UI components (Radix-based)
├── hooks/                        # Custom React hooks (incl. useTypewriter)
├── lib/                          # Utility functions
│   ├── auth/                     # Session (JWT), password hashing, OTP, email sending
│   ├── razorpay/                 # Razorpay client + subscription sync helpers
│   ├── stripe/                   # Stripe client (Connect marketplace only)
│   ├── db.ts                     # Database client
│   ├── queries.ts                # Database queries (cached where noted)
│   ├── cache.ts                  # Redis get-or-set cache wrapper
│   ├── rate-limit.ts             # Redis-backed rate limiters
│   ├── redis.ts                  # Upstash Redis client
│   ├── cloudinary.ts             # Cloudinary server SDK config
│   ├── cloudinary-upload.ts      # Client-side signed upload helper
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper utilities
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Database models
├── providers/                    # React context providers
│   ├── modal-provider.tsx        # Modal management
│   ├── theme-provider.tsx        # Theme switching
│   └── editor/                   # Editor context providers
├── public/                       # Static assets
├── @types/                       # Global TypeScript types
├── middleware.ts                 # Session auth gating, subdomain routing, auth rate limiting
├── tailwind.config.ts            # TailwindCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔐 Authentication System

Canvaas uses its own email/password authentication — there is no third-party auth provider.

**Sign up**
1. `POST /api/auth/signup` — validates input, hashes the password (bcrypt), creates the `User` row (unverified), emails a 6-digit OTP.
2. `POST /api/auth/signup/verify` — verifies the OTP and marks the account `emailVerifiedAt`.

**Sign in (mandatory two-step verification)**
1. `POST /api/auth/login` — checks email/password; on success, emails a fresh OTP. **No session is issued at this step.**
2. `POST /api/auth/login/verify-otp` — verifies the OTP and only then issues a signed, httpOnly session cookie (`jose` JWT, 7-day expiry).

Two-step verification is not optional or toggleable — every login requires the OTP step.

**Forgot / reset password**
- `POST /api/auth/forgot-password` — always responds success (prevents email enumeration); emails an OTP if the account exists.
- `POST /api/auth/reset-password` — verifies the OTP and sets a new password hash.

**Session & route protection**
- `lib/auth/session.ts` — edge-safe JWT sign/verify (used in `middleware.ts`).
- `lib/auth/getSession.ts` — Node-runtime cookie read/write for server components, server actions, and route handlers.
- `middleware.ts` gates every `/agency/*` and `/subaccount/*` route (except the sign-in/sign-up/forgot-password pages) and redirects unauthenticated requests to `/agency/sign-in`.
- `role` (`AGENCY_OWNER` / `AGENCY_ADMIN` / `SUBACCOUNT_USER` / `SUBACCOUNT_GUEST`) lives solely on the Prisma `User` row — it's the single source of truth, encoded into the session JWT.

**OTP codes** are hashed (bcrypt) before being stored in the `OtpCode` table, expire after `OTP_TTL_MINUTES` (default 10), and are attempt-limited.

## 💳 Billing (Razorpay)

Canvaas's own subscription billing (the agency's Canvaas plan) runs on **Razorpay**:

- `lib/razorpay/index.ts` — Razorpay Node SDK client.
- `POST /api/razorpay/create-customer` — creates a Razorpay Customer for an agency.
- `POST /api/razorpay/create-subscription` — creates a Razorpay Subscription for a plan; cancels any existing active subscription first (Razorpay has no in-place plan change).
- `POST /api/razorpay/webhook` — HMAC-SHA256 verified webhook; handles `subscription.activated`, `subscription.charged`, `subscription.completed`, `subscription.cancelled`, `subscription.halted` and syncs the Prisma `Subscription` row.
- Checkout happens client-side via Razorpay's Checkout.js modal (`components/forms/subscription-form/index.tsx`) — there's no server-rendered payment form the way Stripe Elements worked.
- Plan IDs (`lib/constant.ts`'s `pricingCards`/`addOnProducts`) are **Razorpay Plan IDs** — replace the `plan_REPLACE_WITH_...` placeholders with real plan IDs created in your Razorpay dashboard before going live.

**Stripe is intentionally kept**, but scoped down to only the sub-account "Connect" marketplace checkout (a sub-account selling its own products through a funnel page). That flow (`app/api/stripe/create-checkout-session`, OAuth connect on the launchpad pages, `lib/stripe/stripe-actions.ts`'s `getConnectAccountProducts`) is unchanged and still uses `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_CLIENT_ID`.

## ⚡ Caching & Rate Limiting

Backed by **Upstash Redis** (REST-based, works in both Edge middleware and Node routes):

- `lib/cache.ts` — `getOrSetCache(key, ttlSeconds, fn)` wraps read-heavy queries in `lib/queries.ts`: `getDomainContent`, `getFunnelPageByPath` (hit on every public funnel-page view), `getAgencyWithAllData`, `getSubAccountDashboardData`, `getFunnels`/`getFunnel` — each cached for 60s. Mutations (`upsertFunnelPage`, `upsertFunnel`, `updateFunnelProducts`, `deleteFunnelsPage`, agency/sub-account upserts/deletes) invalidate the relevant keys.
- `lib/rate-limit.ts` — sliding-window rate limiters. `middleware.ts` rate-limits every `/api/auth/*` request by IP before it reaches a route handler.
- **No Redis configured?** Both `lib/cache.ts` and `lib/rate-limit.ts` detect a missing `UPSTASH_REDIS_REST_URL`/`TOKEN` and become no-ops (cache always misses through to the DB, rate limiting always allows) — the app runs fine locally without provisioning Redis, at reduced performance/protection.

## 📤 File Uploads (Cloudinary)

Replaces the previous UploadThing integration:

- `POST /api/cloudinary/sign` — requires a valid session (same auth gate UploadThing routes used to have), returns a signed upload payload (`timestamp`, `signature`, `folder`, API key, cloud name).
- `lib/cloudinary-upload.ts` — client helper that requests a signature, then uploads the file **directly from the browser** to Cloudinary (`https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload`) with upload progress.
- `components/global/file-upload.tsx` — the shared drag-and-drop upload UI used by agency/sub-account logos, avatars, and the media library. The `apiEndpoint` prop (`agencyLogo` | `subaccountLogo` | `avatar` | `media`) maps to a Cloudinary folder (`canvaas/agency-logos`, etc.).

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MySQL database
- Razorpay account (for Canvaas's own subscription billing)
- Stripe account (only needed if you use the sub-account Connect marketplace checkout)
- Resend account (for OTP / transactional emails)
- Cloudinary account (for file uploads)
- Upstash Redis database (optional — for caching + rate limiting; app runs without it)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd canvaas
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below for the full list and what each one does).

### Step 4: Set Up Database
```bash
# Generate Prisma Client
npx prisma generate
# Push schema to db
npx prisma db push
# The studio of database tables
npx prisma studio  # important, run in a separate terminal
# Run database migrations
npx prisma migrate dev --name init
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | MySQL database connection | ✅ |
| `JWT_SECRET` | Signs the session cookie JWT — use a long random string | ✅ |
| `SESSION_COOKIE_NAME` | Session cookie name (default `canvaas_session`) | – |
| `OTP_TTL_MINUTES` | OTP expiry window in minutes (default `10`) | – |
| `RESEND_API_KEY` | Sends OTP / invite emails via [Resend](https://resend.com) | ✅ |
| `EMAIL_FROM` | From-address for outgoing emails | – |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Caching + rate limiting — leave blank to disable both | – |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials (agency billing) | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies incoming Razorpay webhooks | ✅ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public key used by the Checkout.js modal | ✅ |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_CLIENT_ID` | Stripe Connect marketplace checkout only | Only if using Connect |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | File uploads | ✅ |
| `NEXT_PUBLIC_URL` | Application base URL | ✅ |
| `NEXT_PUBLIC_DOMAIN` | Domain used for custom-domain funnel routing | ✅ |
| `NEXT_PUBLIC_SCHEME` | `http://` or `https://`, used alongside `NEXT_PUBLIC_DOMAIN` | ✅ |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Optional background video URL for the landing page hero | – |
| `NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT` / `NEXT_PUBLIC_PLATFORM_ONETIME_FEE` / `NEXT_PUBLIC_PLATFORM_AGENY_PERCENT` | Platform fee config for the Stripe Connect marketplace | Only if using Connect |

## 📊 Database Schema

### Core Models

**User**
- Multi-role support (Agency Owner, Admin, Sub-account User/Guest)
- `password` (bcrypt hash) and `emailVerifiedAt` for custom auth
- Linked to agencies, sub-accounts, and `OtpCode` records

**OtpCode**
- One-time codes for sign-up verification, login 2FA, and password reset (`OtpPurpose` enum)
- Stores a bcrypt hash of the code, never the plaintext; tracks attempts and expiry

**Agency**
- Parent organization entity
- Manages multiple sub-accounts
- `customerId` (Razorpay customer) + `connectAccountId` (Stripe Connect, marketplace only)
- White-label customization
- Subscription tracking

**SubAccount**
- Child accounts under agencies
- Independent operations and data
- Pipeline, funnel, and contact management
- Media storage

**Pipeline & Lanes**
- Organize deals and leads
- Lane-based workflow management
- Drag-and-drop ticket organization

**Ticket**
- Individual tasks/deals in lanes
- Customer assignment
- Team member assignment
- Tagging for categorization
- Value tracking

**Funnel & FunnelPages**
- Sales funnel builder
- Multiple pages per funnel
- Domain-based routing (cached)
- Published state management

**Contact**
- Customer database
- Email-based CRM
- Sub-account specific

**Automation & Triggers**
- Contact form triggers
- Workflow automation
- Action creation for leads

**Media**
- Asset management (Cloudinary URLs)
- File organization per sub-account

**Permissions**
- Granular access control
- Email-based permission management

**Subscription & AddOns**
- `Subscription.plan`/`priceId` hold Razorpay Plan IDs (plain strings, not an enum)
- `razorpaySubscriptionId` uniquely ties a row to a Razorpay Subscription

## 🎯 Key Features Explained

### Multi-Tenancy Architecture
The platform supports complete data isolation between agencies and sub-accounts:
- Each agency has its own sub-accounts
- Each sub-account has isolated data (pipelines, contacts, funnels)
- Role-based access control ensures proper authorization

### Sales Funnel Builder
Create custom sales funnels:
1. Create funnel with name and description
2. Add multiple pages to the funnel
3. Customize each page with content
4. Publish funnels to live domains
5. Track performance metrics

### Pipeline Management
Organize your sales process:
1. Create pipelines for different sales stages
2. Add lanes representing stages (Prospecting, Negotiation, Closed, etc.)
3. Add tickets/deals to lanes
4. Drag and drop to move tickets between stages
5. Assign tickets to team members
6. Track deal value

### CRM & Contact Management
Manage customer relationships:
1. Store contact information
2. Tag contacts for organization
3. Track contact interactions via tickets
4. Automate actions when forms are submitted
5. View complete customer history

### Automation Workflows
Automate repetitive tasks:
1. Set triggers (e.g., contact form submission)
2. Create actions (e.g., create contact, assign to ticket)
3. Activate automations per sub-account
4. Track automation instances

### Team Invitations
Inviting a teammate creates a `PENDING` `Invitation` row and emails them a sign-up link. Once they sign up (with the invited email) and log in, `verifyAndAcceptInvitation()` automatically detects the pending invitation on their next authenticated page load, joins them to the agency with the invited role, and deletes the invitation.

## 💻 Development

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type-check without emitting
npx tsc --noEmit

# Prisma commands
npx prisma migrate dev --name migration_name  # Create new migration
npx prisma studio                             # Open Prisma Studio (GUI)
npx prisma db push                            # Push schema to database
npx prisma generate                           # Generate Prisma client
```

### Project Conventions
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Styling**: TailwindCSS utility classes, avoid inline styles
- **Components**: Keep components small and focused
- **Types**: Define types in `@types` or component files
- **Database**: Use Prisma for all database operations
- **Routing**: Follow Next.js App Router conventions

### Adding New Features
1. **Update Database Schema**: Modify `prisma/schema.prisma`
2. **Create Migration**: Run `npx prisma migrate dev --name feature_name`
3. **Create Components**: Add UI components in `components/`
4. **Create Forms**: Add form components in `components/forms/`
5. **Create API Routes**: Add endpoints in `app/api/`
6. **Update Types**: Add TypeScript types in `@types/`
7. **Add Queries**: Create database queries in `lib/queries.ts` — wrap read-heavy ones with `getOrSetCache` and invalidate on the corresponding mutation

## 🔌 API Documentation

### Authentication
```
POST /api/auth/signup                # Create account, sends verification OTP
POST /api/auth/signup/verify         # Verify signup OTP
POST /api/auth/login                 # Check credentials, sends login OTP
POST /api/auth/login/verify-otp      # Verify login OTP, issues session cookie
POST /api/auth/otp/resend            # Resend a signup/login OTP
POST /api/auth/forgot-password       # Request a password-reset OTP
POST /api/auth/reset-password        # Verify OTP + set a new password
POST /api/auth/logout                # Clear the session cookie
```

### Razorpay (agency billing)
```
POST /api/razorpay/create-customer
POST /api/razorpay/create-subscription
POST /api/razorpay/webhook
```

### Stripe (Connect marketplace checkout only)
```
POST /api/stripe/create-checkout-session
```

### Cloudinary
```
POST /api/cloudinary/sign            # Signed upload credentials (auth required)
```

### Custom Endpoints
```
GET /api/domain/[subDomainName]  # Get funnel by domain
GET /api/funnel/[funnelId]/page/[pathName]  # Get specific funnel page
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-Hosted (VPS)
1. Build the application: `npm run build`
2. Set environment variables on your server
3. Ensure MySQL database is accessible
4. Run production server: `npm start`
5. Set up reverse proxy (Nginx/Apache) for domain routing

### Pre-Deployment Checklist
- [ ] All environment variables configured (see table above)
- [ ] Database migrations applied
- [ ] Razorpay Plan IDs created and swapped into `lib/constant.ts` (placeholders removed)
- [ ] Razorpay webhook endpoint configured and `RAZORPAY_WEBHOOK_SECRET` set
- [ ] Resend sending domain verified
- [ ] Cloudinary credentials set
- [ ] Upstash Redis provisioned (recommended for production; optional for dev)
- [ ] Build passes: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] CDN configured for static assets

## 🛠 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check database connection
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

**Authentication Issues**
- Verify `JWT_SECRET` and `RESEND_API_KEY` are set
- Confirm OTP emails are arriving (check Resend dashboard/logs)
- Clear the `canvaas_session` cookie and browser storage if a session looks stuck

**Build Failures**
```bash
# Clear build cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

**Razorpay Webhook Issues**
- Verify `RAZORPAY_WEBHOOK_SECRET` matches the one configured in the Razorpay dashboard
- Check the webhook URL (`/api/razorpay/webhook`) is publicly accessible
- Confirm the plan IDs in `lib/constant.ts` are real Razorpay Plan IDs, not the `plan_REPLACE_WITH_...` placeholders

**Upload Issues**
- Verify `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` are set
- Uploads require an active session — confirm you're logged in

### Debugging Tips
1. Enable detailed logging in development
2. Use Prisma Studio to inspect database data
3. Check browser console for frontend errors
4. Review server logs for backend issues
5. Use React DevTools for component debugging

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upstash Redis Documentation](https://upstash.com/docs/redis)
- [Resend Documentation](https://resend.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For support and questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Contact the development team

---

**Last Updated**: September 2026
**Version**: 2.0.0
**Status**: Production Ready

# Canvaas - Multi-Tenant Agency Management Platform

Canvaas is a comprehensive SaaS platform built with modern web technologies that enables agencies to manage multiple sub-accounts, create sales funnels, automate workflows, and track customer interactions. It features a complete CRM, pipeline management, ticket system, and white-label capabilities.

## 🚀 Key Features

### Core Platform Features
- **Multi-Tenant Architecture**: Support for multiple agencies and sub-accounts
- **User Management**: Role-based access control (Agency Owner, Admin, Sub-account User/Guest)
- **Authentication**: Secure authentication with Clerk
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
- File upload capabilities with UploadThing integration

### Payments & Subscriptions
- Stripe integration for payment processing
- Subscription management
- Add-ons support for additional features

### Notifications
- Real-time notification system
- Activity tracking across agencies

### Dashboard & Analytics
- Tremor-based analytics and charts
- Real-time data visualization
- Pipeline and performance metrics

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Recent Updates](#recent-updates)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Key Features Explained](#key-features-explained)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Platform Features
- **Multi-Tenant Architecture**: Support for multiple agencies and sub-accounts
- **User Management**: Role-based access control (Agency Owner, Admin, Sub-account User/Guest)
- **Authentication**: Secure authentication with Clerk
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
- File upload capabilities with UploadThing integration

### Payments & Subscriptions
- Stripe integration for payment processing
- Subscription management
- Add-ons support for additional features

### Notifications
- Real-time notification system
- Activity tracking across agencies

### Dashboard & Analytics
- Tremor-based analytics and charts
- Real-time data visualization
- Pipeline and performance metrics

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
- **Authentication**: Clerk
- **Toasts**: Sonner

### Backend
- **Database**: MySQL (Prisma ORM)
- **Authentication**: Clerk
- **File Upload**: UploadThing
- **Payment**: Stripe
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
│   │   │   ├── [agencyId]/       # Individual agency dashboards
│   │   │   └── all-subaccounts/  # Sub-account management
│   │   └── subaccount/           # Sub-account management pages
│   │       └── [subaccountId]/   # Individual sub-account dashboards
│   ├── [domain]/                 # Dynamic domain routing for funnels
│   ├── api/                      # API routes
│   │   ├── stripe/               # Stripe webhook handlers
│   │   └── uploadthing/          # File upload handlers
│   ├── site/                     # Public landing pages
│   └── layout.tsx                # Root layout
├── components/                   # Reusable React components
│   ├── forms/                    # Form components (agency, funnel, etc.)
│   ├── global/                   # Global shared components
│   ├── icons/                    # Icon components
│   ├── media/                    # Media management components
│   ├── sidebar/                  # Navigation sidebar
│   ├── site/                     # Public site components
│   └── ui/                       # Base UI components (Radix-based)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── db.ts                     # Database client
│   ├── queries.ts                # Database queries
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Helper utilities
│   ├── stripe/                   # Stripe utilities
│   └── uploadthing.ts            # File upload config
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Database models
├── providers/                    # React context providers
│   ├── modal-provider.tsx        # Modal management
│   ├── theme-provider.tsx        # Theme switching
│   └── editor/                   # Editor context providers
├── public/                       # Static assets
├── @types/                       # Global TypeScript types
├── middleware.ts                 # Next.js middleware
├── tailwind.config.ts            # TailwindCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔄 Recent Updates

### Dashboard Enhancements (Latest)
**Agency Dashboard (`app/(main)/agency/[agencyId]/page.tsx`)**
- Converted to server-side rendering for better performance
- Integrated with `getAgencyDetails` for real database data
- Dynamic sub-account listing from database
- Proper navigation links to actual application features
- Real-time statistics calculation from database records

**Sub-Account Dashboard (`app/(main)/subaccount/[subaccountId]/page.tsx`)**
- Server-side rendering implementation
- Parallel data fetching using `Promise.all()` for multiple data types
- Integration with:
  - `getSubAccountDetails` for account information
  - `getFunnels` for sales funnels
  - `getMedia` for media assets
  - `getContact` for customer contacts
- Conditional rendering for empty states
- Real navigation to actual application pages

### Database Query Improvements
Added new query functions in `lib/queries.ts`:
- `getSubAccountDashboardData` - Comprehensive sub-account data fetching
- Enhanced existing queries with better error handling
- Optimized data fetching patterns

### Key Improvements Made:
✅ **Real Database Integration**: Pages now fetch actual data instead of mock data
✅ **Performance Optimization**: Server-side rendering with parallel data fetching
✅ **Better User Experience**: Proper loading states, error handling, and empty states
✅ **Enhanced Navigation**: Real links to application features
✅ **Type Safety**: Strong TypeScript typing throughout

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MySQL database
- Stripe account (for payment processing)
- Clerk account (for authentication)
- UploadThing account (for file uploads)

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
Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="mysql://username:password@host:port/database_name"
LOCAL_DATABASE_URL="mysql://root:@localhost:3306/canvaas_dev?ssl-mode=DISABLED"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/agency/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/agency/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_CLIENT_ID=your_stripe_client_id

# UploadThing File Storage
UPLOADTHING_TOKEN=your_uploadthing_token

# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http://

# Platform Configuration
NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT=1
NEXT_PUBLIC_PLATFORM_ONETIME_FEE=2
NEXT_PUBLIC_PLATFORM_AGENY_PERCENT=1
```

### Step 4: Set Up Database
```bash
# Generate Prisma Client
npx prisma generate
# push to db 
npx db push
# the studio of database tables
npx prisma studio  #important run in the other terminal
# Run database migrations
npx prisma migrate dev --name init

# Optional: Seed database with sample data
npx prisma db seed
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | Production MySQL database connection | ✅ |
| `LOCAL_DATABASE_URL` | Local development database connection | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend authentication key | ✅ |
| `CLERK_SECRET_KEY` | Clerk backend authentication key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe frontend payment key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe backend payment key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | ✅ |
| `UPLOADTHING_TOKEN` | UploadThing file storage | ✅ |
| `NEXT_PUBLIC_URL` | Application base URL | ✅ |
| `NEXT_PUBLIC_DOMAIN` | Domain for routing | ✅ |

## 📊 Database Schema

### Core Models

**User**
- Multi-role support (Agency Owner, Admin, Sub-account User/Guest)
- Email-based authentication with Clerk
- Linked to agencies and sub-accounts

**Agency**
- Parent organization entity
- Manages multiple sub-accounts
- Stripe integration (customer ID, connect account)
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
- Domain-based routing
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
- Asset management
- File organization per sub-account

**Permissions**
- Granular access control
- Email-based permission management

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
7. **Add Queries**: Create database queries in `lib/queries.ts`

## 🔌 API Documentation

### Stripe Integration
```
POST /api/stripe/create-checkout-session
POST /api/stripe/create-customer
POST /api/stripe/create-subscription
POST /api/stripe/webhook
```

### File Upload
```
POST /api/uploadthing/core
POST /api/uploadthing/route
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
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Stripe webhook endpoints configured
- [ ] Clerk authentication configured
- [ ] UploadThing credentials set
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
- Verify Clerk environment variables
- Check redirect URLs in Clerk dashboard
- Clear browser cookies and localStorage

**Build Failures**
```bash
# Clear build cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

**Stripe Webhook Issues**
- Verify webhook signature in Stripe dashboard
- Check webhook URL is publicly accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Debugging Tips
1. Enable detailed logging in development
2. Use Prisma Studio to inspect database data
3. Check browser console for frontend errors
4. Review server logs for backend issues
5. Use React DevTools for component debugging

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clerk Authentication](https://clerk.com/docs)
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

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
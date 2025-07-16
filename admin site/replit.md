# KOMARCE Admin Platform

## Overview

KOMARCE is a comprehensive multi-country loyalty platform management system designed for unified vendor marketplace administration. The application provides a complete admin dashboard for managing merchants, customers, reward systems, and analytics across multiple countries (Bangladesh, Malaysia, UAE, Philippines).

The platform implements a sophisticated four-tier reward system (800, 1500, 3500, 32200 points) with global and local reward numbers, affiliate programs, and comprehensive VAT/service charge tracking. The system supports both global and country-specific admin roles with Bengali and English language support.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React with TypeScript using Vite as build tool
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Project Structure
```
├── client/                 # React frontend application
├── server/                 # Express.js backend
├── shared/                 # Shared types and database schema
├── migrations/             # Database migrations
└── dist/                   # Build output
```

## Key Components

### Database Schema (`shared/schema.ts`)
The system uses a comprehensive PostgreSQL schema with the following core entities:
- **Users**: Admin users with role-based access (super_admin, country_admin, manager)
- **Countries**: Multi-country support with currency and localization
- **Merchants**: Vendor management with tier-based classification
- **Customers**: End-user management with referral systems
- **Reward Transactions**: Loyalty points and reward management
- **Withdrawals**: Financial transaction handling
- **System Settings**: Configurable platform parameters

### Authentication System (`server/replitAuth.ts`)
- Implements Replit OpenID Connect authentication
- Session management with PostgreSQL storage
- Role-based access control with country-specific permissions
- Secure session handling with encryption

### API Layer (`server/routes.ts`)
RESTful API endpoints providing:
- Authentication endpoints (`/api/auth/*`)
- Dashboard statistics (`/api/dashboard/*`)
- CRUD operations for all entities
- Country-specific data filtering
- Real-time analytics and reporting

### Frontend Architecture (`client/src/`)
- **Component-based architecture** with shadcn/ui
- **Multi-language support** (English/Bengali)
- **Responsive design** for mobile and desktop
- **Real-time data updates** with TanStack Query
- **Country-specific filtering** throughout the application

## Data Flow

### Authentication Flow
1. User accesses application → Redirected to Replit Auth
2. Successful authentication → Session created in PostgreSQL
3. User data stored/updated in users table
4. Role-based access control applied

### Data Management Flow
1. Frontend components make API requests via TanStack Query
2. Express routes handle requests with authentication middleware
3. Drizzle ORM manages database operations
4. Real-time updates propagated to connected clients
5. Country-specific data filtering applied based on user permissions

### Multi-Country Operations
- Users assigned to specific countries or global access
- All data queries filtered by country permissions
- Dashboard statistics aggregated by country
- Localized content and currency handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: TypeScript ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **openid-client**: OpenID Connect authentication
- **wouter**: Lightweight React routing
- **date-fns**: Date manipulation and formatting

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Replit Deployment
- **Development**: `npm run dev` - Concurrent client/server development
- **Production Build**: `npm run build` - Vite frontend + esbuild backend
- **Production Start**: `npm run start` - Optimized production server
- **Database**: Automatic Neon PostgreSQL provisioning
- **Environment**: Replit autoscale deployment target

### Configuration
- **Port**: 5000 (internal) → 80 (external)
- **Database**: Automatic provisioning via DATABASE_URL
- **Sessions**: PostgreSQL-based session storage
- **Static Assets**: Served from dist/public

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `REPLIT_DOMAINS`: Allowed authentication domains

## Changelog

```
Changelog:
- June 21, 2025. Initial setup
- June 21, 2025. Transformed into KOMARCE admin system with:
  * Enhanced database schema for KOMARCE reward system
  * Added four-tier reward system (800, 1500, 3500, 32200)
  * Implemented global/local reward numbers
  * Added Bengali/English bilingual support
  * Enhanced merchant tiers and co-founder system
  * Added VAT/service charge tracking
  * Implemented comprehensive referral system
  * Created complete reward engine with proper point generation logic
  * Implemented affiliate rewards (5%), ripple rewards, infinity rewards
  * Added daily login rewards (100-200 points)
  * Implemented 12.5% VAT/service charge system
  * Created point management interface for admins
- June 24, 2025. Added comprehensive admin settings and management features:
  * Global Commission & Percentage Settings with password confirmation
  * Customer Benefits management (Step-up, Infinity, Affiliate, Ripple, Shopping Voucher)
  * Merchant Settings (Instant Cashback, Affiliate, Profit Share, Rank Incentive)
  * Co-Founder Management with partnership commission tracking
  * Staff Management with role-based access control
  * Customer Care system with ticket management
  * All features properly organized with bilingual support (English/Bengali)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
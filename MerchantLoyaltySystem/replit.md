# KOMARCE Merchant Dashboard

## Overview

This is a comprehensive merchant dashboard for the KOMARCE unified loyalty platform. The application is built as a full-stack web application with a React frontend and Express backend, featuring a loyalty points system, cashback management, customer management, and wallet functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript (MERN Stack)
- **Database**: MongoDB with Mongoose ODM
- **Database Provider**: MongoDB Atlas (cloud) with fallback in-memory storage
- **Authentication**: Session-based authentication with express-session
- **Password Hashing**: bcrypt for secure password storage

### Database Schema
The application uses a comprehensive MongoDB schema with Mongoose models:
- **Merchants**: Store merchant account information, profiles, and referral data
- **Customers**: Manage customer information and reward points
- **Wallets**: Handle multiple wallet types (reward points, income, KOMARCE balance)
- **Transactions**: Track point transfers, cashback, and wallet transactions
- **Products**: Support for merchant product listings (future feature)
- **Fallback Storage**: In-memory storage system for when MongoDB is unavailable

## Key Components

### Authentication System
- Session-based authentication with secure cookies
- Password hashing with bcrypt
- Protected routes requiring authentication
- Automatic session management and logout functionality

### Loyalty Points System
- Point distribution to customers
- Real-time point balance tracking
- Transaction history and reporting
- QR code support for quick transfers

### Cashback System
- Three-tier cashback structure:
  - 15% instant cashback on point transfers
  - 2% referral commission
  - 1% monthly royalty sharing
- Automatic cashback calculation and distribution

### Wallet Management
- Multiple wallet types per merchant
- Inter-wallet transfers
- Balance tracking and transaction history
- Real-time updates via React Query

### Customer Management
- Customer registration and profile management
- Reward tier system (1500 points = reward number)
- Customer search and filtering
- Merchant-customer relationship tracking

## Data Flow

1. **Authentication Flow**: Login → Session creation → Protected route access
2. **Point Transfer Flow**: Merchant → Customer point transfer → Automatic cashback calculation
3. **Wallet Flow**: Multiple wallets → Inter-wallet transfers → Balance updates
4. **Customer Flow**: Registration → Point accumulation → Reward tier progression

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM for type-safe database operations
- **UI**: Radix UI components for accessible interface elements
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Payments**: Stripe integration (prepared for future payment features)

### Development Dependencies
- **Build**: Vite with React plugin
- **TypeScript**: Full TypeScript support throughout the stack
- **ESBuild**: For server-side bundling
- **Replit Integration**: Special plugins for Replit development environment

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Replit-specific plugins for development environment

### Production
- Vite build for frontend static assets
- ESBuild for server bundling
- Single production command serving both frontend and backend
- Environment variables for database and session configuration

### Database Management
- Drizzle Kit for schema migrations
- PostgreSQL as the primary database
- Connection pooling for production scalability

## Key Features

### Merchant Dashboard
- Real-time statistics and analytics
- Point distribution tools
- Customer management interface
- Wallet and transaction monitoring
- Marketing tools and templates
- Leaderboard and ranking system

### Business Logic
- Unified loyalty concept implementation
- Multi-tier reward system
- Referral program management
- Automated cashback calculations
- Merchant-to-merchant affiliations

### Security
- Session-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- Input validation with Zod schemas
- CSRF protection through session handling

The application is designed to be scalable, maintainable, and user-friendly, with a focus on the merchant experience while supporting the broader KOMARCE ecosystem.
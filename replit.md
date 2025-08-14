# Bozorcha E-Commerce Platform

## Overview

Bozorcha is a modern e-commerce platform built with React and Express.js, designed specifically for the Uzbekistan market. The application features SEO-optimized product listings, an automated blog system powered by Google's Gemini AI, and comprehensive admin management tools. The platform combines traditional e-commerce functionality with AI-driven content creation to maintain high search engine visibility and user engagement.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Uzbek (responds in Uzbek language)
Communication preference: Direct and action-oriented responses

## Migration Status

**Migration Completed: August 13, 2025**

Successfully migrated from Replit Agent to Replit environment with:
- ✅ Full-stack application running on Node.js 20
- ✅ In-memory storage fallback for development
- ✅ Sample data populated (3 products, 2 categories, 2 blog posts)
- ✅ All API endpoints functional and tested
- ✅ Frontend-backend integration working
- ✅ Uzbek language content throughout
- ✅ Security measures in place (admin authentication)

## Recent Changes

**August 14, 2025:**
- ✅ Successfully completed migration from Replit Agent to Replit environment
- ✅ Fixed all TypeScript and LSP diagnostic errors across the codebase
- ✅ Implemented missing storage interface methods for categories, orders, and trend analysis
- ✅ GEMINI_API_KEY configured for AI content generation
- ✅ Trend analysis API working with Gemini 2.5 Flash model
- ✅ Blog post creation system functioning with proper authentication
- ✅ SEO-optimized blog post example created about online shopping discounts
- ✅ All admin panel sections fully operational
- ✅ Complete database storage interface with both PostgreSQL and in-memory fallback
- ✅ Server running stable on port 5000 with all endpoints functional

**August 13, 2025:**
- ✅ E-commerce functionality completed: Cart system with counter in header
- ✅ Product pages enhanced: 3 images per product with thumbnails
- ✅ YouTube video integration: Videos displayed on product pages
- ✅ Wishlist system: Functional with counter in header
- ✅ Admin panel authentication updated with custom password "Gisobot201415*"
- ✅ Complete order placement system with customer form and confirmation
- ✅ Cart context type issues resolved - header counters working properly

## System Architecture

### Frontend Architecture
The client-side application uses React with TypeScript, implementing a component-based architecture with shadcn/ui design system. The frontend follows a modern SPA pattern with:
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design pattern using Express.js:
- **API Layer**: Express.js with middleware for authentication, logging, and error handling
- **Database Layer**: Drizzle ORM with type-safe database operations
- **Storage Interface**: Abstract storage layer separating business logic from database implementation
- **Service Layer**: Dedicated services for AI integration and complex business operations

### Data Storage Solutions
The application supports dual storage modes for development flexibility:
- **Production Mode**: PostgreSQL with Neon serverless hosting for scalable production use
- **Development Mode**: In-memory storage fallback with sample data for immediate development
- **Schema Design**: Normalized tables for products, blog posts, categories, users, and trend analysis
- **ORM Integration**: Drizzle ORM for type-safe database queries and migrations
- **Data Validation**: Zod schemas for runtime type checking and validation

### Authentication and Authorization
Simple token-based authentication system:
- **Admin Authentication**: Bearer token authentication for admin routes
- **Route Protection**: Middleware-based route protection for admin functionality
- **Session Management**: Stateless authentication using authorization headers

### AI Integration Architecture
Google Gemini AI integration for automated content generation:
- **Trend Analysis**: Daily automated analysis of market trends and keywords
- **Content Generation**: AI-powered blog post creation based on trending topics
- **Batch Processing**: Automated generation of 10-12 blog posts daily
- **Error Handling**: Robust error handling for AI service failures

## External Dependencies

### Third-party Services
- **Neon Database**: PostgreSQL serverless database hosting
- **Google Gemini AI**: AI content generation and trend analysis via @google/genai
- **Replit Platform**: Development and hosting environment

### Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript for type safety
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for API server
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Build Tools**: esbuild for production bundling, tsx for development
- **WebSocket Support**: ws library for Neon database connections

### Development Dependencies
- **Build System**: Vite with React plugin and development middleware
- **Development Tools**: Replit-specific plugins for cartographer and error overlay
- **Type Checking**: TypeScript with strict configuration
- **Database Tools**: Drizzle Kit for schema management and migrations
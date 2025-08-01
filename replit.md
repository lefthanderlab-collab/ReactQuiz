# Motion Graphics Portfolio Application

## Overview

This is a full-stack motion graphics portfolio application built with React and Express. The application showcases video projects in an elegant grid layout with embedded Vimeo players, categorized by project type. Users can view featured projects on the homepage and contact the portfolio owner through a modal form. The application uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components for a polished user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **Styling**: Tailwind CSS with shadcn/ui component library using the "new-york" style
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling through shadcn/ui

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with endpoints for videos and contact forms
- **Data Storage**: In-memory storage with interface for future database integration
- **Validation**: Zod schemas for request validation
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Layer
- **Database**: Configured for PostgreSQL with Drizzle ORM
- **Schema**: Two main entities - videos (with Vimeo URLs and categories) and contacts (form submissions)
- **Current Implementation**: Memory-based storage with sample data for development
- **Migration Ready**: Drizzle configuration prepared for database deployment

### Authentication & Security
- **Current State**: No authentication implemented
- **Contact Forms**: Basic validation and storage without user accounts
- **CORS**: Configured for development environment

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL (configured via Neon serverless driver)
- **Video Hosting**: Vimeo player embeds for portfolio content
- **Build System**: Vite with TypeScript compilation
- **Development**: Replit integration with cartographer and error modal plugins

### Key Libraries
- **UI Framework**: React with extensive Radix UI component suite
- **HTTP Client**: Native fetch with TanStack Query wrapper
- **Validation**: Zod for schema validation and type safety
- **Styling**: Tailwind CSS with PostCSS processing
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESBuild for production bundling
- **Database Migrations**: Drizzle Kit for schema management
- **Session Management**: Connect-pg-simple (configured but not actively used)
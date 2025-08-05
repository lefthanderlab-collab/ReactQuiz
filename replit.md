# Motion Graphics Portfolio Application

## Overview

This is a full-stack motion graphics portfolio application built with React and Express. The application features a modern single-page design with a red gradient background, inspired by Turkish portfolio websites. It showcases video projects with embedded Vimeo players in a stylized layout with navigation, profile section, services, and portfolio preview. Users can view featured projects on the homepage, browse all projects on a dedicated portfolio page, and contact the portfolio owner through a modal form. The application uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- **Complete Design Overhaul**: Redesigned the application to match modern portfolio website aesthetic with blue/purple gradient background and glass morphism effects
- **Portfolio Personalization**: Updated for "oneglass" - a female film director
  - Added cat profile image from user uploads
  - Changed from "Motion Graphics Designer" to film director focus
  - Updated name to "oneglass" in hero section
- **Language Updates**: Mixed Korean/English interface optimized for Korean market
  - Korean hero message: "창의적인 영상으로 스토리를 전달합니다"
  - Korean description: "브랜드의 본질을 담은 영상 콘텐츠를 통해 감동과 메시지를 전달하는 비디오 디자이너입니다"
  - Korean contact form
- **Apple WWDC25-Inspired Design System**: Implemented premium glass morphism design
  - Gradient mesh background with subtle color gradients
  - Glass morphism effects with backdrop blur and inner highlights
  - Premium surface design with sophisticated transparency layers
- **Minimal Video-Focused Layout**: Streamlined design for maximum video visibility
  - **Removed Navigation Header**: Eliminated fixed header for cleaner layout
  - **Removed Services Section**: Deleted Film Direction, Video Production, Brand Storytelling cards
  - **Simplified Video Gallery**: Clean 2-per-row grid without titles, descriptions, or category tags
  - **Minimal Contact Section**: Only email and social media icons, removed phone number and "Follow me" text
  - **Direct Contact Form**: Replaced modal with inline form for immediate message submission
- **Video Management System (Latest Update)**: Complete admin functionality for portfolio management
  - **PostgreSQL Database**: Migrated from in-memory storage to persistent database with proper schema
  - **Admin Interface**: Dedicated `/admin` page with comprehensive video management tools
  - **Settings Icon Navigation**: Floating settings (⚙️) button on homepage and portfolio page for quick admin access
  - **CRUD Operations**: Full Create, Read, Update, Delete functionality for videos
  - **Korean Admin UI**: Fully localized admin interface with Korean labels and confirmations
  - **Glass Morphism Admin Design**: Consistent visual theme across all pages including admin
  - **Real-time Updates**: Automatic refresh of video galleries after admin changes
  - **Featured Video Selection**: Admin can select unlimited videos to display on homepage via toggle buttons
    - Homepage shows all videos marked as "featured" in admin panel
    - No 4-video limit - displays all selected featured videos
    - Fallback to first 4 videos when no featured videos are selected
- **Profile Introduction Section**: Dedicated section at top with cat profile image and detailed intro
- **Social Media Integration**: Instagram, YouTube, Facebook, Twitter, LinkedIn icons with external links
- **Color Scheme**: Blue/purple gradient throughout the application
- **Enhanced Portfolio Page**: Dedicated page with larger video grid and glass morphism theme
- **Korean Contact Form**: Fully localized contact form with Korean labels and validation
- **Navigation Improvements**: Added floating navigation buttons with hover effects and tooltips

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
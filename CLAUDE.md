# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Centenarian Life MVP** is an AI-powered wellness platform built for the Korean market, focusing on comprehensive health management for longevity. This is a solo startup project implementing a full-stack health tracking and AI recommendation system.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time), Next.js API Routes
- **AI**: OpenAI GPT-4 for personalized health insights
- **Charts**: Recharts for data visualization
- **UI**: Framer Motion, React Hook Form, React Hot Toast

## Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run type-check       # TypeScript type checking (critical - run before commits)
npm run build           # Production build
npm run lint            # ESLint checking

# Dependencies
npm install             # Install dependencies
rm -rf node_modules package-lock.json && npm install  # Clean reinstall
```

## Core Architecture

### Authentication & State Management
The app uses a centralized authentication pattern with Supabase:
- `AuthProvider` (Context) wraps the entire app in `layout.tsx`
- Authentication state is managed globally and automatically syncs with Supabase Auth
- All authenticated routes use `useAuth()` hook for user data and session management
- Protected routes redirect to landing page if user is not authenticated

### Database Architecture
The application uses Supabase with Row Level Security (RLS):
- **Users**: Extends Supabase auth.users with profile data
- **Health Data**: Time-series health metrics (heart rate, weight, mood, etc.)
- **AI Recommendations**: GPT-4 generated personalized health advice
- **Community**: Posts, comments, and likes system
- **User Profiles**: Detailed user settings and health goals

### Page Layout System
Consistent UI is achieved through the `PageLayout` component:
```typescript
// Used in all main pages
<PageLayout title="Page Title" description="Description">
  {content}
</PageLayout>
```
This provides unified navigation with `AppNavigation` component (header + tabs).

### API Architecture
RESTful API structure using Next.js API routes:
- `/api/ai/insights` - AI health analysis using OpenAI GPT-4
- `/api/recommendations/*` - Health recommendation CRUD
- `/api/profile` - User profile management  
- `/api/community/posts/*` - Community features
- `/api/checklist` - Daily wellness checklist CRUD operations
- `/api/checklist/stats` - Checklist statistics and analytics

## Key Features Implemented

### 1. Daily Wellness Checklist (NEW)
**Location**: `/checklist` page, `DailyWellnessChecklist` component

Comprehensive wellness tracking across 10 life domains with full database integration:
- 49 actionable checklist items across physical health, mental health, nutrition, exercise, sleep, social connections, cognitive function, financial stability, purpose, and stress management
- Priority system (high/medium/low) for each item
- Real-time progress tracking with category-wise completion rates
- Daily reflection journal with achievements, improvements, and tomorrow's goals
- **Database persistence with auto-save**: Data saved to `daily_wellness_checklists` table with debounced updates
- **Fallback to localStorage**: Ensures data safety if database is unavailable
- **Dashboard integration**: Weekly stats displayed on main dashboard
- Fully responsive accordion-style interface with save status indicators

**Database Schema**: `daily_wellness_checklists` table stores:
- `checklist_data` (JSONB): Checked items state
- `reflection_data` (JSONB): Daily reflection entries
- `completion_percentage`, `total_items`, `completed_items`: Pre-calculated stats
- Row Level Security for user isolation

### 2. Health Dashboard
Interactive data visualization using Recharts:
- Health metrics summary cards (heart rate, weight, sleep averages)
- Trend charts for weight and heart rate over time
- Sleep duration and step count bar charts
- Mood tracking with emoji visualization
- Empty state handling for new users

### 3. AI-Powered Insights
Integration with OpenAI GPT-4:
- Analyzes user's recent health data to provide personalized recommendations
- Categorizes advice into exercise, nutrition, sleep, and mental health
- Includes priority levels and confidence scores
- Error handling for API rate limits and failures

### 4. Community Platform
Full social features:
- Post creation with rich text and categories
- Real-time commenting system
- Like/unlike functionality with optimistic updates
- Category filtering (general, exercise, nutrition, mental health, tips)
- User profile integration

## Environment Variables Required

Create `.env.local` with:
```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Required)
OPENAI_API_KEY=your_openai_api_key
```

## Database Schema Critical Points

1. **RLS Policies**: All tables use Row Level Security - users can only access their own data
2. **Triggers**: `updated_at` fields auto-update via PostgreSQL triggers
3. **Indexes**: Performance optimized for user_id + date queries on health_data
4. **Relationships**: Proper foreign key cascading deletes implemented

## Component Patterns

### Client vs Server Components
- **Server Components**: Page layouts, static content, initial data fetching
- **Client Components**: Interactive forms, real-time updates, authentication hooks
- All components requiring `useAuth()`, `useState`, or event handlers must be client components

### Form Handling
Uses React Hook Form with Zod validation:
```typescript
// Pattern used throughout the app
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {...}
})
```

### Error Handling
Consistent error handling with React Hot Toast:
```typescript
// Used in all API calls
try {
  // API operation
  toast.success('Success message')
} catch (error) {
  toast.error('Error message')
}
```

## Styling System

### Tailwind Configuration
Custom colors defined for wellness theme:
- `wellness-blue`: #3b82f6
- `wellness-green`: #10b981  
- `wellness-purple`: #8b5cf6

### Responsive Design
Mobile-first approach using Tailwind breakpoints:
- Base styles for mobile
- `md:` prefix for tablet/desktop
- Navigation switches from accordion to horizontal tabs on larger screens

## Critical Development Notes

### Type Safety
- **Always run `npm run type-check`** before commits - TypeScript errors will break the build
- Database types are defined in `lib/supabase.ts` and should be kept in sync with schema
- API routes include proper request/response typing

### Supabase Integration
- All database operations go through Supabase client
- Real-time subscriptions are used for live updates (comments, likes)
- File uploads (if added) should use Supabase Storage with proper RLS

### Performance Considerations
- Health data queries are optimized with date-based indexes
- Charts only render recent data (last 30 days) to prevent performance issues
- Components use React.memo and useCallback where appropriate for expensive operations

### Error Boundaries
The app includes proper error handling for:
- Network failures (API calls)
- Authentication timeouts  
- Missing environment variables
- Malformed data from database

## Common Debugging Issues

1. **Hydration Errors**: Usually caused by client-only data (localStorage) in server components
2. **Authentication Issues**: Check Supabase keys and RLS policies
3. **Type Errors**: Run `npm run type-check` - often caused by outdated database types
4. **Build Failures**: Usually TypeScript errors that need fixing (don't ignore with build config)

## UI/UX Patterns

### Korean Localization
- All user-facing text is in Korean
- Date formats use Korean standards
- UI patterns follow Korean web conventions

### Wellness-Focused Design
- Calming color palette with blues and greens
- Emoji-heavy interface for emotional connection
- Progress-focused UI with completion percentages
- Encouragement messaging throughout the app

This codebase represents a production-ready MVP with 95% feature completion. The architecture supports easy expansion for additional wellness features, AI capabilities, and social functionality.
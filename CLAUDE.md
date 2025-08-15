# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (ESLint with TypeScript extensions)
- **Format code**: `npm run format` (Prettier)

## Architecture Overview

This is a Next.js 15.3.2 inventory management system for "Chriska SRL" built with TypeScript, Chakra UI, and Zustand for state management.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Chakra UI v2 with emotion
- **State Management**: Zustand
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Forms**: Formik with Yup validation
- **Date Handling**: date-fns
- **Icons**: react-icons

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components organized by feature
├── entities/               # TypeScript type definitions
├── enums/                  # TypeScript enums
├── hooks/                  # Custom React hooks for API calls
├── services/               # API service functions
├── stores/                 # Zustand state stores
├── theme/                  # Chakra UI theme configuration
└── utils/                  # Utility functions and helpers
```

### Authentication System

- JWT-based authentication with automatic token validation
- Middleware handles route protection and redirects (`src/middleware.ts:27-114`)
- User store manages authentication state with Zustand (`src/stores/useUserStore.ts`)
- Automatic password change flow for temporary passwords

### Component Architecture

Components follow a modular pattern organized by business domain:

- Each feature has its own folder (e.g., `Products/`, `Users/`, `Vehicles/`)
- Standard component structure: List, Add, Edit, Detail, Filters
- Shared components in `components/shared/` for reusable functionality
- Generic CRUD operations handled by `GenericAdd.tsx` and `GenericDelete.tsx`

### API Integration

- Centralized HTTP client in `src/utils/fetcher.ts` with automatic auth header injection
- Service layer in `src/services/` mirrors component structure
- Custom hooks in `src/hooks/` provide React Query-like functionality
- All API calls automatically include location coordinates for audit purposes

### Permission System

- Role-based permissions stored in JWT token
- Permission checking via `useUserStore.hasPermission()`
- Permissions defined as enums in `src/enums/permission.enum.ts`

### Key Features

The system manages:

- Users and Roles with granular permissions
- Products with categories, subcategories, brands
- Inventory with warehouses, shelves, and stock movements
- Clients and Suppliers
- Vehicles with cost tracking
- Geographic zones for logistics

### Development Notes

- Uses TypeScript strict mode
- Chakra UI with custom theme and dark mode support
- Form validation with Formik + Yup schemas
- Image upload functionality with modal preview
- Responsive design with mobile-first approach
- Cookie-based session management with automatic cleanup

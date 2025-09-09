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

## Filter System Transformation (Dropdown to Input-based)

This section documents the complete process for transforming filter components from dropdown-based client search to simple input-based search patterns.

### Overview

Currently, OrderRequest, Order, Delivery, and ReturnRequest filters use a complex dropdown system for client selection. The desired transformation is to simplify this to an input-based search similar to ProductFilters, where users can type and press Enter to search by name without selecting specific items from a dropdown.

### Current Pattern (Dropdown-based)

The existing filter components use:

- Complex dropdown state management with debounced search
- `selectedClient` state storing `{ id: number; name: string }`
- `onFilterChange` callback with `{ clientId?: number }`
- `useGetClients` hook for dropdown population
- Client selection from dropdown results

### Target Pattern (Input-based)

The desired pattern (like ProductFilters) uses:

- Simple input field with local state
- Parent component manages filter state via props
- Enter key triggers search
- No client selection - searches show all matching results

### Complete Transformation Checklist

**CRITICAL**: All steps must be completed in order. Missing backend changes will cause "loading forever" issues.

#### Step 1: Update Service Layer

File: `src/services/{entity}.ts` (e.g., `src/services/orderRequest.ts`)

```typescript
// Add new filter parameters to existing type
type OrderRequestFilters = {
  status?: string;
  clientId?: number; // Keep for backward compatibility
  userId?: number;
  fromDate?: string;
  toDate?: string;
  // Add new search parameters
  name?: string;
  rut?: string;
  razonSocial?: string;
  contactName?: string;
};

// Update URLSearchParams construction in getOrderRequests
if (filters?.name) {
  params.append('filters[Name]', filters.name);
}
if (filters?.rut) {
  params.append('filters[Rut]', filters.rut);
}
if (filters?.razonSocial) {
  params.append('filters[RazonSocial]', filters.razonSocial);
}
if (filters?.contactName) {
  params.append('filters[ContactName]', filters.contactName);
}
```

#### Step 2: Update Hook Layer

File: `src/hooks/{entity}.ts` (e.g., `src/hooks/orderRequest.ts`)

```typescript
// Update filter type to match service
type OrderRequestFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
  name?: string;
  rut?: string;
  razonSocial?: string;
  contactName?: string;
};

// Update memoizedFilters dependencies
const memoizedFilters = useMemo(
  () => filters,
  [
    filters?.status,
    filters?.clientId,
    filters?.userId,
    filters?.fromDate,
    filters?.toDate,
    // Add new dependencies
    filters?.name,
    filters?.rut,
    filters?.razonSocial,
    filters?.contactName,
  ],
);
```

#### Step 3: Update Parent Component State

File: `src/app/{entity}/page.tsx` (e.g., `src/app/orderrequests/page.tsx`)

```typescript
// Replace clientId-based state with search-based state
const [filters, setFilters] = useState<{
  status?: string;
  userId?: number;
  fromDate?: string;
  toDate?: string;
  // Replace clientId with search fields
  clientSearch?: string;
  clientSearchParam?: 'name' | 'rut' | 'razonSocial' | 'contactName';
}>({});

// Update handleFilterChange to map search fields to service parameters
const handleFilterChange = useCallback((newFilters: any) => {
  const mappedFilters: any = {
    status: newFilters.status,
    userId: newFilters.userId,
    fromDate: newFilters.fromDate,
    toDate: newFilters.toDate,
  };

  // Map search fields to service parameters
  if (newFilters.clientSearch && newFilters.clientSearchParam) {
    mappedFilters[newFilters.clientSearchParam] = newFilters.clientSearch;
  }

  setFilters(mappedFilters);
}, []);
```

#### Step 4: Update Filter Component Props

File: `src/components/{Entity}/{Entity}Filters.tsx`

```typescript
// Change props interface
type OrderRequestFiltersProps = {
  onFilterChange: (filters: {
    status?: string;
    userId?: number;
    fromDate?: string;
    toDate?: string;
    clientSearch?: string;
    clientSearchParam?: 'name' | 'rut' | 'razonSocial' | 'contactName';
  }) => void;
  disabled?: boolean;
};

// Replace complex dropdown logic with simple input pattern
const [clientSearch, setClientSearch] = useState('');
const [clientSearchParam, setClientSearchParam] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
const [inputValue, setInputValue] = useState('');

const handleSearch = useCallback(() => {
  if (inputValue.length >= 2 || inputValue.length === 0) {
    setClientSearch(inputValue);
  }
}, [inputValue]);

const handleKeyPress = useCallback(
  (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  },
  [handleSearch],
);

// Update useEffect to send new format
useEffect(() => {
  onFilterChange({
    status: status || undefined,
    userId: userId ? Number(userId) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    clientSearch: clientSearch || undefined,
    clientSearchParam: clientSearchParam,
  });
}, [status, userId, fromDate, toDate, clientSearch, clientSearchParam, onFilterChange]);
```

#### Step 5: Update Filter Component UI

Replace dropdown UI with simple input:

```typescript
// Remove complex dropdown state and UI
// Replace with simple input similar to ProductFilters
<Flex bg={disabled ? disabledColor : bgInput} borderRadius="md" overflow="hidden">
  <Select
    value={clientSearchParam}
    onChange={(e) => setClientSearchParam(e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName')}
    bg="transparent"
    border="none"
    color={textColor}
    w="auto"
    minW="7rem"
    borderRadius="none"
    _focus={{ boxShadow: 'none' }}
    disabled={disabled}
  >
    <option value="name">Nombre</option>
    <option value="rut">RUT</option>
    <option value="razonSocial">Razón social</option>
    <option value="contactName">Contacto</option>
  </Select>

  <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

  <InputGroup flex="1">
    <Input
      placeholder="Buscar cliente..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={handleKeyPress}
      bg="transparent"
      border="none"
      borderRadius="none"
      _placeholder={{ color: textColor }}
      color={textColor}
      _focus={{ boxShadow: 'none' }}
      pl="1rem"
      disabled={disabled}
    />
    <InputRightElement>
      <IconButton
        aria-label="Buscar"
        icon={<AiOutlineSearch size="1.25rem" />}
        size="sm"
        variant="ghost"
        color={textColor}
        onClick={handleSearch}
        disabled={disabled}
      />
    </InputRightElement>
  </InputGroup>
</Flex>
```

### Common Pitfalls

1. **Missing Backend Changes**: Only updating UI without modifying services/hooks causes infinite loading
2. **Wrong Filter Mapping**: Not properly mapping clientSearch + clientSearchParam to the correct service parameters
3. **Incomplete Dependencies**: Missing new filter fields in useMemo dependencies breaks reactivity
4. **State Structure Mismatch**: Parent component state not matching what child component sends

### Verification Steps

1. Test search with 2+ characters and Enter key
2. Verify network requests include correct filter parameters
3. Test parameter switching (name/rut/razonSocial/contactName)
4. Test reset functionality clears all fields
5. Test with advanced filters combination

### Reference Implementation

See `src/components/Products/ProductFilters.tsx` for the target pattern implementation.

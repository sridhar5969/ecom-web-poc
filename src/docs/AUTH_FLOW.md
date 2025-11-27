# Authentication Flow Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication Modes](#authentication-modes)
3. [Login Flow](#login-flow)
4. [Token Management](#token-management)
5. [Token Refresh Mechanism](#token-refresh-mechanism)
6. [Session Management](#session-management)
7. [Route Protection](#route-protection)
8. [Logout Flow](#logout-flow)
9. [Error Handling](#error-handling)
10. [Security Considerations](#security-considerations)
11. [Code Examples](#code-examples)

---

## Overview

The authentication system supports two modes: **localStorage** and **cookie-based** authentication. It uses JWT tokens (access token and refresh token) for secure user authentication and implements automatic token refresh to maintain user sessions.

### Key Components

- **TokenStorage** (`src/utils/TokenStorage.ts`) - Abstracts token storage between localStorage and cookies
- **authApi** (`src/store/api/auth/auth.api.ts`) - Handles login/logout API calls
- **sessionApi** (`src/store/api/auth/session.api.ts`) - Manages user session data
- **baseApi** (`src/store/api/baseApi.ts`) - Handles automatic token refresh and request interception
- **useAuthRoutes** (`src/hooks/useAuthRoutes.tsx`) - Manages route protection based on authentication state

---

## Authentication Modes

The authentication mode is controlled by the `VITE_AUTH_MODE` environment variable:

### localStorage Mode (`VITE_AUTH_MODE=localStorage`)

- Tokens are stored in browser's `localStorage`
- Access token is sent in `Authorization: Bearer <token>` header
- Refresh token is sent in request body when refreshing
- Tokens are manually managed by the frontend

### Cookie Mode (`VITE_AUTH_MODE=cookie`)

- Tokens are stored in HTTP-only cookies by the backend
- Cookies are automatically sent with requests (`credentials: 'include'`)
- No manual token management needed
- More secure (cookies are not accessible via JavaScript)

### Configuration

```typescript
// src/config/env.ts
VITE_AUTH_MODE: z.enum(['cookie', 'localStorage']).optional().default('cookie');
```

---

## Login Flow

### Step-by-Step Process

1. **User submits login form** (`src/pages/authentication/auth-forms/AuthLogin.tsx`)
   - Email and password are validated using Yup schema
   - Form submission triggers `useLoginUserMutation`

2. **Login API call** (`src/store/api/auth/auth.api.ts`)

   ```typescript
   POST /auth/login
   Body: { email: string, password: string }
   ```

3. **Backend Response** (transformed by `transformResponse`)

   ```json
   {
   	"success": true,
   	"data": {
   		"accessToken": "eyJhbGciOiJIUzI1NiIs...",
   		"refreshToken": "eyJhbGciOiJIUzI1NiIs..."
   	},
   	"message": "Login successful",
   	"timestamp": "2024-01-01T00:00:00Z"
   }
   ```

4. **Token Storage** (localStorage mode only)
   - If `VITE_AUTH_MODE === 'localStorage'`, tokens are stored via `TokenStorage.setTokens()`
   - In cookie mode, backend sets cookies automatically

5. **Navigation**
   - On success, user is redirected to `/` (home)
   - Routes are dynamically generated based on user permissions

### Code Example

```typescript
// Login component
const [loginUser] = useLoginUserMutation();

const onSubmit = async (values: FormValues) => {
	try {
		await loginUser({
			email: values.email,
			password: values.password
		}).unwrap();
		navigate('/'); // Redirect to home
	} catch (err) {
		// Error handling
	}
};
```

---

## Token Management

### TokenStorage Utility

The `TokenStorage` class provides a unified interface for token operations:

```typescript
// Get access token
TokenStorage.getAccessToken(): string | null

// Get refresh token
TokenStorage.getRefreshToken(): string | null

// Set both tokens (localStorage mode only)
TokenStorage.setTokens(accessToken: string, refreshToken: string): void

// Clear both tokens
TokenStorage.clearTokens(): void
```

### Token Storage Locations

| Mode         | Access Token                          | Refresh Token                          |
| ------------ | ------------------------------------- | -------------------------------------- |
| localStorage | `localStorage.getItem('accessToken')` | `localStorage.getItem('refreshToken')` |
| cookie       | HTTP-only cookie                      | HTTP-only cookie                       |

### Token Usage in Requests

**localStorage Mode:**

```typescript
// Automatically added by rawBaseQuery
headers.set('authorization', `Bearer ${token}`);
```

**Cookie Mode:**

```typescript
// Automatically sent with credentials: 'include'
credentials: 'include';
```

---

## Token Refresh Mechanism

### Automatic Token Refresh

The system automatically refreshes tokens when a 401 (Unauthorized) response is received.

### How It Works

1. **Request fails with 401**
   - `baseApi.ts` intercepts the error
   - Triggers `attemptTokenRefresh()`

2. **Token Refresh Queue** (Prevents race conditions)

   ```typescript
   // Only one refresh happens at a time
   // All concurrent requests wait for the same refresh
   let refreshTokenPromise: Promise<boolean> | null = null;
   ```

3. **Refresh Request**

   ```typescript
   // localStorage mode
   POST / auth / refresh;
   Body: {
   	refreshToken: string;
   }

   // cookie mode
   POST / auth / refresh;
   // Refresh token sent via cookie
   ```

4. **Token Update** (localStorage mode only)
   - New tokens are stored via `TokenStorage.setTokens()`
   - Original request is retried with new token

5. **Failure Handling**
   - If refresh fails, user is logged out
   - Redirected to login page

### Code Flow

```typescript
// src/store/api/baseApi.ts

// 1. Request fails with 401
if (result.error?.status === HTTP_STATUS.UNAUTHORIZED) {
	// 2. Attempt token refresh
	const refreshSuccessful = await attemptTokenRefresh(api, extraOptions);

	if (refreshSuccessful) {
		// 3. Retry original request
		result = await rawBaseQuery(args, api, extraOptions);
	}
}
```

### Race Condition Prevention

The refresh mechanism uses Promise deduplication:

```typescript
// If refresh is already in progress, wait for it
if (refreshTokenPromise) {
	return refreshTokenPromise; // All requests share the same promise
}
```

This ensures:

- Only one refresh request is made
- All concurrent 401 errors wait for the same refresh
- No duplicate refresh attempts

---

## Session Management

### Session Data Structure

```typescript
interface SessionData {
	id: string;
	name: string;
	email: string;
	roleId: number;
	roleName: string;
	permissions: string[];
}
```

### Fetching Session Data

```typescript
// src/store/api/auth/session.api.ts
const { data, isLoading, isError } = useSessionContextQuery(token);
```

### Session Caching

- Session data is cached for **30 minutes** (`CACHE_DURATION.LONG`)
- Cache is invalidated on logout
- Session is fetched on app initialization if token exists

### Session Validation

Session data is validated using Zod schema:

```typescript
const parsed = sessionDataSchema.safeParse(response);
if (!parsed.success) {
	throw new Error('Invalid session context structure');
}
```

---

## Route Protection

### Route Guard Logic

Routes are protected in `useAuthRoutes` hook:

```typescript
export function useAuthRoutes() {
	const token = TokenStorage.getAccessToken();
	const { data, isLoading, isError } = useSessionContextQuery(token);

	// 1. No token → Show login routes
	if (!token) return [LoginRoutes];

	// 2. Loading → Show loading state
	if (isLoading || !data) return [createLoadingRoutes()];

	// 3. Error → Show error page
	if (isError || !data) return [createErrorRoutes(errorMessage)];

	// 4. Authenticated → Generate routes based on permissions
	const permissions = getAllPermissions(data);
	const orderedScreens = getOrderedScreens(permissions);
	// ... create dynamic routes
}
```

### Permission-Based Routes

Routes are dynamically generated based on user permissions:

```typescript
const permissions = getAllPermissions(data);
const orderedScreens = getOrderedScreens(permissions);
const dynamicRoutes = orderedScreens.map(screen => ({
  path: screen.path,
  element: <screen.element />
}));
```

### Route States

| State         | Action                |
| ------------- | --------------------- |
| No token      | Show login page       |
| Loading       | Show loading spinner  |
| Error         | Show error page       |
| Authenticated | Show protected routes |

---

## Logout Flow

### Step-by-Step Process

1. **User triggers logout** (e.g., clicks logout button)

   ```typescript
   const logout = useLogout();
   await logout();
   ```

2. **Logout API call**

   ```typescript
   POST / auth / logout;
   // Cookies are cleared by backend (cookie mode)
   ```

3. **Token cleanup**
   - `TokenStorage.clearTokens()` is called
   - Tokens removed from storage

4. **Redux state reset**

   ```typescript
   dispatch(logoutApp()); // Clears all Redux state
   ```

5. **Navigation**
   - User redirected to `/` (login page)

### Code Implementation

```typescript
// src/hooks/useLogOut.tsx
export const useLogout = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [logoutUser] = useLogoutUserMutation();

	const logout = async () => {
		try {
			await logoutUser().unwrap();
		} catch (err) {
			// Clear tokens even if API call fails
			TokenStorage.clearTokens();
		}
		dispatch(logoutApp()); // Reset Redux
		navigate('/'); // Redirect to login
	};

	return logout;
};
```

### Redux State Reset

On logout, the entire Redux state is reset:

```typescript
// src/store/reducers/index.ts
if (action.type === LOGOUT) {
	TokenStorage.clearTokens();
	state = undefined; // Reset entire state
}
```

---

## Error Handling

### Authentication Errors

#### 401 Unauthorized

**Automatic Handling:**

1. Token refresh is attempted
2. If refresh succeeds, request is retried
3. If refresh fails, user is logged out

**Middleware Response:**

```typescript
// src/store/store.ts
if (status === HTTP_STATUS.UNAUTHORIZED) {
	dispatch(logoutApp());
	notificationService.error(ERROR_MESSAGES.SESSION_EXPIRED, 'Session Expired');
}
```

#### Login Errors

**Validation Errors:**

- Displayed as notifications
- Field-level validation shown in form

**Server Errors:**

- Error message displayed to user
- Logged for debugging

### Error Flow

```
API Request
    ↓
401 Error
    ↓
Token Refresh Attempt
    ↓
Success? → Retry Request
    ↓
Failure? → Logout User → Redirect to Login
```

---

## Security Considerations

### Token Storage

**localStorage Mode:**

- ⚠️ Tokens accessible via JavaScript (XSS risk)
- ✅ Not sent automatically (CSRF protection)
- ✅ Survives page refresh

**Cookie Mode:**

- ✅ HTTP-only cookies (XSS protection)
- ⚠️ Automatically sent (CSRF risk - mitigated by backend)
- ✅ More secure overall

### Best Practices

1. **Always use HTTPS** in production
2. **Implement CSRF protection** (cookie mode)
3. **Set appropriate token expiration** times
4. **Validate tokens on backend** before processing requests
5. **Log security events** (failed logins, token refresh failures)

### Token Expiration

- Access tokens should have short expiration (15-30 minutes)
- Refresh tokens should have longer expiration (7-30 days)
- Expired refresh tokens require re-login

---

## Code Examples

### Using Login Mutation

```typescript
import { useLoginUserMutation } from '@store/api/auth/auth.api';

function LoginComponent() {
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginUser({ email, password }).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Using Logout Hook

```typescript
import { useLogout } from '@hooks/useLogOut';

function Header() {
  const logout = useLogout();

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

### Accessing Session Data

```typescript
import { useSessionContextQuery } from '@store/api/auth/session.api';
import TokenStorage from '@utils/TokenStorage';

function ProfileComponent() {
  const token = TokenStorage.getAccessToken();
  const { data: session, isLoading } = useSessionContextQuery(token);

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session.name}</h1>
      <p>Email: {session.email}</p>
      <p>Role: {session.roleName}</p>
    </div>
  );
}
```

### Manual Token Check

```typescript
import TokenStorage from '@utils/TokenStorage';

function ProtectedComponent() {
  const token = TokenStorage.getAccessToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <div>Protected Content</div>;
}
```

### Custom API Call with Auth

```typescript
// RTK Query automatically handles token refresh
import { useGetDataQuery } from '@store/api/data/data.api';

function DataComponent() {
  // Token is automatically included in request
  // 401 errors trigger automatic refresh
  const { data, isLoading, error } = useGetDataQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Architecture Diagram

```
┌─────────────────┐
│   Login Form    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   authApi       │  POST /auth/login
│   loginUser     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ TokenStorage    │  Store tokens
│ setTokens()     │  (localStorage mode)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useAuthRoutes   │  Check token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ sessionApi      │  GET /session
│ userSession     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dynamic Routes  │  Based on permissions
└─────────────────┘

┌─────────────────┐
│  API Request     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   baseApi       │  Add Authorization header
│   baseQuery     │  (localStorage mode)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   401 Error?    │
└────────┬────────┘
         │
    ┌────┴────┐
    │   Yes   │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Token Refresh   │  POST /auth/refresh
│ Queue           │  (Prevents race conditions)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Retry Request   │  With new token
└─────────────────┘
```

---

## Troubleshooting

### Common Issues

**Issue: Tokens not persisting after refresh**

- Check `VITE_AUTH_MODE` environment variable
- Verify token storage implementation matches mode

**Issue: Multiple refresh requests**

- Should be handled by refresh queue
- Check `refreshTokenPromise` implementation

**Issue: Session not loading**

- Verify token exists: `TokenStorage.getAccessToken()`
- Check network tab for `/session` request
- Verify session API response format

**Issue: Logout not working**

- Check `TokenStorage.clearTokens()` implementation
- Verify Redux `LOGOUT` action is dispatched
- Check navigation after logout

---

## Related Documentation

- [API Documentation](./API.md) - API structure and usage
- [Store Documentation](./API_AND_STORE.md) - Redux store setup
- [Types Documentation](./TYPES.md) - TypeScript types
- [Architecture Documentation](./ARCHITECTURE.md) - Overall architecture

---

## Summary

The authentication system provides:

✅ **Dual authentication modes** (localStorage and cookie)  
✅ **Automatic token refresh** with race condition prevention  
✅ **Permission-based routing**  
✅ **Secure token management**  
✅ **Comprehensive error handling**  
✅ **Session management** with caching  
✅ **Clean logout flow** with state reset

The system is designed to be secure, maintainable, and user-friendly while providing flexibility for different deployment scenarios.

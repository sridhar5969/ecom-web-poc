/**
 * Central API registry
 * Import all RTK Query API slices here for auto-discovery
 * This ensures middleware and reducers are automatically registered
 */

import { authApi } from './auth/auth.api';
import { sessionApi } from './auth/session.api';

/**
 * Array of all API slices
 * Add new APIs here to automatically register their middleware and reducers
 */
export const apiSlices = [authApi, sessionApi] as const;

/**
 * Type helper for API slices
 */
export type ApiSlice = (typeof apiSlices)[number];

/**
 * Central API registry
 * Import all RTK Query API slices here for auto-discovery
 * This ensures middleware and reducers are automatically registered
 */

import { authApi } from './auth/auth.api';
import { sessionApi } from './auth/session.api';
import { productApi } from './business/product.api';

/**
 * Array of all API slices
 * Add new APIs here to automatically register their middleware and reducers
 */
export const apiSlices = [authApi, sessionApi, productApi] as const;

/**
 * Type helper for API slices
 */
export type ApiSlice = (typeof apiSlices)[number];

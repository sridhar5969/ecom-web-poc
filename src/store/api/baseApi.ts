import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from '@reduxjs/toolkit/query';
import { env } from '../../config/env';
import type { SuccessResponse, ErrorResponse, RtkQueryError } from '../../types/api.types';
import { logger, logApiError } from '../../services/logger/logger.service';
import { performanceMonitor } from '../../services/performance/performance.service';
import { HTTP_STATUS } from '../../constants';
import TokenStorage from '../../utils/TokenStorage';
import { getOrCreateSessionId } from '../../utils/session';

/**
 * Token refresh queue to prevent race conditions
 * Ensures only one refresh happens at a time, all concurrent requests wait for the same refresh
 */
let refreshTokenPromise: Promise<boolean> | null = null;

/**
 * Raw base query for API calls
 */
export const rawBaseQuery = fetchBaseQuery({
	baseUrl: env.API_BASE_URL,
	credentials: env.VITE_AUTH_MODE === 'cookie' ? 'include' : 'omit',
	prepareHeaders: (headers, api) => {
		const sessionId = getOrCreateSessionId();
		if (sessionId) headers.set('x-session-id', sessionId);
		// Add Authorization header when in localStorage mode
		// if (env.VITE_AUTH_MODE === 'localStorage') {
			// We use api.getState() to access the Redux store. 
			// Since we use redux-persist, this state is automatically rehydrated from localStorage.
			const state = api.getState() as any;
			const token = state.auth?.accessToken;

			console.log('🔒 Attaching Token from Redux State:', token ? 'Yes' : 'No');

			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
		// }
		return headers;
	}
});

/**
 * Transform backend response to RTK Query format
 * Backend format: { success: true, data?: T, message?: string, timestamp: string }
 *                { success: false, message: string, errors?: Record<string, string[]>, timestamp: string }
 */
const isBackendResponse = (response: unknown): response is SuccessResponse | ErrorResponse => {
	return (
		typeof response === 'object' &&
		response !== null &&
		'success' in response &&
		typeof (response as { success: unknown }).success === 'boolean'
	);
};

const transformErrorResponse = (errorResponse: ErrorResponse, status?: number): FetchBaseQueryError => {
	return {
		status: status || 400,
		data: errorResponse
	};
};

/**
 * Attempts to refresh the token
 * Returns true if refresh was successful, false otherwise
 * Uses Promise deduplication to ensure only one refresh happens at a time
 */
const attemptTokenRefresh = async (api: BaseQueryApi, extraOptions: Record<string, unknown>): Promise<boolean> => {
	if (refreshTokenPromise) return refreshTokenPromise;

	refreshTokenPromise = (async () => {
		try {
			logger.info('Attempting token refresh');

			const refreshArgs: FetchArgs =
				env.VITE_AUTH_MODE === 'localStorage'
					? {
						url: 'auth/refresh',
						method: 'POST',
						body: {
							// Use refresh token from Redux state
							refreshToken: (api.getState() as any).auth?.refreshToken
						},
						credentials: 'include'
					}
					: {
						url: 'auth/refresh',
						method: 'POST',
						credentials: 'include'
					};

			const refresh = await rawBaseQuery(refreshArgs, api, extraOptions);

			if (refresh.data && isBackendResponse(refresh.data)) {
				if (!refresh.data.success) return false;

				if (env.VITE_AUTH_MODE === 'localStorage' && refresh.data.data) {
					const tokens = refresh.data.data as { accessToken: string; refreshToken: string };
					if (tokens.accessToken && tokens.refreshToken) {
						TokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
					}
				}

				logger.info('Token refresh successful');
				return true;
			}

			return false;
		} finally {
			refreshTokenPromise = null;
		}
	})();

	return refreshTokenPromise;
};

/**
 * Transform backend response to RTK Query format
 * Handles both success and error responses
 */
const transformResponse = (
	result: Awaited<ReturnType<typeof rawBaseQuery>>
): Awaited<ReturnType<typeof rawBaseQuery>> => {
	// Transform backend response format
	if (result.data && isBackendResponse(result.data)) {
		if (result.data.success === false) {
			// Convert error response to RTK Query error
			return {
				error: transformErrorResponse(result.data, HTTP_STATUS.BAD_REQUEST),
				data: undefined,
				meta: result.meta
			};
		} else {
			// Extract data from success response
			return result;
		}
	}

	// Transform error if it's a backend error format
	if (result.error?.data && isBackendResponse(result.error.data) && result.error.data.success === false) {
		const statusCode = typeof result.error.status === 'number' ? result.error.status : 400;
		return {
			...result,
			error: transformErrorResponse(result.error.data, statusCode)
		};
	}

	return result;
};

/**
 * Base query with automatic token refresh on 401, performance tracking,
 * and backend response transformation
 * Note: Loading states are handled individually by each screen using RTK Query's built-in loading states
 */
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	const url = typeof args === 'string' ? args : args.url;
	const measureId = performanceMonitor.startMeasure(`api-${url}`, 'api_call');

	try {
		let result = await rawBaseQuery(args, api, extraOptions);

		// Transform backend response format
		result = transformResponse(result);

		// Track API performance
		const duration = performanceMonitor.endMeasure(measureId);
		if (duration !== null) {
			logger.debug(`API call completed: ${url}`, {
				duration: `${duration.toFixed(2)}ms`,
				status: result.error ? result.error.status : 'success'
			});
		}

		// Handle 401 unauthorized - attempt token refresh
		if (result.error?.status === HTTP_STATUS.UNAUTHORIZED) {
			console.log('refresh tried');
			// Only skip refresh when using localStorage mode and the refresh token is missing.
			// In cookie auth mode the server may rely on http-only cookies, so allow the refresh attempt.
			if (
				env.VITE_AUTH_MODE === 'localStorage' &&
				!(api.getState() as any).auth?.refreshToken
			) {
				return result; // ← prevent refresh attempts for public routes or missing token
			}

			const refreshSuccessful = await attemptTokenRefresh(api, extraOptions);

			if (refreshSuccessful) {
				// Retry the original request with new token
				logger.info('Retrying request after token refresh', { url });
				result = await rawBaseQuery(args, api, extraOptions);
				result = transformResponse(result);
			}
		}

		// Log errors (but don't show notifications here - let middleware handle that)
		if (result.error) {
			logApiError(result.error, {
				url,
				status: result.error.status
			});
		}

		return result;
	} catch (error) {
		const duration = performanceMonitor.endMeasure(measureId);
		logApiError(error, {
			url,
			duration: duration ? `${duration.toFixed(2)}ms` : undefined,
			action: 'api_call'
		});
		throw error;
	}
};

/**
 * Creates a prefixed base query for API endpoints with a specific prefix
 */
export const createPrefixedBaseQuery =
	(prefix: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
		async (args, api, extraOptions) => {
			const modifiedArgs = typeof args === 'string' ? `${prefix}${args}` : { ...args, url: `${prefix}${args.url}` };

			return baseQuery(modifiedArgs, api, extraOptions);
		};

/**
 * Type guard for RTK Query error
 */
export const isRtkQueryError = (error: unknown): error is RtkQueryError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		typeof (error as { status: unknown }).status === 'number'
	);
};

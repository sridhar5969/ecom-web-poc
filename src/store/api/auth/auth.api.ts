import { logger } from '../../../services/logger/logger.service';
import { env } from '../../../config/env';
import TokenStorage from '../../../utils/TokenStorage';
import { rootApi } from '..';

/**
 * Login response type
 * After transformation, baseApi returns the data portion
 * In localStorage mode: { accessToken: string, refreshToken: string }
 * In cookie mode: {} (empty object)
 */
export type LoginRes = Record<string, never> | { accessToken?: string; refreshToken?: string };

/**
 * Logout response type
 * After transformation, baseApi returns the data portion (empty object {} for logout)
 */
export type LogoutRes = Record<string, never>;

export const authApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		loginUser: builder.mutation<LoginRes, { email: string; password: string }>({
			query(data) {
				return {
					url: 'auth/login',
					method: 'post',
					body: data
				};
			},
			transformResponse: (response: {
				success: boolean;
				timestamp: string;
				data: {
					role: string;
					authMethod: string;
					accessToken: string;
					refreshToken?: string;
				};
				message: string;
			}) => {
				if (response.success && response.data) {
					const { accessToken } = response.data;
					console.log('✅ 1. API Response received token:', accessToken);

					// Note: Backend might not return refresh token in some modes, handle gracefully
					// For now we default to empty string if missing to satisfy types
					const refreshToken = response.data.refreshToken || '';

					// 1. Manually sync to localStorage for non-Redux usage (optional but safe)
					if (accessToken) {
						console.log('✅ 2. Setting TokenStorage manually');
						TokenStorage.setTokens(accessToken, refreshToken);
					}

					// 2. Return tokens so they are passed to authSlice -> Redux Store -> redux-persist
					return { accessToken, refreshToken } as LoginRes;
				}

				console.log('❌ API Response missing success or data:', response);
				return {} as LoginRes;
			}
		}),

		registerUser: builder.mutation<LoginRes, { firstName: string; lastName: string; email: string; password: string }>({
			query(data) {
				return {
					url: 'auth/register',
					method: 'post',
					body: data
				};
			},
			transformResponse: (response: {
				success: boolean;
				timestamp: string;
				data: {
					role: string;
					authMethod: string;
					accessToken: string;
				};
				message: string;
			}) => {
				console.log('✅ Register Response:', response);
				if (typeof response === 'object' && response !== null) {
					const backendResponse = response 

					if (backendResponse.success === true && backendResponse.data) {
						const { accessToken, refreshToken } = backendResponse.data;
						if (accessToken) {
							TokenStorage.setTokens(accessToken, refreshToken || '');
							return { accessToken, refreshToken: refreshToken || '' } as LoginRes;
						}
					}
				}
				return {} as LoginRes;
			}
		}),

		logoutUser: builder.mutation<LogoutRes, void>({
			query: () => ({
				url: 'auth/logout',
				method: 'post',
				credentials: env.VITE_AUTH_MODE === 'cookie' ? 'include' : 'omit'
			}),
			transformResponse: (response: unknown) => {
				// Response is already transformed by baseApi
				// Backend returns: { success: true, data: {}, message: "Logged out successfully", timestamp: string }
				// After baseApi transformation: {} (empty object)
				if (typeof response === 'object' && response !== null) {
					// Clear tokens from storage (works for both cookie and localStorage modes)
					TokenStorage.clearTokens();
					return {} as LogoutRes;
				}
				logger.error('Logout response validation failed', new Error('Invalid response type'), {
					response
				});
				throw new Error('Invalid logout response structure');
			}
		})
	})
});

export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation } = authApi;

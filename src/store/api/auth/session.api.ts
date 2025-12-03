import { sessionDataSchema, type SessionData } from '../../../schemas/session.schemas';
import { logger } from '../../../services/logger/logger.service';
import { CACHE_DURATION } from '../../../constants';
import type { ErrorResponse } from '../../../types/api.types';
import { rootApi } from '..';

export const sessionApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		userSessionContext: builder.query<SessionData | null, void>({
			query: () => '/session', // Ensure this matches your backend route

			keepUnusedDataFor: CACHE_DURATION.LONG,
			providesTags: ['Session'],

			// 👇 UPDATED SECTION
			transformResponse: (rawResponse: { success: boolean; data: unknown }) => {
				// 1. Unwrap the 'data' property
				const payload = rawResponse.data;

				// 2. Validate the INNER payload, not the wrapper
				const parsed = sessionDataSchema.safeParse(payload);

				if (!parsed.success) {
					logger.error('Session context validation failed', parsed.error, {
						rawResponse
					});
					throw new Error('Invalid session context structure');
				}

				return parsed.data;
			},
			// 👆 END UPDATED SECTION

			transformErrorResponse: (response: any) => {
				if (response.status === 401) {
					return null;
				}
				return response;
			}
		})
	})
});

const { useUserSessionContextQuery ,useLazyUserSessionContextQuery} = sessionApi;
export {useLazyUserSessionContextQuery}
/**
 * Simplified session hook - treats 401 as "not authenticated" rather than error
 */
export const useSessionContextQuery = () => {
	const query = useUserSessionContextQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
		refetchOnFocus: false
	});

	const is401 = query.error && 'status' in query.error && query.error.status === 401;

	if (is401) {
		console.log('SessionContextQuery: User is not authenticated (401)');
		return {
			data: null,
			isLoading: false,
			isError: false,
			errorMessage: undefined
		};
	}

	let errorMessage: string | undefined;

	if (query.isError && query.error) {
		if ('status' in query.error && query.error.data && typeof query.error.data === 'object') {
			if ('success' in query.error.data && (query.error.data as { success: unknown }).success === false) {
				errorMessage = (query.error.data as ErrorResponse).message;
			} else {
				errorMessage = `Error ${query.error.status}`;
			}
		} else if ('message' in query.error) {
			errorMessage = query.error.message;
		}
	}

	return {
		data: query.data ?? null,
		isLoading: query.isLoading,
		isError: query.isError && !is401,
		errorMessage
	};
};

export const {
	util: { invalidateTags }
} = sessionApi;

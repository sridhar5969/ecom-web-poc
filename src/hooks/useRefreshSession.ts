import { useDispatch } from 'react-redux';
import { sessionApi } from '../store/api/auth/session.api';

/**
 * Hook to manually refresh session data
 * Use this after login to fetch fresh session data
 */
export const useRefreshSession = () => {
	const dispatch = useDispatch();

	const refreshSession = () => {
		// Invalidate the session cache to force a refetch
		dispatch(sessionApi.util.invalidateTags(['Session']));
	};

	return refreshSession;
};

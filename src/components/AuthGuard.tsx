import { ReactNode } from 'react';
import { useSessionContextQuery } from '../store/api/auth/session.api';
import { AuthProvider } from '../contexts/AuthContext';
import BackdropLoader from '../components/third-party/BackdropLoader';
import SessionError from '../pages/general/SessionError';

interface AuthGuardProps {
	children: ReactNode;
	requireAuth?: boolean; // NEW: Make auth optional
}

/**
 * AuthGuard - Checks authentication and provides context
 * Can work in two modes:
 * 1. requireAuth=true: Shows loading/error for unauthenticated users
 * 2. requireAuth=false: Provides auth context but doesn't block rendering
 */
export const AuthGuard = ({ children, requireAuth = false }: AuthGuardProps) => {
	const { data, isLoading, isError, errorMessage } = useSessionContextQuery();

	// Provide auth context regardless of authentication state
	const authValue = {
		session: data ?? null,
		isLoading,
		isError,
		errorMessage,
		isAuthenticated: !!data
	};

	// If auth is NOT required, always render with context
	if (!requireAuth) {
		return <AuthProvider value={authValue}>{children}</AuthProvider>;
	}

	// If auth IS required, show loading/error states
	if (isLoading) {
		return <BackdropLoader />;
	}

	if (isError || !data) {
		return <SessionError errMsg={errorMessage} />;
	}

	return <AuthProvider value={authValue}>{children}</AuthProvider>;
};

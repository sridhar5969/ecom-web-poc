import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) => {
	const { isAuthenticated, isLoading } = useAuth();

	// Don't render anything while loading (AuthGuard handles this)
	if (isLoading) {
		return null;
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	// Render protected content
	return <>{children}</>;
};

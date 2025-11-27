import { Navigate } from 'react-router-dom';
import { getOrderedScreens, getInitialScreen } from '../routes/screenHelpers';
import { useSessionContextQuery } from '../store/api/auth/session.api';
import NotFound from '../pages/general/NotFound';
import { getAllPermissions } from '../schemas/session.schemas';
import { createLoadingRoutes, createErrorRoutes } from './useAuthRoutes.constants';
import MinimalLayout from '../layouts/MinimalLayout';
import { StorefrontRoutes } from '../routes/public/storefront.routes';
import { LoginRoutes } from '../routes/auth/LoginRoutes';
export function useAuthRoutes() {
	const publicRoutes = [StorefrontRoutes];

	const { data, isLoading, isError, errorMessage } = useSessionContextQuery();

	if (isLoading) return [...publicRoutes, createLoadingRoutes()];

	if (isError) return [...publicRoutes, createErrorRoutes(errorMessage ?? 'Error')];

	// user not authenticated → public + login
	if (!data) return [...publicRoutes, LoginRoutes];

	// ----- USER AUTHENTICATED → BUILD PROTECTED ROUTES -----
	const permissions = getAllPermissions(data);
	const orderedScreens = getOrderedScreens(permissions);
	const initialScreen = getInitialScreen(permissions);

	const dynamicRoutes = orderedScreens.map(screen => ({
		path: screen.path,
		element: <screen.element />
	}));

	const protectedRoutes = [
		{
			path: '/admin',
			element: <MinimalLayout />,
			children: [
				{ path: 'dashboard', element: <Navigate to={initialScreen?.path || '/not-found'} replace /> },
				...dynamicRoutes,
				{ path: '*', element: <NotFound /> }
			]
		}
	];

	return [...publicRoutes, ...protectedRoutes];
}

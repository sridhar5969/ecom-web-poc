import { ProtectedRoute } from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import DashboardRedirect from '../pages/DashboardRedirect';
import NotFound from '../pages/general/NotFound';
import { LoginRoutes } from './auth/LoginRoutes';
import { StorefrontRoutes } from './public/storefront.routes';

// Import all your screen components
// Example:
// import UsersScreen from '../pages/admin/UsersScreen';
// import ProductsScreen from '../pages/admin/ProductsScreen';
// etc.

/**
 * Static route configuration
 * No more dynamic route building based on session state
 */
export const routes = [
	// Public routes (storefront, etc.)
	StorefrontRoutes,

	// Auth routes (login, register, etc.)
	LoginRoutes,
	// StandaloneLoginRoute,
	// StandaloneRegisterRoute,

	// Protected admin routes
	{
		path: '/admin',
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		children: [
			// Dashboard redirect - determines initial screen based on permissions
			{
				path: 'dashboard',
				element: <DashboardRedirect />
			},

			// Define all your admin screens here
			// The screens themselves will check permissions internally
			// Example:
			// { path: 'users', element: <UsersScreen /> },
			// { path: 'products', element: <ProductsScreen /> },
			// { path: 'orders', element: <OrdersScreen /> },
			// { path: 'settings', element: <SettingsScreen /> },

			// Catch-all 404
			{ path: '*', element: <NotFound /> }
		]
	},

	// Root redirect
	// {
	// 	path: '/',
	// 	element: <Navigate to="/products" replace />
	// },

	// Global 404
	{
		path: '*',
		element: <NotFound />
	}
];

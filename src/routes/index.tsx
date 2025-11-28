import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import MinimalLayout from '../layouts/MinimalLayout';
import NotFound from '../pages/general/NotFound';
import { StorefrontRoutes } from './public/storefront.routes';
import { LoginRoutes } from './auth/LoginRoutes';
import DashboardRedirect from '../pages/DashboardRedirect';

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
	{
		path: '/',
		element: <Navigate to="/products" replace />
	},

	// Global 404
	{
		path: '*',
		element: (
			<MinimalLayout>
				<NotFound />
			</MinimalLayout>
		)
	}
];

import { ProtectedRoute } from '../../components/ProtectedRoute';
import MinimalLayout from '../../layouts/MinimalLayout';
import WishlistPage from '../../pages/business/wishlist/WishlistPage';

export const UserRoutes = {
	path: '/',
	element: <MinimalLayout />,
	children: [
		{
			path: 'wishlists',
			element: (
				<ProtectedRoute>
					<WishlistPage />
				</ProtectedRoute>
			)
		}
	]
};

import MinimalLayout from '../../layouts/MinimalLayout';
import ProductDetailsPage from '../../pages/business/products/ProductDetails';
import CartPage from '../../pages/business/cart';
import BrandHomepage from '../../pages/business/brand/BrandPage';
import ProductListPage from '../../pages/business/products/ProductListPage';

import CheckoutPage from '../../pages/business/checkout/CheckoutPage';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import WishlistPage from '../../pages/business/wishlist/WishlistPage';

export const StorefrontRoutes = {
	path: '/',
	element: <MinimalLayout />,
	children: [
		{ index: true, element: <ProductListPage /> },
		//StorefrontRoutes
		{ path: 'products', element: <ProductListPage /> },
		{ path: 'products/:id', element: <ProductDetailsPage /> },
		{ path: 'cart', element: <CartPage /> },
		{ path: 'checkout', element: <CheckoutPage /> },
		{ path: 'shop/:brandSlug', element: <BrandHomepage /> },
		//userRToutes
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

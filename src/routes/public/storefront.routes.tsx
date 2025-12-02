// import StorefrontLayout from "../../layouts/StorefrontLayout";
import MinimalLayout from '../../layouts/MinimalLayout';
// import HomePage from "../../pages/storefront/Home";
import ProductList from '../../pages/business/products';
import ProductDetailsPage from '../../pages/business/products/ProductDetails';
import CartPage from '../../pages/business/cart';

export const StorefrontRoutes = {
	path: '/',
	element: <MinimalLayout />,
	children: [
		// { index: true, element: <HomePage /> },
		{ path: 'products', element: <ProductList /> },
		{ path: 'products/:id', element: <ProductDetailsPage /> },
		{ path: 'cart', element: <CartPage /> }
	]
};

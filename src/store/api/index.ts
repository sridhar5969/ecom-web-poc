import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export const rootApi = createApi({
	reducerPath: 'api',
	baseQuery,
	tagTypes: [
		'Auth',
		'Session',
		'Cart',
		'Products',
		'ProductBySlug',
		'Wishlists',
		'Orders',
		'Brands',
		'BrandsBySlug',
		'Categories',
		'CategoriesBySlug'
	],
	endpoints: () => ({}) // Empty, will be extended later
});

export const apiSlices = [rootApi] as const;

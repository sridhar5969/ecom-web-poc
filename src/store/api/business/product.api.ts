import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseApi';
import { ProductDetail, ProductListResponse, ProductQueryParams } from '../../../types/product.types';

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery: baseQuery,
	tagTypes: ['Products'],
	endpoints: builder => ({
		getProducts: builder.query<ProductListResponse, ProductQueryParams>({
			query: params => ({
				url: 'products',
				method: 'GET',
				params
			}),
			providesTags: result =>
				result
					? [...result.items.map(({ id }) => ({ type: 'Products' as const, id })), { type: 'Products', id: 'LIST' }]
					: [{ type: 'Products', id: 'LIST' }]
		}),

		getProduct: builder.query<ProductDetail, string>({
			query: id => ({
				url: `products/${id}`,
				method: 'GET'
			}),
			providesTags: (result, error, id) => [{ type: 'Products', id }]
		}),

		// Example of future mutation
		deleteProduct: builder.mutation<void, string>({
			query: id => ({
				url: `products/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: [{ type: 'Products', id: 'LIST' }]
		})
	})
});

export const { useGetProductsQuery, useGetProductQuery, useDeleteProductMutation } = productApi;

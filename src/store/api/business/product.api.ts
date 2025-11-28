import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseApi';
import {
	ProductDetail,
	ProductDetailSchema,
	ProductListResponse,
	ProductListSchema,
	ProductQueryParams
} from '../../../types/product.types';

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery,
	tagTypes: ['Products', 'ProductBySlug'],
	endpoints: builder => ({
		getProductList: builder.query<ProductListResponse, ProductQueryParams>({
			query: params => ({
				url: 'products',
				method: 'GET',
				params
			}),
			providesTags: ['Products'],
			transformResponse: response => ProductListSchema.parse(response)
		}),

		getProductBySlug: builder.query<ProductDetail, string>({
			query: id => `products/${id}`,
			providesTags: ['ProductBySlug'],
			transformResponse: response => {
				return ProductDetailSchema.parse(response).data;
			}
		}),

		deleteProduct: builder.mutation<void, string>({
			query: id => ({
				url: `products/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: [{ type: 'Products', id: 'LIST' }]
		})
	})
});

export const { useGetProductBySlugQuery, useGetProductListQuery, useDeleteProductMutation } = productApi;

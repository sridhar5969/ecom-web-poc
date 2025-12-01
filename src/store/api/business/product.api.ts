import {
	ProductDetail,
	ProductDetailSchema,
	ProductListResponse,
	ProductListSchema,
	ProductQueryParams
} from '../../../types/product.types';
import z from 'zod';
import { rootApi } from '..';

export const productApi = rootApi.injectEndpoints({
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
				const data = ProductDetailSchema.safeParse(response);
				if (!data.success) {
					const error = z.prettifyError(data.error);
					console.error(error);
					throw new Error(`Response validation failed: ${JSON.stringify(error)}`);
				}
				return data.data.data;
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

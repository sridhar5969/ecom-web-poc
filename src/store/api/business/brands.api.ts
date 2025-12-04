import { rootApi } from '..';

export const brandApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBrands: builder.query<any, void>({
			query: () => ({
				url: 'brands',
				method: 'GET'
			}),
			providesTags: ['Brands']
			// transformResponse: response => ProductListSchema.parse(response)
		}),

		getBrandBySlug: builder.query<any, string>({
			query: id => `brands/${id}`,
			providesTags: ['BrandsBySlug']
			// transformResponse: response => {
			// 	const data = ProductDetailSchema.safeParse(response);
			// 	if (!data.success) {
			// 		const error = z.prettifyError(data.error);
			// 		console.error(error);
			// 		throw new Error(`Response validation failed: ${JSON.stringify(error)}`);
			// 	}
			// 	return data.data.data;
			// }
		})
	})
});

export const { useGetBrandBySlugQuery, useGetBrandsQuery } = brandApi;

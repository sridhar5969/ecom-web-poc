import { rootApi } from '..';

export const categoriesApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCategories: builder.query<any, void>({
			query: () => ({
				url: 'categories',
				method: 'GET'
			}),
			providesTags: ['Categories']
			// transformResponse: response => ProductListSchema.parse(response)
		}),

		getCategoriesBySlug: builder.query<any, string>({
			query: id => `categories/${id}`,
			providesTags: ['CategoriesBySlug']
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

export const { useGetCategoriesQuery, useGetCategoriesBySlugQuery } = categoriesApi;

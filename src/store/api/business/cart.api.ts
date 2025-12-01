import { AddToCartRequest, AddToCartResponse, CartResponse, UpdateCartRequest } from '../../../types/cart.types';
import { rootApi } from '..';

export const cartApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// GET /api/cart
		// Returns CartResponse (the inner data object with items, subtotal, etc.)
		getCart: builder.query<CartResponse, void>({
			query: () => 'cart',
			providesTags: ['Cart']
		}),

		// POST /api/cart/items
		addToCart: builder.mutation<AddToCartResponse, AddToCartRequest>({
			query: body => ({
				url: 'cart/items',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Cart']
		}),

		// PATCH /api/cart/items/:variantId
		updateCartItem: builder.mutation<any, UpdateCartRequest>({
			query: ({ variantId, quantity }) => ({
				url: `cart/items/${variantId}`,
				method: 'PATCH',
				body: { quantity }
			}),
			invalidatesTags: ['Cart']
		}),

		// DELETE /api/cart/items/:variantId
		removeCartItem: builder.mutation<any, string>({
			query: variantId => ({
				url: `cart/items/${variantId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Cart']
		}),

		// POST /api/cart/merge - Merge Guest Cart with User cart after login
		mergeCart: builder.mutation<void, void>({
			query: () => ({
				url: 'cart/merge',
				method: 'POST'
			}),
			invalidatesTags: ['Cart']
		})
	})
});

export const {
	useGetCartQuery,
	useAddToCartMutation,
	useUpdateCartItemMutation,
	useRemoveCartItemMutation,
	useMergeCartMutation
} = cartApi;

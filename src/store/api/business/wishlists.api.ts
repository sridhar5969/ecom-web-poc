import { Wishlist, CreateWishlistPayload, AddToWishlistPayload } from '../../../types/wishlists.types';
import { SuccessResponse } from '../../../types/api.types';
import { rootApi } from '..';

interface WishlistsResponse extends SuccessResponse {
	data: Wishlist[];
}

export const wishlistsApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// 1. Get All Wishlists (Summary)
		getWishlists: builder.query<WishlistsResponse, void>({
			query: () => 'wishlists',
			providesTags: ['Wishlists']
		}),

		// 2. Get Single Wishlist (With Items)
		getWishlist: builder.query<Wishlist, string>({
			query: id => `wishlists/${id}`,
			providesTags: ['Wishlists']
		}),

		// 3. Create New List
		createWishlist: builder.mutation<Wishlist, CreateWishlistPayload>({
			query: body => ({
				url: 'wishlists',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Wishlists']
		}),

		// 4. Add Item to List
		addToWishlist: builder.mutation<void, { wishlistId: string } & AddToWishlistPayload>({
			query: ({ wishlistId, ...body }) => ({
				url: `wishlists/${wishlistId}/items`,
				method: 'POST',
				body
			}),
			invalidatesTags: ['Wishlists']
		}),

		// 5. Remove Item
		removeFromWishlist: builder.mutation<void, { wishlistId: string; variantId: string }>({
			query: ({ wishlistId, variantId }) => ({
				url: `wishlists/${wishlistId}/items/${variantId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Wishlists']
		}),

		// 6. Move to Cart (Conversion)
		moveToCart: builder.mutation<void, { wishlistId: string; variantId: string }>({
			query: ({ wishlistId, variantId }) => ({
				url: `wishlists/${wishlistId}/items/${variantId}/move-to-cart`,
				method: 'POST'
			}),
			// MAGIC: This updates both the Wishlist UI AND the Cart Navbar Badge instantly
			invalidatesTags: ['Wishlists', 'Cart'] // Refreshes the sidebar list
		}),

		// 7. Share Wishlist
		shareWishlist: builder.mutation<{ shareToken: string; isPublic: boolean }, string>({
			query: wishlistId => ({
				url: `wishlists/${wishlistId}/share`,
				method: 'POST'
			}),
			invalidatesTags: ['Wishlists']
		}),

		// 8. Public Access (For the Shared Page)
		getSharedWishlist: builder.query<Wishlist, string>({
			query: token => `wishlists/shared/${token}`
			// We don't really need tags here as this is usually read-only for guests
		})
	})
});

export const {
	useGetWishlistsQuery,
	useGetWishlistQuery,
	useCreateWishlistMutation,
	useAddToWishlistMutation,
	useRemoveFromWishlistMutation,
	useMoveToCartMutation,
	useShareWishlistMutation,
	useGetSharedWishlistQuery
} = wishlistsApi;

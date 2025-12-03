import { CheckoutRequest, CheckoutResponse } from '../../../types/checkout.types';
import { rootApi } from '..';

export const checkoutApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		processCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
			query: body => ({
				url: 'checkout',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Cart']
		})
	})
});

export const { useProcessCheckoutMutation } = checkoutApi;

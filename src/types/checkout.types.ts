export interface Address {
	fullName: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone: string;
}

export interface CheckoutRequest {
	shippingAddress: Address;
	billingAddress?: Address;
	useShippingAsBilling: boolean;
	paymentMethod: 'cod' | 'online';
	paymentProvider?: string;
}

export interface CheckoutResponse {
	paymentSession: {
		code: string;
		data: {
			expires: string;
			amount: number;
			account_number: string;
			account_name: string;
			bank: string;
			payment_session: string;
		};
		message: string;
		status: boolean;
	};
	paymentMethod: string;
	orderId: string;
	status: string;
	message?: string;
}

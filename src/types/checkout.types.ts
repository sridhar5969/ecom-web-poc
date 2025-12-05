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
	paymentSession?: {
		sessionId: string;
		accountNumber?: string;
		accountName?: string;
		bank?: string;
		amount?: number;
		expiresAt?: string;
		status: string;
		providerResponse?: any;
		url?: string;
	};
	paymentMethod: string;
	orderId: string;
	status: string;
	message?: string;
}

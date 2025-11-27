export interface CartItem {
	variantId: string;
	productId: string;
	title: string;
	variantName: string; // e.g., "200ml"
	sku: string;
	price: number;
	image: string;
	quantity: number;
	maxStock: number;
}

export interface CartState {
	items: CartItem[];
	totalQuantity: number;
	totalAmount: number;
}

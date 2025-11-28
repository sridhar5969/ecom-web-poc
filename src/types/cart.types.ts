import { z } from 'zod/v4';
import { successResponseSchema } from '../schemas/api.schemas';

// --- Data Structures ---

export interface CartItem {
	id: string; // The cart_item UUID
	variantId: string;
	productId: string;
	title: string;
	variantName: string;
	sku: string;
	price: number;
	image: string;
	quantity: number;
	line_total: number;
}

export interface CartResponse {
	id: string;
	items: CartItem[];
	subtotal: number;
	grand_total: number;
	total_quantity: number;
}

// --- Request/Response Schemas ---

export const addToCartRequestSchema = z.object({
	variantId: z.string(),
	quantity: z.number()
});

export interface AddToCartRequest {
	variantId: string;
	quantity: number;
}

export interface UpdateCartRequest {
	variantId: string;
	quantity: number;
}

// Response is wrapped in your standard ApiResponse structure
export type AddToCartResponse = z.infer<typeof addToCartResponseSchema>;
export const addToCartResponseSchema = successResponseSchema(
	z
		.object({
			success: z.boolean(),
			cartId: z.string()
		})
		.optional()
);

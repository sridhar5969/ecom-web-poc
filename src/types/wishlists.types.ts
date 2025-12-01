import { z } from 'zod/v4';
import { successResponseSchema } from '../schemas/api.schemas';

// --- 1. Schemas ---

export const createWishlistSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	isPublic: z.boolean()
});

export const addToWishlistSchema = z.object({
	variantId: z.string(),
	note: z.string().optional(),
	priority: z.number().min(1).max(3).default(1) // 1=Low, 2=Med, 3=High
});

// Defines what a Product looks like INSIDE a wishlist
// (Matches the Drizzle 'with: { variant: { with: { product: true } } }' relation)
export interface WishlistItem {
	id: string; // Wishlist Item ID
	wishlistId: string;
	variantId: string;
	note?: string;
	priority: number;
	priceAtAddition: number;
	addedAt: string;
	variant: {
		id: string;
		name: string; // "200ml"
		sku: string;
		priceAmount: number;
		product: {
			id: string;
			title: string;
			slug: string;
			primaryImageUrl: string;
		};
	};
}

export interface Wishlist {
	id: string;
	userId: string;
	name: string;
	isPublic: boolean;
	shareToken?: string;
	createdAt: string;
	updatedAt: string;
	items?: WishlistItem[]; // Optional because 'getWishlists' (summary) might not return items
}

// --- 2. Request Payloads ---

export type CreateWishlistPayload = z.infer<typeof createWishlistSchema>;
export type AddToWishlistPayload = z.infer<typeof addToWishlistSchema>;

// For API responses
export const wishlistResponseSchema = successResponseSchema(z.custom<Wishlist>());
export const wishlistListResponseSchema = successResponseSchema(z.array(z.custom<Wishlist>()));

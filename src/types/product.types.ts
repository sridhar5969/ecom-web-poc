export enum ProductStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	ARCHIVED = 'archived'
}

export interface Brand {
	id: string;
	name: string;
	slug: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export interface Product {
	id: string;
	title: string;
	slug: string;
	description?: string;
	price_amount: number;
	price_currency: string;
	compare_at_amount?: number;
	primary_image_url?: string;
	status: ProductStatus;
	brand: Brand;
	category: Category;
	average_rating?: number;
	review_count?: number;
	created_at: string;
}

// Helper to match the structure returned by your baseQuery transform
// Assuming backend sends: { success: true, data: { items: [], meta: {} } }
export interface ProductListResponse {
	items: Product[];
	meta: {
		total: number;
		page: number;
		limit: number;
		last_page: number;
	};
}

export interface ProductQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: ProductStatus;
	category_id?: string;
	brand_id?: string;
}

export interface ProductVariant {
	id: string;
	name: string; // e.g. "200ml"
	sku: string;
	price_amount: number;
	compare_at_amount?: number;
	stock_quantity: number;
	attributes: Record<string, string>; // { "size": "200ml" }
}

export interface ProductDetail extends Product {
	// The main product object gets extended with detailed lists
	variants: ProductVariant[];
	images: Array<{ id: string; url: string; is_primary: boolean }>;
	loyalty_points?: number; // "Earn 15 loyalty points"
	tags?: string[]; // ["Lush", "New"]
}

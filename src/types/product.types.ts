import { z } from 'zod';

/**
 * Generic wrapper for APIs returning:
 * {
 *   success: boolean,
 *   timestamp: string,
 *   ...otherFields
 * }
 */
export const base = <T extends z.ZodRawShape>(shape: T) =>
	z.object({
		...shape,
		success: z.boolean(),
		timestamp: z.string()
	});

/* ============================================================
   PRODUCT LIST
============================================================ */
export const ProductListSchema = base({
	items: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			slug: z.string(),
			description: z.string().optional().nullable(),
			price_amount: z.number(),
			price_currency: z.string(),
			compare_at_amount: z.union([z.string(), z.number()]).optional(),
			primary_image_url: z.string().optional(),
			status: z.string(),

			brand: z.object({
				id: z.string(),
				name: z.string(),
				slug: z.string(),
				description: z.string().optional(),
				logo_url: z.string().optional()
			}),

			category: z.object({
				id: z.string(),
				name: z.string(),
				slug: z.string()
			}),
			average_rating: z.number(),
			review_count: z.number(),
			available_stock: z.number().optional(),
			created_at: z.string()
		})
	),

	meta: z.object({
		total: z.number(),
		page: z.number(),
		limit: z.number(),
		last_page: z.number()
	})
});

export type ProductListResponse = z.infer<typeof ProductListSchema>;
export type ProductListItem = ProductListResponse['items'][number];

/* ============================================================
   PRODUCT DETAIL
============================================================ */
export const ProductDetailSchema = base({
	data: z.object({
		id: z.string(),
		title: z.string(),
		slug: z.string(),
		description: z.string(),
		status: z.string(),

		brand: z.object({
			id: z.string(),
			name: z.string(),
			slug: z.string(),
			description: z.string().optional(),
			logo_url: z.string().optional()
		}),

		category: z.object({
			id: z.string(),
			name: z.string(),
			slug: z.string()
		}),

		price_summary: z.object({
			base_amount: z.number(),
			currency: z.string(),
			compare_at_amount: z.union([z.string(), z.number()]).optional(),
			range: z.object({
				min: z.number(),
				max: z.number()
			})
		}),

		primary_image_url: z.string().optional(),

		images: z.array(
			z.object({
				id: z.string(),
				url: z.string(),
				alt_text: z.string().optional(),
				is_primary: z.boolean().optional(),
				display_order: z.number().optional()
			})
		),

		variants: z.array(
			z.object({
				id: z.string(),
				sku: z.string(),
				name: z.string(),
				price_amount: z.number(),
				price_currency: z.string(),
				compare_at_amount: z.number().optional(),
				cost_price_amount: z.number().optional(),
				is_active: z.boolean(),
				updated_at: z.string().optional(),
				images: z.array(z.any()),
				available_stock: z.number().optional()
			})
		),

		metadata: z.record(z.string(), z.any()).optional(),

		bundles: z
			.array(
				z.object({
					id: z.string(),
					title: z.string(),
					slug: z.string(),
					description: z.string().nullable(),
					brand_id: z.string().nullable(),
					variant_id: z.string(),
					variant_sku: z.string().nullable(),
					variant_name: z.string().nullable(),
					price_amount: z.number(),
					price_currency: z.string(),
					compare_at_amount: z.number().nullable(),
					primary_image_url: z.string().nullable(),
					components: z.array(
						z.object({
							variant_id: z.string(),
							quantity: z.number(),
							product_id: z.string(),
							product_title: z.string(),
							product_slug: z.string(),
							product_description: z.string().nullable(),
							brand_id: z.string().nullable(),
							variant_sku: z.string().nullable(),
							variant_name: z.string().nullable(),
							price_amount: z.number(),
							price_currency: z.string(),
							primary_image_url: z.string().nullable()
						})
					)
				})
			)
			.optional(),

		average_rating: z.number(),
		review_count: z.number(),
		flags: z.record(z.string(), z.any()).optional()
	})
});

export type ProductDetailResponse = z.infer<typeof ProductDetailSchema>;
export type ProductDetail = ProductDetailResponse['data'];
export type ProductVariant = ProductDetail['variants'][number];
export type ProductQueryParams = {
	page?: number;
	limit?: number;
	brand?: string;
	category?: string;
};

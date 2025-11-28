import { z } from 'zod';

/**
 * Generic wrapper for APIs returning:
 * {
 *   success: boolean,
 *   timestamp: string,
 *   ...otherFields
 * }
 */
const base = <T extends z.ZodRawShape>(shape: T) =>
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
			description: z.string().optional(),
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

			review_count: z.union([z.string(), z.number()]).optional(),
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
			range: z.object({
				min: z.number(),
				max: z.number()
			})
		}),

		images: z.array(z.any()),

		variants: z.array(
			z.object({
				id: z.string(),
				sku: z.string(),
				name: z.string(),
				price_amount: z.number(),
				price_currency: z.string(),
				compare_at_amount: z.number().optional(),
				cost_price_amount: z.number(),

				attributes: z.object({
					plant: z.string(),
					mrpType: z.string(),
					baseUnit: z.string(),
					rawPrice: z.string(),
					createdBy: z.string(),
					priceUnit: z.number(),
					lastChange: z.string(),
					priceControl: z.string(),
					valuationType: z.string(),
					valuationClass: z.string(),
					purchasingGroup: z.string()
				}),

				is_active: z.boolean(),
				updated_at: z.string(),
				images: z.array(z.any())
			})
		),

		reviews: z.object({
			review_count: z.string()
		}),
		metadata: z.object({
			plants: z.array(z.string()),
			source: z.string(),
			baseUnit: z.string(),
			mrpTypes: z.array(z.string()),
			currencies: z.array(z.string()),
			priceUnits: z.array(z.number()),
			lastSyncedAt: z.string(),
			materialCode: z.string(),
			materialType: z.string(),
			abcIndicators: z.array(z.string()),
			purchasingGroups: z.array(z.string())
		}),

		created_at: z.string(),
		updated_at: z.string()
	})
});

export type ProductDetailResponse = z.infer<typeof ProductDetailSchema>;
export type ProductDetail = ProductDetailResponse['data'];
export type ProductVariant = ProductDetail['variants'][number];
export type ProductQueryParams = {
	page?: number;
	limit?: number;
};

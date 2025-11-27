export const MOCK_PRODUCTS = [
	{
		id: 'mock-prod-001',
		title: 'Wireless Noise Cancelling Headphones',
		slug: 'wireless-noise-cancelling-headphones',
		description: 'Experience world-class silence and superior sound with our premium headphones.',
		price_amount: 29999,
		price_currency: 'USD',
		compare_at_amount: 34999,
		primary_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
		status: 'published',

		brand: { id: 'brand-001', name: 'AudioTech', slug: 'audiotech' },
		category: { id: 'cat-001', name: 'Electronics', slug: 'electronics' },

		average_rating: 4.8,
		review_count: 342,
		created_at: '2023-11-01T10:00:00Z',

		// ⭐ Added images array
		images: [
			{ id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', is_primary: true },
			{ id: '2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=60', is_primary: false },
			{ id: '3', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=40', is_primary: false }
		],

		// ⭐ Added variants (basic mock)
		variants: [{ id: 'v1', name: 'Standard', price_amount: 29999, stock_quantity: 50, sku: 'AT-HDPH-STD' }]
	},

	{
		id: 'mock-prod-002',
		title: 'Minimalist Leather Watch',
		slug: 'minimalist-leather-watch',
		description: 'Elegant design meets precision engineering. Genuine leather strap.',
		price_amount: 12500,
		price_currency: 'USD',
		compare_at_amount: null,
		primary_image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
		status: 'published',

		brand: { id: 'brand-002', name: 'Timeless', slug: 'timeless' },
		category: { id: 'cat-002', name: 'Accessories', slug: 'accessories' },

		average_rating: 4.5,
		review_count: 89,
		created_at: '2023-11-15T09:30:00Z',

		images: [
			{ id: '1', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80', is_primary: true }
		],

		variants: [{ id: 'v1', name: 'One Size', price_amount: 12500, stock_quantity: 100, sku: 'TM-WATCH-001' }]
	},

	{
		id: 'mock-prod-003',
		title: 'Ergonomic Office Chair',
		slug: 'ergonomic-office-chair',
		description: 'Work in comfort all day long with lumbar support and breathable mesh.',
		price_amount: 45000,
		price_currency: 'USD',
		compare_at_amount: 59900,
		primary_image_url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
		status: 'published',

		brand: { id: 'brand-003', name: 'WorkSpace', slug: 'workspace' },
		category: { id: 'cat-003', name: 'Furniture', slug: 'furniture' },

		average_rating: 4.2,
		review_count: 56,
		created_at: '2023-10-20T14:15:00Z',

		images: [
			{ id: '1', url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80', is_primary: true }
		],

		variants: [{ id: 'v1', name: 'Standard', price_amount: 45000, stock_quantity: 20, sku: 'WS-CHAIR-STD' }]
	},

	{
		id: 'mock-prod-004',
		title: 'Organic Cotton T-Shirt',
		slug: 'organic-cotton-t-shirt-basic',
		description: 'Soft, sustainable, and perfect for everyday wear.',
		price_amount: 2500,
		price_currency: 'USD',
		compare_at_amount: null,
		primary_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
		status: 'draft',

		brand: { id: 'brand-004', name: 'EcoWear', slug: 'ecowear' },
		category: { id: 'cat-004', name: 'Apparel', slug: 'apparel' },

		average_rating: 0,
		review_count: 0,
		created_at: '2023-12-01T08:00:00Z',

		images: [
			{ id: '1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', is_primary: true }
		],

		variants: [{ id: 'v1', name: 'Medium', price_amount: 2500, stock_quantity: 40, sku: 'EW-TSHIRT-M' }]
	},

	{
		id: 'mock-prod-005',
		title: 'Smart Home Hub',
		slug: 'smart-home-hub-v2',
		description: 'Control your lights, music, and security from one central device.',
		price_amount: 8999,
		price_currency: 'USD',
		compare_at_amount: 9999,
		primary_image_url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80',
		status: 'published',

		brand: { id: 'brand-005', name: 'NextGen', slug: 'nextgen' },
		category: { id: 'cat-001', name: 'Electronics', slug: 'electronics' },

		average_rating: 3.9,
		review_count: 210,
		created_at: '2023-09-10T11:20:00Z',

		images: [
			{ id: '1', url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80', is_primary: true }
		],

		variants: [{ id: 'v1', name: 'Standard', price_amount: 8999, stock_quantity: 30, sku: 'NG-HUB-V2' }]
	}
];

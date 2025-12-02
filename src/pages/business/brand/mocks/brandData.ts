// src/data/mockBrandData.ts

// Helper to keep dates consistent
const MOCK_DATE = new Date().toISOString();

export const MOCK_BRAND_DB = [
	{
		id: 'brand_indomie_001',
		name: 'Indomie',
		slug: 'indomie',
		description: 'Tasty Nutrition. Good for You. The household name for instant noodles in Nigeria.',
		logo: 'https://logowik.com/content/uploads/images/indomie892.logowik.com.webp',
		banner_image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=2000&auto=format&fit=crop',
		theme_color: '#E31E24',
		products: [
			{
				id: 'ind_1',
				title: 'Indomie Instant Noodles - Chicken Flavor (70g)',
				slug: 'indomie-chicken-flavor-70g',
				description: 'The classic chicken flavor that everyone loves.',
				price_amount: 250,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 5000,
				brand: {
					id: 'brand_indomie_001',
					name: 'Indomie',
					slug: 'indomie',
					logo_url: 'https://logowik.com/content/uploads/images/indomie892.logowik.com.webp'
				},
				category: {
					id: 'cat_noodles',
					name: 'Instant Noodles',
					slug: 'instant-noodles'
				},
				average_rating: 4.8,
				review_count: 1240,
				created_at: MOCK_DATE
			},
			{
				id: 'ind_2',
				title: 'Indomie Onion Chicken (Hungry Man Size)',
				slug: 'indomie-onion-chicken-hungry-man',
				description: 'A larger portion for the hungry ones, with a rich onion twist.',
				price_amount: 550,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 200,
				brand: {
					id: 'brand_indomie_001',
					name: 'Indomie',
					slug: 'indomie',
					logo_url: 'https://logowik.com/content/uploads/images/indomie892.logowik.com.webp'
				},
				category: {
					id: 'cat_noodles',
					name: 'Instant Noodles',
					slug: 'instant-noodles'
				},
				average_rating: 4.9,
				review_count: 850,
				created_at: MOCK_DATE
			},
			{
				id: 'ind_3',
				title: 'Indomie Mi Goreng Fried Noodles',
				slug: 'indomie-mi-goreng',
				description: 'Oriental style fried noodles without soup.',
				price_amount: 350,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 1500,
				brand: {
					id: 'brand_indomie_001',
					name: 'Indomie',
					slug: 'indomie',
					logo_url: 'https://logowik.com/content/uploads/images/indomie892.logowik.com.webp'
				},
				category: {
					id: 'cat_oriental',
					name: 'Oriental Style',
					slug: 'oriental-style'
				},
				average_rating: 4.7,
				review_count: 420,
				created_at: MOCK_DATE
			},
			{
				id: 'ind_4',
				title: 'Indomie Relish - Seafood Delight',
				slug: 'indomie-relish-seafood',
				description: 'Complete meal experience with real fish chunks.',
				price_amount: 900,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 300,
				brand: {
					id: 'brand_indomie_001',
					name: 'Indomie',
					slug: 'indomie',
					logo_url: 'https://logowik.com/content/uploads/images/indomie892.logowik.com.webp'
				},
				category: {
					id: 'cat_premium',
					name: 'Premium Noodles',
					slug: 'premium-noodles'
				},
				average_rating: 4.6,
				review_count: 110,
				created_at: MOCK_DATE
			}
		]
	},
	{
		id: 'brand_kelloggs_002',
		name: "Kellogg's",
		slug: 'kelloggs',
		description: "Let's make today great. Breakfast cereals and snacks for the whole family.",
		logo: 'https://logos-world.net/wp-content/uploads/2020/12/Kellogg-Symbol.png',
		banner_image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop',
		theme_color: '#D21F3C',
		products: [
			{
				id: 'kel_1',
				title: "Kellogg's Corn Flakes (500g)",
				slug: 'kelloggs-corn-flakes-500g',
				description: 'The original and best. Golden flakes of corn.',
				price_amount: 3500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 100,
				brand: {
					id: 'brand_kelloggs_002',
					name: "Kellogg's",
					slug: 'kelloggs',
					logo_url: 'https://logos-world.net/wp-content/uploads/2020/12/Kellogg-Symbol.png'
				},
				category: {
					id: 'cat_cereal',
					name: 'Breakfast Cereal',
					slug: 'breakfast-cereal'
				},
				average_rating: 4.8,
				review_count: 3200,
				created_at: MOCK_DATE
			},
			{
				id: 'kel_2',
				title: "Kellogg's Coco Pops",
				slug: 'kelloggs-coco-pops',
				description: 'Chocolatey toasted rice.',
				price_amount: 4200,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 80,
				brand: {
					id: 'brand_kelloggs_002',
					name: "Kellogg's",
					slug: 'kelloggs',
					logo_url: 'https://logos-world.net/wp-content/uploads/2020/12/Kellogg-Symbol.png'
				},
				category: {
					id: 'cat_kids',
					name: 'Kids Cereal',
					slug: 'kids-cereal'
				},
				average_rating: 4.9,
				review_count: 5000,
				created_at: MOCK_DATE
			},
			{
				id: 'kel_3',
				title: "Kellogg's Fruit Loops",
				slug: 'kelloggs-fruit-loops',
				description: 'Fruity flavored cereal rings.',
				price_amount: 4500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1563229618-b2a632c0f209?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 40,
				brand: {
					id: 'brand_kelloggs_002',
					name: "Kellogg's",
					slug: 'kelloggs',
					logo_url: 'https://logos-world.net/wp-content/uploads/2020/12/Kellogg-Symbol.png'
				},
				category: {
					id: 'cat_kids',
					name: 'Kids Cereal',
					slug: 'kids-cereal'
				},
				average_rating: 4.7,
				review_count: 1200,
				created_at: MOCK_DATE
			}
		]
	},
	{
		id: 'brand_addmie_003',
		name: 'Addmie',
		slug: 'addmie',
		description: 'Make every meal tastier. The perfect garnish mix for your noodles and pasta.',
		logo: 'https://tse1.mm.bing.net/th/id/OIP.InFc56m-ObZEXPLGSWujqAHaDX?rs=1&pid=ImgDetMain&o=7&rm=3',
		banner_image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=2000&auto=format&fit=crop',
		theme_color: '#4CAF50',
		products: [
			{
				id: 'add_1',
				title: 'Addmie Noodlemate - Chicken Flavor',
				slug: 'addmie-noodlemate-chicken',
				description: 'Dried vegetables and proteins to spice up your noodles.',
				price_amount: 500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 1000,
				brand: {
					id: 'brand_addmie_003',
					name: 'Addmie',
					slug: 'addmie',
					logo_url: 'https://tse1.mm.bing.net/th/id/OIP.InFc56m-ObZEXPLGSWujqAHaDX?rs=1&pid=ImgDetMain&o=7&rm=3'
				},
				category: {
					id: 'cat_garnish',
					name: 'Food Garnish',
					slug: 'food-garnish'
				},
				average_rating: 4.5,
				review_count: 85,
				created_at: MOCK_DATE
			},
			{
				id: 'add_2',
				title: 'Addmie Noodlemate - Crayfish & Shrimp',
				slug: 'addmie-noodlemate-crayfish',
				description: 'Seafood twist for your instant pasta.',
				price_amount: 500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 900,
				brand: {
					id: 'brand_addmie_003',
					name: 'Addmie',
					slug: 'addmie',
					logo_url: 'https://tse1.mm.bing.net/th/id/OIP.InFc56m-ObZEXPLGSWujqAHaDX?rs=1&pid=ImgDetMain&o=7&rm=3'
				},
				category: {
					id: 'cat_garnish',
					name: 'Food Garnish',
					slug: 'food-garnish'
				},
				average_rating: 4.6,
				review_count: 92,
				created_at: MOCK_DATE
			},
			{
				id: 'add_3',
				title: 'Addmie Pastamate - Red Sauce Mix',
				slug: 'addmie-pastamate-red',
				description: 'Rich tomato base sauce mix.',
				price_amount: 2500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1594951230623-2895248c1e7a?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 200,
				brand: {
					id: 'brand_addmie_003',
					name: 'Addmie',
					slug: 'addmie',
					logo_url: 'https://tse1.mm.bing.net/th/id/OIP.InFc56m-ObZEXPLGSWujqAHaDX?rs=1&pid=ImgDetMain&o=7&rm=3'
				},
				category: {
					id: 'cat_sauce',
					name: 'Pasta Sauce',
					slug: 'pasta-sauce'
				},
				average_rating: 4.4,
				review_count: 45,
				created_at: MOCK_DATE
			},
			{
				id: 'add_4',
				title: 'Addmie Pastamate - White Sauce Cream',
				slug: 'addmie-pastamate-white',
				description: 'Creamy white sauce mix for carbonara style pasta.',
				price_amount: 2500,
				price_currency: 'NGN',
				primary_image_url: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?auto=format&fit=crop&w=500',
				status: 'published',
				available_stock: 150,
				brand: {
					id: 'brand_addmie_003',
					name: 'Addmie',
					slug: 'addmie',
					logo_url: 'https://tse1.mm.bing.net/th/id/OIP.InFc56m-ObZEXPLGSWujqAHaDX?rs=1&pid=ImgDetMain&o=7&rm=3'
				},
				category: {
					id: 'cat_sauce',
					name: 'Pasta Sauce',
					slug: 'pasta-sauce'
				},
				average_rating: 4.3,
				review_count: 38,
				created_at: MOCK_DATE
			}
		]
	}
];

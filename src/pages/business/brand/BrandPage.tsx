import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

// Components
import Loader from '../../../components/common/Loader';
import BrandHero from './components/BrandHero';
import ProductList from '../products';

// API Hooks
import { useGetProductListQuery } from '../../../store/api/business/product.api';
import { MOCK_BRAND_DB } from './mocks/brandData';

const BrandHomepage: React.FC = () => {
	// 1. Get the brand slug from the URL (e.g., 'nike')
	const { brandSlug } = useParams<{ brandSlug: string }>();

	// 2. Fetch Brand Details (For the Hero Section)
	// const {
	// 	data: brand,
	// 	isLoading: isBrandLoading,
	// 	isError: isBrandError
	// } = useGetBrandBySlugQuery(brandSlug ?? '', { skip: !brandSlug });

	const brand = MOCK_BRAND_DB.find(b => b.slug === brandSlug);
	console.log(brandSlug);

	// 3. Fetch Products (Using the query param ?brand=nike)
	// We pass { brand: brandSlug } which RTK Query converts to /products?brand=nike
	const { data: productData, isLoading: isProductsLoading } = useGetProductListQuery(
		{ brand: brandSlug }
		// { skip: !brandSlug }
	);

	// Loading State (Show loader only if Brand is loading)
	// We can let products load while showing the brand header skeleton if desired,
	// but for simplicity, we wait for the brand info.
	if (isProductsLoading) return <Loader />;

	// Error State
	if (!brand) {
		return (
			<Container sx={{ py: 10, textAlign: 'center' }}>
				<Typography variant="h4">Brand not found</Typography>
				<Typography color="text.secondary">We couldn't find the store you're looking for.</Typography>
			</Container>
		);
	}

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8 }}>
			{/* Brand Header */}
			<BrandHero
				name={brand.name}
				description={brand.description}
				bannerUrl={brand.banner_image}
				logoUrl={brand.logo}
			/>

			<Container maxWidth="xl">
				<Box sx={{ mb: 4 }}>
					<Typography variant="h5" fontWeight="bold">
						Latest from {brand.name}
					</Typography>
				</Box>

				{/* Reusable Product List Component */}
				{/* We pass the loading state and data down */}
				{isProductsLoading ? (
					<Loader />
				) : productData?.items && productData.items.length > 0 ? (
					<ProductList products={productData.items} />
				) : (
					// <Alert severity="info" variant="outlined">
					// 	No products found for this brand yet.
					// </Alert>
					<ProductList products={brand.products} />
				)}
			</Container>
		</Box>
	);
};

export default BrandHomepage;

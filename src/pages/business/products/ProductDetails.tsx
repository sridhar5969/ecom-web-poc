import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Loader from '../../../components/common/Loader';
import { MOCK_PRODUCTS } from './mocks/products'; // Save the JSON above here

// Components
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/Productinfo';
import { ProductDetail } from '../../../types/product.types';

const ProductDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	if (!id) return <Typography>Product not found</Typography>;

	// In a real app, use the ID. For demo, we might mock if ID is missing.
	// const { data: product, isLoading, isError } = useGetProductQuery(id || '');

	// --- MOCK DATA FOR UI VISUALIZATION ---
	const product = MOCK_PRODUCTS.find(p => p.id === id);
	const isError = !product;
	const isLoading = false;

	if (isLoading) return <Loader />;
	if (isError || !product) return <Typography>Product not found</Typography>;

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
			<Container maxWidth="xl" sx={{ py: 3 }}>
				{/* Breadcrumbs */}
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
					<Link underline="hover" color="inherit" href="/">
						Home
					</Link>
					<Link underline="hover" color="inherit" href="/products">
						{product.category?.name || 'Category'}
					</Link>
					<Typography color="text.primary">{product.title}</Typography>
				</Breadcrumbs>

				<Grid container spacing={6}>
					{/* LEFT: Gallery */}
					<Grid size={{ xs: 12, sm: 6, md: 5 }}>
						<ProductGallery images={product.images} title={product.title} />
					</Grid>

					{/* RIGHT: Info */}
					<Grid size={{ xs: 12, sm: 6, md: 7 }}>
						<ProductInfo product={product as ProductDetail} />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default ProductDetailsPage;

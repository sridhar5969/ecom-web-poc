import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Loader from '../../../components/common/Loader';

import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/Productinfo';
import ProductBundles from './components/ProductBundles';

// Zod-based type
import { ProductDetail } from '../../../types/product.types';

import { useGetProductBySlugQuery } from '../../../store/api/business/product.api';

const ProductDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, isError } = useGetProductBySlugQuery(id ?? '');

	const product: ProductDetail | undefined = data;

	if (isLoading) return <Loader />;
	if (isError || !product) return <Typography>Product not found</Typography>;

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
			<Container maxWidth="xl" sx={{ py: 3 }}>
				{/* Breadcrumbs */}
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
					<Link component={RouterLink} underline="hover" color="inherit" to="/">
						Home
					</Link>
					<Link
						component={RouterLink}
						underline="hover"
						color="inherit"
						to={`/products?category=${product?.category?.slug}`}
					>
						{product.category?.name || 'Category'}
					</Link>
					<Typography color="text.primary">{product.title}</Typography>
				</Breadcrumbs>

				<Grid container spacing={6}>
					{/* LEFT: Gallery */}
					<Grid size={{ xs: 12, sm: 6, md: 5 }}>
						<ProductGallery images={product.images} title={product.title} />
					</Grid>

					{/* RIGHT: Product Info */}
					<Grid size={{ xs: 12, sm: 6, md: 7 }}>
						<ProductInfo product={product} />
					</Grid>
				</Grid>

				{/* Product Bundles Section */}
				{product.bundles && product.bundles.length > 0 && (
					<Box sx={{ mt: 6 }}>
						<ProductBundles bundles={product.bundles} />
					</Box>
				)}
			</Container>
		</Box>
	);
};

export default ProductDetailsPage;

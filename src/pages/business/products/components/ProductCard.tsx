import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Stack, Rating } from '@mui/material';

import { ProductListItem } from '../../../../types/product.types';
import { getFallbackImage } from '../utils/getFallbackImage';

// Format helper (price_amount is integer cents)
const formatCurrency = (amount: number, currency: string) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount / 100);

interface ProductCardProps {
	product: ProductListItem;
	onClick: (slug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
	const compare = Number(product.compare_at_amount ?? 0);
	const isOnSale = compare > product.price_amount;

	return (
		<Card
			onClick={() => onClick(product.slug)}
			sx={{
				height: '100%',
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				transition: 'all 0.2s ease-in-out',
				'&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
			}}
		>
			<Box position="relative">
				<CardMedia
					component="img"
					height="180"
					image={getFallbackImage(product)}
					alt={product.title}
					sx={{ objectFit: 'cover' }}
				/>

				{/* Status Chip */}
				{/* {product.status === ProductStatus.DRAFT && (
					<Chip
						label="Draft"
						size="small"
						sx={{
							position: 'absolute',
							top: 8,
							left: 8,
							bgcolor: 'warning.light'
						}}
					/>
				)} */}

				{/* Sale Chip */}
				{isOnSale && <Chip label="SALE" color="error" size="small" sx={{ position: 'absolute', top: 8, right: 8 }} />}
			</Box>

			<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Typography variant="caption" color="text.secondary">
					{product.brand.name} • {product.category.name}
				</Typography>

				<Typography variant="h5" component="div" noWrap title={product.title}>
					{product.title}
				</Typography>

				{/* Rating Section */}
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<Rating value={Number(product.average_rating || 3)} precision={0.5} size="small" readOnly />
					<Typography variant="caption" color="text.secondary">
						({product.review_count || 0})
					</Typography>
				</Stack>

				<Box sx={{ flexGrow: 1 }} />

				{/* Price Section */}
				<Stack direction="row" alignItems="baseline" spacing={1}>
					<Typography variant="h6" color="primary.main">
						{formatCurrency(product.price_amount, product.price_currency)}
					</Typography>

					{isOnSale && (
						<Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
							{formatCurrency(compare, product.price_currency)}
						</Typography>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
};

export default ProductCard;

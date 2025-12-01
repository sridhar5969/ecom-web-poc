import React, { useState } from 'react';
import { Box, Typography, Chip, Rating, Divider, Stack, Button, IconButton, Grid } from '@mui/material';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { useNotification } from '../../../../hooks/useNotification';
import { ProductDetail } from '../../../../types/product.types';
import { getFallbackImage } from '../utils/getFallbackImage';
import { useAddToCartMutation } from '../../../../store/api/business/cart.api';
import useIsMobile from '../../../../hooks/useIsMobile';
import { useAddToWishlistMutation, useGetWishlistsQuery } from '../../../../store/api/business/wishlists.api';

// Format money
const formatMoney = (amount: number, currency?: string) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency || 'USD'
	}).format(amount / 100);

interface ProductInfoProps {
	product: ProductDetail;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
	const [addToCart, { isLoading }] = useAddToCartMutation();
	const [addToWishlist, { isError }] = useAddToWishlistMutation();
	const { data: wishlists = [] } = useGetWishlistsQuery();
	const defaultWishlistId = wishlists?.data?.[0]?.id;
	const { show } = useNotification();

	// Safe fallback images
	const normalizedImages =
		Array.isArray(product.images) && product.images.length > 0
			? product.images
			: [{ id: 'fallback-img', url: getFallbackImage(product) }];

	// Safe fallback variants
	const normalizedVariants =
		Array.isArray(product.variants) && product.variants.length > 0
			? product.variants
			: [
					{
						id: 'fallback-var',
						sku: 'N/A',
						name: 'Default',
						price_amount: product.price_summary?.base_amount ?? 0,
						price_currency: product.price_summary?.currency ?? 'NGN',
						available_stock: 0
					}
				];

	// Always safe state
	const [selectedVariantId, setSelectedVariantId] = useState<string>(normalizedVariants[0].id);
	const [quantity, setQuantity] = useState(1);
	const [deliveryType, setDeliveryType] = useState<'ship' | 'pickup'>('ship');

	// Safe current variant
	const currentVariant = normalizedVariants.find(v => v.id === selectedVariantId) || normalizedVariants[0];

	const totalPrice = currentVariant.price_amount * quantity;
	const { isMobile } = useIsMobile();

	const handleAddToCart = async () => {
		if (!currentVariant.id) return show({ message: 'Please select a size', type: 'error' });

		try {
			await addToCart({
				variantId: currentVariant.id,
				quantity: quantity
			}).unwrap();

			show({ message: 'Added to cart!', type: 'success' });
		} catch (error) {
			console.error(error);
			show({ message: 'Failed to add item', type: 'error' });
		}
	};

	const handleAddToWishlist = async () => {
		if (!currentVariant.id) return show({ message: 'Please select a size', type: 'error' });

		if (!defaultWishlistId) {
			return show({ message: 'Wishlist not loaded yet', type: 'error' });
		}

		try {
			await addToWishlist({
				wishlistId: defaultWishlistId,
				variantId: currentVariant.id,
				priority: 1
			}).unwrap();

			show({ message: 'Added to wishlist!', type: 'success' });
		} catch {
			show({ message: 'Failed to add to wishlist', type: 'error' });
		}
	};

	return (
		<Box>
			{/* Header */}
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
				<Chip
					label={product.brand?.name}
					sx={{
						bgcolor: '#9C27B0',
						color: 'white',
						fontWeight: 'bold',
						borderRadius: 1,
						mb: 1
					}}
				/>
				<Stack direction="row" alignItems="center" spacing={0.5}>
					{(currentVariant.available_stock ?? 0) > 0 ? (
						<>
							<CheckCircleIcon color="success" fontSize="small" />
							<Typography variant="body2" color="success.main" fontWeight="600">
								In Stock ({currentVariant.available_stock})
							</Typography>
						</>
					) : (
						<>
							<Typography variant="body2" color="error.main" fontWeight="600">
								Out of Stock
							</Typography>
						</>
					)}
				</Stack>
			</Stack>

			<Typography variant="h3" sx={{ mt: 1, mb: 1 }}>
				{product.title}
			</Typography>

			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
				<Rating value={product.average_rating || 4.5} readOnly precision={0.1} size="small" />
				<Typography variant="body2" color="text.secondary">
					{product.average_rating} ({product.review_count} reviews)
				</Typography>
			</Stack>

			<Divider sx={{ mb: 3 }} />

			{/* Price Section */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h3" color="primary.main" fontWeight="800">
					{formatMoney(currentVariant.price_amount, currentVariant.price_currency)}
				</Typography>
				{/* <Typography variant="body2" color="success.main" fontWeight="500">
					Earn {product.loyalty_points || 15} loyalty points
				</Typography> */}
			</Box>

			{/* Variants */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
					Size
				</Typography>

				<Stack direction="row" spacing={1.5} overflow="auto">
					{normalizedVariants.map(variant => {
						const isSelected = variant.id === selectedVariantId;
						return (
							<Box
								key={variant.id}
								onClick={() => setSelectedVariantId(variant.id)}
								sx={{
									border: isSelected ? '2px solid #E53935' : '1px solid #E0E0E0',
									borderRadius: 1,
									p: 1.5,
									minWidth: 80,
									textAlign: 'center',
									cursor: 'pointer',
									position: 'relative',
									bgcolor: isSelected ? '#FFF5F5' : 'transparent'
								}}
							>
								{isSelected && (
									<CheckCircleIcon
										color="primary"
										sx={{
											position: 'absolute',
											top: -3,
											right: -3,
											fontSize: 15,
											bgcolor: 'white',
											borderRadius: '50%'
										}}
									/>
								)}
								<Typography variant="body2" fontWeight="bold">
									{variant.name}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{formatMoney(variant.price_amount)}
								</Typography>
							</Box>
						);
					})}
				</Stack>

				<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
					SKU: {currentVariant.sku}
				</Typography>
			</Box>

			{/* Delivery Options */}
			<Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2, mb: 3 }}>
				<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
					<LocalShippingOutlinedIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 1 }} />
					Delivery Options
				</Typography>

				<Grid container spacing={2}>
					<Grid size={{ xs: 6 }}>
						<Box
							onClick={() => setDeliveryType('ship')}
							sx={{
								border: deliveryType === 'ship' ? '2px solid #E53935' : '1px solid #E0E0E0',
								borderRadius: 1,
								p: 2,
								cursor: 'pointer',
								bgcolor: deliveryType === 'ship' ? '#FFF5F5' : 'transparent'
							}}
						>
							<Typography variant="subtitle2" fontWeight="bold">
								Ship to Address
							</Typography>
							<Typography variant="caption" color="text.secondary">
								3-5 business days
							</Typography>
						</Box>
					</Grid>

					<Grid size={{ xs: 6 }}>
						<Box
							onClick={() => setDeliveryType('pickup')}
							sx={{
								border: deliveryType === 'pickup' ? '2px solid #E53935' : '1px solid #E0E0E0',
								borderRadius: 1,
								p: 2,
								cursor: 'pointer',
								bgcolor: deliveryType === 'pickup' ? '#FFF5F5' : 'transparent'
							}}
						>
							<Typography variant="subtitle2" fontWeight="bold">
								Store Pickup
							</Typography>
							<Typography variant="caption" color="success.main" fontWeight="bold">
								FREE • 2-4 hours
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Box>

			{/* Action Bar */}
			<Stack direction="row" spacing={2} alignItems="center">
				{/* Quantity */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						border: '1px solid #E0E0E0',
						borderRadius: 1,
						bgcolor: '#F9FAFB'
					}}
				>
					<IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small">
						<RemoveIcon fontSize="small" />
					</IconButton>
					<Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
					<IconButton onClick={() => setQuantity(quantity + 1)} size="small">
						<AddIcon fontSize="small" />
					</IconButton>
				</Box>

				{/* Total Price */}
				<Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 100 }}>
					<Typography variant="caption" display="block" color="text.secondary">
						Total Price
					</Typography>
					<Typography variant="h6" fontWeight="bold">
						{formatMoney(totalPrice)}
					</Typography>
				</Box>

				{/* Add to Cart */}
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddShoppingCartIcon />}
					sx={{ flexGrow: 1 }}
					onClick={handleAddToCart}
				>
					{isMobile ? 'Add' : 'Add to cart'}
				</Button>

				{/* Secondary Actions */}
				<IconButton sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
					<FavoriteBorderIcon onClick={handleAddToWishlist} />
				</IconButton>

				<IconButton sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
					<ShareIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};

export default ProductInfo;

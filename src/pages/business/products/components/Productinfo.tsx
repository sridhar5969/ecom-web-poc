import React, { useState } from 'react';
import { Box, Typography, Chip, Rating, Divider, Stack, Button, IconButton, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '../../../../store/store';
import { useNotification } from '../../../../hooks/useNotification';
import { addToCart } from '../../../../store/slices/cart.slice';

import { ProductDetail } from '../../../../types/product.types';
import TokenStorage from '../../../../utils/TokenStorage';
import { useNavigate } from 'react-router-dom';
import { useRequireLogin } from '../../../../hooks/useRequireLogin';

// Helper to format currency
const formatMoney = (amount: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

interface ProductInfoProps {
	product: ProductDetail;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { show } = useNotification();
	const requireLogin = useRequireLogin();

	const handleAddToCart = () => {
		console.log('added');
		dispatch(
			addToCart({
				variantId: currentVariant.id,
				productId: product.id,
				title: product.title,
				variantName: currentVariant.name,
				sku: currentVariant.sku,
				price: currentVariant.price_amount,
				image: product.images.find(img => img.is_primary)?.url || product.images[0].url,
				quantity: quantity,
				maxStock: currentVariant.stock_quantity
			})
		);

		show({ message: `${product.title} added to cart!`, type: 'success' });
	};
	// 1. State for User Selections
	const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id);
	const [quantity, setQuantity] = useState(1);
	const [deliveryType, setDeliveryType] = useState<'ship' | 'pickup'>('ship');

	// 2. Derive Data based on selection
	const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

	const totalPrice = currentVariant.price_amount * quantity;

	return (
		<Box>
			{/* Header Section */}
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
				<Chip
					label="Lush"
					sx={{
						bgcolor: '#9C27B0', // TODO: should come from brand attributes
						color: 'white',
						fontWeight: 'bold',
						borderRadius: 1,
						mb: 1
					}}
				/>
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<CheckCircleIcon color="success" fontSize="small" />
					<Typography variant="body2" color="success.main" fontWeight="600">
						In Stock ({currentVariant.stock_quantity})
					</Typography>
				</Stack>
			</Stack>

			<Typography variant="h3" sx={{ mt: 1, mb: 1 }}>
				{product.title}
			</Typography>

			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
				<Rating value={product.average_rating || 4.5} readOnly precision={0.1} size="small" />
				<Typography variant="body2" color="text.secondary">
					4.7 (189 reviews)
				</Typography>
			</Stack>

			<Divider sx={{ mb: 3 }} />

			{/* Price Section */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h3" color="primary.main" fontWeight="800">
					{formatMoney(currentVariant.price_amount)}
				</Typography>
				<Typography variant="body2" color="success.main" fontWeight="500">
					Earn {product.loyalty_points || 15} loyalty points
				</Typography>
			</Box>

			{/* Variant Selector (Size) */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
					Size
				</Typography>
				<Stack direction="row" spacing={1.5} overflow="auto">
					{product.variants.map(variant => {
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

			{/* Delivery Options Box */}
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

				{/* Total Price Label */}
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
					size="large"
					startIcon={<AddShoppingCartIcon />}
					sx={{ flexGrow: 1, height: 48 }}
					onClick={() => requireLogin(handleAddToCart)}
				>
					Add to Cart
				</Button>

				{/* Secondary Actions */}
				<IconButton sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
					<FavoriteBorderIcon />
				</IconButton>
				<IconButton sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
					<ShareIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};

export default ProductInfo;

import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button, Stack, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { WishlistItem } from '../../../../types/wishlists.types';
import { useMoveToCartMutation, useRemoveFromWishlistMutation } from '../../../../store/api/business/wishlists.api';
import { useNotification } from '../../../../hooks/useNotification';

const formatMoney = (amount: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

const WishlistItemCard: React.FC<{ item: WishlistItem }> = ({ item }) => {
	const { show: showNotification } = useNotification();
	const [moveToCart, { isLoading: isMoving }] = useMoveToCartMutation();
	const [removeItem, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

	const handleMoveToCart = async () => {
		try {
			await moveToCart({ wishlistId: item.wishlistId, variantId: item.variantId }).unwrap();
			showNotification({ message: 'Moved to cart!', type: 'success' });
		} catch (error) {
			showNotification({ message: 'Failed to move item', type: 'error' });
		}
	};

	const handleRemove = async () => {
		try {
			await removeItem({ wishlistId: item.wishlistId, variantId: item.variantId }).unwrap();
			showNotification({ message: 'Item removed', type: 'info' });
		} catch (error) {
			showNotification({ message: 'Failed to remove item', type: 'error' });
		}
	};

	return (
		<Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
			<Box sx={{ position: 'relative', pt: '100%' /* 1:1 Aspect Ratio */ }}>
				<CardMedia
					component="img"
					image={item.variant.product.primaryImageUrl || 'https://via.placeholder.com/300'}
					alt={item.variant.product.title}
					sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
				/>
				<Tooltip title="Remove">
					<IconButton
						size="small"
						onClick={handleRemove}
						disabled={isRemoving}
						sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
					>
						<DeleteOutlineIcon color="error" fontSize="small" />
					</IconButton>
				</Tooltip>
			</Box>

			<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Typography variant="subtitle2" noWrap fontWeight="bold">
					{item.variant.product.title}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Size: {item.variant.name}
				</Typography>

				<Box sx={{ mt: 'auto', pt: 1 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
						<Typography variant="h6" color="primary.main">
							{formatMoney(item.variant.priceAmount)}
						</Typography>
						{/* Example Logic: Show price drop if current < priceAtAddition */}
						{item.variant.priceAmount < item.priceAtAddition && (
							<Typography variant="caption" color="error" fontWeight="bold">
								Price Drop!
							</Typography>
						)}
					</Stack>

					<Button
						variant="outlined"
						fullWidth
						startIcon={<AddShoppingCartIcon />}
						onClick={handleMoveToCart}
						disabled={isMoving}
					>
						Add to Cart
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default WishlistItemCard;

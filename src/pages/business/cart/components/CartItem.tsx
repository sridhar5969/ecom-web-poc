import React from 'react';
import { Box, Typography, IconButton, Stack, Avatar, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CartItem as CartItemType } from '../../../../types/cart.types';

// Helper
const formatMoney = (amount: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

interface CartItemProps {
	item: CartItemType;
	onUpdateQty: (id: string, qty: number) => void;
	onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQty, onRemove }) => {
	return (
		<Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
			<Grid container spacing={2} alignItems="center">
				{/* Image */}
				<Grid size={{ xs: 3, sm: 2 }}>
					<Avatar src={item.image} variant="rounded" sx={{ width: 64, height: 64, bgcolor: '#F4F6F8' }} />
				</Grid>

				{/* Details */}
				<Grid size={{ xs: 9, sm: 4 }}>
					<Typography variant="subtitle2" fontWeight="bold">
						{item.title}
					</Typography>
					<Typography variant="caption" color="text.secondary" display="block">
						Size: {item.variantName} | SKU: {item.sku}
					</Typography>
					<Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ mt: 0.5 }}>
						{formatMoney(item.price)}
					</Typography>
				</Grid>

				{/* Quantity Controls */}
				<Grid size={{ xs: 6, sm: 3 }}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{ border: '1px solid #ddd', borderRadius: 1, width: 'fit-content' }}
					>
						<IconButton size="small" onClick={() => onUpdateQty(item.variantId, Math.max(1, item.quantity - 1))}>
							<RemoveIcon fontSize="small" />
						</IconButton>
						<Typography variant="body2" fontWeight="bold">
							{item.quantity}
						</Typography>
						<IconButton size="small" onClick={() => onUpdateQty(item.variantId, item.quantity + 1)}>
							<AddIcon fontSize="small" />
						</IconButton>
					</Stack>
				</Grid>

				{/* Total & Remove */}
				<Grid size={{ xs: 6, sm: 3 }} container justifyContent="flex-end" alignItems="center">
					<Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 2 }}>
						{formatMoney(item.price * item.quantity)}
					</Typography>
					<IconButton color="error" size="small" onClick={() => onRemove(item.variantId)}>
						<DeleteOutlineIcon />
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CartItem;

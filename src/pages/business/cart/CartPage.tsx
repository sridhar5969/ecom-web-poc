import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, Button, Paper, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Store
import {
	selectCartItems,
	selectCartTotalAmount,
	removeFromCart,
	updateQuantity
} from '../../../store/slices/cart.slice';
import { useNotification } from '../../../hooks/useNotification'; // Assuming hook exists

// Components
import CartItem from './components/CartItem';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';

const formatMoney = (amount: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

const CartPage: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { show } = useNotification();

	const cartItems = useSelector(selectCartItems);
	const cartTotal = useSelector(selectCartTotalAmount);

	const handleUpdateQty = (variantId: string, quantity: number) => {
		dispatch(updateQuantity({ variantId, quantity }));
	};

	const handleRemove = (variantId: string) => {
		dispatch(removeFromCart(variantId));
		show({ message: 'Item removed from cart', type: 'info' });
	};

	const handleCheckout = () => {
		show({ message: 'Proceeding to checkout...', type: 'success' });
		navigate('/checkout');
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
			<ModernTopBar title="Shopping Cart" />

			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 3 }}>
					Continue Shopping
				</Button>

				{cartItems.length === 0 ? (
					<Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
						<Typography variant="h5" gutterBottom>
							Your cart is empty
						</Typography>
						<Typography color="text.secondary" sx={{ mb: 3 }}>
							Looks like you haven't added anything to your cart yet.
						</Typography>
						<Button variant="contained" onClick={() => navigate('/products')}>
							Start Shopping
						</Button>
					</Paper>
				) : (
					<Grid container spacing={4}>
						{/* Left: Cart Items */}
						<Grid size={{ xs: 12, md: 8 }}>
							<Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
								<Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
									<Typography variant="h6">Cart Items ({cartItems.length})</Typography>
								</Box>
								{cartItems.map(item => (
									<CartItem key={item.variantId} item={item} onUpdateQty={handleUpdateQty} onRemove={handleRemove} />
								))}
							</Paper>
						</Grid>

						{/* Right: Order Summary */}
						<Grid size={{ xs: 12, md: 4 }}>
							<Paper sx={{ p: 3, borderRadius: 2 }}>
								<Typography variant="h6" gutterBottom>
									Order Summary
								</Typography>
								<Divider sx={{ mb: 2 }} />

								<Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
									<Typography color="text.secondary">Subtotal</Typography>
									<Typography fontWeight="bold">{formatMoney(cartTotal)}</Typography>
								</Stack>

								<Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
									<Typography color="text.secondary">Shipping</Typography>
									<Typography color="success.main">Free</Typography>
								</Stack>

								<Divider sx={{ mb: 2 }} />

								<Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
									<Typography variant="h6">Total</Typography>
									<Typography variant="h6" color="primary.main">
										{formatMoney(cartTotal)}
									</Typography>
								</Stack>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleCheckout}
									sx={{ py: 1.5, fontWeight: 'bold' }}
								>
									Checkout
								</Button>
							</Paper>
						</Grid>
					</Grid>
				)}
			</Container>
		</Box>
	);
};

export default CartPage;

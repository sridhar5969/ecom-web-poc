import React from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Divider, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
	useGetCartQuery,
	useUpdateCartItemMutation,
	useRemoveCartItemMutation
} from '../../../store/api/business/cart.api';

import { useNotification } from '../../../hooks/useNotification';

import CartItem from './components/CartItem';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';
import { useSessionContextQuery } from '../../../store/api/auth/session.api';

const formatMoney = (amount: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

const CartPage: React.FC = () => {
	const navigate = useNavigate();
	const { show } = useNotification();
	const { data: sessionData, isLoading: isSessionLoading } = useSessionContextQuery();
	const isAuthenticated = !!sessionData?.userId;

	// 1. Fetch Cart Data (Auto-refreshes on updates)
	const { data: cartData, isLoading, isError } = useGetCartQuery();

	// 2. Mutations
	const [updateItem] = useUpdateCartItemMutation();
	const [removeItem] = useRemoveCartItemMutation();

	const handleUpdateQty = async (variantId: string, quantity: number) => {
		// if (quantity < 1) return; // Prevent going below 1 (unless you want that to mean delete)
		try {
			await updateItem({ variantId, quantity }).unwrap();
		} catch (error) {
			show({ message: 'Failed to update quantity', type: 'error' });
		}
	};

	const handleRemove = async (variantId: string) => {
		try {
			await removeItem(variantId).unwrap();
			show({ message: 'Item removed from cart', type: 'info' });
		} catch (error) {
			show({ message: 'Failed to remove item', type: 'error' });
		}
	};

	const handleCheckout = () => {
		if (!cartData || cartData.items.length === 0) return;
		show({ message: 'Proceeding to checkout...', type: 'success' });
		if (!isSessionLoading && !isAuthenticated) {
			show({ message: 'Please login to continue with checkout', type: 'info' });
			navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
			return;
		}

		navigate('/checkout');
	};

	// 3. Loading State
	if (isLoading) {
		return (
			<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
				<ModernTopBar title="Shopping Cart" />
				<Box display="flex" justifyContent="center" alignItems="center" height="60vh">
					<CircularProgress />
				</Box>
			</Box>
		);
	}

	// 4. Extract data safely
	const cartItems = cartData?.items || [];
	const cartTotal = cartData?.grand_total || 0;
	const isCartEmpty = !cartData || cartItems.length === 0;

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
			<ModernTopBar title="Shopping Cart" />

			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 3 }}>
					Continue Shopping
				</Button>

				{isCartEmpty ? (
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
								{cartItems.map((item: any) => (
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

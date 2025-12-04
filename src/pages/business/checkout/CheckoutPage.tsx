import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Box,
	Container,
	Grid,
	Typography,
	TextField,
	Button,
	Paper,
	FormControlLabel,
	Checkbox,
	Radio,
	RadioGroup,
	Divider,
	Stack,
	CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';
import { useGetCartQuery } from '../../../store/api/business/cart.api';
import { useProcessCheckoutMutation } from '../../../store/api/business/checkout.api';
import { useNotification } from '../../../hooks/useNotification';

const addressSchema = z.object({
	fullName: z.string().min(1, 'Full name is required'),
	line1: z.string().min(1, 'Address line 1 is required'),
	line2: z.string().optional(),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	postalCode: z.string().min(1, 'Postal code is required'),
	country: z.string().min(1, 'Country is required'),
	phone: z.string().min(1, 'Phone number is required')
});

const checkoutSchema = z.object({
	shippingAddress: addressSchema,
	billingAddress: addressSchema.optional(),
	useShippingAsBilling: z.boolean(),
	paymentMethod: z.enum(['cod', 'online'])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
	const navigate = useNavigate();
	const { show } = useNotification();
	const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
	const [processCheckout, { isLoading: isSubmitting }] = useProcessCheckoutMutation();
	const [paymentSession, setPaymentSession] = React.useState<any>(null);

	const { control, handleSubmit, watch } = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			useShippingAsBilling: true,
			paymentMethod: 'cod',
			shippingAddress: {
				country: 'US'
			}
		}
	});

	const useShippingAsBilling = watch('useShippingAsBilling');

	const onSubmit = async (data: CheckoutFormValues) => {
		try {
			const payload = {
				...data,
				billingAddress: data.useShippingAsBilling ? undefined : data.billingAddress
			};
			const result = await processCheckout(payload).unwrap();

			// Check if online payment
			if (result.paymentMethod === 'online' && result.paymentSession) {
				setPaymentSession(result.paymentSession);
				show({ message: 'Payment session created. Please complete payment.', type: 'info' });
			} else {
				show({ message: result.message || 'Order placed successfully!', type: 'success' });
				navigate('/products');
			}
		} catch (error) {
			show({ message: 'Failed to place order', type: 'error' });
		}
	};

	if (isCartLoading) {
		return (
			<Box
				sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!cartData || cartData.items.length === 0) {
		return (
			<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
				<ModernTopBar title="Checkout" />
				<Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
					<Typography variant="h5">Your cart is empty</Typography>
					<Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
						Go Shopping
					</Button>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
			<ModernTopBar title="Checkout" />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				{paymentSession ? (
					<Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
						<Typography variant="h5" gutterBottom color="primary">
							Payment Details
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Stack spacing={2}>
							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Bank
								</Typography>
								<Typography variant="h6">{paymentSession.bank || 'N/A'}</Typography>
							</Box>

							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Account Number
								</Typography>
								<Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
									{paymentSession.accountNumber || 'N/A'}
								</Typography>
							</Box>

							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Account Name
								</Typography>
								<Typography variant="h6">{paymentSession.accountName || 'N/A'}</Typography>
							</Box>

							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Amount to Pay
								</Typography>
								<Typography variant="h4" color="primary">
									${((paymentSession.amount || 0) / 100).toFixed(2)}
								</Typography>
							</Box>

							{paymentSession.expiresAt && (
								<Box>
									<Typography variant="subtitle2" color="text.secondary">
										Expires At
									</Typography>
									<Typography variant="body1">{new Date(paymentSession.expiresAt).toLocaleString()}</Typography>
								</Box>
							)}

							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Status
								</Typography>
								<Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
									{paymentSession.status}
								</Typography>
							</Box>
						</Stack>

						<Divider sx={{ my: 3 }} />

						<Typography variant="body2" color="text.secondary" gutterBottom>
							Please transfer the exact amount to the account above. Your order will be confirmed once payment is
							received.
						</Typography>

						<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
							<Button variant="outlined" onClick={() => navigate('/products')} fullWidth>
								Continue Shopping
							</Button>
							<Button variant="contained" onClick={() => setPaymentSession(null)} fullWidth>
								Make Another Order
							</Button>
						</Stack>
					</Paper>
				) : (
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={4}>
							<Grid size={{ xs: 12, md: 8 }}>
								<Paper sx={{ p: 3, mb: 3 }}>
									<Typography variant="h6" gutterBottom>
										Shipping Address
									</Typography>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12 }}>
											<Controller
												name="shippingAddress.fullName"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="Full Name"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12 }}>
											<Controller
												name="shippingAddress.line1"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="Address Line 1"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12 }}>
											<Controller
												name="shippingAddress.line2"
												control={control}
												render={({ field }) => <TextField {...field} label="Address Line 2 (Optional)" fullWidth />}
											/>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Controller
												name="shippingAddress.city"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="City"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Controller
												name="shippingAddress.state"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="State"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Controller
												name="shippingAddress.postalCode"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="Postal Code"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Controller
												name="shippingAddress.country"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="Country"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12 }}>
											<Controller
												name="shippingAddress.phone"
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														label="Phone"
														fullWidth
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
									</Grid>
								</Paper>

								<Paper sx={{ p: 3, mb: 3 }}>
									<FormControlLabel
										control={
											<Controller
												name="useShippingAsBilling"
												control={control}
												render={({ field }) => <Checkbox {...field} checked={field.value} />}
											/>
										}
										label="Billing address same as shipping"
									/>

									{!useShippingAsBilling && (
										<Box sx={{ mt: 2 }}>
											<Typography variant="h6" gutterBottom>
												Billing Address
											</Typography>
											<Typography color="text.secondary">
												Billing address form is not implemented in this demo.
											</Typography>
										</Box>
									)}
								</Paper>

								<Paper sx={{ p: 3 }}>
									<Typography variant="h6" gutterBottom>
										Payment Method
									</Typography>
									<Controller
										name="paymentMethod"
										control={control}
										render={({ field }) => (
											<RadioGroup {...field}>
												<FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
												<FormControlLabel value="online" control={<Radio />} label="Online Payment" />
											</RadioGroup>
										)}
									/>
								</Paper>
							</Grid>

							<Grid size={{ xs: 12, md: 4 }}>
								<Paper sx={{ p: 3 }}>
									<Typography variant="h6" gutterBottom>
										Order Summary
									</Typography>
									<Divider sx={{ mb: 2 }} />
									{cartData.items.map((item: any) => (
										<Grid container key={item.variantId} spacing={2} alignItems="center">
											<Grid item size={{ xs: 9 }}>
												<Typography variant="body2">
													<span className="clamp-1">{item.variantName}</span>
												</Typography>
											</Grid>
											<Grid item size={{ xs: 3 }}>
												<Typography variant="body2">
													x {item.quantity} ${((item.price * item.quantity) / 100).toFixed(2)}
												</Typography>
											</Grid>
										</Grid>
									))}

									<Divider sx={{ my: 2 }} />
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="h6">Total</Typography>
										<Typography variant="h6">${(cartData.grand_total / 100).toFixed(2)}</Typography>
									</Stack>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										size="large"
										sx={{ mt: 3 }}
										disabled={isSubmitting}
									>
										{isSubmitting ? <CircularProgress size={24} /> : 'Place Order'}
									</Button>
								</Paper>
							</Grid>
						</Grid>
					</form>
				)}
			</Container>
		</Box>
	);
};

export default CheckoutPage;

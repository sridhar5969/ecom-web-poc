import React, { useState } from 'react';
import { Box, Typography, Card, Stack, Chip, Button, Avatar } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ProductDetail } from '../../../../types/product.types';

const formatMoney = (amount: number, currency?: string) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency || 'NGN'
	}).format(amount / 100);

interface ProductBundlesProps {
	bundles: NonNullable<ProductDetail['bundles']>;
}

import { useAddToCartMutation } from '../../../../store/api/business/cart.api';
import { useNotification } from '../../../../hooks/useNotification';

const ProductBundles: React.FC<ProductBundlesProps> = ({ bundles }) => {
	const [addToCart, { isLoading }] = useAddToCartMutation();
	const { show } = useNotification();
	const [addingBundleId, setAddingBundleId] = useState<string | null>(null);

	const getBundleTheme = (bundle: NonNullable<ProductDetail['bundles']>[0]) => {
		return {
			type: 'starter',
			label: bundle.title,
			primaryColor: '#1976D2', // Blue
			backgroundColor: '#E6F3FF',
			borderColor: '#1976D2',
			buttonVariant: 'outlined' as const
		};
	};

	const calculateSavings = (bundle: NonNullable<ProductDetail['bundles']>[0]) => {
		if (!bundle.compare_at_amount || bundle.compare_at_amount <= bundle.price_amount) return 0;
		const savings = ((bundle.compare_at_amount - bundle.price_amount) / bundle.compare_at_amount) * 100;
		return Math.round(savings);
	};

	const handleAddToCart = async (bundle: NonNullable<ProductDetail['bundles']>[0]) => {
		if (!bundle.variant_id) {
			show({ message: 'Bundle variant not found', type: 'error' });
			return;
		}

		setAddingBundleId(bundle.id);
		try {
			await addToCart({
				variantId: bundle.variant_id,
				quantity: 1
			}).unwrap();
			show({ message: 'Bundle added to cart!', type: 'success' });
		} catch (error) {
			console.error('Failed to add bundle:', error);
			show({ message: 'Failed to add bundle to cart', type: 'error' });
		} finally {
			setAddingBundleId(null);
		}
	};

	return (
		<Box
			sx={{
				bgcolor: '#10A37F',
				borderRadius: 3,
				p: 4,
				color: 'white'
			}}
		>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<LocalOfferIcon sx={{ fontSize: 32 }} />
					<Typography variant="h4" fontWeight="bold">
						Frequently Bought Together
					</Typography>
				</Stack>
				<Chip
					label="Save up to 15%"
					sx={{
						bgcolor: '#FFD700',
						color: '#000',
						fontWeight: 'bold',
						fontSize: '0.9rem',
						px: 2
					}}
				/>
			</Stack>

			<Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
				Save more when you bundle!
			</Typography>

			<Stack spacing={3}>
				{bundles.map((bundle, index) => {
					const savings = calculateSavings(bundle);
					const theme = getBundleTheme(bundle);
					const isAdding = addingBundleId === bundle.id;

					return (
						<Card
							key={bundle.id}
							sx={{
								p: 3,
								border: `2px solid ${theme.borderColor}`,
								borderRadius: 2,
								bgcolor: theme.backgroundColor,
								position: 'relative',
								overflow: 'visible', // Allow tag to overflow
								transition: 'transform 0.2s, box-shadow 0.2s',
								'&:hover': {
									boxShadow: 4,
									transform: 'translateY(-2px)'
								}
							}}
						>
							{theme.label && (
								<Chip
									label={theme.label}
									size="small"
									sx={{
										position: 'absolute',
										top: -12,
										left: 16,
										bgcolor: theme.primaryColor,
										color: 'white',
										fontWeight: 'bold',
										height: 24
									}}
								/>
							)}

							{/* Savings Badge (Top Right) */}
							{savings > 0 && (
								<Typography
									variant="subtitle2"
									sx={{
										position: 'absolute',
										top: 16,
										right: 24,
										color: theme.primaryColor,
										fontWeight: 'bold'
									}}
								>
									Save {savings}%
								</Typography>
							)}

							<Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 1 }}>
								<Box sx={{ flex: 1 }}>
									{/* Bundle Components */}
									{bundle.components.length > 0 && (
										<Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
											{bundle.components.map(component => (
												<Box
													key={component.variant_id}
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1.5,
														p: 1.5,
														border: '1px solid #E0E0E0',
														borderRadius: 2,
														bgcolor: '#FFFFFF',
														minWidth: 200,
														boxShadow: '0px 2px 4px rgba(0,0,0,0.02)'
													}}
												>
													<Avatar
														src={component.primary_image_url || '/placeholder-product.png'}
														alt={component.product_title}
														variant="rounded"
														sx={{ width: 48, height: 48 }}
													/>
													<Box sx={{ flex: 1, overflow: 'hidden' }}>
														<Typography
															variant="body2"
															fontWeight="600"
															sx={{
																overflow: 'hidden',
																textOverflow: 'ellipsis',
																whiteSpace: 'nowrap',
																mb: 0.5
															}}
														>
															{component.product_title}
														</Typography>
														<Typography variant="caption" color="error.main" fontWeight="bold">
															{formatMoney(component.price_amount, component.price_currency)}
														</Typography>
													</Box>
												</Box>
											))}
										</Stack>
									)}

									{/* Price Section */}
									<Stack direction="row" alignItems="baseline" spacing={1.5}>
										{bundle.compare_at_amount && bundle.compare_at_amount > bundle.price_amount && (
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ textDecoration: 'line-through', opacity: 0.8 }}
											>
												Regular: {formatMoney(bundle.compare_at_amount, bundle.price_currency)}
											</Typography>
										)}
										<Typography variant="h5" color={theme.primaryColor} fontWeight="800">
											Bundle: {formatMoney(bundle.price_amount, bundle.price_currency)}
										</Typography>
									</Stack>
								</Box>

								{/* Action Button */}
								<Button
									variant={theme.buttonVariant}
									startIcon={!isAdding ? <ShoppingCartIcon /> : undefined}
									disabled={isAdding || isLoading}
									sx={{
										minWidth: 220,
										height: 48,
										fontWeight: 'bold',
										borderWidth: 2,
										borderColor: theme.primaryColor,
										bgcolor: theme.buttonVariant === 'contained' ? theme.primaryColor : 'transparent',
										color: theme.buttonVariant === 'contained' ? 'white' : theme.primaryColor,
										'&:hover': {
											borderWidth: 2,
											borderColor: theme.primaryColor,
											bgcolor:
												theme.buttonVariant === 'contained'
													? theme.primaryColor // darken slightly in real app
													: `${theme.primaryColor}10` // slight tint
										}
									}}
									onClick={e => {
										e.stopPropagation();
										handleAddToCart(bundle);
									}}
								>
									{isAdding ? 'Adding...' : `Add Bundle (${bundle.components.length} items)`}
								</Button>
							</Stack>
						</Card>
					);
				})}
			</Stack>
		</Box>
	);
};

export default ProductBundles;

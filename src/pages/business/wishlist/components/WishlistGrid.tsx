import React from 'react';
import { Box, Typography, Grid, CircularProgress, Button, Stack, Chip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useGetWishlistQuery, useShareWishlistMutation } from '../../../../store/api/business/wishlists.api';
import WishlistItemCard from './WishlistItemCard';
import { useNotification } from '../../../../hooks/useNotification';

interface Props {
	selectedId: string | null;
}

const WishlistGrid: React.FC<Props> = ({ selectedId }) => {
	const {
		data: wishlist,
		isLoading,
		isError
	} = useGetWishlistQuery(selectedId || '', {
		skip: !selectedId // Don't run query if no ID selected
	});

	const [shareWishlist, { isLoading: isSharing }] = useShareWishlistMutation();
	const { show: showNotification } = useNotification();

	const handleShare = async () => {
		if (!selectedId) return;
		try {
			const result = await shareWishlist(selectedId).unwrap();
			const link = `${window.location.origin}/wishlists/shared/${result.shareToken}`;
			navigator.clipboard.writeText(link);
			showNotification({ message: 'Link copied to clipboard!', type: 'success' });
		} catch (error) {
			showNotification({ message: 'Failed to generate link', type: 'error' });
		}
	};

	if (!selectedId) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100%">
				<Typography color="text.secondary">Select a wishlist to view items</Typography>
			</Box>
		);
	}

	if (isLoading)
		return (
			<Box p={5} textAlign="center">
				<CircularProgress />
			</Box>
		);
	if (isError || !wishlist) return <Typography color="error">Failed to load wishlist</Typography>;

	return (
		<Box>
			{/* Header */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
				<Box>
					<Typography variant="h5" fontWeight="bold">
						{wishlist.name}
					</Typography>
					<Stack direction="row" spacing={1} mt={0.5}>
						<Typography variant="caption" color="text.secondary">
							{wishlist.items?.length || 0} Items
						</Typography>
						{wishlist.isPublic && <Chip label="Public" size="small" color="success" variant="outlined" />}
					</Stack>
				</Box>
				<Button startIcon={<ShareIcon />} onClick={handleShare} disabled={isSharing}>
					Share List
				</Button>
			</Stack>

			{/* Items Grid using MUI Grid v2 Syntax */}
			{!wishlist.items || wishlist.items.length === 0 ? (
				<Box py={5} textAlign="center" bgcolor="#f9f9f9" borderRadius={2}>
					<Typography color="text.secondary">This list is empty.</Typography>
					<Button sx={{ mt: 1 }} href="/products">
						Browse Products
					</Button>
				</Box>
			) : (
				<Grid container spacing={3}>
					{wishlist.items.map(item => (
						<Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
							<WishlistItemCard item={item} />
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
};

export default WishlistGrid;

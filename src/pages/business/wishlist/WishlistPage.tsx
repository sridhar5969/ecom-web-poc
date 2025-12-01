import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, CircularProgress } from '@mui/material';
import { useGetWishlistsQuery } from '../../../store/api/business/wishlists.api';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';

import WishlistSidebar from './components/WishlistSidebar';
import WishlistGrid from './components/WishlistGrid';
import CreateWishlistDialog from './components/CreateWishlistDialog';

const WishlistPage: React.FC = () => {
	const { data: wishlists, isLoading } = useGetWishlistsQuery();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	// Auto-select first list on load
	useEffect(() => {
		if (wishlists && wishlists.length > 0 && !selectedId) {
			setSelectedId(wishlists[0].id);
		}
	}, [wishlists, selectedId]);

	if (isLoading) {
		return (
			<Box
				sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<CircularProgress />
			</Box>
		);
	}
	console.log(wishlists);

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
			<ModernTopBar title="My Wishlists" />

			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Grid container spacing={4}>
					{/* LEFT SIDEBAR */}
					<Grid size={{ xs: 12, md: 3 }}>
						<WishlistSidebar
							wishlists={wishlists || []}
							selectedId={selectedId}
							onSelect={setSelectedId}
							onCreate={() => setIsCreateOpen(true)}
						/>
					</Grid>

					{/* RIGHT CONTENT */}
					<Grid size={{ xs: 12, md: 9 }}>
						<WishlistGrid selectedId={selectedId} />
					</Grid>
				</Grid>
			</Container>

			<CreateWishlistDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
		</Box>
	);
};

export default WishlistPage;

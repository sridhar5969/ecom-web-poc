import React, { useState } from 'react';
import {
	Box,
	Grid,
	Container,
	Pagination,
	Stack,
	Typography,
	CircularProgress,
	Alert,
	Button,
	Drawer,
	useMediaQuery,
	useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import ProductList from './ProductList';
import ProductFilterSidebar from './components/ProductFiltersSidebar';

// Hooks
import { useProductFilters } from '../../../hooks/useProductFilters';
import { useGetProductListQuery } from '../../../store/api/business/product.api';

const ProductListPage = () => {
	// 1. Get current filters from URL
	const { queryParams, setFilter } = useProductFilters();

	// 2. Fetch Data
	const { data, isLoading, isFetching, isError } = useGetProductListQuery(queryParams);

	// 3. Mobile Drawer State
	const [mobileOpen, setMobileOpen] = useState(false);

	// Check if screen is mobile for logic (optional, but useful for responsiveness)
	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handlePageChange = (event, value) => {
		setFilter('page', value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB' }}>
			<Container maxWidth="xl">
				{/* MOBILE FILTER BUTTON & HEADER (Visible only on XS/SM) */}
				<Box
					sx={{
						display: { xs: 'flex', md: 'none' },
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
						mt: 4
					}}
				>
					<Typography variant="h6" fontWeight="bold">
						Products
					</Typography>
					<Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleDrawerToggle}>
						Filters
					</Button>
				</Box>

				<Grid container spacing={4}>
					{/* DESKTOP SIDEBAR (Visible only on MD+) */}
					<Grid item size={{ xs: 12, md: 3, lg: 2.5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
						<Box sx={{ position: 'sticky', top: 80 }}>
							<ProductFilterSidebar isMobile={false} />
						</Box>
					</Grid>

					{/* MOBILE DRAWER SIDEBAR (Hidden on Desktop, Pops up on Mobile) */}
					<Drawer
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
						sx={{
							display: { xs: 'block', md: 'none' },
							'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
						}}
					>
						<ProductFilterSidebar isMobile={true} onClose={handleDrawerToggle} />
					</Drawer>

					{/* RIGHT CONTENT (Product List) */}
					<Grid item size={{ xs: 12, md: 9, lg: 9.5 }}>
						{/* 1. Loading State */}
						{isLoading ? (
							<Box display="flex" justifyContent="center" py={10}>
								<CircularProgress />
							</Box>
						) : isError ? (
							<Alert severity="error">Failed to load products. Please try again.</Alert>
						) : (
							<>
								{/* Result Count Header */}
								<Box mb={2} mt={{ xs: 0, md: 4 }} display="flex" justifyContent="space-between" alignItems="center">
									<Typography variant="body1" color="text.secondary">
										Showing <strong>{data?.items.length}</strong> of <strong>{data?.meta.total}</strong> products
									</Typography>
								</Box>

								{/* The Product Grid */}
								<Box sx={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
									{data?.items && data.items.length > 0 ? (
										<ProductList products={data.items} />
									) : (
										<Box textAlign="center" py={10}>
											<Typography variant="h6" color="text.secondary">
												No products found matching your filters.
											</Typography>
											{/* <Button onClick={() => setFilter('search', '')} sx={{ mt: 2 }}>
												Clear Search
											</Button> */}
										</Box>
									)}
								</Box>

								{/* Pagination */}
								{data?.meta && data.meta.last_page > 1 && (
									<Stack alignItems="center" sx={{ mt: 6 }}>
										<Pagination
											count={data.meta.last_page}
											page={data.meta.page}
											onChange={handlePageChange}
											color="primary"
											size="large"
											showFirstButton
											showLastButton
										/>
									</Stack>
								)}
							</>
						)}
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default ProductListPage;

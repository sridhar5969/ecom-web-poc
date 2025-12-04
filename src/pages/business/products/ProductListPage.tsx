import React from 'react';
import { Box, Grid, Container, Pagination, Stack, Typography, CircularProgress, Alert, Button } from '@mui/material';
import ProductList from './ProductList';
import ProductFilterSidebar from './components/ProductFiltersSidebar';

// Hooks
import { useProductFilters } from '../../../hooks/useProductFilters';
import { useGetProductListQuery } from '../../../store/api/business/product.api';

const ProductListPage = () => {
	// 1. Get current filters from URL (Single Source of Truth)
	const { queryParams, setFilter } = useProductFilters();

	// 2. Fetch Data using RTK Query (Refetches automatically when URL changes)
	const { data, isLoading, isFetching, isError } = useGetProductListQuery(queryParams);

	// handle page change
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setFilter('page', value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB' }}>
			<Container maxWidth="xl">
				<Grid container spacing={4}>
					{/* LEFT SIDEBAR (Sticky) */}
					<Grid item size={{ xs: 12, md: 3, lg: 2.5 }}>
						<Box sx={{ position: 'sticky', top: 80 }}>
							<ProductFilterSidebar />
						</Box>
					</Grid>

					{/* RIGHT CONTENT */}
					<Grid item size={{ xs: 12, md: 9, lg: 9.5 }}>
						{/* 1. Loading State */}
						{isLoading ? (
							<Box display="flex" justifyContent="center" py={10}>
								<CircularProgress />
							</Box>
						) : isError ? (
							/* 2. Error State */
							<Alert severity="error">Failed to load products. Please try again.</Alert>
						) : (
							/* 3. Data State */
							<>
								{/* Result Count Header */}
								<Box mb={2} mt={4} display="flex" justifyContent="space-between" alignItems="center">
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
											<Button onClick={() => setFilter('search', '')} sx={{ mt: 2 }}>
												Clear Search
											</Button>
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

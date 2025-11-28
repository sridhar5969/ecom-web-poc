import React, { useState } from 'react';
import { Box, Typography, TextField, Pagination, InputAdornment, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import { useGetProductListQuery } from '../../../store/api/business/product.api';
import ProductCard from './components/ProductCard';
import Loader from '../../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import { ProductListItem } from '../../../types/product.types';

const ProductList: React.FC = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');

	// Integrate state with the API query
	// Assuming your API accepts 'search' or 'q' for filtering
	const { data, isLoading, isError, refetch } = useGetProductListQuery({
		page,
		limit: 12,
		search: searchTerm
	});

	const totalPages = isError ? 1 : data?.meta?.last_page || 1;

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		// Reset to page 1 when search criteria changes to avoid empty states
		setPage(1);
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Box
					sx={{
						mb: 4,
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						alignItems: { xs: 'stretch', sm: 'center' },
						gap: 2
					}}
				>
					<TextField
						variant="outlined"
						placeholder="Search products by name, sku..."
						size="small"
						value={searchTerm}
						onChange={handleSearchChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="action" />
								</InputAdornment>
							)
						}}
						sx={{ width: { xs: '100%', sm: 300 } }}
					/>
				</Box>

				{isLoading ? (
					<Box display="flex" justifyContent="center" py={10}>
						<Loader />
					</Box>
				) : isError ? (
					<Box textAlign="center" py={10}>
						<Typography color="error" variant="h6">
							Failed to load products.
						</Typography>
						<Button onClick={() => refetch()} sx={{ mt: 2 }}>
							Try Again
						</Button>
					</Box>
				) : (
					<>
						{/* Product Grid */}
						{data?.items?.length === 0 ? (
							<Box textAlign="center" py={10} bgcolor="background.paper" borderRadius={2}>
								<Typography variant="h6" color="text.secondary">
									No products found.
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Try adjusting your search criteria.
								</Typography>
							</Box>
						) : (
							<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								{data?.items?.map(product => (
									<Grid size={{ xs: 2, sm: 4, md: 3 }} key={product.slug}>
										<ProductCard product={product as ProductListItem} onClick={slug => navigate(`/products/${slug}`)} />
									</Grid>
								))}
							</Grid>
						)}

						{/* Pagination */}
						{data?.meta && data.meta.last_page > 1 && (
							<Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
								<Pagination
									count={totalPages}
									page={page}
									onChange={handlePageChange}
									color="primary"
									size="large"
									showFirstButton
									showLastButton
								/>
							</Box>
						)}
					</>
				)}
			</Container>
		</Box>
	);
};

export default ProductList;

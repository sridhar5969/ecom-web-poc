import React, { useState } from 'react';
import { Box, Typography, TextField, Pagination, InputAdornment, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

// Store & Hooks
import { useGetProductsQuery } from '../../../store/api/business/product.api';

// Components
import ProductCard from './components/ProductCard';
import Loader from '../../../components/common/Loader';
import { MOCK_PRODUCTS } from './mocks/products'; // Save the JSON above here
import { Product } from '../../../types/product.types';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');

	// TODO: Debounce search to prevent API spam
	// const debouncedSearch = useDebounce(searchTerm, 500);

	// API Call
	const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery({
		page,
		limit: 12,
		search: searchTerm
	});

	const productsToDisplay = isError ? MOCK_PRODUCTS : data?.items || [];

	const totalPages = isError ? 1 : data?.meta?.last_page || 1;

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleCreateNew = () => {
		// navigate('/products/new');
		console.log('Create new product');
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			{/* 1. Top Navigation */}

			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* 2. Controls Header */}
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
						onChange={e => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="action" />
								</InputAdornment>
							)
						}}
						sx={{ width: { xs: '100%', sm: 300 } }}
					/>

					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={isFetching}>
							Refresh
						</Button>
						<Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateNew}>
							Add Product
						</Button>
					</Box>
				</Box>

				{/* 3. Loading & Error States */}
				{isLoading ? (
					<Box display="flex" justifyContent="center" py={10}>
						<Loader />
					</Box>
				) : (
					// ) : isError ? (
					// 	<Box textAlign="center" py={10}>
					// 		<Typography color="error" variant="h6">
					// 			Failed to load products.
					// 		</Typography>
					// 		<Button onClick={() => refetch()} sx={{ mt: 2 }}>
					// 			Try Again
					// 		</Button>
					// 	</Box>
					// ) : (
					<>
						{/* 4. Product Grid */}
						{productsToDisplay?.length === 0 ? (
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
								{productsToDisplay?.map(product => (
									<Grid size={{ xs: 2, sm: 4, md: 3 }} key={product.id}>
										<ProductCard product={product as Product} onClick={id => navigate(`/products/${id}`)} />
									</Grid>
								))}
							</Grid>
						)}

						{/* 5. Pagination */}
						{/* {data?.meta && data.meta.last_page > 1 && ( */}
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
						{/* )} */}
					</>
				)}
			</Container>
		</Box>
	);
};

export default ProductList;

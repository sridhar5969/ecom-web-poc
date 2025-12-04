import React, { useState } from 'react';
import { Box, Grid, Skeleton, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { ProductListItem } from '../../../types/product.types';
import { useGetProductListQuery } from '../../../store/api/business/product.api';
import { useProductFilters } from '../../../hooks/useProductFilters';

interface ProductListProps {
	products?: ProductListItem[]; // array mode
	loading?: boolean; // external loading for array mode
	query?: { search?: string; brand?: string }; // API mode settings
	limit?: number; // items per page for array mode
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, query, limit = 12 }) => {
	const { queryParams } = useProductFilters();
	const navigate = useNavigate();

	/** detect mode */
	const isApiMode = !products;

	/** pagination state */
	const [page, setPage] = useState(1);

	/** API MODE **/
	const { data, isLoading, isError, refetch } = useGetProductListQuery(queryParams, { skip: !isApiMode });

	/** ARRAY MODE **/
	const paginatedArray = !isApiMode && products ? products.slice((page - 1) * limit, page * limit) : [];

	const totalPages = isApiMode ? data?.meta?.last_page || 1 : products ? Math.ceil(products.length / limit) : 1;

	const resolvedLoading = isApiMode ? isLoading : loading;
	const resolvedProducts = isApiMode ? data?.items : paginatedArray;

	const handlePageChange = (_: any, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			{/* ERROR STATE */}
			{isApiMode && isError && (
				<Box textAlign="center" py={10}>
					<Typography color="error" variant="h6">
						Failed to load products.
					</Typography>
					<Button onClick={() => refetch()} sx={{ mt: 2 }}>
						Try Again
					</Button>
				</Box>
			)}

			{/* PRODUCT GRID */}
			<Grid container spacing={{ xs: 4, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				{resolvedLoading
					? Array.from({ length: limit }).map((_, idx) => (
							<Grid size={{ xs: 4, sm: 4, md: 3 }} key={'sk-' + idx}>
								<Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
								<Skeleton width="60%" sx={{ mt: 1 }} />
							</Grid>
						))
					: resolvedProducts?.map(product => (
							<Grid size={{ xs: 4, sm: 4, md: 3 }} key={product.slug}>
								<ProductCard product={product} onClick={slug => navigate(`/products/${slug}`)} />
							</Grid>
						))}
			</Grid>

			{/* EMPTY STATE */}
			{!resolvedLoading && resolvedProducts?.length === 0 && (
				<Box textAlign="center" py={10}>
					<Typography variant="h6" color="text.secondary">
						No products found.
					</Typography>
				</Box>
			)}

			{/* PAGINATION */}
			{/* {totalPages > 1 && (
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
			)} */}
		</>
	);
};

export default ProductList;

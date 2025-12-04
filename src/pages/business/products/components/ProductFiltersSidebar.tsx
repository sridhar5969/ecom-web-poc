import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Divider,
	TextField,
	Button,
	InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useProductFilters } from '../../../../hooks/useProductFilters'; // Adjust path as needed
import { useGetBrandsQuery } from '../../../../store/api/business/brands.api';
import { useGetCategoriesQuery } from '../../../../store/api/business/categories.api';
import Loader from '../../../../components/common/Loader';

const ProductFilterSidebar = () => {
	const { getActiveList, toggleFilter, setFilter, queryParams, clearFilters } = useProductFilters();
	const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery();
	const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
	console.log('cateogirs', categories);
	// --- SEARCH STATE MANAGEMENT (Debouncing) ---
	// 1. Local state controls the input field immediately so typing feels fast
	const [localSearch, setLocalSearch] = useState(queryParams.search || '');

	// 2. Sync local state if URL changes externally (e.g. back button)
	useEffect(() => {
		setLocalSearch(queryParams.search || '');
	}, [queryParams.search]);

	// 3. Debounce: Update URL only after user stops typing for 500ms
	useEffect(() => {
		const handler = setTimeout(() => {
			// Only update if the value is different to avoid infinite loops
			if (localSearch !== (queryParams.search || '')) {
				setFilter('search', localSearch);
			}
		}, 500);

		return () => clearTimeout(handler);
	}, [localSearch, setFilter, queryParams.search]);
	// ---------------------------------------------

	// Derived state for UI checks
	const activeBrands = getActiveList('brand');
	const activeCategories = getActiveList('category');

	return (
		<Box sx={{ width: '100%', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6" fontWeight="bold">
					Filters
				</Typography>
				<Button
					size="small"
					onClick={() => {
						setLocalSearch(''); // Clear local input
						clearFilters(); // Clear URL params
					}}
				>
					Reset
				</Button>
			</Box>

			{/* SEARCH FIELD */}
			<TextField
				fullWidth
				placeholder="Search products..."
				size="small"
				value={localSearch}
				onChange={e => setLocalSearch(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon color="action" fontSize="small" />
						</InputAdornment>
					)
				}}
				sx={{ mb: 3 }}
			/>

			<Divider sx={{ mb: 2 }} />

			{/* 1. BRAND FILTER */}
			<Typography variant="subtitle2" fontWeight="bold" mb={1}>
				Brands
			</Typography>
			<FormGroup sx={{ mb: 2 }}>
				{isBrandsLoading ? (
					<Loader />
				) : (
					brands.items?.map(brand => (
						<FormControlLabel
							key={brand.slug}
							control={
								<Checkbox
									size="small"
									checked={activeBrands.includes(brand.slug)}
									onChange={() => toggleFilter('brand', brand.slug)}
								/>
							}
							label={<Typography variant="body2">{brand.name}</Typography>}
						/>
					))
				)}
			</FormGroup>

			<Divider sx={{ mb: 2 }} />

			{/* 2. CATEGORY FILTER */}
			<Typography variant="subtitle2" fontWeight="bold" mb={1}>
				Categories
			</Typography>
			<FormGroup sx={{ mb: 2 }}>
				{isCategoriesLoading ? (
					<Loader />
				) : (
					categories.items.map(cat => (
						<FormControlLabel
							key={cat.slug}
							control={
								<Checkbox
									size="small"
									checked={activeCategories.includes(cat.slug)}
									onChange={() => toggleFilter('category', cat.slug)}
								/>
							}
							label={<Typography variant="body2">{cat.name}</Typography>}
						/>
					))
				)}
			</FormGroup>

			<Divider sx={{ mb: 2 }} />
			{/* TODO: ADD PRICE RANGE AND STOCK FILTER IN BACKEND */}

			{/* 3. PRICE RANGE */}
			{/* <Typography variant="subtitle2" fontWeight="bold" mb={1}>
				Price Range (NGN)
			</Typography>
			<Box display="flex" gap={1} mb={2}>
				<TextField
					label="Min"
					size="small"
					type="number"
					value={queryParams.min_price || ''}
					onChange={e => setFilter('min_price', e.target.value)}
				/>
				<TextField
					label="Max"
					size="small"
					type="number"
					value={queryParams.max_price || ''}
					onChange={e => setFilter('max_price', e.target.value)}
				/>
			</Box> */}

			{/* <Divider sx={{ mb: 2 }} /> */}

			{/* 4. STOCK FILTER */}
			{/* <FormControlLabel
				control={<Checkbox checked={!!queryParams.in_stock} onChange={e => setFilter('in_stock', e.target.checked)} />}
				label={
					<Typography variant="body2" fontWeight="bold">
						In Stock Only
					</Typography>
				}
			/> */}
		</Box>
	);
};

export default ProductFilterSidebar;

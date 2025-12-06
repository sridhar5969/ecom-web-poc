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
	InputAdornment,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Adjust these imports to match your project structure
import { useProductFilters } from '../../../../hooks/useProductFilters';
import { useGetBrandsQuery } from '../../../../store/api/business/brands.api';
import { useGetCategoriesQuery } from '../../../../store/api/business/categories.api';
import Loader from '../../../../components/common/Loader';

const ProductFilterSidebar = ({ onClose, isMobile }) => {
	const { getActiveList, toggleFilter, setFilter, queryParams, clearFilters } = useProductFilters();
	const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery();
	const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

	// --- SEARCH STATE MANAGEMENT ---
	const [localSearch, setLocalSearch] = useState(queryParams.search || '');

	// Sync local state if URL changes externally
	useEffect(() => {
		setLocalSearch(queryParams.search || '');
	}, [queryParams.search]);

	// Debounce: Update URL only after user stops typing
	useEffect(() => {
		const handler = setTimeout(() => {
			// Only update if the value is different
			if (localSearch !== (queryParams.search || '')) {
				setFilter('search', localSearch);
			}
		}, 500);

		return () => clearTimeout(handler);
	}, [localSearch, setFilter, queryParams.search]);

	// --- HANDLERS ---

	// Robust Reset: Clears local state AND URL params immediately
	const handleResetFilters = () => {
		setLocalSearch(''); // 1. Clear Input UI
		setFilter('search', ''); // 2. Clear Search URL Param immediately
		clearFilters(); // 3. Clear all other filters (Brands, Cats, etc.)
	};

	// Derived state for UI checks
	const activeBrands = getActiveList('brand');
	const activeCategories = getActiveList('category');

	return (
		<Box
			sx={{
				width: '100%',
				p: 2,
				bgcolor: 'background.paper',
				borderRadius: 2,
				height: isMobile ? '100%' : 'auto',
				display: 'flex',
				flexDirection: 'column',
				// FIX: Add top margin on mobile to clear the fixed Navbar
				mt: isMobile ? 8 : 0
			}}
		>
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6" fontWeight="bold">
					Filters
				</Typography>
				<Box>
					<Button size="small" onClick={handleResetFilters} sx={{ mr: 1 }}>
						Reset
					</Button>
					{/* Close "X" button for Mobile Drawer */}
					{isMobile && (
						<IconButton onClick={onClose} size="small">
							<CloseIcon />
						</IconButton>
					)}
				</Box>
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
					),
					// FIX: Added a clear "X" button inside the search field itself
					endAdornment: localSearch && (
						<InputAdornment position="end">
							<IconButton size="small" onClick={() => setLocalSearch('')}>
								<CloseIcon fontSize="small" />
							</IconButton>
						</InputAdornment>
					)
				}}
				sx={{ mb: 2 }}
			/>

			<Divider sx={{ mb: 2 }} />

			{/* Scrollable Container for Accordions */}
			<Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
				{/* 1. BRAND FILTER ACCORDION */}
				<Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
						<Typography variant="subtitle2" fontWeight="bold">
							Brands
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ p: 0 }}>
						<FormGroup>
							{isBrandsLoading ? (
								<Loader />
							) : (
								brands?.items?.map(brand => (
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
					</AccordionDetails>
				</Accordion>

				<Divider sx={{ my: 1 }} />

				{/* 2. CATEGORY FILTER ACCORDION */}
				<Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
						<Typography variant="subtitle2" fontWeight="bold">
							Categories
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ p: 0 }}>
						<FormGroup>
							{isCategoriesLoading ? (
								<Loader />
							) : (
								categories?.items?.map(cat => (
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
					</AccordionDetails>
				</Accordion>
			</Box>

			{/* FIX: Removed the "Show Results" button from here as requested */}
		</Box>
	);
};

export default ProductFilterSidebar;

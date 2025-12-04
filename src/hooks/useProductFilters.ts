import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
// Optional: install lodash or write a simple debounce

// This matches the INPUT of your Zod schema (what goes into the URL)
export interface ProductUrlParams {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
	min_price?: number;
	max_price?: number;
	brand?: string; // "indomie,kelloggs"
	category?: string; // "noodles,pasta"
	in_stock?: boolean;
}

export const useProductFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// 1. QUERY PARAMS: The raw object for RTK Query
	const queryParams: ProductUrlParams = useMemo(() => {
		const params: ProductUrlParams = {};

		// Parsing logic matching your Zod "Coerce" logic
		const page = searchParams.get('page');
		if (page) params.page = Number(page);

		const limit = searchParams.get('limit');
		if (limit) params.limit = Number(limit);

		const search = searchParams.get('search');
		if (search) params.search = search;

		const sort = searchParams.get('sort');
		if (sort) params.sort = sort;

		const min = searchParams.get('min_price');
		if (min) params.min_price = Number(min);

		const max = searchParams.get('max_price');
		if (max) params.max_price = Number(max);

		// Strings (don't split here, API wants comma-separated)
		const brand = searchParams.get('brand');
		if (brand) params.brand = brand;

		const category = searchParams.get('category');
		if (category) params.category = category;

		const inStock = searchParams.get('in_stock');
		if (inStock) params.in_stock = inStock === 'true';

		return params;
	}, [searchParams]);

	// 2. HELPER: Get array from comma-separated string (For UI Checkboxes)
	const getActiveList = useCallback(
		(key: 'brand' | 'category') => {
			const val = searchParams.get(key);
			return val ? val.split(',') : [];
		},
		[searchParams]
	);

	// 3. SETTERS

	// Generic setter
	const setFilter = useCallback(
		(key: keyof ProductUrlParams, value: string | number | boolean | null) => {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev);
				if (value === null || value === '' || value === undefined) {
					newParams.delete(key);
				} else {
					newParams.set(key, String(value));
				}
				// Reset page on filter change
				if (key !== 'page') newParams.set('page', '1');
				return newParams;
			});
		},
		[setSearchParams]
	);

	// Specific setter for Toggle Logic (Brand/Category)
	const toggleFilter = useCallback(
		(key: 'brand' | 'category', value: string) => {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev);
				const currentStr = newParams.get(key) || '';
				const currentArr = currentStr ? currentStr.split(',') : [];

				let newArr;
				if (currentArr.includes(value)) {
					// Remove
					newArr = currentArr.filter(item => item !== value);
				} else {
					// Add
					newArr = [...currentArr, value];
				}

				if (newArr.length === 0) {
					newParams.delete(key);
				} else {
					newParams.set(key, newArr.join(','));
				}

				newParams.set('page', '1');
				return newParams;
			});
		},
		[setSearchParams]
	);

	// Clear all filters
	const clearFilters = () => {
		setSearchParams(new URLSearchParams());
	};

	return {
		queryParams, // Pass this to RTK Query
		getActiveList, // Use this for UI (isActive)
		setFilter, // Use for simple fields (sort, search)
		toggleFilter, // Use for multi-select (brand, category)
		clearFilters
	};
};

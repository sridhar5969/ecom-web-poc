import React, { useState } from 'react';
import { Box, Container, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductList from './ProductList';

const ProductListPage = () => {
	const [search, setSearch] = useState('');

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* SEARCH BAR */}
				<Box sx={{ mb: 4 }}>
					<TextField
						placeholder="Search products..."
						size="small"
						value={search}
						onChange={e => setSearch(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="action" />
								</InputAdornment>
							)
						}}
						sx={{ width: 300 }}
					/>
				</Box>

				{/* PAGINATED LIST (API Mode) */}
				<ProductList query={{ search }} />
			</Container>
		</Box>
	);
};

export default ProductListPage;

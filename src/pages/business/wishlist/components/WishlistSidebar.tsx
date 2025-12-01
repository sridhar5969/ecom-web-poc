import React from 'react';
import { List, ListItemButton, ListItemText, ListItemIcon, Button, Box, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Wishlist } from '../../../../types/wishlists.types';

interface Props {
	wishlists: Wishlist[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onCreate: () => void;
}

const WishlistSidebar: React.FC<Props> = ({ wishlists, selectedId, onSelect, onCreate }) => {
	console.log(wishlists);
	return (
		<Paper variant="outlined" sx={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
			<Box p={2} borderBottom="1px solid #eee">
				<Typography variant="h6" fontWeight="bold" gutterBottom>
					My Collections
				</Typography>
				<Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
					New Wishlist
				</Button>
			</Box>

			<List sx={{ flexGrow: 1, overflow: 'auto' }}>
				{wishlists.data?.map(list => (
					<ListItemButton
						key={list.id}
						selected={selectedId === list.id}
						onClick={() => onSelect(list.id)}
						sx={{
							borderLeft: selectedId === list.id ? '4px solid' : '4px solid transparent',
							borderColor: 'primary.main'
						}}
					>
						<ListItemIcon sx={{ minWidth: 40 }}>
							{selectedId === list.id ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
						</ListItemIcon>
						<ListItemText
							primary={list.name}
							primaryTypographyProps={{ fontWeight: selectedId === list.id ? 'bold' : 'normal' }}
							secondary={list.isPublic ? 'Public' : 'Private'}
						/>
					</ListItemButton>
				))}
			</List>
		</Paper>
	);
};

export default WishlistSidebar;

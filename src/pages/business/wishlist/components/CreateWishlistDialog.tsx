import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControlLabel,
	Checkbox
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWishlistSchema, CreateWishlistPayload } from '../../../../types/wishlists.types';
import { useCreateWishlistMutation } from '../../../../store/api/business/wishlists.api';
import { useNotification } from '../../../../hooks/useNotification';

interface Props {
	open: boolean;
	onClose: () => void;
}

const CreateWishlistDialog: React.FC<Props> = ({ open, onClose }) => {
	const [createWishlist, { isLoading }] = useCreateWishlistMutation();
	const { show: showNotification } = useNotification();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<CreateWishlistPayload>({
		resolver: zodResolver(createWishlistSchema),
		defaultValues: { name: '', isPublic: false }
	});

	const onSubmit = async (data: CreateWishlistPayload) => {
		try {
			await createWishlist(data).unwrap();
			showNotification({ message: 'Wishlist created!', type: 'success' });
			reset();
			onClose();
		} catch (error) {
			showNotification({ message: 'Failed to create wishlist', type: 'error' });
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create New Wishlist</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Wishlist Name"
						fullWidth
						variant="outlined"
						error={!!errors.name}
						helperText={errors.name?.message}
						{...register('name')}
					/>
					<FormControlLabel
						control={<Checkbox {...register('isPublic')} />}
						label="Make Public (Shared via link)"
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={isLoading}>
						{isLoading ? 'Creating...' : 'Create'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default CreateWishlistDialog;

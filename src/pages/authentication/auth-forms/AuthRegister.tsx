import React, { useState } from 'react';
import { Box, Button, TextField, InputAdornment, IconButton, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../../hooks/useNotification';
import { useRegisterUserMutation } from '../../../store/api/auth/auth.api';
import { useMergeCartMutation } from '../../../store/api/business/cart.api';

const AuthRegister = () => {
	const navigate = useNavigate();
	const [mergeCart] = useMergeCartMutation();

	const { show } = useNotification();
	const [params] = useSearchParams();
	const [register, { isLoading }] = useRegisterUserMutation();
	console.log(params.get('returnUrl'), 'url');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
		setError('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validation
		if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
			setError('All fields are required');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		try {
			await register({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				password: formData.password
			}).unwrap();

			show({ message: 'Registration successful! Please login.', type: 'success' });
			const returnUrl = params.get('returnUrl');
			if (returnUrl) {
				if (returnUrl == '/checkout') await mergeCart().unwrap();

				window.location.href = returnUrl;
			} else {
				navigate('/auth/login');
			}
		} catch (err: any) {
			setError(err?.data?.message || 'Registration failed. Please try again.');
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit} noValidate>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<TextField
					fullWidth
					label="First Name"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					disabled={isLoading}
					required
				/>
				<TextField
					fullWidth
					label="Last Name"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					disabled={isLoading}
					required
				/>
			</Box>

			<TextField
				fullWidth
				label="Email Address"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleChange}
				disabled={isLoading}
				required
				sx={{ mb: 2 }}
			/>

			<TextField
				fullWidth
				label="Password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				value={formData.password}
				onChange={handleChange}
				disabled={isLoading}
				required
				sx={{ mb: 2 }}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>

			<TextField
				fullWidth
				label="Confirm Password"
				name="confirmPassword"
				type={showConfirmPassword ? 'text' : 'password'}
				value={formData.confirmPassword}
				onChange={handleChange}
				disabled={isLoading}
				required
				sx={{ mb: 3 }}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle confirm password visibility"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								edge="end"
							>
								{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>

			<Button
				fullWidth
				type="submit"
				variant="contained"
				size="large"
				disabled={isLoading}
				sx={{
					py: 1.5,
					textTransform: 'none',
					fontSize: '1rem',
					fontWeight: 600
				}}
			>
				{isLoading ? <CircularProgress size={24} /> : 'Create Account'}
			</Button>
		</Box>
	);
};

export default AuthRegister;

import { Typography, Box, Paper, Container, Link } from '@mui/material';
import AuthLogin from './auth-forms/AuthLogin';
import Logo from '../../components/common/logo/Logo';
import { env } from '../../config/env';

const Login = () => {
	const searchParams = new URLSearchParams(window.location.search);
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden',
				background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `
						radial-gradient(circle at 15% 85%, rgba(220, 38, 38, 0.05) 0%, transparent 50%),
						radial-gradient(circle at 85% 15%, rgba(185, 28, 28, 0.08) 0%, transparent 50%),
						radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)
					`,
					zIndex: 0
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-5%',
					width: '40%',
					height: '40%',
					background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
					filter: 'blur(60px)',
					zIndex: 0
				}
			}}
		>
			{/* Header with Logo */}
			<Box
				sx={{
					position: 'absolute',
					top: 24,
					left: 24,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					zIndex: 2
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 40,
						height: 40,
						borderRadius: '10px',
						background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
						boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
					}}
				>
					<Logo sx={{ width: 27, height: 20 }} fill="white" />
				</Box>
				<Typography
					variant="h6"
					component="h1"
					sx={{
						fontWeight: 700,
						color: '#1a1a1a',
						letterSpacing: '-0.02em'
					}}
				>
					{env.VITE_APP_NAME}
				</Typography>
			</Box>

			{/* Main Content */}
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					zIndex: 1,
					px: 2
				}}
			>
				<Container
					maxWidth="sm"
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Paper
						elevation={0}
						sx={{
							width: '100%',
							maxWidth: 480,
							p: { xs: 3, sm: 4 },
							borderRadius: 2,
							backgroundColor: '#ffffff',
							border: '1px solid rgba(0, 0, 0, 0.05)',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
							transition: 'all 0.2s ease',
							'&:hover': {
								boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
							}
						}}
					>
						{/* Header */}
						<Box sx={{ mb: 3 }}>
							<Typography
								variant="h4"
								component="h1"
								sx={{
									fontWeight: 700,
									color: '#1a1a1a',
									mb: 1
								}}
							>
								Welcome Back
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Don't have an account?{' '}
								<Link
									href={`/auth/register${searchParams.get('returnUrl') ? `?returnUrl=${encodeURIComponent(searchParams.get('returnUrl')!)}` : ''}`}
									sx={{
										color: '#dc2626',
										textDecoration: 'none',
										'&:hover': {
											textDecoration: 'underline'
										}
									}}
								>
									Sign up
								</Link>
							</Typography>
						</Box>

						{/* Form */}
						<AuthLogin />
					</Paper>
				</Container>
			</Box>

			{/* Footer */}
			<Box
				sx={{
					position: 'absolute',
					bottom: 24,
					left: 24,
					right: 24,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					zIndex: 2
				}}
			>
				<Typography
					variant="caption"
					sx={{
						color: '#9ca3af',
						fontSize: '0.75rem'
					}}
				>
					© powered by{' '}
					<Link
						href="#"
						sx={{
							color: '#dc2626',
							textDecoration: 'none',
							'&:hover': {
								textDecoration: 'underline'
							}
						}}
					>
						Metayb AI
					</Link>
				</Typography>
				<Link
					href="#"
					sx={{
						color: '#9ca3af',
						textDecoration: 'none',
						fontSize: '0.75rem',
						'&:hover': {
							textDecoration: 'underline'
						}
					}}
				>
					Terms and Conditions
				</Link>
			</Box>
		</Box>
	);
};

export default Login;

import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Divider,
	Tooltip,
	Stack,
	Badge,
	useTheme
} from '@mui/material';
import { env } from '../../../config/env';
import {
	MdLogout as Logout,
	MdPerson as Person,
	MdAdminPanelSettings as AdminPanelSettings,
	MdSecurity as Security,
	MdSupervisorAccount as SupervisorAccount,
	MdSettings as Settings,
	MdNotificationsNone as NotificationsNone,
	MdShoppingCart
} from 'react-icons/md';
import { useLogout } from '../../../hooks/useLogOut';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useGetCartQuery } from '../../../store/api/business/cart.api';

interface ModernTopBarProps {
	onMenuToggle: () => void;
	drawerOpen: boolean;
	title: string;
}

const ModernTopBar = ({ onMenuToggle, drawerOpen, title }: ModernTopBarProps) => {
	const navigate = useNavigate();
	const { data: cartData } = useGetCartQuery();

	const totalQty = cartData?.total_quantity || 0;
	const theme = useTheme();

	// 1. Get Session Data from Context
	const { session, isAuthenticated } = useAuth();
	const logout = useLogout();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	// 2. Derived state for UI safety
	const userName = session?.userName || 'Guest';
	const userEmail = session?.userEmail || '';
	const roleName = session?.roleName || 'guest';
	const permissionsCount = session?.permissions?.length || 0;

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const getRoleIcon = (role: string) => {
		const iconStyle = { fontSize: 18 };
		// Normalize role string to handle casing
		switch (role?.toLowerCase()) {
			case 'admin':
			case 'dev_admin':
				return <AdminPanelSettings style={iconStyle} />;
			case 'manager':
			case 'supervisor':
				return <SupervisorAccount style={iconStyle} />;
			case 'security':
				return <Security style={iconStyle} />;
			case 'customer':
			default:
				return <Person style={iconStyle} />;
		}
	};

	const getRoleColor = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'admin':
			case 'dev_admin':
				return '#f44336'; // Red
			case 'manager':
				return '#00bcd4'; // Cyan
			case 'customer':
				return '#2196f3'; // Blue
			default:
				return '#757575'; // Grey
		}
	};

	const getRoleDisplayName = (role: string) => {
		if (!role) return 'Guest';
		return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	};

	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				backgroundColor: '#ffffff',
				borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
				backdropFilter: 'blur(20px)',
				zIndex: theme.zIndex.drawer + 1,
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			}}
		>
			<Toolbar
				sx={{
					minHeight: '64px !important',
					px: { xs: 2, sm: 2.5, md: 3 },
					justifyContent: 'space-between'
				}}
			>
				{/* Left Section - Logo */}
				<Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }}>
					<Typography
						variant="h6"
						component="div"
						sx={{
							color: '#1a1a1a',
							fontWeight: 600,
							fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
							letterSpacing: '-0.02em'
						}}
					>
						{title || env.VITE_APP_NAME}
					</Typography>
				</Stack>

				{/* Right Section - Notifications & User Profile */}
				<Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1, md: 1 }}>
					{/* Cart Icon */}
					<IconButton onClick={() => navigate('/cart')}>
						<Badge badgeContent={totalQty} color="error">
							<MdShoppingCart />
						</Badge>
					</IconButton>

					{/* Notifications */}
					<Tooltip title="Notifications">
						<IconButton
							sx={{
								color: '#666666',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.04)',
									color: '#1a1a1a'
								},
								transition: 'all 0.2s ease',
								borderRadius: '12px',
								width: { xs: 36, md: 40 },
								height: { xs: 36, md: 40 }
							}}
						>
							<Badge badgeContent={0} color="error" variant="dot">
								<NotificationsNone style={{ fontSize: 18 }} />
							</Badge>
						</IconButton>
					</Tooltip>

					{/* User Profile Trigger */}
					<Tooltip title="Account Settings">
						<IconButton
							onClick={handleProfileMenuOpen}
							sx={{
								p: 0,
								'&:hover': {
									'& .MuiAvatar-root': {
										backgroundColor: '#374151'
									}
								},
								transition: 'all 0.15s ease'
							}}
						>
							<Avatar
								sx={{
									width: { xs: 32, md: 36 },
									height: { xs: 32, md: 36 },
									backgroundColor: '#6b7280',
									fontSize: { xs: '0.8rem', md: '0.9rem' },
									fontWeight: 500,
									color: '#ffffff',
									border: '1px solid rgba(0, 0, 0, 0.08)',
									transition: 'all 0.15s ease'
								}}
							>
								{userName.charAt(0).toUpperCase()}
							</Avatar>
						</IconButton>
					</Tooltip>

					{/* User Profile Menu */}
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						PaperProps={{
							sx: {
								mt: 1.5,
								minWidth: 320,
								borderRadius: '16px',
								boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
								border: '1px solid rgba(0, 0, 0, 0.05)',
								overflow: 'hidden'
							}
						}}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					>
						<Box>
							{/* User Info Header */}
							<Box sx={{ p: 3, pb: 2 }}>
								<Stack direction="row" alignItems="center" spacing={2}>
									<Avatar
										sx={{
											width: 48,
											height: 48,
											backgroundColor: '#6b7280',
											fontSize: '1.1rem',
											fontWeight: 500,
											color: '#ffffff',
											border: '1px solid rgba(0, 0, 0, 0.08)'
										}}
									>
										{userName.charAt(0).toUpperCase()}
									</Avatar>
									<Box sx={{ flexGrow: 1, minWidth: 0 }}>
										<Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
											{userName}
										</Typography>
										<Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
											{userEmail}
										</Typography>
									</Box>
								</Stack>
							</Box>

							<Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.06)' }} />

							{/* Current Role Display */}
							{isAuthenticated && (
								<Box sx={{ p: 2, pt: 2.5 }}>
									<Typography
										variant="caption"
										sx={{ color: '#666666', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}
									>
										Current Role
									</Typography>
									<Box sx={{ mt: 1.5, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '12px' }}>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Box
												sx={{
													width: 32,
													height: 32,
													borderRadius: '8px',
													backgroundColor: getRoleColor(roleName) + '15',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: getRoleColor(roleName)
												}}
											>
												{getRoleIcon(roleName)}
											</Box>
											<Box sx={{ flexGrow: 1 }}>
												<Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
													{getRoleDisplayName(roleName)}
												</Typography>
												<Typography variant="caption" sx={{ color: '#666666' }}>
													{permissionsCount} permissions granted
												</Typography>
											</Box>
										</Stack>
									</Box>
								</Box>
							)}

							<Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.06)' }} />

							{/* Menu Actions */}
							<Box sx={{ p: 1 }}>
								<MenuItem
									key="settings"
									onClick={handleMenuClose}
									sx={{
										p: 1.5,
										borderRadius: '12px',
										'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
									}}
								>
									<Stack direction="row" alignItems="center" spacing={2}>
										<Settings style={{ fontSize: 20, color: '#666666' }} />
										<Typography variant="body2" sx={{ color: '#1a1a1a' }}>
											Settings
										</Typography>
									</Stack>
								</MenuItem>

								<MenuItem
									key="logout"
									onClick={() => {
										logout();
										handleMenuClose();
									}}
									sx={{
										p: 1.5,
										borderRadius: '12px',
										'&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
									}}
								>
									<Stack direction="row" alignItems="center" spacing={2}>
										<Logout style={{ fontSize: 20, color: '#f44336' }} />
										<Typography variant="body2" sx={{ color: '#f44336', fontWeight: 500 }}>
											Sign Out
										</Typography>
									</Stack>
								</MenuItem>
							</Box>
						</Box>
					</Menu>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default ModernTopBar;

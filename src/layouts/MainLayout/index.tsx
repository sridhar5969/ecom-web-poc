import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import Drawer from './Drawer';
import { useAuth } from '../../contexts/AuthContext';
import { RoleProvider } from '../../contexts/RoleContext';
import ModernTopBar from '../../components/common/TopBar/ModernTopBar';
import Breadcrumbs from '../../components/common/breadcrumbs/Breadcrumbs';
import { GlobalLoader } from '../../components/common/loading/GlobalLoader';
import { SessionData } from '../../schemas';

/**
 * MainLayout - Simplified, uses AuthContext and RoleProvider
 * Session is guaranteed to exist here because of ProtectedRoute wrapper
 */
const MainLayout = () => {
	const theme = useTheme();
	const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
	const { session } = useAuth();

	// Drawer state management
	const shouldBeOpen = useMemo(() => !matchDownLG, [matchDownLG]);
	const [manuallyToggled, setManuallyToggled] = useState(false);
	const drawerOpen = manuallyToggled ? !shouldBeOpen : shouldBeOpen;

	const handleDrawerToggle = () => {
		setManuallyToggled(!manuallyToggled);
	};

	// Session is guaranteed to exist here due to ProtectedRoute
	if (!session) {
		return null; // Should never happen
	}

	return (
		<RoleProvider sessionData={session}>
			<MainLayoutContent open={drawerOpen} handleDrawerToggle={handleDrawerToggle} session={session} />
		</RoleProvider>
	);
};

const MainLayoutContent = ({
	open,
	handleDrawerToggle,
	session
}: {
	open: boolean;
	handleDrawerToggle: () => void;
	session: SessionData;
}) => {
	const permissions = session.permissions;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				backgroundColor: '#fafafa'
			}}
		>
			<ModernTopBar onMenuToggle={handleDrawerToggle} drawerOpen={open} />

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: open ? '240px 1fr' : { xs: '57px 1fr', sm: '65px 1fr' },
					flexGrow: 1,
					overflow: 'hidden',
					pt: '64px',
					transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
				}}
			>
				<Drawer open={open} handleDrawerToggle={handleDrawerToggle} permissions={permissions} />
				<Box
					component="main"
					sx={{
						height: 'calc(100vh - 64px)',
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: '#fafafa'
					}}
				>
					<Box
						sx={{
							flexGrow: 1,
							overflow: 'auto',
							p: { xs: 2, sm: 2.5, md: 3 },
							display: 'flex',
							flexDirection: 'column',
							'&::-webkit-scrollbar': { width: '6px' },
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: 'rgba(0,0,0,0.2)',
								borderRadius: '3px'
							}
						}}
					>
						<Breadcrumbs permissions={permissions} />

						<Box
							sx={{
								flexGrow: 1,
								position: 'relative',
								minHeight: 0,
								overflow: 'visible'
							}}
						>
							<GlobalLoader />
							<Outlet />
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default MainLayout;

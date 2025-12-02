import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import ModernTopBar from '../../components/common/TopBar/ModernTopBar';
import { useAuth } from '../../contexts/AuthContext';
import { RoleProvider } from '../../contexts/RoleContext';

/**
 * MinimalLayout - Simplified, no more session checks
 * Uses AuthContext for session data
 */

const MinimalLayout = () => {
	const { session } = useAuth();

	return (
		<RoleProvider sessionData={session}>
			<Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
				<ModernTopBar onMenuToggle={() => {}} drawerOpen={false} />
				<Box sx={{ py: 6, px: 2 }}>
					<Outlet />
				</Box>
			</Box>
		</RoleProvider>
	);
};

const MinimalLayoutWrapper = () => {
	return <MinimalLayout />;
};

export default MinimalLayoutWrapper;

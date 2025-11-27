import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import BackdropLoader from '../../components/third-party/BackdropLoader';
import SessionError from '../../pages/general/SessionError';
import ModernTopBar from '../../components/common/TopBar/ModernTopBar';
import TokenStorage from '../../utils/TokenStorage';
import { useSessionContextQuery } from '../../store/api/auth/session.api';
import { RoleProvider } from '../../contexts/RoleContext';

interface MinimalLayoutProps {
	requiresAuth?: boolean;
}

const MinimalLayout = ({ requiresAuth = true }: MinimalLayoutProps) => {
	const query = useSessionContextQuery(); // ALWAYS call hook

	const { data, isLoading, isError, errorMessage } = query;

	// 🔹 Auth-required mode
	if (requiresAuth) {
		if (isLoading) return <BackdropLoader />;
		if (isError || !data) return <SessionError errMsg={errorMessage} />;

		return (
			<RoleProvider sessionData={data}>
				<MinimalLayoutContent />
			</RoleProvider>
		);
	}

	return (
		<RoleProvider sessionData={data}>
			<MinimalLayoutContent />
		</RoleProvider>
	);
};

const MinimalLayoutContent = () => {
	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
			<ModernTopBar onMenuToggle={() => {}} drawerOpen={false} />
			<Box sx={{ py: 6, px: 2 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default MinimalLayout;

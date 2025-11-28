import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllPermissions } from '../schemas/session.schemas';
import { getInitialScreen } from '../routes/screenHelpers';

/**
 * DashboardRedirect - Redirects to the appropriate initial screen
 * based on user permissions
 */
const DashboardRedirect = () => {
	const { session } = useAuth();

	if (!session) {
		return <Navigate to="/auth/login" replace />;
	}

	const permissions = getAllPermissions(session);
	const initialScreen = getInitialScreen(permissions);

	if (!initialScreen) {
		return <Navigate to="/not-found" replace />;
	}

	return <Navigate to={initialScreen.path} replace />;
};

export default DashboardRedirect;

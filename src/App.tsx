import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRoutes } from 'react-router-dom';

// project import
import ThemeCustomization from './themes';
import ScrollTop from './components/common/ScrollTop';
import { NotificationProvider } from './services/notifications/NotificationProvider';
import { NotificationContainer } from './services/notifications/NotificationContainer';
import { LoadingProvider } from './services/loading/LoadingProvider';
import { AuthGuard } from './components/AuthGuard';
import { routes } from './routes';

import './App.css';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
	return (
		<ThemeCustomization>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<LoadingProvider>
					<NotificationProvider>
						{/* AuthGuard with requireAuth=false provides context without blocking */}
						<AuthGuard requireAuth={false}>
							<ScrollTop>
								<Routes />
							</ScrollTop>
						</AuthGuard>
						<NotificationContainer />
					</NotificationProvider>
				</LoadingProvider>
			</LocalizationProvider>
		</ThemeCustomization>
	);
};

const Routes = () => {
	return useRoutes(routes);
};

export default App;

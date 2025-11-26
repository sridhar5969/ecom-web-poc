import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRoutes } from 'react-router-dom';

// project import
import ThemeCustomization from './themes';
import ScrollTop from './components/common/ScrollTop';
import { NotificationProvider } from './services/notifications/NotificationProvider';
import { NotificationContainer } from './services/notifications/NotificationContainer';
import { LoadingProvider } from './services/loading/LoadingProvider';

import './App.css';
import { useAuthRoutes } from './hooks/useAuthRoutes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
	return (
		<ThemeCustomization>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<LoadingProvider>
					<NotificationProvider>
						<ScrollTop>
							<Routes />
						</ScrollTop>
						<NotificationContainer />
					</NotificationProvider>
				</LoadingProvider>
			</LocalizationProvider>
		</ThemeCustomization>
	);
};

const Routes = () => {
	const r = useAuthRoutes();
	return useRoutes(r);
};

export default App;

import { lazy } from 'react';
import Loadable from '../../components/common/Loadable';
import { Navigate } from 'react-router-dom';
const Login = Loadable(lazy(() => import('../../pages/authentication/Login')));

export const LoginRoutes = {
	path: '/auth',
	// element: <MinimalLayout />,
	children: [
		{ index: true, element: <Login /> },
		{ path: 'login', element: <Login /> },
		{ path: '*', element: <Navigate to="/auth/login" replace /> }
	]
};

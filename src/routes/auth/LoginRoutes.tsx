import { lazy } from 'react';
import Loadable from '../../components/common/Loadable';
import { Navigate } from 'react-router-dom';
const Login = Loadable(lazy(() => import('../../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../../pages/authentication/Register')));

export const LoginRoutes = {
	path: '/auth',
	// element: <MinimalLayout />,
	children: [
		{ index: true, element: <Login /> },
		{ path: 'login', element: <Login /> },
		{ path: 'register', element: <Register /> },
		{ path: '*', element: <Navigate to="/auth/login" replace /> }
	]
};

// Standalone login route
export const StandaloneLoginRoute = {
	path: '/login',
	element: <Login />
};

// Standalone register route
export const StandaloneRegisterRoute = {
	path: '/register',
	element: <Register />
};

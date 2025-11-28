import { createContext, useContext } from 'react';
import { useUserSessionContextQuery } from '../store/api/auth/session.api';

const AuthContext = createContext({
	data: null,
	isLoading: true,
	isError: false,
	errorMessage: null
});

export const AuthProvider = ({ children }) => {
	const session = useUserSessionContextQuery(null, {
		skip: false, // ALWAYS attempt, backend handles cookies
		refetchOnMountOrArgChange: false,
		refetchOnReconnect: false
	});

	return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, ReactNode } from 'react';
import type { SessionData } from '../schemas/session.schemas';

interface AuthContextValue {
	session: SessionData | null;
	isLoading: boolean;
	isError: boolean;
	errorMessage?: string;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
	value: AuthContextValue;
}

export const AuthProvider = ({ children, value }: AuthProviderProps) => {
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

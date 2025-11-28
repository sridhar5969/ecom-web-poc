import { createContext, useContext, useMemo, ReactNode } from 'react';
import type { SessionData } from '../schemas/session.schemas';
import { getAllPermissions } from '../schemas/session.schemas';

interface RoleContextValue {
	// User info
	userId: string | null;
	userName: string;
	userEmail: string | null;

	// Role info
	roleId: number | null;
	roleName: string;

	// Permissions
	permissions: string[];
	hasPermission: (permission: string) => boolean;
	hasAnyPermission: (permissions: string[]) => boolean;
	hasAllPermissions: (permissions: string[]) => boolean;

	// State
	isGuest: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

interface RoleProviderProps {
	children: ReactNode;
	sessionData: SessionData | null;
}

/**
 * RoleProvider - Simplified role and permission management
 * Handles both authenticated users and guests
 */
export const RoleProvider = ({ children, sessionData }: RoleProviderProps) => {
	const isGuest = !sessionData;

	const value: RoleContextValue = useMemo(() => {
		// Guest user
		if (isGuest) {
			return {
				userId: null,
				userName: 'Guest',
				userEmail: null,
				roleId: null,
				roleName: 'guest',
				permissions: [],
				hasPermission: () => false,
				hasAnyPermission: () => false,
				hasAllPermissions: () => false,
				isGuest: true
			};
		}

		// Authenticated user
		const permissions = getAllPermissions(sessionData);

		return {
			userId: sessionData.userId,
			userName: sessionData.userName,
			userEmail: sessionData.userEmail,
			roleId: sessionData.roleId,
			roleName: sessionData.roleName,
			permissions,
			hasPermission: (permission: string) => permissions.includes(permission),
			hasAnyPermission: (perms: string[]) => perms.some(p => permissions.includes(p)),
			hasAllPermissions: (perms: string[]) => perms.every(p => permissions.includes(p)),
			isGuest: false
		};
	}, [sessionData, isGuest]);

	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

/**
 * useRole hook - Access role and permission information
 */
export const useRole = () => {
	const context = useContext(RoleContext);
	if (!context) {
		throw new Error('useRole must be used within RoleProvider');
	}
	return context;
};

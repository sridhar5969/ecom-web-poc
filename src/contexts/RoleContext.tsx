import { useCallback, useMemo } from 'react';
import { RoleContextType, Role, RoleProviderProps } from './RoleContext.types';
import { RoleContext } from './RoleContext.context';

/**
 * RoleProvider
 * Handles both authenticated users and guests (sessionData = null)
 */
export const RoleProvider = ({ children, sessionData }: RoleProviderProps) => {
	// 🔹 If sessionData is null → treat user as "guest"
	const isGuest = !sessionData;
	console.log(sessionData);

	// -----------------------------
	// ROLE
	// -----------------------------
	const currentRole: Role = useMemo(() => {
		if (isGuest) {
			return {
				id: 0,
				name: 'guest',
				permissions: [] // No permissions for guests
			};
		}

		return {
			id: sessionData.id,
			name: sessionData.name,
			permissions: sessionData.permissions ?? []
		};
	}, [isGuest, sessionData]);

	const availableRoles: Role[] = useMemo(() => [currentRole], [currentRole]);

	// -----------------------------
	// USER INFO
	// -----------------------------
	const userInfo = useMemo(() => {
		if (isGuest) {
			return {
				id: null,
				name: 'Guest',
				email: null
			};
		}

		return {
			id: sessionData.id,
			name: sessionData.name,
			email: sessionData.email
		};
	}, [isGuest, sessionData]);

	// -----------------------------
	// SWITCH ROLE (no-op, but safe)
	// -----------------------------
	const switchRole = useCallback((roleId: number) => {
		// Only one role available — do nothing
	}, []);

	// -----------------------------
	// PERMISSIONS
	// -----------------------------
	const getCurrentPermissions = useCallback(() => {
		return currentRole.permissions;
	}, [currentRole.permissions]);

	// -----------------------------
	// CONTEXT VALUE
	// -----------------------------
	const value: RoleContextType = {
		currentRole,
		availableRoles,
		userInfo,
		switchRole,
		getCurrentPermissions
	};

	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

import { z } from 'zod';

/**
 * Session data schema matching the NEW backend structure
 * Backend returns: { userId, userName, userEmail, roleId, roleName, permissions, isGuest }
 */
export const sessionDataSchema = z.object({
	// Use nullable() because 'Guest' users have null IDs and Emails
	userId: z.string().nullable(),
	userName: z.string(),
	userEmail: z.string().email().nullable(),

	// Role ID is null for enum-based roles in your system
	roleId: z.number().nullable(),

	// Use z.string() or a specific enum if you want strict validation on specific role names
	roleName: z.enum(['admin', 'manager', 'customer', 'guest']),

	permissions: z.array(z.string()),

	// New field indicating guest status
	isGuest: z.boolean()
});

export type SessionData = z.infer<typeof sessionDataSchema>;

/**
 * Helper function to extract all permissions from session data
 */
export const getAllPermissions = (sessionData: SessionData): string[] => {
	return sessionData.permissions || [];
};

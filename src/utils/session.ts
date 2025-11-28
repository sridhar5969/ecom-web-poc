import { v4 as uuidv4 } from 'uuid';

export const getOrCreateSessionId = (): string => {
	const KEY = 'shop_guest_session_id';
	let sessionId = localStorage.getItem(KEY);
	if (!sessionId) {
		sessionId = uuidv4();
		localStorage.setItem(KEY, sessionId);
	}
	return sessionId;
};

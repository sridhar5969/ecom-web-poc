import { useOutletContext } from 'react-router-dom';
import type { SessionData } from '../schemas/session.schemas';

export default function useSession(): SessionData {
	return useOutletContext<SessionData>();
}

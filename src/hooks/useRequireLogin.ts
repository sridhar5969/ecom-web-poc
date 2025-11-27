import { useNavigate } from 'react-router-dom';
import { useSessionContextQuery } from '../store/api/auth/session.api';
export const useRequireLogin = () => {
	const navigate = useNavigate();
	const { data: session, isLoading } = useSessionContextQuery();

	return (callback: () => void) => {
		if (isLoading) return;

		if (!session) {
			navigate('/auth/login');
		} else {
			callback();
		}
	};
};

// src/hooks/useLogout.ts
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { logoutApp } from '../store/reducers/actions';
import TokenStorage from '../utils/TokenStorage';
import { useLogoutUserMutation } from '../store/api/auth/auth.api';

export const useLogout = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [logoutUser] = useLogoutUserMutation();

	const logout = async () => {
		try {
			await logoutUser().unwrap(); // 🔹 call backend (also clears tokens via transformResponse)
		} catch (err) {
			console.error('Logout API failed:', err);
			// Clear tokens even if API call fails
			TokenStorage.clearTokens();
		}
		dispatch(logoutApp()); // 🔹 reset Redux
		navigate('/auth/login'); // 🔹 redirect to login
	};

	return logout;
};

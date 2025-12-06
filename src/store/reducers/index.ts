import { combineReducers, AnyAction } from 'redux';
import { LOGOUT, AuthActionTypes } from './actions';
import TokenStorage from '../../utils/TokenStorage';
import { apiSlices } from '../api';

// Auto-discover and register all API reducers
const apiReducers = apiSlices.reduce(
	(acc, api) => {
		acc[api.reducerPath] = api.reducer;
		return acc;
	},
	{} as Record<string, (typeof apiSlices)[number]['reducer']>
);

import authReducer from '../slices/auth.slice';

// Combine ALL reducers from imported slices
const rootReducer = combineReducers({
	auth: authReducer,
	...apiReducers
});

// Handle the LOGOUT action
const appReducer = (state: ReturnType<typeof rootReducer> | undefined, action: AnyAction) => {
	console.log('ACTION FIRED:', action.type);

	if (action.type === LOGOUT) {
		TokenStorage.clearTokens();
		state = undefined;
	}
	return rootReducer(state, action as AuthActionTypes);
};

export default appReducer;

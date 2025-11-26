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

const rootReducer = combineReducers(apiReducers);

// Handle the LOGOUT action
const appReducer = (state: ReturnType<typeof rootReducer> | undefined, action: AnyAction) => {
	if (action.type === LOGOUT) {
		TokenStorage.clearTokens();
		state = undefined;
	}
	return rootReducer(state, action as AuthActionTypes);
};

export default appReducer;

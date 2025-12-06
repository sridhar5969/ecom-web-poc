// third-party
import { Middleware, configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project import
import appReducer from './reducers';
import { apiSlices } from './api';
import { logoutApp } from './reducers/actions';
import { logger } from '../services/logger/logger.service';
import { notificationService } from '../services/notifications/notification.service';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import type { ErrorResponse } from '../types/api.types';
import { isDevelopment } from '../config/env';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

/**
 * RTK Query error handler middleware
 * Shows notifications and dispatches logout on 401 errors
 * Note: Error logging and transformation are handled in baseQuery
 */
export const rtkQueryErrorLogger: Middleware =
	({ dispatch }) =>
		next =>
			action => {
				if (isRejectedWithValue(action)) {
					const { status, data } =
						(action.payload as {
							status?: number;
							data?: ErrorResponse;
							error?: string;
						}) || {};

					// Extract error message from backend ErrorResponse format
					// baseQuery already transforms errors, so data should be ErrorResponse if present
					let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;
					let validationErrors: Record<string, string[]> | undefined;

					if (data && typeof data === 'object' && 'success' in data && data.success === false) {
						errorMessage = data.message;
						validationErrors = data.errors;
					}

					// Handle 401 unauthorized - logout user
					if (status === HTTP_STATUS.UNAUTHORIZED) {
						dispatch(logoutApp());
						logger.warn('Session expired, logging out user', { statusCode: status });
						notificationService.error(ERROR_MESSAGES.SESSION_EXPIRED, 'Session Expired');
					} else {
						// Show error notification with validation errors if present
						if (validationErrors && Object.keys(validationErrors).length > 0) {
							const validationMessages = Object.entries(validationErrors)
								.flatMap(([field, messages]) => messages.map(msg => `${field}: ${msg}`))
								.join('\n');
							const message =
								validationMessages.length > 200
									? `${errorMessage}\n\n${validationMessages.substring(0, 200)}...`
									: `${errorMessage}\n\n${validationMessages}`;
							notificationService.error(message, 'Validation Error');
						} else {
							notificationService.error(errorMessage, 'Error');
						}
					}
				}
				return next(action);
			};

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: isDevelopment(),
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		}).concat([
			// Auto-register all API middleware
			...apiSlices.map(api => api.middleware),
			rtkQueryErrorLogger
		] as Middleware[])
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

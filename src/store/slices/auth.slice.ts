import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/auth/auth.api';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            const { accessToken, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.loginUser.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ 3. Auth Slice Matcher received payload:', payload);
                    const { accessToken, refreshToken } = payload;
                    if (accessToken) {
                        state.accessToken = accessToken;
                        console.log('✅ 4. Redux State updated with Access Token');
                    }
                    if (refreshToken) {
                        state.refreshToken = refreshToken;
                    }
                }
            )
            .addMatcher(
                authApi.endpoints.registerUser.matchFulfilled,
                (state, { payload }) => {
                    const { accessToken, refreshToken } = payload;
                    if (accessToken) {
                        state.accessToken = accessToken;
                    }
                    if (refreshToken) {
                        state.refreshToken = refreshToken;
                    }
                }
            );
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.accessToken;

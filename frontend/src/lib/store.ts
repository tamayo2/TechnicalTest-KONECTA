import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api';
import { salesApi } from '../features/sales/api';
import { usersApi } from '../features/users/api';
import { statsApi } from '../features/stats/api';
import authReducer from '../features/auth/authSlice';
import { loadAuth, saveAuth } from './authPersist';
import { errorToastMiddleware } from './errorToastMiddleware';

const preloaded = loadAuth();

export const store = configureStore({
    preloadedState: { auth: preloaded },
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [salesApi.reducerPath]: salesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        auth: authReducer,
    },
    middleware: (gDM) =>
        gDM().concat(
            authApi.middleware,
            salesApi.middleware,
            usersApi.middleware,
            statsApi.middleware,
            errorToastMiddleware
        ),
});

let prev = store.getState().auth;
store.subscribe(() => {
    const cur = store.getState().auth;
    if (cur !== prev) { saveAuth(cur as any); prev = cur; }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
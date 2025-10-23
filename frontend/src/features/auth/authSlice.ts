import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type User = { id: number; name: string; email: string; role: 'ADMIN' | 'ADVISOR' };
type AuthState = { user: User | null; access: string; refresh: string };

const initialState: AuthState = { user: null, access: '', refresh: '' };

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (s, a: PayloadAction<{ user: User; access: string; refresh: string }>) => {
            s.user = a.payload.user; s.access = a.payload.access; s.refresh = a.payload.refresh;
        },
        logout: (s) => { s.user = null; s.access = ''; s.refresh = ''; },
    },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
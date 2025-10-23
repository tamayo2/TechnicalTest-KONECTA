export type PersistAuth = { user:any|null; access:string; refresh:string };

const KEY = 'konecta-auth';

export const loadAuth = (): PersistAuth => {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : { user:null, access:'', refresh:'' };
    } catch { return { user:null, access:'', refresh:'' }; }
};

export const saveAuth = (auth: PersistAuth) => {
    try { localStorage.setItem(KEY, JSON.stringify(auth)); } catch {}
};

export const clearAuth = () => { try { localStorage.removeItem(KEY); } catch {} };
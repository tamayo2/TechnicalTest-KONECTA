import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/authSlice';

export default function App(){
    const user = useSelector((s:any)=>s.auth.user);
    const dispatch = useDispatch();
    const nav = useNavigate();

    return (
        <div className="min-h-screen">
            <header className="flex items-center justify-between p-4 border-b bg-white">
                <nav className="flex gap-4">
                    <Link to="/ventas" className="underline">Ventas</Link>
                    {user?.role === 'ADMIN' && <Link to="/usuarios" className="underline">Usuarios</Link>}
                </nav>
                <div className="flex items-center gap-3">
                    <span className="text-sm">{user?.name} ({user?.role})</span>
                    <button className="text-sm underline"
                            onClick={()=>{ dispatch(logout()); nav('/login'); }}>
                        Salir
                    </button>
                </div>
            </header>
            <main className="p-6"><Outlet/></main>
        </div>
    );
}
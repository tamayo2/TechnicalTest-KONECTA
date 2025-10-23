import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from './api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;
export default function Login() {
    const { register, handleSubmit, formState:{errors} } = useForm<FormData>({ resolver: zodResolver(schema) });
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaToken, setCaptchaToken] = useState('');
    const onSubmit = async (data: FormData) => {
        if (!captchaToken) return;
        const res = await login({ ...data, captchaToken }).unwrap();
        dispatch(setCredentials(res));
        nav('/ventas');
    };
    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-3">
                <h1 className="text-2xl font-semibold mb-2">Iniciar sesión</h1>
                <input className="border p-2 w-full" placeholder="Email" {...register('email')} />
                <input className="border p-2 w-full" placeholder="Contraseña" type="password" {...register('password')} />
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
                    onChange={(token) => setCaptchaToken(token || '')}
                    onExpired={() => setCaptchaToken('')}
                />
                <button
                    className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-60"
                    disabled={!captchaToken || isLoading}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                <p className="text-sm text-red-600">{Object.values(errors)[0]?.message as any}</p>
            </form>
        </div>
    );
}
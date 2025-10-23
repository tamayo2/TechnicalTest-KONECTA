import axios from 'axios';

export async function verifyCaptcha(token: string) {
    if (process.env.CAPTCHA_BYPASS === 'true') return; // sólo DEV
    const provider = process.env.CAPTCHA_PROVIDER;
    const secret = process.env.CAPTCHA_SECRET!;
    if (!secret) throw Object.assign(new Error('Captcha secreto no configurado'), { status: 500 });

    if (provider === 'HCAPTCHA') {
        const { data } = await axios.post('https://hcaptcha.com/siteverify',
            new URLSearchParams({ secret, response: token }));
        if (!data.success) throw Object.assign(new Error('Captcha inválido'), { status: 400 });
    } else {
        const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({ secret, response: token }));
        if (!data.success) throw Object.assign(new Error('Captcha inválido'), { status: 400 });
    }
}
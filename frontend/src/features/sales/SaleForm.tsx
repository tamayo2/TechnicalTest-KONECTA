import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMutation, useUpdateMutation } from './api';
import { useEffect, useState } from 'react';
const saleSchema = z.object({
    product: z.enum(['CONSUMO','LIBRANZA','TARJETA_CREDITO']),
    cupoSolicitado: z.string().regex(/^\d{1,17}(?:\.\d{1,2})?$/, 'Cupo inválido'),
    franchise: z.enum(['AMEX','VISA','MASTERCARD']).optional(),
    tasa: z.string().regex(/^\d{1,2}\.[0-9]{2}$/,'Formato 10.58').optional(),
}).superRefine((v,ctx)=>{
    if (v.product === 'TARJETA_CREDITO' && !v.franchise) {
        ctx.addIssue({ code:'custom', message:'Franquicia es obligatoria para Tarjeta de Crédito', path:['franchise'] });
    }
    if ((v.product === 'CONSUMO' || v.product === 'LIBRANZA') && !v.tasa) {
        ctx.addIssue({ code:'custom', message:'Tasa es obligatoria para Consumo/Libranza', path:['tasa'] });
    }
});
type FormData = z.infer<typeof saleSchema>;

const unformat = (s:string) => s.replace(/[.\s,]/g, '');
const formatMiles = (s:string) => {
    const clean = unformat(s);
    if (!clean) return '';
    return Number(clean).toLocaleString();
};
export default function SaleForm({ editing, initial, onDone }:{
    editing?: boolean; initial?: any; onDone?: ()=>void
}){
    const [create] = useCreateMutation();
    const [update] = useUpdateMutation();
    const { register, handleSubmit, watch, reset, setValue, formState:{errors} } =
        useForm<FormData>({ resolver: zodResolver(saleSchema), defaultValues: initial ?? { product:'CONSUMO' } });
    const product = watch('product');

    const [cupoVis, setCupoVis] = useState('');
    useEffect(()=>{
        if (initial?.cupoSolicitado != null) {
            setCupoVis(formatMiles(String(initial.cupoSolicitado)));
            setValue('cupoSolicitado', String(initial.cupoSolicitado));
        } else {
            setCupoVis('');
        }
    }, [initial, setValue]);
    const onCupoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (!/^[\d.,\s]*$/.test(v)) return;
        setCupoVis(formatMiles(v));
        setValue('cupoSolicitado', String(unformat(v)), { shouldValidate: true });
    };
    const onSubmit = async (data: FormData) => {
        if (editing && initial?.id) {
            await update({ id: initial.id, body: data }).unwrap();
            onDone?.();
        } else {
            await create(data).unwrap();
            reset({ product:'CONSUMO', cupoSolicitado:'', tasa:'', franchise:undefined });
            setCupoVis('');
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-5 gap-2 items-end">
            <select className="border p-2" {...register('product')}>
                <option value="CONSUMO">Crédito de Consumo</option>
                <option value="LIBRANZA">Libranza Libre Inversión</option>
                <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
            </select>

            <input
                className="border p-2"
                placeholder="Cupo (1.000.000)"
                value={cupoVis}
                onChange={onCupoChange}
            />
            <input type="hidden" {...register('cupoSolicitado')} />
            {product === 'TARJETA_CREDITO' ? (
                <select className="border p-2" {...register('franchise')}>
                    <option value="AMEX">AMEX</option>
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                </select>
            ) : (
                <input className="border p-2" placeholder="Tasa (10.58)" {...register('tasa')} />
            )}
            <button className="bg-black text-white px-4 py-2 rounded">{editing?'Guardar':'Crear'}</button>
            <div className="col-span-5 text-sm text-red-600">
                {Object.values(errors)[0]?.message as any}
            </div>
        </form>
    );
}
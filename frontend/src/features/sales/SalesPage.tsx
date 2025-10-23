import { useListQuery, useRemoveMutation } from './api';
import SaleForm from './SaleForm';
import { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import Stats from '../stats/Stats';
import SaleDetail from './SaleDetail';
export default function SalesPage(){
    const { data, isLoading } = useListQuery();
    const [remove] = useRemoveMutation();
    const [editing, setEditing] = useState<any|null>(null);
    const [viewId, setViewId] = useState<number|null>(null);
    if (isLoading) return <div>Cargando...</div>;
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Productos Radicados</h2>
                <div className="text-sm">Sumatoria cupo: <b>{formatCurrency(data?.totalCupo||0)}</b></div>
            </div>
            <Stats />
            <SaleForm
                editing={!!editing}
                initial={editing ?? undefined}
                onDone={()=>setEditing(null)}
            />
            <table className="w-full border">
                <thead>
                <tr className="bg-gray-50">
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-left">Cupo</th>
                    <th className="p-2 text-left">Fecha</th>
                    <th className="p-2 text-left">Creado por</th>
                    <th className="p-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {data?.list?.map((s:any) => (
                    <tr key={s.id} className="border-t">
                        <td className="p-2">
                            {s.product === 'CONSUMO' ? 'Crédito de Consumo'
                                : s.product === 'LIBRANZA' ? 'Libranza Libre Inversión'
                                    : 'Tarjeta de Crédito'}
                        </td>
                        <td className="p-2">{formatCurrency(s.cupoSolicitado)}</td>
                        <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                        <td className="p-2">{s.createdBy?.name}</td>
                        <td className="p-2 flex gap-3 justify-center">
                            <button className="underline" onClick={()=>setViewId(s.id)}>Ver</button>
                            <button className="underline" onClick={()=>setEditing(s)}>Editar</button>
                            <button className="text-red-600 underline" onClick={()=>remove(s.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {viewId && <SaleDetail id={viewId} onClose={()=>setViewId(null)} />}
        </div>
    );
}
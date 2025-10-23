import { useEffect, useState } from 'react';

export default function Stats(){
    const [data,setData] = useState<any>(null);

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_API_URL}/stats/summary`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('konecta-auth') ? JSON.parse(localStorage.getItem('konecta-auth')!).access : ''}` }
        }).then(r=>r.json()).then(setData).catch(()=>{});
    },[]);

    if (!data) return null;
    return (
        <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">Ventas por asesor</div>
                <div className="text-lg font-semibold">{data.porAsesor?.length}</div>
            </div>
            <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">Productos diferentes</div>
                <div className="text-lg font-semibold">{data.porProducto?.length}</div>
            </div>
            <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">Días con ventas</div>
                <div className="text-lg font-semibold">{data.porFecha?.length}</div>
            </div>
        </div>
    );
}
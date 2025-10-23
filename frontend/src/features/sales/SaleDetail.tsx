import { useGetQuery } from './api';

export default function SaleDetail({ id, onClose }: { id:number; onClose:()=>void }) {
    const { data, isLoading } = useGetQuery(id);

    if (isLoading) return (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
            <div className="bg-white rounded-xl shadow p-5 w-full max-w-md">Cargando…</div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
            <div className="bg-white rounded-xl shadow p-5 w-full max-w-md">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Detalle de venta #{data.id}</h3>
                    <button className="text-sm underline" onClick={onClose}>Cerrar</button>
                </div>
                <div className="space-y-2 text-sm">
                    <div><b>Producto:</b> {data.product}</div>
                    <div><b>Cupo:</b> {Number(data.cupoSolicitado).toLocaleString()}</div>
                    {data.franchise && <div><b>Franquicia:</b> {data.franchise}</div>}
                    {(data.tasa != null) && <div><b>Tasa:</b> {String(data.tasa)}</div>}
                    <div><b>Estado:</b> {data.status}</div>
                    <div><b>Creado:</b> {new Date(data.createdAt).toLocaleString()} por {data.createdBy?.name}</div>
                    <div><b>Actualizado:</b> {new Date(data.updatedAt).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
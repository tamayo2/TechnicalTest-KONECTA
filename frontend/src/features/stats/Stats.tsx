import { useSummaryQuery } from './api';
import StatsChart from "./StatsChart.tsx";

const card = 'p-3 border rounded bg-white shadow-sm';

export default function Stats() {
    const { data, isFetching, isError } = useSummaryQuery();

    if (isFetching) {
        return <div className="text-sm text-gray-500">Cargando métricas…</div>;
    }

    if (isError || !data) {
        return (
            <div className="p-3 border rounded bg-amber-50 text-amber-800 text-sm">
                No se pudieron cargar las métricas. Verifica que /api/stats/summary responda 200 y que tengas sesión.
            </div>
        );
    }

    const totalVentas = data.porAsesor.reduce((acc, x) => acc + (x._count?._all || 0), 0);
    const totalCupo = data.porProducto.reduce((acc, x) => acc + Number(x._sum?.cupoSolicitado || 0), 0);

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className={card}>
                <div className="text-xs text-gray-500">Ventas totales</div>
                <div className="text-xl font-semibold">{totalVentas.toLocaleString()}</div>
            </div>
            <div className={card}>
                <div className="text-xs text-gray-500">Cupo total</div>
                <div className="text-xl font-semibold">{Number(totalCupo).toLocaleString()}</div>
            </div>
            <div className={card}>
                <div className="text-xs text-gray-500">Asesores con ventas</div>
                <div className="text-xl font-semibold">{data.porAsesor.length}</div>
            </div>
            <div className={card}>
                <div className="text-xs text-gray-500">Productos distintos</div>
                <div className="text-xl font-semibold">{data.porProducto.length}</div>
            </div>
            <StatsChart />
        </div>
    );
}
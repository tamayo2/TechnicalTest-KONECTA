import { useSummaryQuery } from './api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsChart(){
    const { data, isFetching } = useSummaryQuery();
    if (isFetching || !data) return null;

    const rows = data.porProducto.map(p => ({
        name:
            p.product === 'CONSUMO' ? 'Consumo' :
                p.product === 'LIBRANZA' ? 'Libranza' : 'Tarjeta',
        cupo: Number(p._sum?.cupoSolicitado || 0)
    }));

    return (
        <div className="p-3 border rounded bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-2">Cupo total por producto</div>
            <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                    <BarChart data={rows}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cupo" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
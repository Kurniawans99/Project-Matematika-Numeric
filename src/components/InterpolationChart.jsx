import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export function InterpolationChart({ data, points }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Grafik Interpolasi</h2>
      <div className="h-64 md:h-96 bg-gray-900 rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={["dataMin", "dataMax"]} 
              tickFormatter={v => v.toFixed(1)}
              stroke="#9CA3AF"
            />
            <YAxis 
              domain={["dataMin", "dataMax"]} 
              tickFormatter={v => v.toFixed(1)}
              stroke="#9CA3AF"
            />
            <Tooltip 
              formatter={v => [v.toFixed(4), 'y']} 
              labelFormatter={l => `x: ${l.toFixed(4)}`}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#EAB308" 
              strokeWidth={2}
              dot={false} 
              isAnimationActive={false} 
              name="Kurva Interpolasi" 
            />
            {points.map((pt, i) => (
              <Line 
                key={i} 
                data={[pt]} 
                dataKey="y" 
                dot={{ r: 6, stroke: '#DC2626', strokeWidth: 2, fill: '#EF4444' }} 
                strokeWidth={0} 
                isAnimationActive={false} 
                name={`Titik (${pt.x},${pt.y})`} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
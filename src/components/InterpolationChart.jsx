import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function InterpolationChart({ data, points }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Grafik Interpolasi</h2>
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={v => v.toFixed(1)}/>
            <YAxis domain={["dataMin", "dataMax"]} tickFormatter={v => v.toFixed(1)}/>
            <Tooltip formatter={v => [v.toFixed(4), 'y']} labelFormatter={l => `x: ${l.toFixed(4)}`}/>
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} name="Interpolasi" />
            {points.map((pt, i) => (
              <Line key={i} data={[pt]} dataKey="y" dot={{ r: 5, stroke: '#ff0000', strokeWidth: 2, fill: '#ff0000' }} strokeWidth={0} isAnimationActive={false} name={`(${pt.x},${pt.y})`} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
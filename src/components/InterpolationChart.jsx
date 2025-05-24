import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function InterpolationChart({
  data,
  points,
  resultPoint,
  viewDomainX,
  viewDomainY,
  chartWrapperRef,
  isInteractionActive,
  isPanning,
  onMouseDown,
  onMouseMove,
  onMouseUpOrLeave,
  onWheel
}) {
  const validPoints = points.filter(pt => typeof pt.x === 'number' && typeof pt.y === 'number' && !isNaN(pt.x) && !isNaN(pt.y));

  const getCursorValue = () => {
    if (!isInteractionActive) return 'pointer'; 
    if (isPanning) return 'grabbing';
    return 'grab';
  };

  const wrapperDivStyle = {
    touchAction: 'none',
  };

  const lineChartStyle = {
    cursor: getCursorValue(),
  };

  return (
    <div className="bg-gray-800 p-2 sm:p-4 rounded-lg border border-gray-700 h-full flex flex-col">
      <div
        ref={chartWrapperRef}
        onMouseDown={isInteractionActive ? onMouseDown : undefined}
        onMouseMove={isInteractionActive ? onMouseMove : undefined}
        onMouseUp={isInteractionActive ? onMouseUpOrLeave : undefined}
        onMouseLeave={isInteractionActive ? onMouseUpOrLeave : undefined}
        onWheel={isInteractionActive ? onWheel : undefined}
        className="flex-grow bg-gray-900 rounded-lg p-1 sm:p-2 select-none overflow-hidden"
        style={wrapperDivStyle} 
      >
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 25, left: 15, bottom: 15 }}
              style={lineChartStyle} 
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="x" type="number" domain={viewDomainX} allowDataOverflow={true}
                tickFormatter={v => typeof v === 'number' ? v.toFixed(1) : ''} stroke="#9CA3AF" scale="linear"
              />
              <YAxis
                domain={viewDomainY} allowDataOverflow={true}
                tickFormatter={v => typeof v === 'number' ? v.toFixed(1) : ''} stroke="#9CA3AF" scale="linear"
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }}/>
              <Line type="monotone" dataKey="y" stroke="#EAB308" strokeWidth={2} dot={false} isAnimationActive={false} name="Kurva Interpolasi" />
              {validPoints.map((pt, i) => (
                <Line key={`input-pt-${i}`} data={[{ x: Number(pt.x), y: Number(pt.y) }]} type="basis" dataKey="y"
                  dot={{ r: 6, stroke: '#DC2626', strokeWidth: 2, fill: '#EF4444' }} stroke="transparent" activeDot={{ r: 8 }}
                  isAnimationActive={false} name={`Titik (${Number(pt.x).toFixed(1)},${Number(pt.y).toFixed(1)})`} />
              ))}
              {resultPoint && typeof resultPoint.x === 'number' && typeof resultPoint.y === 'number' && (
                 <Line key="result-point" data={[{ x: Number(resultPoint.x), y: Number(resultPoint.y) }]} type="basis" dataKey="y"
                  dot={{ r: 7, stroke: '#10B981', strokeWidth: 2, fill: '#34D399' }} stroke="transparent" activeDot={{ r: 9 }}
                  isAnimationActive={false} name={`Hasil (${Number(resultPoint.x).toFixed(1)}, ${Number(resultPoint.y).toFixed(1)})`} />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Data tidak cukup untuk menampilkan grafik.
          </div>
        )}
      </div>
    </div>
  );
}
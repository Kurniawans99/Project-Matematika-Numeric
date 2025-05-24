import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

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

  // Fungsi untuk mendapatkan tick kustom untuk sumbu X
  const getCustomXTicks = () => {
    const xValues = new Set(); // Menggunakan Set untuk menghindari duplikasi secara otomatis

    // Tambahkan nilai x dari points
    points.forEach(p => {
      const numX = parseFloat(p.x);
      if (!isNaN(numX)) {
        xValues.add(numX);
      }
    });

    // Tambahkan nilai x dari resultPoint
    if (resultPoint) {
      const numResX = parseFloat(resultPoint.x);
      if (!isNaN(numResX)) {
        xValues.add(numResX);
      }
    }

    // Jika tidak ada nilai x spesifik, kembalikan undefined agar Recharts menggunakan logika default
    if (xValues.size === 0) {
      return undefined;
    }

    // Ubah Set menjadi array dan urutkan
    return Array.from(xValues).sort((a, b) => a - b);
  };

  const customXTicks = getCustomXTicks();

  // Persiapkan props untuk XAxis
  const xAxisProps = {
    dataKey: "x",
    type: "number",
    domain: viewDomainX, // Pastikan viewDomainX mencakup semua customXTicks
    allowDataOverflow: true,
    tickFormatter: v => (typeof v === 'number' ? v.toFixed(1) : ''),
    stroke: "#9CA3AF",
    scale: "linear",
    axisLine: { stroke: '#D1D5DB', strokeWidth: 2 },
    tick: { fill: '#9CA3AF' },
  };

  // Tambahkan prop ticks jika customXTicks ada
  if (customXTicks && customXTicks.length > 0) {
    xAxisProps.ticks = customXTicks;
  }
  // Jika customXTicks kosong atau undefined, XAxis akan menggunakan tick generation default.

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
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              style={lineChartStyle}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis {...xAxisProps}>
                <Label value="Sumbu X" offset={-20} position="insideBottom" fill="#9CA3AF" />
              </XAxis>
              <YAxis
                domain={viewDomainY}
                allowDataOverflow={true}
                tickFormatter={v => typeof v === 'number' ? v.toFixed(1) : ''}
                stroke="#9CA3AF"
                scale="linear"
                axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                tick={{ fill: '#9CA3AF' }}
              >
                <Label value="Sumbu Y" angle={-90} offset={0} position="insideLeft" fill="#9CA3AF" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
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
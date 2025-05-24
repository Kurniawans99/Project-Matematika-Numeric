export function PointsInput({ points, onChange, onAdd, onRemove }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Data Input</h2>
      {points.map((point, idx) => (
        <div key={idx} className="flex items-center space-x-3 mb-3">
          <label className="text-gray-300 w-16">Point {idx + 1}:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              step="any"
              value={point.x}
              onChange={(e) => onChange(idx, "x", parseFloat(e.target.value) || 0)}
              className="border border-gray-600 rounded p-2 w-20 bg-gray-700 text-white focus:border-yellow-500 focus:outline-none"
              placeholder="x"
            />
            <input
              type="number"
              step="any"
              value={point.y}
              onChange={(e) => onChange(idx, "y", parseFloat(e.target.value) || 0)}
              className="border border-gray-600 rounded p-2 w-20 bg-gray-700 text-white focus:border-yellow-500 focus:outline-none"
              placeholder="y"
            />
          </div>
          <button
            onClick={() => onRemove(idx)}
            disabled={points.length <= 2}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-black font-medium p-2 px-4 rounded transition-colors"
      >
        + Tambah Titik
      </button>
    </div>
  );
}
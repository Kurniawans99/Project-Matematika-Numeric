export function InterpolationForm({ targetX, onChange, onCalculate, result }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Hitung Nilai Interpolasi</h2>
      <div className="flex items-center space-x-3 mb-4">
        <label className="text-gray-300">Nilai x:</label>
        <input
          type="number"
          step="any"
          value={targetX}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="border border-gray-600 rounded p-2 w-28 bg-gray-700 text-white focus:border-yellow-500 focus:outline-none"
        />
        <button 
          onClick={onCalculate} 
          className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium p-2 px-4 rounded transition-colors"
        >
          Hitung
        </button>
      </div>
      {result !== null && (
        <div className="bg-gray-700 border border-yellow-600 p-4 rounded-lg">
          <p className="text-white">
            P({targetX}) = <span className="text-white font-bold">{result.toFixed(6)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
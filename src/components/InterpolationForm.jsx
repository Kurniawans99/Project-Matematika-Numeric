import React from 'react';

export function InterpolationForm({ targetX, onChange, onCalculate, result }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Hitung Nilai Interpolasi</h2>
      <div className="flex items-center space-x-2">
        <label>Nilai x:</label>
        <input
          type="number"
          step="any"
          value={targetX}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="border rounded p-2 w-28"
        />
        <button onClick={onCalculate} className="bg-green-500 text-white p-2 rounded">Hitung</button>
      </div>
      {result !== null && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <p>P({targetX}) = <strong>{result.toFixed(6)}</strong></p>
        </div>
      )}
    </div>
  );
}
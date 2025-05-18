import React from "react";

export function PointsInput({ points, onChange, onAdd, onRemove }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Data Input</h2>
      {points.map((point, idx) => (
        <div key={idx} className="flex items-center space-x-2 mb-2">
          <label>Point {idx + 1}:</label>
          <input
            type="number"
            step="any"
            value={point.x}
            onChange={(e) => onChange(idx, "x", parseFloat(e.target.value))}
            className="border rounded p-2 w-20"
          />
          <input
            type="number"
            step="any"
            value={point.y}
            onChange={(e) => onChange(idx, "y", parseFloat(e.target.value))}
            className="border rounded p-2 w-20"
          />
          <button
            onClick={() => onRemove(idx)}
            disabled={points.length <= 2}
            className="bg-red-500 text-white p-2 rounded"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        + Tambah Titik
      </button>
    </div>
  );
}

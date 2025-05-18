import React from 'react';

export function FormulaDisplay({ formula }) {
  if (!formula) return null;
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Rumus Polinom Lagrange:</h2>
      <pre className="bg-white p-2 rounded border overflow-x-auto text-sm font-mono">{formula}</pre>
    </div>
  );
}
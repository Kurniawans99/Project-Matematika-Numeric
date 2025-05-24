// FormulaDisplay Component
export function FormulaDisplay({ formula }) {
  if (!formula) return null;
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-white">Rumus Polinom Lagrange:</h2>
      <div className="bg-gray-900 border border-gray-600 p-3 rounded overflow-x-auto">
        <pre className="text-sm font-mono text-white whitespace-pre-wrap">{formula}</pre>
      </div>
    </div>
  );
}
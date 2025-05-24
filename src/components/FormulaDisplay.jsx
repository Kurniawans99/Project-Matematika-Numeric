import katex from 'katex'; // Impor KaTeX
import { useEffect, useRef } from 'react';
export function FormulaDisplay({ formula }) {
  const formulaRef = useRef();

  useEffect(() => {
    if (formulaRef.current && formula) {
      try {
        katex.render(formula, formulaRef.current, {
          throwOnError: false, 
          displayMode: true, 
     
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        formulaRef.current.textContent = formula;
      }
    } else if (formulaRef.current) {
      formulaRef.current.textContent = '';
    }
  }, [formula]); // Jalankan ulang efek ini ketika prop 'formula' berubah

  if (!formula) return null; // Jangan render apa pun jika tidak ada formula

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Rumus Polinom Lagrange:</h2>
      <div className="bg-gray-900 border border-gray-600 p-4 rounded overflow-x-auto">
        <div ref={formulaRef} className="text-white text-lg"></div> {/* Tambahkan class untuk styling */}
      </div>
    </div>
  );
}
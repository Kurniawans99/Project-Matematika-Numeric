import React from 'react';

export function About() {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Tentang Interpolasi Polinom Lagrange</h2>
      <p>Interpolasi polinom Lagrange adalah metode untuk mencari polinom dengan derajat (n-1) yang melalui n titik data.</p>
      <pre className="bg-white p-2 rounded border mt-2 font-mono">
P(x) = Σ yᵢ Lᵢ(x)
Lᵢ(x) = ∏ (x - xⱼ)/(xᵢ - xⱼ)
      </pre>
    </div>
  );
}
export function About() {
  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-white">Tentang Interpolasi Polinom Lagrange</h2>
      <p className="text-gray-300 mb-4">
        Interpolasi polinom Lagrange adalah metode untuk mencari polinom dengan derajat (n-1) yang melalui n titik data yang diberikan.
      </p>
      <div className="bg-gray-900 border border-gray-600 p-4 rounded">
        <pre className="font-mono text-white text-sm">
{`P(x) = Σ yᵢ Lᵢ(x)

dimana:
Lᵢ(x) = ∏ (x - xⱼ)/(xᵢ - xⱼ)
        j≠i`}
        </pre>
      </div>
    </div>
  );
}
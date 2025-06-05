import { InlineMath, BlockMath } from 'react-katex';

export function About() {
  const PxFormula = `P(x) = \\sum_{i} y_i L_i(x)`;
  const LxFormula = `L_i(x) = \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}`;

  return (
    <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Tentang Interpolasi Polinom Lagrange
      </h2>

      <p className="text-gray-300 mb-4 text-base leading-relaxed">
        Interpolasi polinom Lagrange adalah metode untuk menemukan sebuah polinom unik  
        dengan derajat terkecil (biasanya <InlineMath math="n-1" /> untuk {' '}    
         <InlineMath math="n " />  titik data) yang melewati semua titik data yang diberikan.  
        Metode ini menggunakan kombinasi linear dari polinom basis Lagrange {' '} 
        <InlineMath math=" L_i(x)" />.
      </p>

      <div className="bg-gray-900 border border-gray-600 p-4 rounded space-y-4">
        {/* block formula P(x) */}
        <BlockMath math={PxFormula} />

        <p className="text-gray-300 text-base">
          dimana <InlineMath math="L_i(x)" /> adalah polinom basis Lagrange:
        </p>

        {/* block formula L_i(x) */}
        <BlockMath math={LxFormula} />
      </div>

     <p className="text-gray-400 mt-4 text-sm">
        Setiap polinom basis <InlineMath math={`L_i(x)`} /> memiliki sifat{' '}
        <InlineMath math={`L_i(x_k) = 1 \\text{ jika } k = i`} /> dan{' '}
        <InlineMath math={`L_i(x_k) = 0 \\text{ jika } j \\neq i`} />. Ini memastikan
        bahwa polinom <InlineMath math={`P(x)`} /> yang dihasilkan akan
        melewati setiap titik <InlineMath math={`(x_i, y_i)`} />.
      </p>
    </div>
  );
}

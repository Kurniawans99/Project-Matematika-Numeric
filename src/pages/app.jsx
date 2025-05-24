// Impor yang mungkin sudah ada di LagrangeInterpolation.jsx
import { useState, useEffect } from 'react';
import { evaluateLagrangePolynomial, generateLagrangeFormulaTex } from '../utils/lagrange';
import { PointsInput } from '../components/PointsInput';
import { InterpolationForm } from '../components/InterpolationForm';
import { FormulaDisplay } from '../components/FormulaDisplay'; // Pastikan path ini benar
import { InterpolationChart } from '../components/InterpolationChart';
import { About } from '../components/About';
import 'katex/dist/katex.min.css';

export default function LagrangeInterpolation() {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 }
  ]);
  const [targetX, setTargetX] = useState(1.5);
  const [result, setResult] = useState(null);
  const [formula, setFormula] = useState('');
  const [chartData, setChartData] = useState([]);

  const updatePoints = (idx, field, value) => {
    const updated = points.map((pt, i) => i === idx ? { ...pt, [field]: value } : pt);
    setPoints(updated);
  };

  const addPoint = () => setPoints([...points, { x: 0, y: 0 }]);

  const removePoint = idx => {
    if (points.length > 2) {
      setPoints(points.filter((_, i) => i !== idx));
    }
  };

  const generateChartDataForComponent = () => {
    if (points.length < 2) return [];
    const xs = points.map(p => p.x);
    const minX = Math.min(...xs) - 2;
    const maxX = Math.max(...xs) + 2;
    const numSteps = 200;
    const stepSize = (maxX - minX) / numSteps;
    const data = Array.from({ length: numSteps + 1 }, (_, i) => {
      const x = minX + i * stepSize;
      const y = evaluateLagrangePolynomial(x, points);
      return { x, y };
    });
    return data;
  };

  const calculate = () => {
    if (points.length === 0) {
      setResult(null);
      setFormula('');
      setChartData([]);
      return;
    }

    const calculatedValue = evaluateLagrangePolynomial(targetX, points);
    setResult(calculatedValue);

    const formulaTex = generateLagrangeFormulaTex(points);
    setFormula(formulaTex);

    setChartData(generateChartDataForComponent());
  };

  useEffect(() => {
  
    if (points.length > 0) {
      calculate();
    } else {
      // Reset jika tidak ada poin
      setResult(null);
      setFormula('');
      setChartData([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, targetX]); 

  useEffect(() => {
    if (points.length > 0) {
      calculate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dijalankan sekali saat mount

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            INTERPOLASI POLINOM
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-2"></div>
          <p className="text-yellow-400 font-medium tracking-wider">METODE LAGRANGE</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <PointsInput
              points={points}
              onChange={updatePoints}
              onAdd={addPoint}
              onRemove={removePoint}
            />
            <InterpolationForm
              targetX={targetX}
              onChange={setTargetX}
              onCalculate={calculate}
              result={result}
            />
            <FormulaDisplay formula={formula} />
          </div>

          {/* Right Column */}
          <div>
            <InterpolationChart data={chartData} points={points} />
          </div>
        </div>
        <About />
      </div>
    </div>
  );
}
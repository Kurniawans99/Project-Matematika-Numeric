import { useState, useEffect } from 'react';
import { lagrangeInterpolation } from '../utils/lagrange';
import { PointsInput } from '../components/PointsInput';
import { InterpolationForm } from '../components/InterpolationForm';
import { FormulaDisplay } from '../components/FormulaDisplay';
import { InterpolationChart } from '../components/InterpolationChart';
import { About } from '../components/About';

export default function LagrangeInterpolation() {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 4 }]);
  const [targetX, setTargetX] = useState(1.5);
  const [result, setResult] = useState(null);
  const [formula, setFormula] = useState('');
  const [chartData, setChartData] = useState([]);

  const updatePoints = (idx, field, value) => {
    const updated = points.map((pt, i) => i === idx ? { ...pt, [field]: value } : pt);
    setPoints(updated);
  };

  const addPoint = () => setPoints([...points, { x: 0, y: 0 }]);
  const removePoint = idx => setPoints(points.length > 2 ? points.filter((_, i) => i !== idx) : points);

  const generateChartData = () => {
    if (points.length < 2) return [];
    const xs = points.map(p => p.x);
    const minX = Math.min(...xs) - 1;
    const maxX = Math.max(...xs) + 1;
    const data = Array.from({ length: 101 }, (_, i) => {
      const x = minX + (i / 100) * (maxX - minX);
      const y = lagrangeInterpolation(x, points);
      return { x, y };
    });
    return [...data, ...points.map(p => ({ ...p, isOriginal: true }))];
  };

  const calculate = () => {
    const val = lagrangeInterpolation(targetX, points);
    setResult(val);
    // build formula string
    const terms = points.map((pt, i) => {
      const num = `(${pt.y}`;
      const factors = points.filter((_, j) => i !== j)
        .map(pj => `(x - ${pj.x})/(${pt.x} - ${pj.x})`)
        .join(' * ');
      return `${num} * ${factors})`;
    });
    setFormula(`P(x) = ${terms.join(' + ')}`);
    setChartData(generateChartData());
  };

  useEffect(() => setChartData(generateChartData()), [points]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Interpolasi Polinom Lagrange</h1>
      <div className="grid md:grid-cols-2 gap-6">
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
        <InterpolationChart data={chartData} points={points} />
      </div>
      <About />
    </div>
  );
}
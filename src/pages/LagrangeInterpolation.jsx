import { useState, useEffect } from 'react';
import { lagrangeUtils } from '../utils/lagrange';
import { PointsInput } from '../components/PointsInput';
import { InterpolationForm } from '../components/InterpolationForm';
import { FormulaDisplay } from '../components/FormulaDisplay';
import { InterpolationChart } from '../components/InterpolationChart';
import { About } from '../components/About';

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

  const generateChartData = () => {
    if (points.length < 2) return [];
    const xs = points.map(p => p.x);
    const minX = Math.min(...xs) - 2;
    const maxX = Math.max(...xs) + 2;
    const data = Array.from({ length: 201 }, (_, i) => {
      const x = minX + (i / 200) * (maxX - minX);
      const y = lagrangeUtils(x, points);
      return { x, y };
    });
    return data;
  };

  const calculate = () => {
    const val = lagrangeUtils(targetX, points);
    setResult(val);
    
    // Build formula string
    const terms = points.map((pt, i) => {
      const factors = points
        .filter((_, j) => i !== j)
        .map(pj => `(x - ${pj.x})/(${pt.x} - ${pj.x})`)
        .join(' × ');
      return `${pt.y} × [${factors}]`;
    });
    setFormula(`P(x) = ${terms.join(' + ')}`);
    setChartData(generateChartData());
  };

  useEffect(() => {
    setChartData(generateChartData());
  }, [points]);

  useEffect(() => {
    calculate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            INTERPOLASI POLINOM
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-2"></div>
          <p className="text-yellow-400 font-medium tracking-wider">LAGRANGE METHOD</p>
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
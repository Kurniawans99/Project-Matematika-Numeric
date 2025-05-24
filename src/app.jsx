import React, { useState, useEffect, useCallback } from 'react';
import { evaluateLagrangePolynomial, generateLagrangeFormulaTex } from './utils/lagrange';
import { PointsInput } from './components/PointsInput';
import { InterpolationForm } from './components/InterpolationForm';
import { FormulaDisplay } from './components/FormulaDisplay';
import { ChartContainer } from './components/ChartContainer';
import { About } from './components/About';
import 'katex/dist/katex.min.css';

export default function App() {
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
  
  const generateChartDataForComponent = useCallback(() => {
    if (points.length < 2) return [];
    const numericPoints = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
                              .filter(p => !isNaN(p.x) && !isNaN(p.y));
    if (numericPoints.length < 2) return [];

    const xs = numericPoints.map(p => p.x);
    const sortedPoints = [...numericPoints].sort((a, b) => a.x - b.x);
    const minXInput = Math.min(...xs);
    const maxXInput = Math.max(...xs);
    
    const rangePadding = Math.max(1, (maxXInput - minXInput) * 0.2); 
    const minX = minXInput - rangePadding;
    const maxX = maxXInput + rangePadding;

    const numSteps = 200;
    const stepSize = (maxX - minX) / numSteps;
    
    const data = Array.from({ length: numSteps + 1 }, (_, i) => {
      const x = minX + i * stepSize;
      const y = evaluateLagrangePolynomial(x, sortedPoints);
      return { x, y };
    });
    return data;
  }, [points]);

  const calculate = useCallback(() => {
    const numericPoints = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));
    if (points.length === 0 || numericPoints.some(p => isNaN(p.x) || isNaN(p.y))) {
      setResult(null); 
      setFormula(''); 
      setChartData([]);
      return;
    }
    
    const numericTargetX = parseFloat(targetX);
    if (isNaN(numericTargetX)) {
      setResult(null); 
      setFormula('Error: Target X tidak valid.'); 
      setChartData([]);
      return;
    }
    
    const calculatedValue = evaluateLagrangePolynomial(numericTargetX, numericPoints);
    setResult(calculatedValue);
    
    const formulaTex = generateLagrangeFormulaTex(numericPoints);
    setFormula(formulaTex);
    
    const newChartData = generateChartDataForComponent();
    setChartData(newChartData);
  }, [points, targetX, generateChartDataForComponent]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">INTERPOLASI POLINOM</h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-2"></div>
          <p className="text-yellow-400 font-medium tracking-wider">METODE LAGRANGE</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PointsInput points={points} onChange={updatePoints} onAdd={addPoint} onRemove={removePoint} />
            <InterpolationForm targetX={targetX} onChange={setTargetX} onCalculate={calculate} result={result} />
            <FormulaDisplay formula={formula} />
          </div>

          {/* Kolom Kanan untuk Grafik */}
          <div>
            <ChartContainer 
              points={points}
              targetX={targetX}
              result={result}
              chartData={chartData}
            />
          </div>
        </div>
        <About />
      </div>
    </div>
  );
}
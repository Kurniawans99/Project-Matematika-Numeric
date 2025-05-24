import { useState, useRef, useCallback } from 'react';

export function useChartInteraction() {
  const chartWrapperRef = useRef(null);
  const [isChartInteractionActive, setIsChartInteractionActive] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState({ x: 0, y: 0 });
  const [panStartDomain, setPanStartDomain] = useState({ x: ['auto', 'auto'], y: ['auto', 'auto'] });

  const handleChartMouseDown = useCallback((event, setViewDomainX, setViewDomainY) => {
    if (!isChartInteractionActive || event.button !== 0) return;
    event.preventDefault();
    setIsPanning(true);
    setPanStartCoords({ x: event.clientX, y: event.clientY });
    setViewDomainX(currentXDomain => {
      setViewDomainY(currentYDomain => {
        setPanStartDomain({ x: currentXDomain, y: currentYDomain });
        return currentYDomain;
      });
      return currentXDomain;
    });
  }, [isChartInteractionActive]);

  const handleChartMouseMove = useCallback((event, setViewDomainX, setViewDomainY) => {
    if (!isChartInteractionActive || !isPanning || !chartWrapperRef.current) return;
    event.preventDefault();
    const chartRect = chartWrapperRef.current.getBoundingClientRect();
    const chartWidth = chartRect.width;
    const chartHeight = chartRect.height;
    if (chartWidth <= 0 || chartHeight <= 0) return;
    const deltaX = event.clientX - panStartCoords.x;
    const deltaY = event.clientY - panStartCoords.y;
    
    if(panStartDomain.x[0] === 'auto' || panStartDomain.y[0] === 'auto') return;

    const domainRangeX = panStartDomain.x[1] - panStartDomain.x[0];
    const dataDeltaX = (deltaX / chartWidth) * domainRangeX;
    const domainRangeY = panStartDomain.y[1] - panStartDomain.y[0];
    const dataDeltaY = (-deltaY / chartHeight) * domainRangeY;

    setViewDomainX([panStartDomain.x[0] - dataDeltaX, panStartDomain.x[1] - dataDeltaX]);
    setViewDomainY([panStartDomain.y[0] - dataDeltaY, panStartDomain.y[1] - dataDeltaY]);
  }, [isChartInteractionActive, isPanning, panStartCoords, panStartDomain]);

  const handleChartMouseUpOrLeave = useCallback(() => {
    if (isPanning) setIsPanning(false);
  }, [isPanning]);

  const handleChartWheel = useCallback((event, setViewDomainX, setViewDomainY) => {
    if (!isChartInteractionActive || !chartWrapperRef.current) return;
    event.preventDefault();
    
    const zoomIntensity = 0.1;
    const direction = event.deltaY < 0 ? 1 : -1;

    setViewDomainX(([min, max]) => {
      if (typeof min !== 'number' || typeof max !== 'number') return ['auto', 'auto'];
      const range = max - min;
      if (range <= 0.0001 && direction === 1) return [min,max]; 
      const change = range * zoomIntensity * direction;
      const newMin = min + change / 2;
      const newMax = max - change / 2;
      return newMin < newMax ? [newMin, newMax] : [min,max];
    });
    setViewDomainY(([min, max]) => {
      if (typeof min !== 'number' || typeof max !== 'number') return ['auto', 'auto'];
      const range = max - min;
      if (range <= 0.0001 && direction === 1) return [min,max];
      const change = range * zoomIntensity * direction;
      const newMin = min + change / 2;
      const newMax = max - change / 2;
      return newMin < newMax ? [newMin, newMax] : [min,max];
    });
  }, [isChartInteractionActive]);

  return {
    chartWrapperRef,
    isChartInteractionActive,
    setIsChartInteractionActive,
    isPanning,
    handleChartMouseDown,
    handleChartMouseMove,
    handleChartMouseUpOrLeave,
    handleChartWheel
  };
}


export function useChartModal() {
  const [isChartMaximized, setIsChartMaximized] = useState(false);

  const handleOpenMaximizedChart = useCallback((points, targetX, result, chartData, calculateInitialDomains, setIsChartInteractionActive) => {
    if (!isChartMaximized) {
      // Reset view domain ke kondisi awal setiap kali membuka tampilan penuh
      const numericPoints = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) })).filter(p => !isNaN(p.x) && !isNaN(p.y));
      const numericTargetXVal = parseFloat(targetX);
      const numericResultVal = parseFloat(result);
      calculateInitialDomains(numericPoints, chartData, numericTargetXVal, numericResultVal);

      setIsChartMaximized(true);
      setIsChartInteractionActive(true);
    }
  }, [isChartMaximized]);

  const handleCloseMaximizedChart = useCallback((setIsChartInteractionActive) => {
    setIsChartMaximized(false);
    setIsChartInteractionActive(false);
  }, []);

  const handleResetViewMaximized = useCallback((points, targetX, result, chartData, calculateInitialDomains, isChartInteractionActive) => {
    if (isChartInteractionActive) {
      const numericPoints = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) })).filter(p => !isNaN(p.x) && !isNaN(p.y));
      const numericTargetXVal = parseFloat(targetX);
      const numericResultVal = parseFloat(result);
      calculateInitialDomains(numericPoints, chartData, numericTargetXVal, numericResultVal);
    }
  }, []);

  return {
    isChartMaximized,
    handleOpenMaximizedChart,
    handleCloseMaximizedChart,
    handleResetViewMaximized
  };
}

export function useChartDomain() {
  const [viewDomainX, setViewDomainX] = useState(['auto', 'auto']);
  const [viewDomainY, setViewDomainY] = useState(['auto', 'auto']);
  const defaultPadding = 1;

  const calculateInitialDomains = useCallback((currentPoints, currentChartData, currentTargetX, currentResultY) => {
    if (currentPoints.length === 0 && currentChartData.length === 0) {
      setViewDomainX(['auto', 'auto']);
      setViewDomainY(['auto', 'auto']);
      return;
    }
    
    let allXValues = currentPoints.map(p => p.x).filter(v => typeof v === 'number' && !isNaN(v));
    let allYValues = currentPoints.map(p => p.y).filter(v => typeof v === 'number' && !isNaN(v));

    if(currentChartData == null || currentChartData == undefined){
        return;
    }

    if (currentChartData.length > 0) {
      allXValues = [...allXValues, ...currentChartData.map(d => d.x).filter(v => typeof v === 'number' && !isNaN(v))];
      allYValues = [...allYValues, ...currentChartData.map(d => d.y).filter(v => typeof v === 'number' && !isNaN(v))];
    }
    
    if (currentTargetX !== null && currentResultY !== null && 
        typeof currentTargetX === 'number' && typeof currentResultY === 'number' && 
        !isNaN(currentTargetX) && !isNaN(currentResultY)) {
      allXValues.push(currentTargetX);
      allYValues.push(currentResultY);
    }
    
    if (allXValues.length === 0 || allYValues.length === 0) {
      setViewDomainX(['auto', 'auto']);
      setViewDomainY(['auto', 'auto']);
      return;
    }
    
    const minX = Math.min(...allXValues);
    const maxX = Math.max(...allXValues);
    const minY = Math.min(...allYValues);
    const maxY = Math.max(...allYValues);
    const xRange = maxX - minX;
    const yRange = maxY - minY;
    const paddingX = xRange === 0 ? defaultPadding : xRange * 0.1;
    const paddingY = yRange === 0 ? defaultPadding : yRange * 0.1;
    
    setViewDomainX([minX - paddingX, maxX + paddingX]);
    setViewDomainY([minY - paddingY, maxY + paddingY]);
  }, [defaultPadding]);

  return {
    viewDomainX,
    viewDomainY,
    setViewDomainX,
    setViewDomainY,
    calculateInitialDomains
  };
}
import React, { useCallback, useEffect, useMemo } from 'react';
import { InterpolationChart } from './InterpolationChart';
import { useChartDomain, useChartInteraction, useChartModal } from '../hooks/useChartLogic';

export function ChartContainer({ points, targetX, result, chartData }) {
  const {
    viewDomainX,
    viewDomainY,
    setViewDomainX,
    setViewDomainY,
    calculateInitialDomains
  } = useChartDomain();

  const {
    chartWrapperRef,
    isChartInteractionActive,
    setIsChartInteractionActive,
    isPanning,
    handleChartMouseDown,
    handleChartMouseMove,
    handleChartMouseUpOrLeave,
    handleChartWheel
  } = useChartInteraction();

  const {
    isChartMaximized,
    handleOpenMaximizedChart,
    handleCloseMaximizedChart,
    handleResetViewMaximized
  } = useChartModal();

  useEffect(() => {
    if (!isChartMaximized && points.length >= 2 && chartData && chartData.length > 0) {
      const numericPoints = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
                                .filter(p => !isNaN(p.x) && !isNaN(p.y));
      const resultPoint = result !== null && targetX !== null && !isNaN(parseFloat(result)) && !isNaN(parseFloat(targetX))
                        ? { x: parseFloat(targetX), y: parseFloat(result) } : null;
      
      if (numericPoints.length >= 2) {
        calculateInitialDomains(numericPoints, resultPoint, chartData);
      }
    }
  }, [points, targetX, result, chartData, isChartMaximized, calculateInitialDomains]);

  const onOpenMaximizedChart = useCallback(() => {
    handleOpenMaximizedChart(points, targetX, result, chartData, calculateInitialDomains, setIsChartInteractionActive);
  }, [handleOpenMaximizedChart, points, targetX, result, chartData, calculateInitialDomains, setIsChartInteractionActive]);

  const onCloseMaximizedChart = useCallback(() => {
    handleCloseMaximizedChart(setIsChartInteractionActive);
  }, [handleCloseMaximizedChart, setIsChartInteractionActive]);

  const onResetViewMaximized = useCallback(() => {
    handleResetViewMaximized(points, targetX, result, chartData, calculateInitialDomains, isChartInteractionActive);
  }, [handleResetViewMaximized, points, targetX, result, chartData, calculateInitialDomains, isChartInteractionActive]);

  const onChartMouseDown = useCallback((event) => {
    handleChartMouseDown(event, setViewDomainX, setViewDomainY);
  }, [handleChartMouseDown, setViewDomainX, setViewDomainY]);

  const onChartMouseMove = useCallback((event) => {
    handleChartMouseMove(event, setViewDomainX, setViewDomainY);
  }, [handleChartMouseMove, setViewDomainX, setViewDomainY]);

  const onChartWheel = useCallback((event) => {
    handleChartWheel(event, setViewDomainX, setViewDomainY);
  }, [handleChartWheel, setViewDomainX, setViewDomainY]);

  const numericPointsForChart = points.map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));
  const resultPointForChart = result !== null && targetX !== null && !isNaN(parseFloat(result)) && !isNaN(parseFloat(targetX))
                           ? { x: parseFloat(targetX), y: parseFloat(result) } : null;

  const commonChartProps = {
    data: chartData,
    points: numericPointsForChart,
    resultPoint: resultPointForChart,
  };

  const interactiveChartHandlers = {
    onMouseDown: onChartMouseDown,
    onMouseMove: onChartMouseMove,
    onMouseUpOrLeave: handleChartMouseUpOrLeave,
    onWheel: onChartWheel,
  };

  const previewChartKey = useMemo(() => {
    const domainXString = viewDomainX ? JSON.stringify(viewDomainX) : 'undefined';
    const domainYString = viewDomainY ? JSON.stringify(viewDomainY) : 'undefined';
    const pointsString = JSON.stringify(numericPointsForChart.map(p => ({x: p.x, y: p.y})));
    const chartDataLength = chartData ? chartData.length : 0;
    return `preview-${domainXString}-${domainYString}-${pointsString}-${chartDataLength}`;
  }, [viewDomainX, viewDomainY, numericPointsForChart, chartData]);

  return (
    <>
      {/* Grafik Normal (Preview) */}
      {!isChartMaximized && (
        <div 
          className="border border-gray-700 rounded-lg p-1 hover:border-yellow-500 transition-colors"
          onClick={onOpenMaximizedChart}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onOpenMaximizedChart()}
        >
          <div className="w-full h-120"> 
            {viewDomainX && viewDomainY && chartData && chartData.length > 0 && numericPointsForChart.length >= 2 ? (
              <InterpolationChart
                key={previewChartKey}
                {...commonChartProps}
                viewDomainX={viewDomainX}
                viewDomainY={viewDomainY}
                chartWrapperRef={null}
                isInteractionActive={false}
                isPanning={false}
                cursorStyle={'pointer'} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                Data belum cukup atau sedang memuat grafik pratinjau...
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 w-full text-center py-2 cursor-pointer">
            Klik area grafik untuk memperbesar dan mengaktifkan mode interaksi.
          </p>
        </div>
      )}

      {/* Tampilan Penuh Grafik  */}
      {isChartMaximized && (
         <div 
         className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
         onClick={onCloseMaximizedChart}
       >
         <div 
           className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-2xl w-[95vw] h-[90vh] sm:w-[90vw] sm:h-[90vh] md:w-[85vw] md:h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}
         >
           <div className="flex justify-between items-center mb-2">
             <h3 className="text-lg sm:text-xl font-semibold text-white">Grafik Interpolasi (Interaktif)</h3>
             <button
               onClick={onCloseMaximizedChart}
               className="text-gray-300 hover:text-white text-2xl sm:text-3xl leading-none p-1"
               aria-label="Tutup tampilan penuh"
             >
               &times;
             </button>
           </div>
           <div className="flex-grow h-0 min-h-0 relative">
             <InterpolationChart
               {...commonChartProps}
               viewDomainX={viewDomainX}
               viewDomainY={viewDomainY}
               chartWrapperRef={chartWrapperRef}
               isInteractionActive={isChartInteractionActive}
               isPanning={isPanning}
               {...interactiveChartHandlers}
             />
           </div>
           <div className="mt-2 sm:mt-3 flex justify-center">
             <button 
               onClick={onResetViewMaximized} 
               className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded text-sm sm:text-base"
             >
               Reset View
             </button>
           </div>
         </div>
       </div>
      )}
    </>
  );
}
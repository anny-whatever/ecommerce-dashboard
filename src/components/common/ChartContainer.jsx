// src/components/common/ChartContainer.jsx
import { useEffect, useState, useRef } from "react";

const ChartContainer = ({
  children,
  height = 300,
  fallback = "Loading chart...",
  className = "",
}) => {
  const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initial measure
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || height,
      });

      // Use timeout to ensure React has time to render
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      // Setup resize observer for responsive behavior
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height || height,
          });
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        clearTimeout(timer);
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={`chart-container ${className}`}
      style={{
        height: `${height}px`,
        width: "100%",
        position: "relative",
        minHeight: `${height}px`,
      }}
    >
      {!isReady && (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-500">{fallback}</p>
        </div>
      )}
      {isReady && dimensions.width > 0 && children}
    </div>
  );
};

export default ChartContainer;

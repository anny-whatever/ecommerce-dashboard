// src/components/common/ChartWrapper.jsx
import { useEffect, useState } from "react";

/**
 * A wrapper component to ensure charts render properly
 * Solves common issues with chart rendering:
 * - Ensures minimum height/width
 * - Delays rendering until after component mount
 * - Handles empty data gracefully
 */
const ChartWrapper = ({ children, fallback, minHeight = 300 }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          height: minHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight, width: "100%", position: "relative" }}>
      {children || fallback || <p>No data available</p>}
    </div>
  );
};

export default ChartWrapper;

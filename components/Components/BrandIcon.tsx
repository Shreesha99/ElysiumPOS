import React, { useEffect, useState } from "react";

interface BrandIconProps {
  size?: number;
  animated?: boolean;
  strokeWidth?: number;
}

const BrandIcon: React.FC<BrandIconProps> = ({
  size = 100,
  animated = false,
  strokeWidth = 8,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animated) {
      setAnimate(true);
    }
  }, [animated]);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Top Line */}
      <line
        x1="20"
        y1="20"
        x2="80"
        y2="20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={animate ? "brand-line brand-line-1" : ""}
      />

      {/* Middle Line */}
      <line
        x1="20"
        y1="50"
        x2="70"
        y2="50"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={animate ? "brand-line brand-line-2" : ""}
      />

      {/* Bottom Line */}
      <line
        x1="20"
        y1="80"
        x2="80"
        y2="80"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={animate ? "brand-line brand-line-3" : ""}
      />
    </svg>
  );
};

export default BrandIcon;

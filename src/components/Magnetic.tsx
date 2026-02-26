import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number; scale?: number; className?: string }> = ({ children, strength = 8, scale = 1.015, className = "inline-block" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const s = useMotionValue(1);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springS = useSpring(s, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * (strength / (width / 2)));
    y.set(distanceY * (strength / (height / 2)));
    s.set(scale);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    s.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, scale: springS }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

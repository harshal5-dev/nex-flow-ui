import { useState, useEffect } from "react";

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target, 10) || 0;

  useEffect(() => {
    if (numericTarget === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(numericTarget / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, numericTarget);
      setCount(current);
      if (current >= numericTarget) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [numericTarget]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;

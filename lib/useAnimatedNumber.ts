"use client";
import { useEffect, useRef, useState } from "react";

/** target로 부드럽게 카운트업(ease-out cubic). prefers-reduced-motion이면 즉시. */
export function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      let p = Math.min(1, (t - start) / duration);
      p = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

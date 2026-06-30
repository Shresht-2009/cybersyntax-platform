"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(trailX, { stiffness: 120, damping: 20 });
  const springY = useSpring(trailY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [cursorX, cursorY, trailX, trailY]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: cursorX,
          top: cursorY,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent-cyan)",
          boxShadow: "0 0 12px var(--accent-cyan), 0 0 32px rgba(0,212,255,0.3)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s, height 0.15s, background 0.15s",
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[99998]"
        style={{
          left: springX,
          top: springY,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(0,212,255,0.15)",
          background: "rgba(0,212,255,0.03)",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 24px rgba(0,212,255,0.04)",
        }}
      />
    </>
  );
}

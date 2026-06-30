"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

const TRAIL_COUNT = 6;
const CLICK_BURST_COUNT = 8;

export function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);
  const isHovering = useMotionValue(0);

  const [clickBursts, setClickBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const clickIdRef = useRef(0);
  const hiddenRef = useRef(false);

  const springX = useSpring(trailX, { stiffness: 80, damping: 16 });
  const springY = useSpring(trailY, { stiffness: 80, damping: 16 });

  const dotSize = useTransform(isHovering, [0, 1], [8, 16]);
  const ringSize = useTransform(isHovering, [0, 1], [40, 60]);
  const ringOpacity = useTransform(isHovering, [0, 1], [1, 0.6]);

  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  const handleMouse = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    trailX.set(e.clientX);
    trailY.set(e.clientY);

    for (let i = TRAIL_COUNT - 1; i > 0; i--) {
      trailPositions.current[i] = { ...trailPositions.current[i - 1] };
    }
    trailPositions.current[0] = { x: e.clientX, y: e.clientY };

    const target = e.target as HTMLElement;
    const isInteractive = target.tagName === "BUTTON" || target.tagName === "A" || target.tagName === "INPUT" ||
      target.tagName === "SELECT" || target.tagName === "TEXTAREA" || target.closest("button") ||
      target.closest("a") || target.closest('[role="button"]') || target.closest(".card") ||
      target.closest(".nav-link") || target.closest(".stat-card");
    isHovering.set(isInteractive ? 1 : 0);
    hiddenRef.current = false;
  }, [cursorX, cursorY, trailX, trailY, isHovering]);

  const handleClick = useCallback((e: MouseEvent) => {
    const id = clickIdRef.current++;
    setClickBursts((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setClickBursts((prev) => prev.filter((b) => b.id !== id)), 700);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("click", handleClick);
    };
  }, [handleMouse, handleClick]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: cursorX,
          top: cursorY,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "var(--accent-emerald)",
          boxShadow: "0 0 12px var(--accent-emerald), 0 0 32px rgba(16,185,129,0.3)",
          transform: "translate(-50%, -50%)",
          transition: "background 0.15s, box-shadow 0.15s",
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[99998]"
        style={{
          left: springX,
          top: springY,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1px solid rgba(16,185,129,0.15)",
          background: "rgba(16,185,129,0.03)",
          transform: "translate(-50%, -50%)",
          opacity: ringOpacity,
          boxShadow: "0 0 24px rgba(16,185,129,0.04)",
        }}
      />
      {Array.from({ length: TRAIL_COUNT - 1 }).map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-[99997]"
          style={{
            width: 4 - i * 0.4,
            height: 4 - i * 0.4,
            borderRadius: "50%",
            background: `rgba(16,185,129,${0.08 - i * 0.012})`,
            transform: "translate(-50%, -50%)",
            left: trailPositions.current[i]?.x ?? -100,
            top: trailPositions.current[i]?.y ?? -100,
          }}
        />
      ))}
      {clickBursts.map((burst) => (
        <ClickBurst key={burst.id} x={burst.x} y={burst.y} />
      ))}
    </>
  );
}

function ClickBurst({ x, y }: { x: number; y: number }) {
  return (
    <>
      {Array.from({ length: CLICK_BURST_COUNT }).map((_, i) => {
        const angle = (i / CLICK_BURST_COUNT) * 360;
        const dist = 20 + Math.random() * 16;
        return (
          <motion.div
            key={i}
            className="pointer-events-none fixed z-[99996]"
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "var(--accent-emerald)",
              left: x,
              top: y,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              opacity: 0,
              scale: 1.5,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
}

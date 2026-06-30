"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  opacity: number; hue: number;
  baseOpacity: number;
}

interface BurstParticle {
  x: number; y: number; size: number;
  vx: number; vy: number;
  opacity: number; hue: number;
  life: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const burstRef = useRef<BurstParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const scrollSpeedRef = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const handleClick = (e: MouseEvent) => {
      const count = 18 + Math.floor(Math.random() * 12);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360 + Math.random() * 30;
        const speed = 1.5 + Math.random() * 3;
        burstRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: 1.5 + Math.random() * 2.5,
          vx: Math.cos((angle * Math.PI) / 180) * speed,
          vy: Math.sin((angle * Math.PI) / 180) * speed,
          opacity: 0.8,
          hue: Math.random() > 0.5 ? 160 : Math.random() > 0.5 ? 45 : 340,
          life: 1,
        });
      }
    };
    window.addEventListener("click", handleClick);

    const handleScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY.current);
      scrollSpeedRef.current = Math.min(dy, 15) / 15;
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      baseOpacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 160 : Math.random() > 0.5 ? 45 : 340,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const scrollBoost = 1 + scrollSpeedRef.current * 2;
      timeRef.current += 0.005;
      scrollSpeedRef.current *= 0.95;

      const hueCycle = 160 + Math.sin(timeRef.current * 0.3) * 30;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x -= dx * force * 0.002;
          p.y -= dy * force * 0.002;
        }

        p.x += p.speedX * scrollBoost;
        p.y += p.speedY * scrollBoost;
        p.opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(timeRef.current * 2 + i));

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 120) {
            const lineOpacity = (1 - dist2 / 120) * 0.12;
            const throb = 0.7 + 0.3 * Math.sin(timeRef.current * 3 + i + j);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${hueCycle}, 80%, 60%, ${lineOpacity * throb})`;
            ctx.stroke();
          }
        }
      }

      const bursts = burstRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.03;
        b.life -= 0.015;
        b.opacity = b.life * 0.8;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${b.hue}, 80%, 60%, ${b.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

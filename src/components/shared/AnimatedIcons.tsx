"use client";

import { motion } from "framer-motion";

interface IconProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

export function ShieldIcon({ size = 24, color = "var(--accent-emerald)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={animated ? { scale: [1, 1.04, 1] } : undefined}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </motion.svg>
  );
}

export function ChartIcon({ size = 24, color = "var(--accent-gold)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.rect
        x="4" y="14" width="4" height="6" rx="1"
        animate={animated ? { height: [6, 10, 6], y: [14, 10, 14] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.rect
        x="10" y="10" width="4" height="10" rx="1"
        animate={animated ? { height: [10, 14, 10], y: [10, 6, 10] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.rect
        x="16" y="6" width="4" height="14" rx="1"
        animate={animated ? { height: [14, 18, 14], y: [6, 2, 6] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </motion.svg>
  );
}

export function GraphIcon({ size = 24, color = "var(--accent-rose)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        animate={animated ? { pathLength: [0, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function UsersIcon({ size = 24, color = "var(--accent-emerald)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle
        cx="9" cy="7" r="4"
        animate={animated ? { scale: [1, 1.06, 1] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
        animate={animated ? { d: ["M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"] } : undefined}
      />
      <motion.circle
        cx="17" cy="8" r="3"
        animate={animated ? { scale: [1, 1.06, 1] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.path
        d="M21 21v-2a3 3 0 00-3-3"
        animate={animated ? { d: ["M21 21v-2a3 3 0 00-3-3"] } : undefined}
      />
    </motion.svg>
  );
}

export function BookIcon({ size = 24, color = "var(--accent-gold)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={animated ? { rotate: [0, -2, 0, 2, 0] } : undefined}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </motion.svg>
  );
}

export function CodeIcon({ size = 24, color = "var(--accent-emerald)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={animated ? { opacity: [0.8, 1, 0.8] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </motion.svg>
  );
}

export function BrainIcon({ size = 24, color = "var(--accent-gold)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M9.5 2A2.5 2.5 0 0112 4.5V6M14.5 2A2.5 2.5 0 0012 4.5V6m-4 8a2 2 0 100 4 2 2 0 000-4zm0 0V6m0 8a2 2 0 110 4 2 2 0 010-4zM12 6v6m0 0a2 2 0 102 2m-2-2a2 2 0 11-2 2"
        animate={animated ? { pathLength: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function DollarIcon({ size = 24, color = "var(--accent-rose)", animated = true }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.line
        x1="12" y1="1" x2="12" y2="23"
        animate={animated ? { y1: [2, 4, 2], y2: [22, 20, 22] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        animate={animated ? { d: ["M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"] } : undefined}
      />
    </motion.svg>
  );
}

export function AnimatedIcon({
  icon,
  size = 24,
  color,
  animated = true,
}: IconProps & { icon: "shield" | "chart" | "graph" | "users" | "book" | "code" | "brain" | "dollar" }) {
  const icons = {
    shield: ShieldIcon,
    chart: ChartIcon,
    graph: GraphIcon,
    users: UsersIcon,
    book: BookIcon,
    code: CodeIcon,
    brain: BrainIcon,
    dollar: DollarIcon,
  };
  const Component = icons[icon];
  return <Component size={size} color={color} animated={animated} />;
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/mentor/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/mentor/announcements", label: "Announcements", icon: AnnounceIcon },
  { href: "/mentor/applications", label: "Applications", icon: AppIcon },
  { href: "/mentor/students", label: "Students", icon: StudentsIcon },
  { href: "/mentor/courses", label: "Courses", icon: CourseIcon },
  { href: "/mentor/assignments", label: "Assignments", icon: AssignIcon },
  { href: "/mentor/chat", label: "Chat", icon: ChatIcon },
  { href: "/mentor/finance", label: "Finance", icon: FinanceIcon },
];

const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

const pageTransition = { type: "spring" as const, stiffness: 80, damping: 14 };

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative" style={{ background: 'var(--bg-deep)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--accent-emerald), transparent)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, var(--accent-gold), transparent)' }}
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 w-64 hidden lg:flex flex-col card-glass" style={{ borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', borderRadius: 0 }}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/mentor/dashboard" className="flex items-center gap-2.5">
            <CyberLogo />
            <span className="text-lg font-bold text-gradient tracking-tight">Mentor Portal</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`}>
                <item.icon active={active} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => signOut()} className="btn-ghost flex items-center gap-3 px-3 py-2.5 w-full" style={{ color: 'var(--accent-red)' }}>
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 card-glass" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="p-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
            <HamburgerIcon />
          </button>
          <span className="text-lg font-bold text-gradient">Mentor Portal</span>
          <div className="w-10" />
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
            <motion.aside variants={sidebarVariants} initial="hidden" animate="visible" exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-y-0 left-0 w-64 card-glass flex flex-col" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none' }}>
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-lg font-bold text-gradient">Mentor Portal</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                  <CloseIcon />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
                    <item.icon active={pathname === item.href} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => signOut()} className="btn-ghost flex items-center gap-3 px-3 py-2.5 w-full" style={{ color: 'var(--accent-red)' }}>
                  <LogoutIcon />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={pageTransition}>
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function CyberLogo() {
  return (
    <motion.svg width="28" height="28" viewBox="0 0 32 32" fill="none"
      whileHover={{ rotate: 45, scale: 1.1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#g)" strokeWidth="2" />
      <path d="M16 8L16 24M8 16L24 16" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="url(#g)" />
      <defs><linearGradient id="g" x1="4" y1="4" x2="28" y2="28"><stop stopColor="#10b981" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
    </motion.svg>
  );
}

function DashboardIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></motion.svg>; }
function AnnounceIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></motion.svg>; }
function AppIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></motion.svg>; }
function StudentsIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></motion.svg>; }
function CourseIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></motion.svg>; }
function AssignIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></motion.svg>; }
function ChatIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></motion.svg>; }
function FinanceIcon({ active }: { active: boolean }) { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></motion.svg>; }
function LogoutIcon() { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.15 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></motion.svg>; }
function HamburgerIcon() { return <motion.svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ scale: 1.1 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></motion.svg>; }
function CloseIcon() { return <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" whileHover={{ rotate: 90 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></motion.svg>; }

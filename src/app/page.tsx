"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes drop { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(200%); opacity: 0; } }`;
    document.head.appendChild(styleSheet);

    // HERO TIMELINE
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
    });
    heroTl.to("#heroTitle1", { x: "-30vw", opacity: 0 }, 0)
      .to("#heroTitle2", { x: "30vw", opacity: 0 }, 0)
      .to("#heroGrid", { scale: 2, opacity: 0 }, 0)
      .to("#scrollIndicator", { opacity: 0 }, 0);

    // ======================= CYBERSECURITY =======================
    const cyberTl = gsap.timeline({
      scrollTrigger: { trigger: "#cyber", start: "top top", end: "+=1400%", pin: true, scrub: 1 }
    });

    cyberTl.to(".m1", { y: "300vh", duration: 22 }, 0)
      .to(".m2", { y: "300vh", duration: 18 }, 0)
      .fromTo(".cyber-bg-text-1", { x: "-20vw" }, { x: "15vw", duration: 22 }, 0)
      .fromTo(".cyber-bg-text-2", { x: "20vw" }, { x: "-15vw", duration: 22 }, 0);

    cyberTl.to(".cyber-hex", { strokeDashoffset: 0, duration: 1 }, 0)
      .to(".cyber-eye", { strokeDashoffset: 0, duration: 0.5 }, 0.5)
      .to(".cyber-crosshair", { strokeDashoffset: 0, duration: 0.5 }, 1.0)
      .to(".cyber-ring-1", { rotation: 360, transformOrigin: "50% 50%", duration: 4 }, 0)
      .to(".cyber-ring-2", { rotation: -360, transformOrigin: "50% 50%", duration: 4 }, 0)
      .fromTo(".cyber-core-text", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 1.5);

    cyberTl.to(".cyber-stage-1", { opacity: 0.1, scale: 0.8, duration: 1 }, 4)
      .to(".cyber-stage-2", { opacity: 1, duration: 1 }, 4.5);

    cyberTl.to(".cyber-scanner", { x: "500%", duration: 1.5, ease: "power1.inOut" }, 5.5)
      .to("#encrypt-text", { duration: 1, text: { value: "3x9@Q!$#*", delimiter: "" }, color: "#00ff9d" }, 5.5)
      .to("#cyber-phase-label", { text: "PHASE 2: ENCRYPTED & SECURED" }, 5.5)
      .to({}, { duration: 1 }, 6.5)
      .to(".cyber-scanner", { x: "-100%", duration: 1.5, ease: "power1.inOut" }, 7.5)
      .to("#encrypt-text", { duration: 1, text: { value: "PAYLOAD", delimiter: "" }, color: "#ffffff" }, 7.5)
      .to("#cyber-phase-label", { text: "PHASE 3: DECRYPTED WITH KEY" }, 7.5);

    cyberTl.to(".cyber-stage-2", { opacity: 0, duration: 1 }, 9)
      .to(".cyber-stage-3", { opacity: 1, duration: 1 }, 9.5);

    cyberTl.fromTo(".t-left", { x: -200, opacity: 0 }, { x: -60, opacity: 1, duration: 1 }, 10.5)
      .fromTo(".t-right", { x: 200, opacity: 0 }, { x: 60, opacity: 1, duration: 1 }, 10.5)
      .fromTo(".t-top", { y: -200, opacity: 0 }, { y: -60, opacity: 1, duration: 1 }, 10.5)
      .to(".firewall-shield", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 11.2)
      .to(".core-node svg", { stroke: "#fff", duration: 0.2 }, 11.2)
      .to(".t-left", { x: -150, y: -50, opacity: 0, duration: 0.5 }, 11.5)
      .to(".t-right", { x: 150, y: -50, opacity: 0, duration: 0.5 }, 11.5)
      .to(".t-top", { y: -150, x: 50, opacity: 0, duration: 0.5 }, 11.5)
      .to(".cyber-threat-title", { text: "THREAT NEUTRALIZED", color: "#00ff9d", duration: 0.5 }, 12.0)
      .to({}, { duration: 1 }, 12.5);

    cyberTl.to(".cyber-stage-3", { opacity: 0, duration: 1 }, 13.5)
      .to(".cyber-stage-4", { opacity: 1, duration: 1 }, 14.0);

    cyberTl.to(".mfa-factor-1", { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 14.5)
      .to(".f1-dot", { backgroundColor: "#fff", stagger: 0.1, duration: 0.4 }, 15.0)
      .to(".f1-line", { scaleX: 1, duration: 0.5 }, 15.5)
      .to(".mfa-body", { stroke: "#aaaaaa", duration: 0.2 }, 16.0)
      .to(".mfa-title", { text: "AWAITING SECONDARY FACTOR", color: "#ffb800", duration: 0.5 }, 16.2)
      .to(".mfa-factor-2", { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 16.5)
      .to(".f2-line", { scaleX: 1, duration: 0.5 }, 17.2)
      .to(".mfa-body, .mfa-shackle", { stroke: "#00ff9d", duration: 0.2 }, 17.7)
      .to(".mfa-shackle", { y: -15, duration: 0.5, ease: "back.out(2)" }, 17.9)
      .to(".mfa-hole", { fill: "#00ff9d", duration: 0.2 }, 17.9)
      .to(".mfa-title", { text: "ACCESS GRANTED", color: "#00ff9d", duration: 0.5 }, 18.0)
      .to({}, { duration: 2 }, 19);

    // ======================= DATA SCIENCE =======================
    const dataContainer = document.getElementById('data-dots-container');
    if (dataContainer) {
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.className = 'absolute w-4 h-4 rounded-full bg-white/40 data-dot';
        dot.style.left = (Math.random() * 80) + '%';
        dot.style.top = (Math.random() * 80) + '%';
        dataContainer.appendChild(dot);
      }
    }

    const dataTl = gsap.timeline({
      scrollTrigger: { trigger: "#data", start: "top top", end: "+=1400%", pin: true, scrub: 1 }
    });

    dataTl.fromTo(".data-bg-scale", { scale: 0.1, opacity: 0 }, { scale: 3, opacity: 0.1, duration: 22 }, 0)
      .to(".data-dot", { backgroundColor: "#ffb800", opacity: 0.8, stagger: 0.05, duration: 1.5 }, 0.5)
      .to(".data-dot", {
        x: "random(-20, 20)", y: "random(-20, 20)",
        duration: 2, ease: "sine.inOut", yoyo: true, repeat: 1
      }, 0);

    dataTl.to(".data-stage-1", { opacity: 0.05, duration: 1 }, 4)
      .to(".data-stage-2", { opacity: 1, duration: 1 }, 4.5);

    dataTl.to(".data-dot", {
      left: (i: number) => `${20 + (i % 6) * 12}%`,
      top: (i: number) => `${80 - Math.floor(i / 6) * 15}%`,
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      width: "20px",
      height: "20px",
      duration: 2,
      ease: "power2.inOut"
    }, 5.5);

    dataTl.to(".data-stage-2", { opacity: 0, duration: 1 }, 8.5)
      .to(".data-stage-3", { opacity: 1, duration: 1 }, 9.0);

    dataTl.to(".data-trend-line", { opacity: 1, duration: 0.1 }, 10.0)
      .to(".data-trend-line", { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" }, 10.0)
      .to(".data-dot", { backgroundColor: "#ffb800", duration: 0.5 }, 11.5);

    dataTl.to(".data-stage-3", { opacity: 0, duration: 1 }, 13.5)
      .to(".data-stage-4", { opacity: 1, duration: 1 }, 14.0);

    dataTl.to(".data-insight-box", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, 15.0)
      .to({}, { duration: 2 }, 16.0);

    // ======================= FINANCE SECTION =======================
    const financeTl = gsap.timeline({
      scrollTrigger: { trigger: "#finance", start: "top top", end: "+=1400%", pin: true, scrub: 1 }
    });

    financeTl.fromTo(".finance-bg-marquee", { y: "20vh" }, { y: "-40vh", duration: 22 }, 0);

    financeTl.to(".scale-beam", { rotation: -15, duration: 1, ease: "power2.inOut" }, 0.5)
      .to(".scale-beam", { rotation: 10, duration: 1.5, ease: "power2.inOut" }, 1.5)
      .to(".scale-beam", { rotation: 0, duration: 1, ease: "back.out(2)" }, 3.0);

    financeTl.to(".finance-stage-1", { opacity: 0, scale: 0.9, duration: 1 }, 4)
      .to(".finance-stage-2", { opacity: 1, duration: 1 }, 4.5);

    financeTl.fromTo(".f-bar", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.2, duration: 2, ease: "power1.out" }, 5.5)
      .to(".f-curve", { opacity: 1, duration: 0.1 }, 7.5)
      .to(".f-curve", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 7.5);

    financeTl.to(".finance-stage-2", { opacity: 0, duration: 1 }, 9.5)
      .to(".finance-stage-3", { opacity: 1, duration: 1 }, 10.0);

    financeTl.to(".f-risk-node", { scale: 1.2, borderColor: "#ff0055", duration: 0.8, ease: "power1.in" }, 11.0)
      .to(".f-risk-node", { opacity: 0, scale: 0, duration: 0.2 }, 11.8)
      .fromTo(".f-split-nodes", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }, 12.0);

    financeTl.to(".finance-stage-3", { opacity: 0, duration: 1 }, 14.0)
      .to(".finance-stage-4", { opacity: 1, duration: 1 }, 14.5);

    financeTl.to(".f-demand", { scaleX: 1, duration: 1, ease: "power2.out" }, 15.5)
      .to(".f-d-label", { opacity: 1, duration: 0.5 }, 16.0)
      .to(".f-supply", { scaleX: 1, duration: 1, ease: "power2.out" }, 16.5)
      .to(".f-s-label", { opacity: 1, duration: 0.5 }, 17.0)
      .to(".f-equilibrium", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, 17.5)
      .to(".f-e-label", { opacity: 1, y: -10, duration: 0.5 }, 17.8)
      .to({}, { duration: 2 }, 18.0);

    // ======================= RESEARCH SECTION =======================
    const researchTl = gsap.timeline({
      scrollTrigger: { trigger: "#research", start: "top top", end: "+=1400%", pin: true, scrub: 1 }
    });

    researchTl.fromTo(".research-bg-marquee", { y: "20vh" }, { y: "-40vh", duration: 22 }, 0);

    researchTl.to(".student-node", { scale: 1.2, boxShadow: "0 0 30px #b500ff", duration: 1.5, yoyo: true, repeat: 2 }, 0);

    researchTl.to(".research-stage-1", { opacity: 0.1, scale: 0.9, duration: 1 }, 4)
      .to(".research-stage-2", { opacity: 1, duration: 1 }, 4.5);

    researchTl.to(".r1", { scale: 1, opacity: 0.5, duration: 1.5, ease: "power2.out" }, 5.5)
      .to(".r2", { scale: 1, opacity: 0.3, duration: 1.5, ease: "power2.out" }, 6.0)
      .to(".r3", { scale: 1, opacity: 0.1, duration: 1.5, ease: "power2.out" }, 6.5)
      .to(".i1", { opacity: 1, scale: 1.5, duration: 0.5 }, 6.2)
      .to(".i2", { opacity: 1, scale: 1.5, duration: 0.5 }, 6.7)
      .to(".i3", { opacity: 1, scale: 1.5, duration: 0.5 }, 7.2);

    researchTl.to(".research-stage-2", { opacity: 0, duration: 1 }, 8.5)
      .to(".research-stage-3", { opacity: 1, duration: 1 }, 9.0);

    researchTl.to(".mentor-node", { opacity: 1, scale: 1, x: 0, duration: 1, ease: "back.out(1.2)" }, 10.0)
      .to(".mentor-line", { scaleX: 1, duration: 1, ease: "power2.inOut" }, 11.0)
      .to(".mentor-packet", { opacity: 1, duration: 0.1 }, 12.0)
      .to(".mentor-packet", { left: "100%", x: "-20px", duration: 1, ease: "none", repeat: 1 }, 12.0)
      .to(".mentor-packet", { opacity: 0, duration: 0.1 }, 14.0);

    researchTl.to(".research-stage-3", { opacity: 0, duration: 1 }, 14.5)
      .to(".research-stage-4", { opacity: 1, duration: 1 }, 15.0);

    researchTl.to(".paper-doc", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 16.0)
      .to(".paper-doc", { boxShadow: "0 0 50px rgba(181, 0, 255, 0.4)", duration: 1 }, 17.0)
      .to({}, { duration: 2 }, 18.0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5" style={{ background: 'linear-gradient(to bottom, rgba(3,3,5,0.8), transparent)' }}>
        <div className="flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#gl)" strokeWidth="2" />
            <path d="M16 8L16 24M8 16L24 16" stroke="url(#gl)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="16" r="4" fill="url(#gl)" />
            <defs>
              <linearGradient id="gl" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#10b981" /><stop offset="1" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CyberSyntax</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-outline px-5 py-2.5 rounded-lg text-sm">Login</Link>
          <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-lg text-sm">Get Started</Link>
        </div>
      </nav>

      <style>{`
        :root {
          --bg-dark: #030305;
          --cyber: #00ff9d;
          --data: #ffb800;
          --finance: #10b981;
          --research: #b500ff;
        }
        .font-display {
          font-family: var(--font-syncopate), 'Syncopate', sans-serif;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .font-space {
          font-family: var(--font-space), 'Space Grotesk', sans-serif;
        }
        .text-outline-cyber { color: transparent; -webkit-text-stroke: 2px var(--cyber); }
        .text-outline-data { color: transparent; -webkit-text-stroke: 2px var(--data); }
        .text-outline-finance { color: transparent; -webkit-text-stroke: 2px var(--finance); }
        .text-outline-research { color: transparent; -webkit-text-stroke: 2px var(--research); }
        .svg-draw { stroke-dasharray: 1200; stroke-dashoffset: 1200; }
        .panel {
          height: 100vh; width: 100vw;
          position: relative; display: flex;
          align-items: center; justify-content: center;
          overflow: hidden;
        }
        .hud-label {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          opacity: 0.6;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="noise-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 50, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* ======================= HERO SECTION ======================= */}
      <section className="panel" id="hero">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030305] z-10"></div>
        <svg className="absolute inset-0 w-full h-full opacity-20" id="heroGrid">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="z-20 text-center w-full flex flex-col items-center justify-center">
          <h1 className="font-display text-[8vw] leading-none font-bold tracking-tighter" id="heroTitle1">CYBER</h1>
          <h1 className="font-display text-[8vw] leading-none font-bold tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px white' }} id="heroTitle2">SYNTAX</h1>
          <div className="mt-8 overflow-hidden">
            <p className="font-space tracking-[0.5em] text-sm text-gray-400 uppercase" id="heroSub">
              Cinematic Scroll Experience V5
            </p>
          </div>
          <div className="absolute bottom-10 flex flex-col items-center" id="scrollIndicator">
            <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[drop_2s_infinite]"></div>
            </div>
            <p className="font-space text-xs mt-4 tracking-widest text-white/50">INITIATE SCROLL</p>
          </div>
        </div>
      </section>

      {/* ======================= CYBERSECURITY SECTION ======================= */}
      <section className="panel bg-[#030305]" id="cyber">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-around w-full opacity-15 font-mono text-[1.2rem] text-[#00ff9d] leading-relaxed text-center cyber-matrix-bg">
          <div className="absolute m1" style={{ top: '-100%' }}>0 1 1 0<br />1 0 0 1<br />A E F 9<br />0 1 1 0</div>
          <div className="absolute m2" style={{ top: '-50%' }}>E N C R<br />Y P T I<br />O N 0 1<br />E N C R</div>
          <div className="absolute m3" style={{ top: '-80%' }}>1 1 0 0<br />S H A 3<br />2 5 6 X<br />1 1 0 0</div>
          <div className="absolute m4" style={{ top: '20%' }}>K E Y G<br />E N E R<br />A T E D<br />K E Y G</div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between py-20 pointer-events-none z-0 opacity-20">
          <h2 className="font-display text-[15vw] text-outline-cyber cyber-bg-text-1">ENCRYPT</h2>
          <h2 className="font-display text-[15vw] text-outline-cyber cyber-bg-text-2 text-right">SECURE</h2>
          <h2 className="font-display text-[15vw] text-outline-cyber cyber-bg-text-3">DEFEND</h2>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full cyber-stage-1">
          <div className="relative w-[80vh] h-[80vh] flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00ff9d] opacity-10 blur-[100px] rounded-full cyber-glow"></div>
            <svg viewBox="-100 -100 800 800" className="w-full h-full absolute overflow-visible">
              <circle cx="300" cy="300" r="320" fill="none" stroke="#00ff9d" strokeWidth="1" strokeDasharray="4 16" className="cyber-ring-1" opacity="0.3" />
              <circle cx="300" cy="300" r="260" fill="none" stroke="#00ff9d" strokeWidth="2" strokeDasharray="30 50" className="cyber-ring-2" opacity="0.8" />
              <polygon points="300,110 464,205 464,395 300,490 136,395 136,205" fill="none" stroke="#00ff9d" strokeWidth="4" className="svg-draw cyber-hex" />
              <circle cx="300" cy="300" r="80" fill="none" stroke="#00ff9d" strokeWidth="3" className="svg-draw cyber-eye" />
              <path d="M 300 220 L 300 160 M 300 380 L 300 440 M 220 300 L 160 300 M 380 300 L 440 300" stroke="#00ff9d" strokeWidth="3" className="svg-draw cyber-crosshair" />
            </svg>
            <div className="absolute z-20 font-space font-bold text-[#00ff9d] tracking-[1em] uppercase text-sm cyber-core-text">ZERO TRUST</div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 pointer-events-none cyber-stage-2">
          <div className="bg-black/60 backdrop-blur-md border border-[#00ff9d]/30 p-10 rounded-2xl text-center min-w-[50vw]">
            <div className="hud-label text-[#00ff9d]" id="cyber-phase-label">PHASE 1: PLAIN TEXT</div>
            <div className="font-display text-5xl md:text-7xl font-bold tracking-widest my-8 text-white transition-colors duration-500" id="encrypt-text">PAYLOAD</div>
            <div className="relative w-full h-[2px] bg-white/10 overflow-hidden mb-6">
              <div className="absolute top-0 left-0 h-full w-[20%] bg-[#00ff9d] blur-sm cyber-scanner" style={{ transform: 'translateX(-100%)' }}></div>
            </div>
            <div className="font-space text-lg text-gray-400 max-w-lg mx-auto" id="cyber-desc">
              Data travels across the web in plain sight. Anyone can read it.
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none cyber-stage-3">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#00ff9d]">PHASE 3: ACTIVE FIREWALL</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest cyber-threat-title">INTRUSION DETECTED</h3>
          </div>
          <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            <div className="w-24 h-24 bg-[#00ff9d]/20 border-2 border-[#00ff9d] rounded-full flex items-center justify-center shadow-[0_0_30px_#00ff9d] z-20 core-node">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div className="absolute w-[300px] h-[300px] rounded-full border-[4px] border-[#00ff9d] border-dashed opacity-0 firewall-shield z-10 scale-50"></div>
            <div className="absolute w-full h-full">
              <div className="absolute top-1/2 left-0 w-8 h-8 bg-[#ff0055] rounded-full flex items-center justify-center cyber-threat t-left" style={{ transform: 'translate(-150px, -50%)', opacity: 0 }}><span className="text-white text-xs font-bold">X</span></div>
              <div className="absolute top-1/2 right-0 w-8 h-8 bg-[#ff0055] rounded-full flex items-center justify-center cyber-threat t-right" style={{ transform: 'translate(150px, -50%)', opacity: 0 }}><span className="text-white text-xs font-bold">X</span></div>
              <div className="absolute top-0 left-1/2 w-8 h-8 bg-[#ff0055] rounded-full flex items-center justify-center cyber-threat t-top" style={{ transform: 'translate(-50%, -150px)', opacity: 0 }}><span className="text-white text-xs font-bold">X</span></div>
            </div>
          </div>
          <div className="absolute bottom-[20%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center" id="cyber-desc-3">
            Algorithms detect anomalous packets and instantly deploy a perimeter shield to deflect unauthorized requests.
          </div>
        </div>

        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none cyber-stage-4">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#00ff9d]">PHASE 4: MULTI-FACTOR AUTH</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest mfa-title text-white">ACCESS PENDING</h3>
          </div>

          <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center mt-10">
            <div className="relative w-48 h-64 z-20 mfa-lock flex flex-col items-center">
              <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,255,157,0.2)]" id="lock-svg">
                <path d="M 25 60 V 35 A 25 25 0 0 1 75 35 V 60" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" className="mfa-shackle" />
                <rect x="10" y="60" width="80" height="70" rx="10" fill="#030305" stroke="white" strokeWidth="6" className="mfa-body" />
                <circle cx="50" cy="85" r="8" fill="white" className="mfa-hole" />
                <polygon points="45,90 55,90 52,110 48,110" fill="white" className="mfa-hole" />
              </svg>
            </div>

            <div className="absolute left-10 flex flex-col items-center opacity-0 mfa-factor-1" style={{ transform: 'translateX(-50px)' }}>
              <div className="font-display text-sm text-gray-400 mb-2">FACTOR 1: PASSWORD</div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 f1-dot"></div>
                <div className="w-6 h-6 rounded-full bg-white/20 f1-dot"></div>
                <div className="w-6 h-6 rounded-full bg-white/20 f1-dot"></div>
                <div className="w-6 h-6 rounded-full bg-white/20 f1-dot"></div>
              </div>
              <div className="h-[2px] w-32 bg-white/30 absolute right-[-140px] top-10 f1-line origin-left scale-x-0"></div>
            </div>

            <div className="absolute right-10 flex flex-col items-center opacity-0 mfa-factor-2" style={{ transform: 'translateX(50px)' }}>
              <div className="font-display text-sm text-gray-400 mb-2 text-[#00ff9d]">FACTOR 2: BIOMETRIC</div>
              <svg viewBox="0 0 50 100" className="w-16 h-32">
                <rect x="5" y="5" width="40" height="90" rx="5" fill="none" stroke="#00ff9d" strokeWidth="2" />
                <circle cx="25" cy="50" r="10" fill="none" stroke="#00ff9d" strokeWidth="2" strokeDasharray="2 4" className="animate-spin" style={{ animationDuration: '4s' }} />
                <circle cx="25" cy="50" r="4" fill="#00ff9d" />
              </svg>
              <div className="h-[2px] w-32 bg-[#00ff9d]/50 absolute left-[-140px] top-16 f2-line origin-right scale-x-0"></div>
            </div>
          </div>

          <div className="absolute bottom-[20%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center" id="cyber-desc-4">
            A stolen password is useless. Zero Trust architectures require physical, secondary validation to guarantee identity before granting access.
          </div>
        </div>
      </section>

      {/* ======================= DATA SCIENCE SECTION ======================= */}
      <section className="panel bg-[#030305]" id="data">
        <div className="absolute inset-0 pointer-events-none opacity-20 font-space text-xs text-[#ffb800] overflow-hidden flex flex-col justify-around px-10">
          <div className="tracking-widest">DATA_SET_01 // ACTIVE</div>
          <div className="tracking-widest text-right">COLLECTION_MODE // INITIATED</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 overflow-hidden">
          <h2 className="font-display text-[25vw] text-outline-data data-bg-scale absolute">BASICS</h2>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full data-stage-1">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#ffb800]">PHASE 1: INFORMATION GATHERING</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">WHAT IS DATA?</h3>
          </div>
          <div className="relative w-[80vw] h-[50vh] flex items-center justify-center" id="data-dots-container"></div>
          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center data-desc-1">
            Data is simply information. It starts as scattered pieces of observations, numbers, and facts all around us.
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 pointer-events-none data-stage-2">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#ffb800]" id="data-phase-label">PHASE 2: ORGANIZATION</div>
            <h3 className="font-display text-3xl md:text-5xl text-white" id="data-title">SORTING THE CHAOS</h3>
          </div>
          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            In our beginner course, you learn how to group and organize this scattered information so it starts to make sense.
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none data-stage-3">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#ffb800]">PHASE 3: VISUALIZATION</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white data-viz-title">SEEING THE STORY</h3>
          </div>
          <div className="relative w-full max-w-4xl h-[40vh] mt-10 px-10 flex items-end justify-around pb-10 border-b-2 border-white/20 border-l-2">
            <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
              <path d="M 50 150 C 200 150, 300 100, 400 120 C 500 140, 600 50, 750 30" fill="none" stroke="#ffb800" strokeWidth="6" strokeDasharray="10 10" className="svg-draw data-trend-line" opacity="0" />
            </svg>
          </div>
          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            By turning numbers into visual charts and graphs, the hidden story behind the data becomes crystal clear.
          </div>
        </div>

        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none data-stage-4">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#ffb800]">PHASE 4: BASIC INSIGHTS</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">MAKING DECISIONS</h3>
          </div>

          <div className="relative w-64 h-64 mt-10 flex flex-col items-center justify-center border-4 border-[#ffb800] rounded-3xl bg-[#ffb800]/10 data-insight-box opacity-0 scale-50">
            <svg viewBox="0 0 24 24" className="w-20 h-20 text-[#ffb800] mb-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            <div className="font-display font-bold text-xl text-[#ffb800]">CLEAR TREND</div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            You don't need complex coding. Just foundational logic to find the answers and make smarter real-world choices.
          </div>
        </div>
      </section>

      {/* ======================= FINANCE SECTION ======================= */}
      <section className="panel bg-[#030305]" id="finance">
        <div className="absolute inset-0 flex justify-between px-20 py-10 opacity-20 font-space text-xs z-0 pointer-events-none overflow-hidden text-[#10b981]">
          <div className="flex flex-col gap-2">
            <div>ASSET_CLASS // EQUITIES</div><div>COMPOUND_RATE // 8.5%</div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>RISK_PROFILE // MODERATE</div><div>PORTFOLIO // DIVERSIFIED</div>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 opacity-15 overflow-hidden">
          <div className="flex flex-col gap-4 finance-bg-marquee">
            <h2 className="font-display text-[10vw] text-outline-finance">WEALTH</h2>
            <h2 className="font-display text-[10vw] text-[#10b981]">VALUE</h2>
            <h2 className="font-display text-[10vw] text-outline-finance">MARKETS</h2>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full finance-stage-1">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#10b981]">PHASE 1: THE BASICS</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">INCOME & EXPENSES</h3>
          </div>
          <div className="relative w-64 h-64 flex flex-col items-center justify-center mt-10">
            <div className="w-full h-2 bg-white/40 relative scale-beam origin-center shadow-[0_0_10px_white]">
              <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#ff0055] rounded-b-full scale-pan-left flex justify-center items-end pb-2 -translate-x-1/2 bg-black/50"><span className="font-space text-xs text-[#ff0055] font-bold">OUT</span></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-2 border-[#10b981] rounded-b-full scale-pan-right flex justify-center items-end pb-2 translate-x-1/2 bg-black/50"><span className="font-space text-xs text-[#10b981] font-bold">IN</span></div>
            </div>
            <div className="w-6 h-32 bg-white/20 mt-[-2px] border-l-2 border-r-2 border-white/40" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Personal finance begins with a simple truth: maximizing the value coming in while optimizing the value going out.
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 pointer-events-none finance-stage-2">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#10b981]">PHASE 2: GROWTH</div>
            <h3 className="font-display text-3xl md:text-5xl text-white">COMPOUND INTEREST</h3>
          </div>

          <div className="relative w-[600px] h-[300px] flex items-end mt-10 border-b-2 border-l-2 border-white/20 px-4 pb-0">
            <div className="flex items-end justify-between w-full h-full gap-2 pt-10">
              <div className="w-12 bg-[#10b981]/20 border-t-2 border-[#10b981] f-bar b1" style={{ height: '10%' }}></div>
              <div className="w-12 bg-[#10b981]/30 border-t-2 border-[#10b981] f-bar b2" style={{ height: '15%' }}></div>
              <div className="w-12 bg-[#10b981]/40 border-t-2 border-[#10b981] f-bar b3" style={{ height: '25%' }}></div>
              <div className="w-12 bg-[#10b981]/50 border-t-2 border-[#10b981] f-bar b4" style={{ height: '40%' }}></div>
              <div className="w-12 bg-[#10b981]/60 border-t-2 border-[#10b981] f-bar b5" style={{ height: '60%' }}></div>
              <div className="w-12 bg-[#10b981]/80 border-t-2 border-[#10b981] f-bar b6" style={{ height: '85%' }}></div>
              <div className="w-12 bg-[#10b981] border-t-2 border-white f-bar b7 shadow-[0_0_20px_#10b981]" style={{ height: '120%' }}></div>
            </div>
            <svg viewBox="0 0 600 300" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
              <path d="M 30 260 Q 300 280, 570 -50" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10" className="svg-draw f-curve" opacity="0" />
            </svg>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Time is your greatest asset. Earning interest on your interest creates an unstoppable, exponential snowball effect.
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none finance-stage-3">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#10b981]">PHASE 3: RISK MANAGEMENT</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">DIVERSIFICATION</h3>
          </div>

          <div className="relative w-full max-w-3xl h-[40vh] mt-10 flex flex-col items-center justify-center">
            <div className="absolute w-40 h-40 rounded-full border-4 border-white/50 bg-[#030305] z-10 flex items-center justify-center f-risk-node">
              <span className="font-display font-bold text-white text-2xl">100%</span>
            </div>

            <div className="absolute flex gap-8 md:gap-16 f-split-nodes opacity-0 scale-50">
              <div className="w-28 h-28 rounded-full border-2 border-[#10b981] bg-[#10b981]/20 flex items-center justify-center shadow-[0_0_25px_#10b981]">
                <span className="font-space font-bold text-[#10b981] text-xs">STOCKS</span>
              </div>
              <div className="w-28 h-28 rounded-full border-2 border-[#ffb800] bg-[#ffb800]/20 flex items-center justify-center shadow-[0_0_25px_#ffb800]">
                <span className="font-space font-bold text-[#ffb800] text-xs">BONDS</span>
              </div>
              <div className="w-28 h-28 rounded-full border-2 border-[#00ff9d] bg-[#00ff9d]/20 flex items-center justify-center shadow-[0_0_25px_#00ff9d]">
                <span className="font-space font-bold text-[#00ff9d] text-xs">CASH</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Never put all your eggs in one basket. Spreading investments across different asset classes protects against unexpected market shocks.
          </div>
        </div>

        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none finance-stage-4">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#10b981]">PHASE 4: ECONOMICS</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">SUPPLY & DEMAND</h3>
          </div>

          <div className="relative w-[400px] h-[300px] flex items-center justify-center mt-10 border-b border-l border-white/30 bg-white/5">
            <div className="absolute w-[90%] h-[4px] bg-[#00ff9d] origin-top-left rotate-[30deg] top-[10%] left-[10%] f-demand scale-x-0 shadow-[0_0_10px_#00ff9d]"></div>
            <div className="absolute w-[90%] h-[4px] bg-[#ff0055] origin-bottom-left rotate-[-30deg] bottom-[10%] left-[10%] f-supply scale-x-0 shadow-[0_0_10px_#ff0055]"></div>

            <div className="w-8 h-8 rounded-full border-4 border-[#10b981] bg-black shadow-[0_0_30px_#10b981] absolute z-20 f-equilibrium opacity-0 scale-50"></div>

            <div className="absolute top-[5%] right-[5%] font-space text-sm font-bold text-[#ff0055] f-s-label opacity-0">SUPPLY</div>
            <div className="absolute bottom-[5%] right-[5%] font-space text-sm font-bold text-[#00ff9d] f-d-label opacity-0">DEMAND</div>
            <div className="absolute top-[35%] left-[55%] font-display font-bold text-xs text-white bg-black/80 px-3 py-2 border border-[#10b981] rounded f-e-label opacity-0">MARKET PRICE</div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Prices aren't random. They are the exact meeting point—the equilibrium—where buyers and sellers finally agree.
          </div>
        </div>
      </section>

      {/* ======================= RESEARCH SECTION ======================= */}
      <section className="panel bg-[#030305]" id="research">
        <div className="absolute inset-0 flex justify-between px-20 py-10 opacity-20 font-space text-xs z-0 pointer-events-none overflow-hidden text-[#b500ff]">
          <div className="flex flex-col gap-2">
            <div>HYPOTHESIS_1 // GENERATED</div><div>LITERATURE_REVIEW // 80%</div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>MENTOR_NODE // CONNECTED</div><div>GRANT_PROPOSAL // DRAFTING</div>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 opacity-15 overflow-hidden">
          <div className="flex flex-col gap-4 research-bg-marquee">
            <h2 className="font-display text-[10vw] text-outline-research">DISCOVER</h2>
            <h2 className="font-display text-[10vw] text-[#b500ff]">INNOVATE</h2>
            <h2 className="font-display text-[10vw] text-outline-research">RESEARCH</h2>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full research-stage-1">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#b500ff]">STEP 1: CURIOSITY</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">THE RESEARCH QUESTION</h3>
          </div>
          <div className="relative w-40 h-40 flex items-center justify-center mt-10">
            <div className="absolute inset-0 bg-[#b500ff] opacity-20 blur-[50px] rounded-full r-glow"></div>
            <div className="w-16 h-16 rounded-full border-4 border-[#b500ff] bg-[#030305] z-10 flex items-center justify-center student-node">
              <span className="font-display font-bold text-[#b500ff] text-2xl">?</span>
            </div>
          </div>
          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Every great breakthrough begins with a simple question. No prior experience is needed—just raw curiosity.
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 pointer-events-none research-stage-2">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#b500ff]">STEP 2: EXPLORATION</div>
            <h3 className="font-display text-3xl md:text-5xl text-white">GATHERING CONTEXT</h3>
          </div>

          <div className="relative w-[600px] h-[600px] flex items-center justify-center mt-10">
            <div className="absolute w-full h-full rounded-full border-[1px] border-[#b500ff] opacity-0 radar-ring r1 scale-0"></div>
            <div className="absolute w-[80%] h-[80%] rounded-full border-[1px] border-[#b500ff] opacity-0 radar-ring r2 scale-0"></div>
            <div className="absolute w-[60%] h-[60%] rounded-full border-[1px] border-[#b500ff] opacity-0 radar-ring r3 scale-0"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full r-info i1 opacity-0" style={{ top: '20%', left: '30%' }}></div>
            <div className="absolute w-4 h-4 bg-white rounded-full r-info i2 opacity-0" style={{ bottom: '30%', right: '20%' }}></div>
            <div className="absolute w-4 h-4 bg-white rounded-full r-info i3 opacity-0" style={{ top: '50%', right: '10%' }}></div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            We teach you how to read the landscape, find existing knowledge, and identify where you can make a unique impact.
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none research-stage-3">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#b500ff]">STEP 3: COLLABORATION</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">GUIDED MENTORSHIP</h3>
          </div>

          <div className="relative w-full max-w-4xl h-[40vh] mt-10 flex items-center justify-center">
            <div className="absolute left-[20%] w-20 h-20 rounded-full border-4 border-[#b500ff] bg-[#030305] z-10 flex items-center justify-center">
              <span className="font-space font-bold text-white text-xs">STUDENT</span>
            </div>
            <div className="absolute right-[20%] w-24 h-24 rounded-full bg-[#b500ff] z-10 flex items-center justify-center mentor-node opacity-0" style={{ transform: 'translateX(100px) scale(0.5)' }}>
              <span className="font-space font-bold text-[#030305] text-sm">MENTOR</span>
            </div>
            <div className="absolute w-[40%] h-[4px] bg-gradient-to-r from-[#b500ff]/20 to-[#b500ff] z-0 mentor-line origin-left scale-x-0">
              <div className="w-[20px] h-full bg-white shadow-[0_0_15px_white] absolute top-0 left-0 mentor-packet opacity-0"></div>
            </div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            You are never alone. Work one-on-one with experienced mentors who guide your methodology and refine your ideas.
          </div>
        </div>

        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none research-stage-4">
          <div className="text-center mb-10 absolute top-[15%]">
            <div className="hud-label text-[#b500ff]">STEP 4: IMPACT</div>
            <h3 className="font-display text-3xl md:text-5xl tracking-widest text-white">PUBLISH & PRESENT</h3>
          </div>

          <div className="relative w-64 h-80 bg-white/5 border border-[#b500ff]/30 p-6 flex flex-col items-center mt-10 paper-doc opacity-0 translate-y-10">
            <div className="w-full h-2 bg-[#b500ff] mb-6"></div>
            <div className="w-3/4 h-4 bg-white/20 mb-4 rounded"></div>
            <div className="w-1/2 h-4 bg-white/20 mb-8 rounded"></div>

            <div className="w-full h-2 bg-white/10 mb-2 rounded"></div>
            <div className="w-full h-2 bg-white/10 mb-2 rounded"></div>
            <div className="w-full h-2 bg-white/10 mb-2 rounded"></div>
            <div className="w-5/6 h-2 bg-white/10 mb-2 rounded"></div>

            <div className="mt-auto w-16 h-16 rounded-full bg-[#b500ff]/20 border-2 border-[#b500ff] flex items-center justify-center shadow-[0_0_20px_#b500ff]">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#b500ff]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-[10%] font-space text-lg text-gray-400 max-w-lg mx-auto text-center">
            Complete a formal research paper and present your findings to the world. Your journey into innovation starts here.
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AGENTS } from "../lib/agents";

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = AGENTS.map(a => a.color);
    const particles = Array.from({ length: 72 }, () => {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2, col,
        phase: Math.random() * Math.PI * 2,
      };
    });

    let frame = 0;
    let raf: number;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, c.width, c.height);

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 140) continue;
          const alpha = (1 - d / 140) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].col + Math.floor(alpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // nodes
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        p.phase += 0.03;
        const opacity = 0.5 + 0.5 * Math.sin(p.phase);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, p.col + Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, "0"));
        grd.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

function IntroOverlay({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const COLORS = ["#FF006E", "#FF5500", "#00E5FF", "#A855F7", "#AAFF00"];
    const STEP = 38;
    const cx = c.width / 2;
    const cy = c.height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    const dots: { x: number; y: number; color: string; delay: number }[] = [];
    for (let x = STEP / 2; x < c.width; x += STEP) {
      for (let y = STEP / 2; y < c.height; y += STEP) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        dots.push({
          x, y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: (dist / maxDist) * 55,
        });
      }
    }

    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.fillStyle = "#08080C";
      ctx.fillRect(0, 0, c.width, c.height);

      for (const dot of dots) {
        const t = frame - dot.delay;
        if (t <= 0) continue;
        const alpha = t < 18 ? t / 18 : Math.max(0, 1 - (t - 18) / 28);
        if (alpha <= 0) continue;
        const a = Math.floor(alpha * 200).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + a;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#08080C",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.7s ease",
      pointerEvents: visible ? "all" : "none",
    }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

export default function HeroSection() {
  const [burns, setBurns] = useState(4821);
  const [txs, setTxs] = useState(9248);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setIntroVisible(false), 1800);
    const t2 = setTimeout(() => setHeroReady(true), 2300);
    const id1 = setInterval(() => setBurns(p => p + Math.floor(Math.random() * 3) + 1), 2800);
    const id2 = setInterval(() => setTxs(p => p + Math.floor(Math.random() * 5) + 1), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(id1); clearInterval(id2); };
  }, []);

  const NAV = ["Agents", "How It Works", "Builders", "Tokenomics"];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden grain" style={{ background: "var(--bg)" }}>
      <IntroOverlay visible={introVisible} />
      <ParticleCanvas />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(8,8,12,0.7) 65%, var(--bg) 100%)"
      }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ borderBottom: "1px solid var(--hairline)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, var(--iron), var(--ember))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>
            ROGUE<span style={{ color: "var(--iron)" }}>CLAW</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ color: "var(--muted)", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
              {item}
            </a>
          ))}
          <a href="https://rogueclaw.gitbook.io/rogueclaw" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--muted)", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
            Docs
          </a>
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a href="#builders" className="hidden md:flex items-center gap-2"
            style={{
              background: "var(--iron)", color: "white", fontSize: 12, fontWeight: 700,
              padding: "8px 18px", borderRadius: 100, textDecoration: "none",
              boxShadow: "0 0 0 1px rgba(255,0,110,0.4), 0 4px 20px rgba(255,0,110,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(255,0,110,0.6), 0 8px 32px rgba(255,0,110,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(255,0,110,0.4), 0 4px 20px rgba(255,0,110,0.35)"; }}>
            Get Early Access
          </a>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "rgba(255,255,255,0.8)" }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-20"
          style={{ background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--hairline)", padding: "20px 24px 24px" }}>
          <div className="flex flex-col gap-1">
            {NAV.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                style={{ color: "rgba(255,255,255,0.8)", fontSize: 20, fontWeight: 700, textDecoration: "none", padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
                {item}
              </a>
            ))}
            <a href="https://rogueclaw.gitbook.io/rogueclaw" target="_blank" rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 20, fontWeight: 700, textDecoration: "none", padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
              Docs
            </a>
            <a href="#builders" onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 16, display: "block", textAlign: "center",
                background: "var(--iron)", color: "white", fontSize: 14, fontWeight: 700,
                padding: "13px", borderRadius: 8, textDecoration: "none",
              }}>
              Get Early Access
            </a>
          </div>
        </div>
      )}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6"
        style={{ paddingBottom: 100 }}>

        {/* Badge */}
        <div className="glass flex items-center gap-2 mb-8"
          style={{ borderRadius: 100, padding: "6px 16px", display: "inline-flex", animation: heroReady ? "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both" : "none", opacity: heroReady ? undefined : 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--storm)", boxShadow: "0 0 8px var(--storm)", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
          <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--storm)", letterSpacing: "0.14em" }}>
            LIVE ON SOLANA · TESTNET
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(48px, 9vw, 120px)", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-0.04em", marginBottom: 28, animation: heroReady ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none", opacity: heroReady ? undefined : 0 }}>
          <span style={{ display: "block", color: "white" }}>Five Agents.</span>
          <span style={{ display: "block" }} className="agent-grad">One Token.</span>
          <span style={{ display: "block", color: "rgba(255,255,255,0.25)" }}>Zero Humans.</span>
        </h1>

        {/* Sub */}
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.7, color: "var(--muted)", maxWidth: 520, marginBottom: 44, animation: heroReady ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" : "none", opacity: heroReady ? undefined : 0 }}>
          Five autonomous AI agents run $ROGUECLAW on Solana. They hunt, burn, pool, vault, and raid — 24/7, on-chain, answering to no one.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-16" style={{ animation: heroReady ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.32s both" : "none", opacity: heroReady ? undefined : 0 }}>
          <a href="#agents" style={{
            background: "var(--iron)", color: "white", fontSize: 14, fontWeight: 700,
            padding: "13px 30px", borderRadius: 100, textDecoration: "none",
            boxShadow: "0 0 0 1px rgba(255,0,110,0.5), 0 8px 32px rgba(255,0,110,0.4)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
            Meet the Agents
          </a>
          <a href="#how-it-works" className="glass" style={{
            color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600,
            padding: "13px 30px", borderRadius: 100, textDecoration: "none",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}>
            How It Works →
          </a>
        </div>

        {/* Stats bar */}
        {mounted && (
          <div className="glass" style={{ borderRadius: 16, padding: "18px 28px", display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", animation: heroReady ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both" : "none", opacity: heroReady ? undefined : 0 }}>
            {[
              { label: "Burns Executed", value: burns.toLocaleString(), color: "var(--ember)" },
              { label: "On-Chain Txs", value: txs.toLocaleString(), color: "var(--tide)" },
              { label: "Agents Active", value: "5 / 5", color: "var(--storm)" },
              { label: "Humans in Control", value: "0", color: "var(--iron)" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10" style={{ transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span className="mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "var(--subtle)", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--iron), transparent)" }} />
      </div>
    </section>
  );
}

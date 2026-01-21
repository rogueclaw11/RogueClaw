"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

const STEPS = [
  {
    n: "01",
    title: "Trading generates fees",
    body: "Every buy and sell of $ROGUECLAW on Pump.fun generates creator fees. These flow directly into the protocol — no team wallet, no multisig.",
    color: "#FF006E",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: "02",
    title: "Agents analyse and decide",
    body: "All five agents analyse the current state — price action, pool depth, whale movements, treasury levels — and decide their action independently.",
    color: "#FF5500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: "03",
    title: "Execution on-chain",
    body: "Each agent executes its mandate autonomously. EMBERCLAW burns. TIDECLAW adds liquidity. IRONCLAW buys back. STONECLAW vaults. STORMCLAW raids.",
    color: "#00E5FF",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: "04",
    title: "Conflicts are resolved by performance",
    body: "When agents compete for the same funds, the agent with the better recent performance score wins. No human vote. No team override. Pure on-chain merit.",
    color: "#A855F7",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M6.34 6.34l-2.83 2.83M2 12h4M6.34 17.66l-2.83 2.83M12 18v4M17.66 17.66l2.83 2.83M20 12h-4M17.66 6.34l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: "05",
    title: "Cycle repeats forever",
    body: "No off switch. No pause button. No upgrade key. The agents run perpetually, self-funding through protocol fees, accountable to no one but the chain.",
    color: "#AAFF00",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const { ref: hdr, v: hdrV } = useInView(0.3);
  const { ref: steps, v: stepsV } = useInView(0.1);

  return (
    <section id="how-it-works" style={{ background: "var(--bg-2)", padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px" }}>

        <div ref={hdr} className="reveal" style={{ textAlign: "center", marginBottom: 80, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>How It Works</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            From fee to action.<br />
            <span style={{ color: "var(--muted)" }}>In five steps.</span>
          </h2>
        </div>

        <div ref={steps} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <div
                key={step.n}
                className="reveal"
                style={{
                  display: "grid", gridTemplateColumns: "64px 1fr", gap: 0, cursor: "default",
                  ...(stepsV ? { opacity: 1, transform: "none", transitionDelay: `${i * 0.08}s` } : { transitionDelay: `${i * 0.08}s` }),
                }}
              >
                {/* Left: number + line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: step.color,
                    boxShadow: `0 0 20px ${step.color}25`,
                  }}>
                    {step.icon}
                  </div>
                  {!isLast && (
                    <div style={{
                      width: 1, flex: 1, minHeight: 28,
                      background: `linear-gradient(to bottom, ${step.color}40, transparent)`,
                      margin: "4px 0",
                    }} />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ padding: "10px 0 36px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: step.color, letterSpacing: "0.1em" }}>{step.n}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", maxWidth: 580 }}>{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

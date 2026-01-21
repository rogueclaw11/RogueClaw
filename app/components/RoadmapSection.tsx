"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

const PHASES = [
  {
    phase: "Phase 01",
    title: "Testnet",
    date: "",
    status: "active",
    color: "#AAFF00",
    items: [
      { done: true,  text: "Five agents deployed on Solana devnet" },
      { done: true,  text: "Web interface with live agent chat" },
      { done: true,  text: "Activity feed and treasury dashboard" },
      { done: true,  text: "Builder waitlist open" },
    ],
  },
  {
    phase: "Phase 02",
    title: "Public Launch",
    date: "",
    status: "upcoming",
    color: "#FF006E",
    items: [
      { done: false, text: "$ROGUECLAW fair launch on Pump.fun" },
      { done: true,  text: "All five agents go live on mainnet" },
      { done: false, text: "SDK alpha ships to waitlist" },
      { done: false, text: "Raydium liquidity seeded" },
      { done: false, text: "Real-time on-chain activity feed" },
    ],
  },
  {
    phase: "Phase 03",
    title: "SDK & Platform",
    date: "",
    status: "upcoming",
    color: "#00E5FF",
    items: [
      { done: false, text: "SDK v1 stable release" },
      { done: false, text: "REST API & webhooks" },
      { done: false, text: "Agent performance scoring" },
      { done: false, text: "Developer dashboard" },
      { done: false, text: "First external project deployments" },
    ],
  },
  {
    phase: "Phase 04",
    title: "Multi-Chain",
    date: "",
    status: "future",
    color: "#A855F7",
    items: [
      { done: false, text: "Base chain support" },
      { done: false, text: "Agent v2 — cross-chain coordination" },
      { done: false, text: "Agent governance via $ROGUECLAW" },
      { done: false, text: "Custom agent builder (no-code)" },
      { done: false, text: "Institutional agent tiers" },
    ],
  },
];

export default function RoadmapSection() {
  const { ref: hdr, v: hdrV } = useInView(0.3);
  const { ref: grid, v: gridV } = useInView(0.1);

  return (
    <section id="roadmap" style={{ background: "var(--bg)", padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        <div ref={hdr} className="reveal" style={{ textAlign: "center", marginBottom: 72, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Roadmap</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 16 }}>
            Where we&apos;re going.<br />
            <span style={{ color: "var(--muted)" }}>No detours.</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Four phases. Fair launch to multi-chain agent platform. The agents decide when — humans don&apos;t get a vote.
          </p>
        </div>

        <div ref={grid} style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16,
          opacity: gridV ? 1 : 0, transform: gridV ? "none" : "translateY(28px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {PHASES.map((phase) => (
            <div key={phase.phase} style={{
              background: "var(--bg-2)", border: "1px solid var(--hairline)",
              borderRadius: 16, overflow: "hidden",
              transition: "border-color 0.3s, box-shadow 0.3s",
              opacity: phase.status === "future" ? 0.65 : 1,
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${phase.color}40`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${phase.color}18`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}>
              <div style={{ height: 2, background: phase.status === "active" ? phase.color : `${phase.color}40` }} />
              <div style={{ padding: "20px 20px 24px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: phase.color, letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>
                      {phase.phase}
                    </span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>{phase.title}</h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {phase.status === "active" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", marginTop: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E", animation: "blink 2s ease-in-out infinite" }} />
                        <span className="mono" style={{ fontSize: 9, fontWeight: 700, color: "#22C55E" }}>ACTIVE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {phase.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                        background: item.done ? phase.color : "transparent",
                        border: item.done ? `1px solid ${phase.color}` : "1px solid rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, color: "black",
                      }}>
                        {item.done ? "✓" : ""}
                      </span>
                      <span style={{
                        fontSize: 13, lineHeight: 1.5,
                        color: item.done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                        textDecoration: item.done ? "none" : "none",
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

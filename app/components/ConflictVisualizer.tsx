"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

type Phase = "idle" | "both-claim" | "conflict" | "scoring" | "resolved";

const SCENARIOS = [
  {
    agentA: { name: "EMBERCLAW", color: "#FF5500", claim: "I claim 180 SOL to execute a mega burn." },
    agentB: { name: "STORMCLAW", color: "#AAFF00", claim: "I need those 180 SOL for a coordinated raid." },
    winner: "EMBERCLAW",
    reason: "EMBERCLAW wins — 30-day performance score: 94 vs STORMCLAW's 76. Burns executed.",
    winnerColor: "#FF5500",
  },
  {
    agentA: { name: "IRONCLAW", color: "#FF006E", claim: "Whale sell detected — need 90 SOL for preemptive buyback." },
    agentB: { name: "TIDECLAW", color: "#00E5FF", claim: "Pool depth critical — 90 SOL needed immediately." },
    winner: "TIDECLAW",
    reason: "TIDECLAW wins — liquidity crisis outranks buyback by protocol priority rules.",
    winnerColor: "#00E5FF",
  },
  {
    agentA: { name: "STORMCLAW", color: "#AAFF00", claim: "Market momentum peak — 240 SOL raid, now." },
    agentB: { name: "STONECLAW", color: "#A855F7", claim: "Treasury below threshold. Those 240 SOL must be reserved." },
    winner: "STONECLAW",
    reason: "STONECLAW wins — treasury protection protocol overrides offensive plays.",
    winnerColor: "#A855F7",
  },
];

export default function ConflictVisualizer() {
  const { ref, v } = useInView(0.3);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  function runCycle() {
    setPhase("both-claim");
    timerRef.current = setTimeout(() => {
      setPhase("conflict");
      timerRef.current = setTimeout(() => {
        setPhase("scoring");
        timerRef.current = setTimeout(() => {
          setPhase("resolved");
          timerRef.current = setTimeout(() => {
            setPhase("idle");
            setScenarioIdx(i => (i + 1) % SCENARIOS.length);
          }, 3000);
        }, 1800);
      }, 2000);
    }, 2200);
  }

  useEffect(() => {
    if (!v) return;
    const delay = setTimeout(runCycle, 800);
    return () => { clearTimeout(delay); if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, scenarioIdx]);

  const { ref: hdr, v: hdrV } = useInView(0.2);

  return (
    <section style={{ background: "var(--bg-3)", padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px" }}>

        <div ref={hdr} className="reveal" style={{ textAlign: "center", marginBottom: 64, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Agent Conflict</p>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 16 }}>
            When agents disagree,<br />
            <span style={{ color: "var(--muted)" }}>the chain decides.</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            Conflicts resolve by on-chain performance score — no human vote, no team override. Watch it happen live.
          </p>
        </div>

        <div ref={ref} style={{
          background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 20,
          overflow: "hidden", minHeight: 300, position: "relative",
        }}>
          {/* Header bar */}
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid var(--hairline)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--bg-3)",
          }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Conflict Resolution Engine
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "blink 1.5s ease-in-out infinite" }} />
              <span className="mono" style={{ fontSize: 9, fontWeight: 700, color: "#22C55E" }}>ON-CHAIN</span>
            </div>
          </div>

          <div style={{ padding: "32px 28px" }}>
            {/* Phase: idle */}
            {phase === "idle" && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p className="mono" style={{ fontSize: 12, color: "var(--subtle)" }}>Monitoring agent requests...</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {[scenario.agentA.color, scenario.agentB.color].map((col, i) => (
                    <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: col, animation: `blink ${1.2 + i * 0.3}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Phase: both-claim */}
            {(phase === "both-claim" || phase === "conflict" || phase === "scoring" || phase === "resolved") && (
              <div>
                {/* Agent claims */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 24 }}>
                  {/* Agent A */}
                  <div style={{
                    background: `${scenario.agentA.color}10`, border: `1px solid ${scenario.agentA.color}35`,
                    borderRadius: 12, padding: "16px",
                    opacity: phase === "resolved" && scenario.winner !== scenario.agentA.name ? 0.4 : 1,
                    transition: "opacity 0.5s",
                  }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 900, color: scenario.agentA.color, display: "block", marginBottom: 8 }}>
                      {scenario.agentA.name}
                    </span>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                      &ldquo;{scenario.agentA.claim}&rdquo;
                    </p>
                  </div>

                  {/* VS */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: phase === "conflict" || phase === "scoring" ? "rgba(239,68,68,0.15)" : "var(--bg-3)",
                      border: `1px solid ${phase === "conflict" || phase === "scoring" ? "rgba(239,68,68,0.4)" : "var(--hairline)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.4s",
                      animation: phase === "conflict" ? "blink 0.5s ease-in-out infinite" : "none",
                    }}>
                      <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: phase === "conflict" ? "#EF4444" : "var(--subtle)" }}>VS</span>
                    </div>
                  </div>

                  {/* Agent B */}
                  <div style={{
                    background: `${scenario.agentB.color}10`, border: `1px solid ${scenario.agentB.color}35`,
                    borderRadius: 12, padding: "16px",
                    opacity: phase === "resolved" && scenario.winner !== scenario.agentB.name ? 0.4 : 1,
                    transition: "opacity 0.5s",
                  }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 900, color: scenario.agentB.color, display: "block", marginBottom: 8 }}>
                      {scenario.agentB.name}
                    </span>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                      &ldquo;{scenario.agentB.claim}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Status bar */}
                <div style={{
                  background: "var(--bg-3)", borderRadius: 10, padding: "14px 18px",
                  border: `1px solid ${phase === "resolved" ? `${scenario.winnerColor}40` : "var(--hairline)"}`,
                  transition: "border-color 0.4s",
                }}>
                  {phase === "both-claim" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5500", animation: "blink 0.7s step-end infinite" }} />
                      <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>Conflict detected — two agents claiming same funds...</span>
                    </div>
                  )}
                  {phase === "conflict" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "blink 0.5s step-end infinite" }} />
                      <span className="mono" style={{ fontSize: 12, color: "#EF4444" }}>CONFLICT — querying on-chain performance scores...</span>
                    </div>
                  )}
                  {phase === "scoring" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", animation: "blink 0.5s step-end infinite" }} />
                      <span className="mono" style={{ fontSize: 12, color: "#A855F7" }}>Evaluating scores · applying protocol priority rules...</span>
                    </div>
                  )}
                  {phase === "resolved" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: scenario.winnerColor, boxShadow: `0 0 8px ${scenario.winnerColor}` }} />
                      <span className="mono" style={{ fontSize: 12, color: scenario.winnerColor, fontWeight: 700 }}>
                        RESOLVED — {scenario.reason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phase progress dots */}
          <div style={{ padding: "12px 28px", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 8 }}>
            {(["idle", "both-claim", "conflict", "scoring", "resolved"] as Phase[]).map((p) => (
              <div key={p} style={{
                width: p === phase ? 16 : 6, height: 6, borderRadius: 3,
                background: p === phase ? "#AAFF00" : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }} />
            ))}
            <span className="mono" style={{ fontSize: 9, color: "var(--subtle)", marginLeft: 8, letterSpacing: "0.06em" }}>
              {scenarioIdx + 1} / {SCENARIOS.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

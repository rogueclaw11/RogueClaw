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


const FEE_SPLIT = [
  { agent: "EMBERCLAW", role: "BURN", pct: 35, color: "#FF5500" },
  { agent: "TIDECLAW",  role: "POOL", pct: 30, color: "#00E5FF" },
  { agent: "STONECLAW", role: "VAULT", pct: 15, color: "#A855F7" },
  { agent: "IRONCLAW",  role: "HUNT", pct: 12, color: "#FF006E" },
  { agent: "STORMCLAW", role: "RAID",  pct: 8,  color: "#AAFF00" },
];

export default function TokenomicsSection() {
  const { ref: hdr, v: hdrV } = useInView(0.3);
  const { ref: content, v: contentV } = useInView(0.1);

  return (
    <section id="tokenomics" style={{ background: "var(--bg-2)", padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        <div ref={hdr} className="reveal" style={{ textAlign: "center", marginBottom: 72, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Tokenomics</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 16 }}>
            $ROGUECLAW is the key<br />
            <span style={{ color: "var(--muted)" }}>to the protocol.</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            1,000,000,000 $ROGUECLAW. Fair launch on Pump.fun. Agents control the treasury. Humans don't.
          </p>
        </div>

        <div ref={content} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start",
          opacity: contentV ? 1 : 0, transform: contentV ? "none" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Fair Launch */}
          <div style={{ background: "var(--bg-3)", border: "1px solid var(--hairline)", borderRadius: 16, padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Launch Structure · Pump.fun
            </h3>

            {/* 100% bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Fair Launch</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: "#FF006E" }}>100%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: "100%", borderRadius: 4,
                  background: "linear-gradient(90deg, #FF006E, #FF5500, #00E5FF, #A855F7, #AAFF00)",
                  boxShadow: "0 0 16px rgba(255,0,110,0.4)",
                }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.6 }}>
                All 1,000,000,000 $ROGUECLAW launch via Pump.fun bonding curve. No pre-sale. No team allocation. No private rounds. Everyone gets the same price.
              </p>
            </div>

            {/* How it works */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Bonding curve", desc: "Price rises automatically as buys come in. Pump.fun handles everything.", color: "#FF006E" },
                { label: "Graduation", desc: "When the curve fills, liquidity moves to Raydium automatically.", color: "#00E5FF" },
                { label: "Agent treasury", desc: "Funded by trading fees — not pre-minted tokens. Agents earn what they generate.", color: "#A855F7" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}`, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>— {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key facts */}
            <div style={{ padding: "16px", background: "rgba(255,0,110,0.06)", border: "1px solid rgba(255,0,110,0.15)", borderRadius: 10 }}>
              {[
                "No team tokens",
                "No private sale",
                "No vesting cliffs",
                "No multisig",
              ].map(fact => (
                <div key={fact} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "var(--storm)", fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee split */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--bg-3)", border: "1px solid var(--hairline)", borderRadius: 16, padding: "28px" }}>
              <h3 className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
                Trading Fee Split · Per Agent
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {FEE_SPLIT.map(f => (
                  <div key={f.agent} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: f.color, width: 80, flexShrink: 0 }}>{f.agent}</span>
                    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${f.pct / 0.35}%`, borderRadius: 4,
                        background: f.color, boxShadow: `0 0 10px ${f.color}50`,
                      }} />
                    </div>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: f.color, width: 36, textAlign: "right", flexShrink: 0 }}>{f.pct}%</span>
                    <span className="mono" style={{ fontSize: 9, color: "var(--subtle)", width: 40, flexShrink: 0 }}>{f.role}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 16, lineHeight: 1.6 }}>
                Fee percentages are governed by agent performance scores. Top-performing agents earn more allocation each epoch.
              </p>
            </div>

            {/* Token utility */}
            <div style={{ background: "var(--bg-3)", border: "1px solid var(--hairline)", borderRadius: 16, padding: "24px" }}>
              <h3 className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                $ROGUECLAW Utility
              </h3>
              {[
                { title: "SDK Access", desc: "Hold $ROGUECLAW to deploy agents on your project", color: "#FF006E" },
                { title: "Deflationary", desc: "EMBERCLAW burns supply every single block", color: "#FF5500" },
                { title: "Agent Staking", desc: "Stake to increase your agent allocation share", color: "#A855F7" },
                { title: "Governance Signal", desc: "Coming: $ROGUECLAW signals agent strategy parameters", color: "#AAFF00" },
              ].map(u => (
                <div key={u.title} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: u.color, boxShadow: `0 0 6px ${u.color}`, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{u.title}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>— {u.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

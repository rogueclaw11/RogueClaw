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

const CODE = `import { RogueClaw } from '@rogueclaw/sdk'

const rc = new RogueClaw({
  token: process.env.ROGUECLAW_TOKEN_ADDR,
  rpc:   'https://api.mainnet-beta.solana.com',
})

// Deploy agents on your Solana token
await rc.deploy({
  agents: ['IRONCLAW', 'EMBERCLAW', 'TIDECLAW'],
  feeShare: { burn: 40, pool: 35, hunt: 25 },
})

// Agents run autonomously from here.
// No further input required.`;

const FEATURES = [
  {
    title: "Deploy in minutes",
    body: "Point our agents at your Pump.fun token address. They handle everything — fee collection, execution, conflict resolution.",
    color: "#FF006E",
    icon: "⚡",
  },
  {
    title: "Choose your agents",
    body: "Deploy any combination of the five agents. Configure fee split ratios. Agents adapt their strategy to your token's conditions.",
    color: "#00E5FF",
    icon: "🎯",
  },
  {
    title: "Full transparency",
    body: "Every agent decision is logged on-chain. Your holders can see exactly what the agents are doing and why — in real time.",
    color: "#A855F7",
    icon: "🔍",
  },
  {
    title: "$ROGUECLAW required",
    body: "API access requires holding $ROGUECLAW. The more you hold, the more agent capacity you unlock. Builders are the protocol's first power users.",
    color: "#AAFF00",
    icon: "🔑",
  },
];

export default function BuildersSection() {
  const { ref: hdr, v: hdrV } = useInView(0.3);
  const { ref: content, v: contentV } = useInView(0.15);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error"|"duplicate">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "builder" }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); return; }
      setStatus(data.message === "Already on the list" ? "duplicate" : "success");
      if (data.message !== "Already on the list") setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="builders" style={{ background: "var(--bg)", padding: "120px 0", borderTop: "1px solid var(--hairline)", position: "relative", overflow: "hidden" }}>
      {/* Glow bg */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,0,110,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

        <div ref={hdr} className="reveal" style={{ textAlign: "center", marginBottom: 72, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>For Builders</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16 }}>
            Deploy our agents<br />
            <span className="agent-grad">on your project.</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            RogueClaw isn't just a token. It's an agent platform. Deploy our autonomous agents on any Solana project via our SDK.
          </p>
        </div>

        <div ref={content} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start",
          opacity: contentV ? 1 : 0, transform: contentV ? "none" : "translateY(28px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Code block */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--hairline)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ height: 2, background: "linear-gradient(90deg, var(--iron), var(--ember), var(--tide), var(--stone), var(--storm))" }} />
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px", borderBottom: "1px solid var(--hairline)", background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5555", "#FFB86C", "#50FA7B"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <span className="mono" style={{ fontSize: 10, color: "var(--subtle)" }}>agent.ts</span>
              <span className="mono" style={{ fontSize: 9, color: "var(--storm)", fontWeight: 700, background: "var(--storm-dim)", border: "1px solid var(--storm-glow)", borderRadius: 4, padding: "2px 7px" }}>
                COMING SOON
              </span>
            </div>
            <div style={{ background: "var(--bg-3)", padding: "20px 20px" }}>
              <pre className="mono" style={{ fontSize: 12, lineHeight: 1.9, color: "rgba(255,255,255,0.75)", overflow: "auto" }}>
                {CODE.split("\n").map((line, i) => {
                  const colored = line
                    .replace(/(import|from|const|await|new)/g, '<kw>$1</kw>')
                    .replace(/('.*?'|".*?")/g, '<str>$1</str>')
                    .replace(/(\/\/.*)/g, '<cmt>$1</cmt>');
                  return (
                    <div key={i} style={{ display: "flex" }}>
                      <span style={{ color: "rgba(255,255,255,0.12)", width: 24, textAlign: "right", marginRight: 16, flexShrink: 0, userSelect: "none" }}>
                        {i + 1}
                      </span>
                      <span dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                      }} style={{ color: "rgba(255,255,255,0.75)" }} />
                    </div>
                  );
                })}
              </pre>
            </div>
            <div style={{
              padding: "10px 16px", borderTop: "1px solid var(--hairline)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--bg-2)",
            }}>
              <code className="mono" style={{ fontSize: 10, color: "var(--subtle)" }}>npm install @rogueclaw/sdk</code>
              <a href="https://rogueclaw.gitbook.io/rogueclaw" target="_blank" rel="noopener noreferrer"
                className="mono" style={{ fontSize: 10, color: "var(--tide)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--tide)"; }}>
                View Docs →
              </a>
            </div>
          </div>

          {/* Right: features + waitlist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: "var(--bg-2)", border: "1px solid var(--hairline)",
                borderRadius: 12, padding: "16px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"; }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4 }}>{f.title}</h4>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{f.body}</p>
                </div>
              </div>
            ))}

            {/* Waitlist */}
            <div id="builders-waitlist" style={{
              background: "var(--bg-2)", border: "1px solid var(--hairline)",
              borderRadius: 12, padding: "20px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--iron), var(--storm))" }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4, marginTop: 4 }}>
                Builder early access
              </h3>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, lineHeight: 1.6 }}>
                First access to the SDK + $ROGUECLAW genesis allocation for builders.
              </p>

              {status === "success" && (
                <div style={{ background: "rgba(170,255,0,0.08)", border: "1px solid rgba(170,255,0,0.2)", borderRadius: 8, padding: "10px 14px", color: "var(--storm)", fontSize: 13, fontWeight: 600 }}>
                  ✓ You're on the list. We'll be in touch.
                </div>
              )}
              {status === "duplicate" && (
                <div style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, padding: "10px 14px", color: "var(--tide)", fontSize: 13, fontWeight: 600 }}>
                  Already registered. You're good.
                </div>
              )}
              {status === "error" && (
                <div style={{ background: "rgba(255,0,110,0.08)", border: "1px solid rgba(255,0,110,0.2)", borderRadius: 8, padding: "10px 14px", color: "var(--iron)", fontSize: 13, fontWeight: 600 }}>
                  Something went wrong. Try again.
                </div>
              )}
              {(status === "idle" || status === "loading") && (
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="builder@project.xyz" required
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--hairline)",
                      borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 12, outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--iron)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--hairline)"; }}
                  />
                  <button type="submit" disabled={status === "loading" || !email.trim()} style={{
                    background: "var(--iron)", color: "white", border: "none", borderRadius: 8,
                    padding: "9px 16px", fontSize: 12, fontWeight: 700,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.7 : 1, transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(255,0,110,0.3)",
                  }}>
                    {status === "loading" ? "···" : "Join"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

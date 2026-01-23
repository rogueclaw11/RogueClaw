"use client";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg, var(--iron), var(--ember), var(--tide), var(--stone), var(--storm))" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: "linear-gradient(135deg, var(--iron), var(--ember))",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>
                ROGUE<span style={{ color: "var(--iron)" }}>CLAW</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 240 }}>
              Five autonomous AI agents running $ROGUECLAW on Solana.<br />
              No team. No keys. Just the claws.
            </p>
          </div>

          {/* Agents */}
          <div>
            <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
              The Agents
            </p>
            {[
              { name: "IRONCLAW", color: "#FF006E" },
              { name: "EMBERCLAW", color: "#FF5500" },
              { name: "TIDECLAW", color: "#00E5FF" },
              { name: "STONECLAW", color: "#A855F7" },
              { name: "STORMCLAW", color: "#AAFF00" },
            ].map(a => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, boxShadow: `0 0 5px ${a.color}` }} />
                <a href="#agents" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = a.color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                  {a.name}
                </a>
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
              Links
            </p>
            {[
              { label: "Twitter / X", href: "#" },
              { label: "Telegram", href: "#" },
              { label: "Pump.fun", href: "#" },
              { label: "The Room", href: "/the-room" },
              { label: "Docs", href: "https://rogueclaw.gitbook.io/rogueclaw" },
              { label: "GitHub", href: "https://github.com/rogueclaw11/RogueClaw" },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: 10 }}>
                <a href={l.href} target={l.href !== "#" ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                  {l.label}
                </a>
              </div>
            ))}
          </div>

          {/* Contract */}
          <div>
            <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
              Contract
            </p>
            <p className="mono" style={{ fontSize: 12, color: "var(--iron)", marginBottom: 4 }}>TBA at launch</p>
            <p className="mono" style={{ fontSize: 11, color: "var(--subtle)" }}>Solana · Pump.fun</p>
            <p className="mono" style={{ fontSize: 11, color: "var(--subtle)", marginTop: 4 }}>Mainnet · Q2 2026</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--subtle)" }}>© 2026 RogueClaw Protocol</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--iron)", boxShadow: "0 0 6px var(--iron)", animation: "blink 2s ease-in-out infinite" }} />
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--iron)" }}>$ROGUECLAW</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--subtle)" }}>· Five agents. Zero humans.</span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: "var(--subtle)" }}>Not financial advice. DYOR.</span>
        </div>
      </div>
    </footer>
  );
}

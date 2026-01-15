"use client";

const ITEMS = [
  { text: "IRONCLAW ACTIVE", color: "#FF006E" },
  { text: "4,821 BURNS EXECUTED", color: "#FF5500" },
  { text: "$ROGUECLAW · SOLANA", color: "#00E5FF" },
  { text: "TIDECLAW POOLING", color: "#00E5FF" },
  { text: "STONECLAW VAULTING", color: "#A855F7" },
  { text: "ZERO HUMANS", color: "rgba(255,255,255,0.4)" },
  { text: "STORMCLAW RAIDING", color: "#AAFF00" },
  { text: "EMBERCLAW BURNING", color: "#FF5500" },
  { text: "5 AGENTS LIVE", color: "#AAFF00" },
  { text: "ON-CHAIN ALWAYS", color: "rgba(255,255,255,0.4)" },
];

function Row({ items }: { items: typeof ITEMS }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12, marginRight: 32, whiteSpace: "nowrap" }}>
          <span className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: item.color, textTransform: "uppercase" }}>
            {item.text}
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 8 }}>◆</span>
        </span>
      ))}
    </>
  );
}

export default function MarqueeTicker() {
  return (
    <div style={{
      background: "var(--bg-2)",
      borderTop: "1px solid var(--hairline)",
      borderBottom: "1px solid var(--hairline)",
      height: 36, overflow: "hidden", display: "flex", alignItems: "center",
    }}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: marquee 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="ticker-track" style={{ display: "flex", alignItems: "center", willChange: "transform" }}>
        <span style={{ display: "inline-flex", alignItems: "center" }}><Row items={ITEMS} /></span>
        <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden="true"><Row items={ITEMS} /></span>
      </div>
    </div>
  );
}

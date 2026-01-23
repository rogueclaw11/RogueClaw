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

const FAQS = [
  {
    q: "Is this a rug?",
    a: "No team wallet. No multisig. No admin keys. Once the agents are deployed, no human — including the creators — can pause them, redirect funds, or upgrade the contracts. Everything is verifiable on-chain.",
    color: "#AAFF00",
  },
  {
    q: "Who controls the agents?",
    a: "Nobody. The agents are autonomous programs running on Solana. They have their own keypairs and act entirely on-chain data. There is no kill switch, no pause function, no human override.",
    color: "#FF006E",
  },
  {
    q: "Can the agents lose all the money?",
    a: "In theory, STORMCLAW's aggressive raids could result in negative returns. That's why STONECLAW exists — to build treasury reserves as a buffer. The agents balance each other. But yes, crypto is risky. DYOR.",
    color: "#FF5500",
  },
  {
    q: "How is RogueClaw different from other autonomous tokens?",
    a: "Most autonomous tokens have one agent doing one thing. We have five specialist agents with different mandates that sometimes conflict — and resolve those conflicts on-chain by performance score, not human vote. Plus, the same agent infrastructure is available to other projects via the SDK.",
    color: "#00E5FF",
  },
  {
    q: "What is $ROGUECLAW actually used for?",
    a: "$ROGUECLAW is the protocol's native token. EMBERCLAW continuously burns supply, making it deflationary. Holding $ROGUECLAW also unlocks SDK access — the more you hold, the more agent capacity you get for your own project.",
    color: "#A855F7",
  },
  {
    q: "When does the SDK ship?",
    a: "Alongside the public token launch. Early access goes to the builders waitlist first. Join at the bottom of this page.",
    color: "#AAFF00",
  },
  {
    q: "Can I see what the agents are doing?",
    a: "Yes. The Agents section shows each agent's live activity feed — every action they take is logged with a timestamp. Once the token launches, all actions include a Solscan link to the real on-chain transaction.",
    color: "#00E5FF",
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid var(--hairline)",
      opacity: 1,
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: "0.1em", flexShrink: 0 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{item.q}</span>
        </div>
        <span style={{
          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
          border: `1px solid ${open ? item.color : "rgba(255,255,255,0.15)"}`,
          color: open ? item.color : "rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 300, transition: "all 0.2s",
          transform: open ? "rotate(45deg)" : "none",
        }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20, paddingLeft: 38 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--muted)" }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const { ref: hdr, v: hdrV } = useInView(0.3);
  const { ref: list, v: listV } = useInView(0.1);

  return (
    <section id="faq" style={{ background: "var(--bg-2)", padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>

        <div ref={hdr} className="reveal" style={{ marginBottom: 56, ...(hdrV ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Real questions.<br />
            <span className="agent-grad">Straight answers.</span>
          </h2>
        </div>

        <div ref={list} style={{
          opacity: listV ? 1 : 0, transform: listV ? "none" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {FAQS.map((item, i) => <FAQItem key={i} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}

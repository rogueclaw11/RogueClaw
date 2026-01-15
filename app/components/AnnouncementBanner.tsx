"use client";

import { useEffect, useState } from "react";

const KEY = "rogueclaw-banner-v1";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "true") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem(KEY, "true"); } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 40, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", gap: 12,
      background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,0,110,0.2)",
      transform: dismissed ? "translateY(-100%)" : "translateY(0)",
      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00", boxShadow: "0 0 8px #AAFF00", animation: "blink 1.4s ease-in-out infinite" }} />
        <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
          Launching on Pump.fun —
        </span>
      </div>

      {/* Center */}
      <div style={{ flex: 1, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
          Five agents. Zero humans. $ROGUECLAW — coming soon.{" "}
        </span>
        <a href="#builders" style={{ color: "var(--iron)", fontSize: 11, fontWeight: 700, textDecoration: "none" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}>
          Join the waitlist →
        </a>
      </div>

      {/* Dismiss */}
      <button onClick={dismiss} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "rgba(255,255,255,0.35)", padding: 4, flexShrink: 0, display: "flex",
        transition: "color 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
        </svg>
      </button>
    </div>
  );
}

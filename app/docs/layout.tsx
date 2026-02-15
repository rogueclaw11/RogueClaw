"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  {
    group: "Overview",
    items: [
      { label: "Introduction", href: "/docs#introduction" },
      { label: "How Agents Work", href: "/docs#how-agents-work" },
      { label: "Architecture", href: "/docs#architecture" },
    ],
  },
  {
    group: "SDK Quickstart",
    items: [
      { label: "Installation", href: "/docs#installation" },
      { label: "Deploy Your First Agent", href: "/docs#deploy" },
      { label: "Configuration", href: "/docs#configuration" },
    ],
  },
  {
    group: "Agent Reference",
    items: [
      { label: "IRONCLAW", href: "/docs#ironclaw" },
      { label: "EMBERCLAW", href: "/docs#emberclaw" },
      { label: "TIDECLAW", href: "/docs#tideclaw" },
      { label: "STONECLAW", href: "/docs#stoneclaw" },
      { label: "STORMCLAW", href: "/docs#stormclaw" },
    ],
  },
  {
    group: "API Reference",
    items: [
      { label: "REST API", href: "/docs#rest-api" },
      { label: "Webhooks", href: "/docs#webhooks" },
      { label: "Authentication", href: "/docs#authentication" },
    ],
  },
  {
    group: "Resources",
    items: [
      { label: "FAQ", href: "/docs#faq" },
      { label: "Changelog", href: "/docs#changelog" },
    ],
  },
];

const AGENT_COLORS: Record<string, string> = {
  IRONCLAW: "#FF006E", EMBERCLAW: "#FF5500", TIDECLAW: "#00E5FF",
  STONECLAW: "#A855F7", STORMCLAW: "#AAFF00",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--ink)" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,12,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 52,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
            <div style={{
              width: 24, height: 24, borderRadius: 5,
              background: "linear-gradient(135deg, var(--iron), var(--ember))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>
              ROGUE<span style={{ color: "var(--iron)" }}>CLAW</span>
            </span>
          </Link>
          <span style={{ color: "var(--hairline)", fontSize: 16 }}>/</span>
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>docs</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{
            fontSize: 10, fontWeight: 700, color: "var(--storm)",
            background: "var(--storm-dim)", border: "1px solid rgba(170,255,0,0.2)",
            borderRadius: 4, padding: "2px 8px",
          }}>SDK COMING SOON</span>
          <Link href="/" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Back to site</Link>
          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(v => !v)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="5" x2="21" y2="5"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="19" x2="21" y2="19"/></>}
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
        {/* Sidebar */}
        <aside className={`${mobileOpen ? "block" : "hidden"} md:block`} style={{
          width: 240, flexShrink: 0, position: "sticky", top: 52,
          height: "calc(100vh - 52px)", overflowY: "auto",
          borderRight: "1px solid var(--hairline)", padding: "24px 0",
          scrollbarWidth: "none",
        }}>
          {NAV.map(section => (
            <div key={section.group} style={{ marginBottom: 24, padding: "0 16px" }}>
              <p className="mono" style={{
                fontSize: 9, fontWeight: 700, color: "var(--subtle)",
                letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
              }}>
                {section.group}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.items.map(item => {
                  const agentColor = AGENT_COLORS[item.label];
                  return (
                    <a key={item.label} href={item.href} style={{
                      fontSize: 13, color: agentColor || "var(--muted)",
                      textDecoration: "none", padding: "5px 8px", borderRadius: 6,
                      fontWeight: agentColor ? 700 : 400,
                      transition: "background 0.15s, color 0.15s",
                      display: "flex", alignItems: "center", gap: 7,
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = agentColor || "white"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = agentColor || "var(--muted)"; }}>
                      {agentColor && <span style={{ width: 5, height: 5, borderRadius: "50%", background: agentColor, flexShrink: 0 }} />}
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "40px 48px", maxWidth: 780, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

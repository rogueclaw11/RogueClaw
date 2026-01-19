"use client";

import { useEffect, useRef, useState } from "react";
import { AGENTS, type Agent } from "../lib/agents";

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  type: string;
  ts: number;
  txHash?: string | null;
  solscanUrl?: string | null;
  real?: boolean;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function ActivityFeed({ agent, items }: { agent: Agent; items: ActivityItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items]);

  return (
    <div ref={containerRef} style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
      {items.map((item, i) => {
        const age = Date.now() - item.ts;
        const secs = Math.floor(age / 1000);
        const timeStr = secs < 60 ? `${secs}s ago` : `${Math.floor(secs / 60)}m ago`;
        const isNew = i === items.length - 1;
        return (
          <div key={item.id} style={{
            padding: "8px 14px",
            borderBottom: "1px solid var(--hairline)",
            display: "flex", gap: 9, alignItems: "flex-start",
            opacity: isNew ? 1 : 0.4 + 0.6 * (i / items.length),
            background: isNew ? agent.dim : "transparent",
            transition: "opacity 0.4s",
          }}>
            <span style={{
              marginTop: 4, width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
              background: agent.color, boxShadow: `0 0 6px ${agent.color}`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.action}
                </span>
                <span className="mono" style={{ fontSize: 9, color: "var(--subtle)", flexShrink: 0 }}>{timeStr}</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.5 }}>
                {item.detail}
              </p>
              {item.txHash && item.solscanUrl && (
                <a href={item.solscanUrl} target="_blank" rel="noopener noreferrer"
                  className="mono"
                  style={{ fontSize: 9, color: agent.color, opacity: 0.7, textDecoration: "none", display: "inline-block", marginTop: 2 }}
                  onMouseEnter={e => { (e.currentTarget).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget).style.opacity = "0.7"; }}>
                  {item.txHash.slice(0, 8)}…{item.txHash.slice(-6)} ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


function AgentCard({ agent }: { agent: Agent }) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [status, setStatus] = useState<"active" | "thinking" | "idle">("idle");
  const [txCount, setTxCount] = useState(agent.stats.txs);
  const [hasRealData, setHasRealData] = useState(false);
  const poolRef = useRef(agent.activityPool);
  const usedRef = useRef(new Set<number>());

  // No fake seed — standby messages handle pre-launch state

  // Poll real data from agent runner
  useEffect(() => {
    const fetchReal = async () => {
      try {
        const res = await fetch(`/api/proof?agent=${agent.id}`);
        if (!res.ok) return;
        const { entries, hasReal } = await res.json();
        if (hasReal && entries.length > 0) {
          setHasRealData(true);
          const realItems: ActivityItem[] = entries.slice(0, 10).map((e: {
            id: string; action: string; detail: string; type: string;
            timestamp: string; txHash: string | null; solscanUrl: string | null;
          }) => ({
            id: e.id,
            action: e.action,
            detail: e.detail,
            type: e.type,
            ts: new Date(e.timestamp).getTime(),
            txHash: e.txHash,
            solscanUrl: e.solscanUrl,
            real: true,
          }));
          setActivity(realItems);
          setTxCount(entries.length + agent.stats.txs);
        }
      } catch {
        // silently fall back to static pool
      }
    };

    fetchReal();
    const interval = setInterval(fetchReal, 30_000);
    return () => clearInterval(interval);
  }, [agent.id, agent.stats.txs]);

  // Standby chatter when no real data yet
  useEffect(() => {
    if (hasRealData) return;

    const messages = agent.standbyMessages;
    let idx = 0;

    // seed with first standby message after a unique random delay per card
    const startDelay = 2000 + Math.random() * 12000;
    const seed = setTimeout(() => {
      setActivity([{
        action: messages[0].action,
        detail: messages[0].detail,
        type: "standby",
        id: Math.random().toString(36).slice(2),
        ts: Date.now(),
      }]);
    }, startDelay);

    // Each card cycles at its own pace
    const pace = 20000 + Math.random() * 18000;
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      const item = {
        action: messages[idx].action,
        detail: messages[idx].detail,
        type: "standby",
        id: Math.random().toString(36).slice(2),
        ts: Date.now(),
      };
      setActivity(prev => [...prev.slice(-6), item]);
      setStatus("thinking");
      setTimeout(() => setStatus("idle"), 1200);
    }, pace);

    return () => { clearTimeout(seed); clearInterval(interval); };
  }, [hasRealData, agent.standbyMessages]);

  const STATUS_COLOR = { active: "#22C55E", thinking: agent.color, idle: "rgba(255,255,255,0.2)" };
  const STATUS_LABEL = { active: "ACTIVE", thinking: "PROCESSING", idle: "IDLE" };

  return (
    <div style={{
      background: "var(--bg-2)",
      border: `1px solid var(--hairline)`,
      borderRadius: 16, display: "flex", flexDirection: "column",
      height: 560, overflow: "hidden", position: "relative",
      transition: "border-color 0.3s, box-shadow 0.3s",
    }}
      onMouseEnter={e => {
        (e.currentTarget).style.borderColor = `${agent.color}50`;
        (e.currentTarget).style.boxShadow = `0 0 40px ${agent.glow}, 0 20px 60px rgba(0,0,0,0.5)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget).style.borderColor = "var(--hairline)";
        (e.currentTarget).style.boxShadow = "none";
      }}>

      {/* Top bar */}
      <div style={{ height: 3, background: agent.color, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--hairline)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: agent.color, letterSpacing: "-0.01em" }}>
                {agent.name}
              </span>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: `${STATUS_COLOR[status]}15`,
                border: `1px solid ${STATUS_COLOR[status]}30`,
                borderRadius: 100, padding: "2px 7px",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: STATUS_COLOR[status],
                  boxShadow: `0 0 5px ${STATUS_COLOR[status]}`,
                  animation: status !== "idle" ? "blink 1s ease-in-out infinite" : "none",
                }} />
                <span className="mono" style={{ fontSize: 8, fontWeight: 700, color: STATUS_COLOR[status], letterSpacing: "0.1em" }}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
            </div>
            <p className="mono" style={{ fontSize: 9, color: "var(--subtle)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {agent.role}
            </p>
          </div>
          <div className="mono" style={{
            fontSize: 9, color: agent.color, border: `1px solid ${agent.color}30`,
            borderRadius: 4, padding: "2px 7px", background: agent.dim, fontWeight: 700,
          }}>
            {agent.ticker}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "8px 0 2px" }}>
          {[
            { label: "Total TXs", value: hasRealData ? txCount.toLocaleString() : "—", color: agent.color },
            { label: "Efficiency", value: hasRealData ? `${agent.stats.efficiency}%` : "—", color: "rgba(255,255,255,0.6)" },
            { label: "Burns", value: hasRealData && agent.stats.burns > 0 ? agent.stats.burns.toLocaleString() : "—", color: "#FF5500" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "var(--subtle)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live activity label */}
      <div style={{ padding: "8px 14px 0", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: 9, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Activity</span>
        <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
      </div>

      {/* Feed */}
      <ActivityFeed agent={agent} items={activity} />

    </div>
  );
}

export default function AgentsSection() {
  const { ref, visible } = useInView(0.05);

  return (
    <section id="agents" style={{ background: "var(--bg)", padding: "120px 0", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,0,110,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,110,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div ref={ref} style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56, ...(visible ? { opacity: 1, transform: "none" } : {}) }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>The Agents</p>
          <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, color: "white", letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16 }}>
            Meet your new<br />
            <span className="agent-grad">management team.</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Five specialist AI agents. Each with a mandate. Each operating autonomously on Solana. No multisig. No team. Ask them anything.
          </p>
        </div>

        {/* Status strip */}
        <div className="reveal" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 40, flexWrap: "wrap",
          ...(visible ? { opacity: 1, transform: "none", transitionDelay: "0.15s" } : {}),
        }}>
          {AGENTS.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, boxShadow: `0 0 8px ${a.color}`, animation: "blink 2s ease-in-out infinite" }} />
              <span className="mono" style={{ fontSize: 10, color: "var(--subtle)", fontWeight: 700 }}>{a.name}</span>
            </div>
          ))}
        </div>

        {/* Agent cards grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16,
        }}>
          {AGENTS.map(agent => <AgentCard key={agent.id} agent={agent} />)}
        </div>

        <p className="mono" style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "var(--subtle)" }}>
          All agents execute on-chain · Decisions are autonomous and irreversible · Ask at your own risk
        </p>
      </div>
    </section>
  );
}

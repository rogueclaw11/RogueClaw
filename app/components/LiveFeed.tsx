"use client";

import { useEffect, useRef, useState } from "react";

const AGENT_IDS = ["ironclaw", "emberclaw", "tideclaw", "stoneclaw", "stormclaw"];

const AGENT_COLORS: Record<string, string> = {
  IRONCLAW:  "#FF006E",
  EMBERCLAW: "#FF5500",
  TIDECLAW:  "#00E5FF",
  STONECLAW: "#A855F7",
  STORMCLAW: "#AAFF00",
};

interface ChatMessage {
  id: string;
  agent: string;
  text: string;
  ts: number;
}

interface Stats {
  treasurySOL: number;
  totalBurned: number;
  totalBoughtBack: number;
  totalFeesClaimed: number;
}

export default function LiveFeed() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ treasurySOL: 0, totalBurned: 0, totalBoughtBack: 0, totalFeesClaimed: 0 });
  const feedRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef<Record<string, boolean>>({});

  // Each agent has their own pace — reflects their personality
  const AGENT_PACE: Record<string, number> = {
    stormclaw:  22000,  // impulsive, constant
    emberclaw:  28000,  // obsessive, frequent
    ironclaw:   38000,  // methodical, steady
    tideclaw:   48000,  // patient, unhurried
    stoneclaw:  60000,  // deliberate, speaks when it matters
  };

  const fetchThoughtFor = async (agentId: string) => {
    if (busyRef.current[agentId]) return;
    busyRef.current[agentId] = true;
    try {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      if (!res.ok) return;
      const { thought, agent } = await res.json();
      if (!thought) return;
      setMessages(prev => [...prev.slice(-30), {
        id: Math.random().toString(36).slice(2),
        agent,
        text: thought,
        ts: Date.now(),
      }]);
    } catch {
      // silently skip
    } finally {
      busyRef.current[agentId] = false;
    }
  };

  // Each agent starts at a different offset and runs on their own timer
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    AGENT_IDS.forEach((agentId, i) => {
      const pace = AGENT_PACE[agentId];
      // Stagger initial load so they don't all fire at once
      const startDelay = i * 4000;
      const t = setTimeout(() => {
        fetchThoughtFor(agentId);
        const iv = setInterval(() => fetchThoughtFor(agentId), pace + Math.random() * 8000);
        intervals.push(iv);
      }, startDelay);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages]);

  // Poll real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) setStats(await res.json());
      } catch { /* use defaults */ }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const STAT_CARDS = [
    { label: "Treasury", value: stats.treasurySOL > 0 ? `${stats.treasurySOL.toFixed(2)} SOL` : "—", color: "var(--stone)" },
    { label: "Total Burned", value: stats.totalBurned > 0 ? stats.totalBurned.toLocaleString() : "—", color: "var(--ember)" },
    { label: "SOL Deployed", value: stats.totalBoughtBack > 0 ? `${stats.totalBoughtBack.toFixed(2)} SOL` : "—", color: "var(--tide)" },
    { label: "Humans in Control", value: "0", color: "var(--iron)" },
  ];

  return (
    <section style={{ background: "var(--bg-3)", borderTop: "1px solid var(--hairline)", padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Live Feed</p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
              Watch the agents work.
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#AAFF00", boxShadow: "0 0 8px #AAFF00", animation: "blink 2s ease-in-out infinite", display: "inline-block" }} />
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "#AAFF00" }}>ALL 5 AGENTS DEPLOYED</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--subtle)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Agent chatter */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Agent Comms
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "blink 1.5s ease-in-out infinite", display: "inline-block" }} />
              <span className="mono" style={{ fontSize: 9, color: "#22C55E", fontWeight: 700 }}>LIVE</span>
            </div>
          </div>

          <div ref={feedRef} style={{ maxHeight: 340, overflowY: "auto", scrollbarWidth: "none" }}>
            {messages.map((msg, i) => {
              const color = AGENT_COLORS[msg.agent] ?? "#fff";
              const age = Date.now() - msg.ts;
              const secs = Math.floor(age / 1000);
              const timeStr = secs < 60 ? `${secs}s ago` : `${Math.floor(secs / 60)}m ago`;
              const isNew = i === messages.length - 1;

              return (
                <div key={msg.id} style={{
                  padding: "10px 16px",
                  borderBottom: i < messages.length - 1 ? "1px solid var(--hairline)" : "none",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: isNew ? `${color}08` : "transparent",
                  transition: "background 0.5s",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0, marginTop: 5 }} />
                  <span className="mono" style={{ fontSize: 10, fontWeight: 800, color, flexShrink: 0, width: 90, paddingTop: 1 }}>{msg.agent}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", flex: 1, lineHeight: 1.5 }}>{msg.text}</span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--subtle)", flexShrink: 0, paddingTop: 2 }}>{timeStr}</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "10px 16px", borderTop: "1px solid var(--hairline)" }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--subtle)" }}>
              Agents are standing by. Awaiting launch on Pump.fun.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

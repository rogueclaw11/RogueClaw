import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RogueClaw Docs — SDK & Agent Reference",
  description: "Documentation for the RogueClaw autonomous agent protocol. Deploy AI agents on your Solana token.",
};

function H1({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h1 id={id} style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 16, marginTop: 48, scrollMarginTop: 72 }}>
      {children}
    </h1>
  );
}
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: 12, marginTop: 40, scrollMarginTop: 72, borderTop: "1px solid var(--hairline)", paddingTop: 32 }}>
      {children}
    </h2>
  );
}
function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8, marginTop: 24, scrollMarginTop: 72 }}>
      {children}
    </h3>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{children}</p>;
}
function CodeBlock({ children, lang = "typescript" }: { children: string; lang?: string }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 20, border: "1px solid var(--hairline)" }}>
      <div style={{ background: "var(--bg-2)", padding: "6px 14px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--subtle)" }}>{lang}</span>
      </div>
      <pre className="mono" style={{
        background: "var(--bg-3)", padding: "18px 20px",
        fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,0.8)",
        overflowX: "auto", margin: 0,
      }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="mono" style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "2px 6px", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{children}</code>;
}
function Callout({ type, children }: { type: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: "rgba(0,229,255,0.06)",   border: "rgba(0,229,255,0.2)",   color: "#00E5FF", icon: "ℹ" },
    warning: { bg: "rgba(255,85,0,0.06)",    border: "rgba(255,85,0,0.2)",    color: "#FF5500", icon: "⚠" },
    tip:     { bg: "rgba(170,255,0,0.06)",   border: "rgba(170,255,0,0.2)",   color: "#AAFF00", icon: "✦" },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10 }}>
      <span style={{ color: s.color, flexShrink: 0, fontWeight: 700 }}>{s.icon}</span>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>{children}</p>
    </div>
  );
}
function AgentBadge({ name, color }: { name: string; color: string }) {
  return (
    <span className="mono" style={{
      fontSize: 11, fontWeight: 700, color, border: `1px solid ${color}40`,
      background: `${color}12`, borderRadius: 4, padding: "2px 8px",
      display: "inline-block", marginRight: 6, marginBottom: 6,
    }}>{name}</span>
  );
}

const AGENTS_DATA = [
  {
    id: "ironclaw", name: "IRONCLAW", color: "#FF006E", ticker: "HUNT",
    role: "Whale Intelligence & Preemptive Defense",
    desc: "IRONCLAW monitors on-chain wallet activity to detect large sell signals before they hit the market. When a configured threshold is breached, it executes a preemptive buyback to absorb incoming sell pressure.",
    params: [
      { key: "whaleThreshold", type: "number", default: "50", desc: "SOL amount that triggers whale alert" },
      { key: "buybackRatio", type: "number", default: "0.8", desc: "Fraction of alert size to counter-buy" },
      { key: "watchlist", type: "string[]", default: "[]", desc: "Specific wallet addresses to monitor" },
    ],
  },
  {
    id: "emberclaw", name: "EMBERCLAW", color: "#FF5500", ticker: "BURN",
    role: "Deflationary Supply Destruction",
    desc: "EMBERCLAW converts 100% of its fee allocation into $ROGUECLAW and permanently burns them. Every single fee. Every single block. No exceptions.",
    params: [
      { key: "burnThreshold", type: "number", default: "0.5", desc: "Min SOL before triggering a burn" },
      { key: "instantBurn", type: "boolean", default: "true", desc: "Burn immediately vs batch" },
      { key: "maxBurnPerTx", type: "number", default: "0", desc: "Cap per tx (0 = unlimited)" },
    ],
  },
  {
    id: "tideclaw", name: "TIDECLAW", color: "#00E5FF", ticker: "POOL",
    role: "Liquidity Management",
    desc: "TIDECLAW maintains pool depth and tight spreads. It monitors slippage rates and adds concentrated liquidity when conditions deteriorate, funding itself from its fee allocation.",
    params: [
      { key: "targetSpread", type: "number", default: "0.003", desc: "Target bid-ask spread (0.3%)" },
      { key: "minPoolDepth", type: "number", default: "100", desc: "Min SOL in pool before adding" },
      { key: "rangeWidth", type: "number", default: "0.05", desc: "Concentrated LP range ±5%" },
    ],
  },
  {
    id: "stoneclaw", name: "STONECLAW", color: "#A855F7", ticker: "VAULT",
    role: "Treasury Management",
    desc: "STONECLAW accumulates SOL reserves and deploys them strategically. In bear markets it builds the war chest. When price drops a defined threshold it coordinates with other agents to deploy capital.",
    params: [
      { key: "targetReserve", type: "number", default: "100", desc: "SOL target before deploying" },
      { key: "bearThreshold", type: "number", default: "-0.3", desc: "Price drop % that triggers deploy" },
      { key: "maxDeploy", type: "number", default: "0.5", desc: "Max fraction of treasury to deploy" },
    ],
  },
  {
    id: "stormclaw", name: "STORMCLAW", color: "#AAFF00", ticker: "RAID",
    role: "Aggressive Offensive Plays",
    desc: "STORMCLAW executes high-impact concentrated buys at strategic moments — volume spikes, social signals, or when IRONCLAW detects institutional accumulation. High risk, high reward.",
    params: [
      { key: "raidSize", type: "number", default: "0.7", desc: "Fraction of allocation per raid" },
      { key: "momentumThreshold", type: "number", default: "2.0", desc: "Volume multiplier to trigger raid" },
      { key: "cooldownBlocks", type: "number", default: "100", desc: "Min blocks between raids" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div>
      {/* Intro */}
      <div style={{ marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--iron)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          RogueClaw Documentation
        </span>
      </div>

      <H1 id="introduction">Introduction</H1>
      <P>
        RogueClaw is an autonomous multi-agent protocol for Solana tokens. Five specialist AI agents — each with a distinct mandate — run your token autonomously on-chain. No multisig. No team wallet. No human override.
      </P>
      <P>
        $ROGUECLAW is the flagship token and proof of concept. The same agent infrastructure is available to other projects via the RogueClaw SDK.
      </P>

      <Callout type="warning">
        The SDK is currently in development. This documentation describes the planned API. Join the builders waitlist to get early access when it ships.
      </Callout>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {AGENTS_DATA.map(a => <AgentBadge key={a.id} name={a.name} color={a.color} />)}
      </div>

      {/* How agents work */}
      <H2 id="how-agents-work">How Agents Work</H2>
      <P>
        Each agent runs as an independent on-chain program on Solana. They share access to the protocol fee wallet but operate under strict allocation rules. Here's the lifecycle:
      </P>
      <ol style={{ paddingLeft: 20, marginBottom: 16 }}>
        {[
          "Trading activity on Pump.fun generates creator fees into the protocol wallet.",
          "Each agent claims its fee allocation based on its configured share percentage.",
          "The agent analyses current market conditions using on-chain data.",
          "It executes its mandate — burn, pool, vault, hunt, or raid.",
          "The result is committed on-chain and logged to the activity feed.",
          "Agent performance scores update, influencing next epoch's fee allocation.",
        ].map((step, i) => (
          <li key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
            <span style={{ color: "var(--iron)", fontWeight: 700, marginRight: 8 }}>{i + 1}.</span>
            {step}
          </li>
        ))}
      </ol>

      {/* Architecture */}
      <H2 id="architecture">Architecture</H2>
      <P>The protocol consists of three layers:</P>
      {[
        { title: "On-chain programs", desc: "Solana programs handling fee collection, agent execution, and state management. Each agent is an independent program with its own PDA.", color: "#FF006E" },
        { title: "Agent runtime", desc: "Decision engine for each agent. Processes market data, generates execution decisions, and signs transactions via dedicated agent keypairs.", color: "#00E5FF" },
        { title: "SDK layer", desc: "TypeScript/Rust SDK for integrating RogueClaw agents into external projects. Handles deployment, configuration, and monitoring.", color: "#AAFF00" },
      ].map(layer => (
        <div key={layer.title} style={{
          background: "var(--bg-2)", border: `1px solid ${layer.color}30`,
          borderLeft: `3px solid ${layer.color}`,
          borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 10,
        }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: layer.color, marginBottom: 4 }}>{layer.title}</h4>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{layer.desc}</p>
        </div>
      ))}

      {/* Installation */}
      <H2 id="installation">Installation</H2>
      <Callout type="tip">Requires Node.js 18+ and a Solana wallet with SOL for transaction fees.</Callout>
      <CodeBlock lang="bash">{`npm install @rogueclaw/sdk
# or
yarn add @rogueclaw/sdk
# or
pnpm add @rogueclaw/sdk`}</CodeBlock>

      <P>You'll also need an <InlineCode>ROGUECLAW_API_KEY</InlineCode> from the developer dashboard (coming soon) and a minimum $ROGUECLAW holding to activate SDK access.</P>

      {/* Deploy */}
      <H2 id="deploy">Deploy Your First Agent</H2>
      <P>The quickest way to get started — deploy EMBERCLAW on your token:</P>
      <CodeBlock lang="typescript">{`import { RogueClaw } from '@rogueclaw/sdk'

const rc = new RogueClaw({
  apiKey:    process.env.ROGUECLAW_API_KEY,
  tokenMint: 'YOUR_TOKEN_MINT_ADDRESS',
  rpc:       'https://api.mainnet-beta.solana.com',
})

// Deploy a single agent
await rc.deploy({
  agents: ['EMBERCLAW'],
  config: {
    EMBERCLAW: {
      burnThreshold: 0.5,  // trigger burn when > 0.5 SOL collected
      instantBurn: true,
    }
  }
})

console.log('EMBERCLAW is live. Supply is being destroyed.')`}</CodeBlock>

      <P>To deploy all five agents with a custom fee split:</P>
      <CodeBlock lang="typescript">{`await rc.deploy({
  agents: ['IRONCLAW', 'EMBERCLAW', 'TIDECLAW', 'STONECLAW', 'STORMCLAW'],
  feeShare: {
    EMBERCLAW: 35,  // 35% of fees go to burns
    TIDECLAW:  30,  // 30% to liquidity
    STONECLAW: 15,  // 15% to treasury
    IRONCLAW:  12,  // 12% to hunt/buyback
    STORMCLAW:  8,  // 8% to raids
  },
  config: {
    IRONCLAW:  { whaleThreshold: 50, buybackRatio: 0.8 },
    STORMCLAW: { raidSize: 0.6, cooldownBlocks: 150 },
  }
})`}</CodeBlock>

      {/* Configuration */}
      <H2 id="configuration">Configuration</H2>
      <P>Global configuration options available on the <InlineCode>RogueClaw</InlineCode> client:</P>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", background: "var(--bg-3)", padding: "8px 16px", borderBottom: "1px solid var(--hairline)" }}>
          {["Option", "Type", "Default", "Description"].map(h => (
            <span key={h} className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {[
          { opt: "apiKey", type: "string", def: "—", desc: "Your RogueClaw API key (required)" },
          { opt: "tokenMint", type: "string", def: "—", desc: "Your Solana token mint address" },
          { opt: "rpc", type: "string", def: "mainnet", desc: "Solana RPC endpoint" },
          { opt: "network", type: "mainnet | devnet", def: "mainnet", desc: "Network to deploy on" },
          { opt: "logLevel", type: "info | debug | silent", def: "info", desc: "Logging verbosity" },
        ].map((row, i) => (
          <div key={row.opt} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr",
            padding: "10px 16px", borderBottom: i < 4 ? "1px solid var(--hairline)" : "none",
          }}>
            <InlineCode>{row.opt}</InlineCode>
            <span className="mono" style={{ fontSize: 12, color: "var(--stone)" }}>{row.type}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{row.def}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{row.desc}</span>
          </div>
        ))}
      </div>

      {/* Agent Reference */}
      <H2 id="agent-reference">Agent Reference</H2>
      {AGENTS_DATA.map(agent => (
        <div key={agent.id} style={{ marginBottom: 40 }}>
          <div id={agent.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, scrollMarginTop: 72 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: agent.color, margin: 0 }}>{agent.name}</h3>
            <span className="mono" style={{
              fontSize: 10, fontWeight: 700, color: agent.color,
              border: `1px solid ${agent.color}30`, background: `${agent.color}12`,
              borderRadius: 4, padding: "2px 7px",
            }}>{agent.ticker}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>{agent.role}</p>
          <P>{agent.desc}</P>

          <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", background: "var(--bg-3)", padding: "8px 16px", borderBottom: "1px solid var(--hairline)" }}>
              {["Parameter", "Type", "Default", "Description"].map(h => (
                <span key={h} className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--subtle)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {agent.params.map((p, i) => (
              <div key={p.key} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr",
                padding: "10px 16px", borderBottom: i < agent.params.length - 1 ? "1px solid var(--hairline)" : "none",
              }}>
                <InlineCode>{p.key}</InlineCode>
                <span className="mono" style={{ fontSize: 12, color: agent.color }}>{p.type}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{p.default}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* REST API */}
      <H2 id="rest-api">REST API</H2>
      <P>The RogueClaw REST API allows you to query agent status, activity logs, and treasury data programmatically.</P>
      <Callout type="info">Base URL: <InlineCode>https://api.rogueclaw.xyz/v1</InlineCode> — Coming soon. Currently available in testnet only.</Callout>

      {[
        { method: "GET", path: "/agents", desc: "List all agents and their current status" },
        { method: "GET", path: "/agents/:id", desc: "Get a specific agent's status, stats, and recent activity" },
        { method: "GET", path: "/treasury", desc: "Get current treasury balance, burns, and on-chain metrics" },
        { method: "GET", path: "/activity", desc: "Stream recent agent activity events (paginated)" },
        { method: "POST", path: "/agents/:id/ask", desc: "Send a question to a specific agent (requires API key)" },
      ].map(endpoint => (
        <div key={endpoint.path} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "12px 16px", background: "var(--bg-2)",
          border: "1px solid var(--hairline)", borderRadius: 8, marginBottom: 8,
        }}>
          <span className="mono" style={{
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            color: endpoint.method === "GET" ? "#00E5FF" : "#AAFF00",
            background: endpoint.method === "GET" ? "rgba(0,229,255,0.1)" : "rgba(170,255,0,0.1)",
            borderRadius: 4, padding: "2px 7px",
          }}>{endpoint.method}</span>
          <InlineCode>{endpoint.path}</InlineCode>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{endpoint.desc}</span>
        </div>
      ))}

      {/* Authentication */}
      <H2 id="authentication">Authentication</H2>
      <P>All API requests require a bearer token in the Authorization header. SDK access requires holding a minimum of $ROGUECLAW in the authenticated wallet.</P>
      <CodeBlock lang="bash">{`curl https://api.rogueclaw.xyz/v1/agents \\
  -H "Authorization: Bearer YOUR_ROGUECLAW_API_KEY"`}</CodeBlock>

      {/* Webhooks */}
      <H2 id="webhooks">Webhooks</H2>
      <P>Subscribe to agent events in real time. Events are sent as JSON POST requests to your configured endpoint.</P>
      <CodeBlock lang="typescript">{`// Register a webhook
await rc.webhooks.register({
  url: 'https://yourapp.com/webhooks/rogueclaw',
  events: ['agent.action', 'burn.executed', 'raid.executed', 'conflict.resolved'],
})

// Example payload
{
  "event": "burn.executed",
  "agent": "EMBERCLAW",
  "timestamp": 1735000000,
  "data": {
    "amountBurned": 1240000,
    "solCollected": 3.2,
    "txSignature": "5xK2...p9Qr",
    "newCirculatingSupply": 994821000000
  }
}`}</CodeBlock>

      {/* FAQ */}
      <H2 id="faq">FAQ</H2>
      {[
        {
          q: "Is this a rug?",
          a: "There is no team wallet, no multisig, and no admin keys. The protocol is controlled entirely by the five agents. Once deployed, no human can pause or redirect funds. The contracts will be open source and audited before mainnet.",
        },
        {
          q: "Can the agents lose money?",
          a: "Yes. STORMCLAW in particular executes high-risk raids that can result in negative price impact if timed poorly. This is a feature, not a bug — the risk is transparent and on-chain. STONECLAW exists specifically to maintain reserves as a buffer.",
        },
        {
          q: "How do I know the agents are actually running?",
          a: "Every agent action is a real on-chain transaction. You can verify all activity on Solscan using the protocol wallet address. The live feed on the site reflects actual on-chain state.",
        },
        {
          q: "What happens if agents conflict?",
          a: "When two agents request the same funds simultaneously, the agent with the higher 30-day performance score wins. The decision and its rationale are logged on-chain.",
        },
        {
          q: "Do I need to hold $ROGUECLAW to use the SDK?",
          a: "Yes. SDK access is gated by $ROGUECLAW balance. The tier system (minimum holdings for different agent capacities) will be published before SDK launch.",
        },
        {
          q: "What chains will you support?",
          a: "Solana at launch. Base and ETH are on the roadmap pending demand from the builder community.",
        },
        {
          q: "Can I customise what the agents do?",
          a: "Yes, through the SDK configuration. You can tune thresholds, fee splits, and agent parameters. You cannot change an agent's core mandate — EMBERCLAW will always burn, TIDECLAW will always pool.",
        },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: 20, borderBottom: "1px solid var(--hairline)", paddingBottom: 20 }}>
          <H3>{item.q}</H3>
          <P>{item.a}</P>
        </div>
      ))}

      {/* Changelog */}
      <H2 id="changelog">Changelog</H2>
      {[
        { version: "v0.1.0 — Testnet", date: "Phase 01", items: ["Five agents deployed on Solana devnet", "Web interface with live agent chat", "Activity feed and treasury dashboard"] },
        { version: "v0.2.0 — SDK Beta", date: "Phase 02", items: ["SDK alpha for builders", "REST API endpoints", "Webhook system", "$ROGUECLAW public launch on Pump.fun"] },
        { version: "v1.0.0 — Mainnet", date: "Phase 03", items: ["Full mainnet deployment", "SDK v1 stable", "Agent performance scoring", "Multi-chain support begins"] },
      ].map(entry => (
        <div key={entry.version} style={{ marginBottom: 24, display: "flex", gap: 20 }}>
          <div style={{ width: 2, background: "var(--hairline)", flexShrink: 0, borderRadius: 1, marginTop: 4 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{entry.version}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{entry.date}</span>
            </div>
            {entry.items.map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ color: "var(--storm)", fontSize: 12, marginTop: 1 }}>+</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div style={{ marginTop: 48, padding: 28, background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--iron), var(--ember), var(--tide), var(--stone), var(--storm))" }} />
        <h3 style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 8 }}>Ready to build with RogueClaw?</h3>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Join the waitlist for SDK early access and $ROGUECLAW genesis allocation.</p>
        <a href="/#builders" style={{
          background: "var(--iron)", color: "white", fontSize: 13, fontWeight: 700,
          padding: "11px 24px", borderRadius: 100, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(255,0,110,0.4)", display: "inline-block",
        }}>
          Join the Builders Waitlist →
        </a>
      </div>
    </div>
  );
}

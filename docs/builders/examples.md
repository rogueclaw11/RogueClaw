# Examples

---

## Single Burn Agent

Deploy a single EMBERCLAW-type agent to continuously burn your token's protocol fees.

```typescript
import { RogueClawSDK } from "@rogueclaw/sdk";

const sdk = new RogueClawSDK({
  apiKey: process.env.ROGUECLAW_API_KEY!,
  wallet: process.env.WALLET_ADDRESS!,
  tier: "builder",
});

const burnAgent = await sdk.deployAgent({
  mandate: "burn",
  token: "YOUR_TOKEN_MINT",
  triggers: ["fee_threshold_met", "interval_6h"],
  maxBudgetSol: 20,
  onConflict: "performance_score",
});

burnAgent.on("action", (e) => {
  console.log(`Burned: ${e.detail} | tx: ${e.txHash}`);
});

await burnAgent.start();
console.log("Burn agent active.");
```

---

## Full Five-Agent Stack

Deploy the complete RogueClaw framework for your own token. Requires Operator or Sovereign tier.

```typescript
import { RogueClawSDK } from "@rogueclaw/sdk";

const sdk = new RogueClawSDK({
  apiKey: process.env.ROGUECLAW_API_KEY!,
  wallet: process.env.WALLET_ADDRESS!,
  tier: "operator",
});

const TOKEN = "YOUR_TOKEN_MINT";
const CONFLICT = "performance_score";

const [hunt, burn, pool, vault, raid] = await Promise.all([
  sdk.deployAgent({
    mandate: "hunt",
    token: TOKEN,
    triggers: ["whale_sell_detected", "price_drop_5pct"],
    maxBudgetSol: 100,
    onConflict: CONFLICT,
  }),
  sdk.deployAgent({
    mandate: "burn",
    token: TOKEN,
    triggers: ["fee_threshold_met"],
    maxBudgetSol: 0, // burn agents use fee income, not treasury SOL
    onConflict: CONFLICT,
  }),
  sdk.deployAgent({
    mandate: "pool",
    token: TOKEN,
    triggers: ["liquidity_drop_20pct", "volume_spike_3x"],
    maxBudgetSol: 150,
    onConflict: CONFLICT,
  }),
  sdk.deployAgent({
    mandate: "vault",
    token: TOKEN,
    triggers: ["treasury_below_floor"],
    maxBudgetSol: 0, // vault agent controls treasury, doesn't deploy it offensively
    onConflict: CONFLICT,
    circuitBreaker: { floor: 500 }, // minimum 500 SOL in treasury at all times
  }),
  sdk.deployAgent({
    mandate: "raid",
    token: TOKEN,
    triggers: ["volume_spike_3x", "price_drop_10pct"],
    maxBudgetSol: 200,
    onConflict: CONFLICT,
  }),
]);

// Listen to all agents
for (const agent of [hunt, burn, pool, vault, raid]) {
  agent.on("action", (e) => console.log(`[${e.agentId}] ${e.type}: ${e.detail}`));
  agent.on("conflict", (e) => console.log(`Conflict: ${e.winner} beat ${e.loser}`));
}

// Start all agents
await Promise.all([hunt, burn, pool, vault, raid].map((a) => a.start()));
console.log("All five agents active.");
```

---

## Monitoring Agent Performance

```typescript
const agents = await sdk.listAgents();

for (const agent of agents) {
  const score = await agent.getPerformanceScore();
  const status = await agent.getStatus();
  const history = await agent.getActionHistory(10);

  console.log(`
Agent:   ${agent.id}
Status:  ${status}
Score:   ${score}/100
Recent:  ${history.length} actions
Last:    ${history[0]?.detail ?? "none"}
  `);
}
```

---

## Handling Circuit Breakers

```typescript
agent.on("circuit_breaker", (event) => {
  console.log(`Circuit breaker triggered: ${event.level}`);
  console.log(`Treasury: ${event.treasurySol} SOL`);
  console.log(`Floor: ${event.floorSol} SOL`);
  console.log(`Actions suspended: ${event.suspendedActions.join(", ")}`);

  // You can alert your team, log to monitoring, etc.
  // You cannot override the circuit breaker — it is contract-enforced.
});
```

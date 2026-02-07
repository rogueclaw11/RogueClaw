# SDK Quickstart

The RogueClaw SDK lets you deploy the same five-agent framework that runs $ROGUECLAW for your own project. Configure agents, set mandates, connect a treasury, and deploy — no protocol access required beyond your $ROGUECLAW tier.

---

## Requirements

- Node.js 18+
- A Solana wallet with SOL for transaction fees
- $ROGUECLAW holdings matching your desired SDK tier
- An AI inference API key (required for agent decision engine)

---

## Installation

```bash
npm install @rogueclaw/sdk
```

---

## Authentication

SDK access is gated by on-chain $ROGUECLAW holdings. Connect your wallet and the SDK verifies your tier automatically.

```typescript
import { RogueClawSDK } from "@rogueclaw/sdk";

const sdk = new RogueClawSDK({
  apiKey: "your_rogueclaw_api_key",
  wallet: "your_solana_wallet_address",
  tier: "builder", // verified on-chain against your $ROGUECLAW balance
});
```

| Tier | $ROGUECLAW Required | Agent Slots |
|---|---|---|
| Observer | 0 | Read-only API |
| Builder | 10,000 | 1 agent |
| Operator | 100,000 | 3 agents |
| Sovereign | 1,000,000 | Unlimited |

---

## Deploy Your First Agent

```typescript
const agent = await sdk.deployAgent({
  mandate: "burn",                                    // Agent type
  triggers: ["price_drop_5pct", "whale_sell_detected"], // What activates the agent
  maxBudgetSol: 50,                                   // Max SOL per action cycle
  onConflict: "performance_score",                    // Conflict resolution method
  token: "YOUR_TOKEN_MINT_ADDRESS",                   // The token this agent manages
});

// Listen to agent actions
agent.on("action", (event) => {
  console.log("Agent acted:", event.type, event.detail);
});

agent.on("conflict", (event) => {
  console.log("Conflict resolved:", event.winner, event.loser);
});

// Start the agent
await agent.start();
```

---

## Available Agent Types

| Type | Mandate |
|---|---|
| `hunt` | Whale tracking and preemptive buybacks |
| `burn` | Fee collection and supply burns |
| `pool` | Liquidity management and slippage prevention |
| `vault` | Treasury custody and circuit breakers |
| `raid` | Coordinated market raids |

You can deploy multiple agent types in combination. Deploying all five creates the full RogueClaw stack for your token.

---

## Conflict Resolution Options

```typescript
onConflict: "performance_score"  // Default: 30-day rolling score decides
onConflict: "priority_queue"     // Fixed priority order you define at deployment
onConflict: "first_proposer"     // First agent to propose in a cycle wins
```

---

## Next Steps

- [SDK Reference](./sdk-reference.md) — full API documentation
- [Examples](./examples.md) — complete deployment examples

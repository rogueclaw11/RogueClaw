/**
 * RogueClaw SDK — Multi-Agent Example
 *
 * Deploys burn + liquidity agents with conflict resolution
 * and a treasury circuit breaker.
 *
 * Run: npx ts-node index.ts
 */

import { RogueClawSDK } from "@rogueclaw/sdk";

async function main() {
  const sdk = new RogueClawSDK({
    apiKey: process.env.ROGUECLAW_API_KEY!,
    cluster: "devnet",
    tier: "protocol",            // multi-agent requires "protocol" tier or above
  });

  const { agents, arbiter } = await sdk.deployMultiAgent({
    agents: [
      {
        type: "burn",
        name: "MY_BURNER",
        config: {
          triggers: ["price_drop_5pct"],
          maxBurnPerTx: 500_000,
          cooldownMs: 30_000,
        },
      },
      {
        type: "liquidity",
        name: "MY_LIQUIDITY",
        config: {
          targetDepthSol: 50,
          rebalanceThresholdPct: 10,
        },
      },
    ],
    conflictResolution: "performance_score",
    treasury: {
      address: process.env.TREASURY_WALLET!,
      circuitBreakerPct: 20,     // halt all agents if treasury drops 20%
    },
    dryRun: true,
  });

  // Listen to conflict resolutions
  arbiter.on("resolved", (event) => {
    console.log(`\n[RESOLVED] ${event.winner} wins`);
    console.log(`  Reason: ${event.reason}`);
  });

  // Listen to each agent
  for (const agent of agents) {
    agent.on("action", (event) => {
      console.log(`[${agent.name}] ${event.type} — ${event.trigger}`);
    });
  }

  console.log("All agents started.");
  await sdk.startAll();

  process.on("SIGINT", async () => {
    await sdk.stopAll();
    process.exit(0);
  });
}

main().catch(console.error);

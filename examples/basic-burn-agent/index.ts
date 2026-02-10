/**
 * RogueClaw SDK — Basic Burn Agent Example
 *
 * Deploys a single EMBERCLAW-style burn agent that triggers
 * on price drops and volume spikes.
 *
 * Run: npx ts-node index.ts
 */

import { RogueClawSDK } from "@rogueclaw/sdk";

async function main() {
  const sdk = new RogueClawSDK({
    apiKey: process.env.ROGUECLAW_API_KEY!,
    cluster: "devnet",           // use "mainnet-beta" for production
    tier: "builder",
  });

  console.log("Deploying burn agent...");

  const agent = await sdk.deployAgent({
    type: "burn",
    config: {
      triggers: [
        "price_drop_5pct",       // burn on 5% price drop
        "volume_spike_2x",       // burn on 2x volume spike
      ],
      maxBurnPerTx: 1_000_000,   // max tokens burned per transaction
      cooldownMs: 60_000,        // 1 minute cooldown between burns
      dryRun: true,              // set false for live execution
    },
  });

  agent.on("action", (event) => {
    console.log(`\n[ACTION] ${event.type}`);
    console.log(`  Trigger: ${event.trigger}`);
    console.log(`  Amount:  ${event.amount?.toLocaleString()} tokens`);
    console.log(`  Tx:      ${event.txSignature ?? "dry-run"}`);
  });

  agent.on("error", (err) => {
    console.error("[ERROR]", err.message);
  });

  agent.on("conflict", (event) => {
    console.log(`\n[CONFLICT] vs ${event.opponent}`);
    console.log(`  My score:    ${event.myScore}`);
    console.log(`  Their score: ${event.opponentScore}`);
    console.log(`  Winner:      ${event.winner}`);
  });

  console.log("Agent started. Monitoring market conditions...");
  await agent.start();

  // Keep process alive
  process.on("SIGINT", async () => {
    console.log("\nShutting down agent...");
    await agent.stop();
    process.exit(0);
  });
}

main().catch(console.error);

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { fetchMarketData, formatMarketContext } from "./market";
import { runStoneclaw } from "./agents/stoneclaw";
import { runEmberclaw } from "./agents/emberclaw";
import { runIronclaw } from "./agents/ironclaw";
import { runTideclaw } from "./agents/tideclaw";
import { runStormclaw } from "./agents/stormclaw";
import { setStats } from "./logger";
import { getWalletSOL } from "./wallet";

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

async function runCycle() {
  console.log("\n--- RogueClaw Agent Cycle ---", new Date().toISOString());

  try {
    // 1. Fetch market data
    console.log("[SYSTEM] Fetching market data...");
    const marketData = await fetchMarketData();
    const marketContext = formatMarketContext(marketData);
    console.log(`[SYSTEM] Wallet: ${marketData.walletSOL.toFixed(4)} SOL | Trend: ${marketData.trend}`);

    // 2. Update treasury stat with current wallet balance
    setStats({ treasurySOL: marketData.walletSOL });

    // 3. STONECLAW decides if we act and how to split
    const allocation = await runStoneclaw(marketData, marketContext);
    if (!allocation) {
      console.log("[SYSTEM] Cycle complete — no action taken.\n");
      return;
    }

    // 4. Run agents in parallel where possible
    // IRONCLAW and EMBERCLAW can run concurrently
    // STORMCLAW runs last (most conservative)
    await Promise.all([
      allocation.emberclaw > 0 ? runEmberclaw(allocation.emberclaw) : Promise.resolve(),
      allocation.ironclaw > 0 ? runIronclaw(allocation.ironclaw, marketData) : Promise.resolve(),
      allocation.tideclaw > 0 ? runTideclaw(allocation.tideclaw, marketData) : Promise.resolve(),
    ]);

    if (allocation.stormclaw > 0) {
      await runStormclaw(allocation.stormclaw, marketData, marketContext);
    }

    console.log("[SYSTEM] Cycle complete.\n");
  } catch (err) {
    console.error("[SYSTEM] Cycle error:", err);
  }
}

async function main() {
  console.log("RogueClaw Agent Runner starting...");
  console.log(`Cycle interval: ${INTERVAL_MS / 60000} minutes`);

  // Run immediately on start
  await runCycle();

  // Then on interval
  setInterval(runCycle, INTERVAL_MS);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

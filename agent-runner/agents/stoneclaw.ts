import { logActivity, updateStats } from "../logger";
import { MarketData } from "../market";
import { stoneclawDecide } from "../decisions";
import { getWalletSOL, MIN_ACTION_THRESHOLD, GAS_RESERVE } from "../wallet";

export async function runStoneclaw(marketData: MarketData, marketContext: string) {
  const walletSOL = marketData.walletSOL;
  const deployable = walletSOL - GAS_RESERVE;

  if (deployable < MIN_ACTION_THRESHOLD) {
    console.log(`[STONECLAW] ${deployable.toFixed(4)} SOL available — below threshold. Holding.`);
    logActivity({
      agent: "stoneclaw",
      action: "Treasury holding",
      detail: `${deployable.toFixed(4)} SOL available — insufficient to act`,
      txHash: null,
      solscanUrl: null,
      type: "vault",
    });
    return null;
  }

  console.log(`[STONECLAW] ${deployable.toFixed(4)} SOL available. Running allocation decision...`);

  const { decision, allocation } = await stoneclawDecide(marketContext, deployable);

  logActivity({
    agent: "stoneclaw",
    action: decision.action === "act" ? "Allocation approved" : "Treasury holding",
    detail: decision.reason,
    txHash: null,
    solscanUrl: null,
    type: "vault",
  });

  if (decision.action === "hold" || !allocation) {
    console.log(`[STONECLAW] Decision: HOLD — ${decision.reason}`);
    return null;
  }

  console.log(`[STONECLAW] Decision: ACT — ${decision.reason}`);
  console.log(`[STONECLAW] Split: EMBER ${(allocation.emberclaw * 100).toFixed(0)}% | IRON ${(allocation.ironclaw * 100).toFixed(0)}% | TIDE ${(allocation.tideclaw * 100).toFixed(0)}% | STORM ${(allocation.stormclaw * 100).toFixed(0)}%`);

  updateStats({ treasurySOL: -deployable });

  return {
    emberclaw: deployable * allocation.emberclaw,
    ironclaw: deployable * allocation.ironclaw,
    tideclaw: deployable * allocation.tideclaw,
    stormclaw: deployable * allocation.stormclaw,
  };
}

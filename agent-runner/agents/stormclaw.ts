import { logActivity, updateStats } from "../logger";
import { wallet, ROGUECLAW_MINT } from "../wallet";
import { connection } from "../wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { stormclawApprove } from "../decisions";
import { MarketData } from "../market";

async function executeRaid(solAmount: number): Promise<string | null> {
  if (!ROGUECLAW_MINT) return null;

  try {
    const quoteRes = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${ROGUECLAW_MINT.toString()}&amount=${Math.floor(solAmount * LAMPORTS_PER_SOL)}&slippageBps=300`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!quoteRes.ok) return null;
    const quote = await quoteRes.json();

    const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!swapRes.ok) return null;
    const { swapTransaction } = await swapRes.json();

    const { VersionedTransaction } = await import("@solana/web3.js");
    const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, "base64"));
    tx.sign([wallet]);
    const sig = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
    await connection.confirmTransaction(sig, "confirmed");
    return sig;
  } catch (err) {
    console.error("[STORMCLAW] Raid execution failed:", err);
    return null;
  }
}

export async function runStormclaw(solAmount: number, marketData: MarketData, marketContext: string) {
  console.log(`[STORMCLAW] ${solAmount.toFixed(4)} SOL allocated. Checking conditions...`);

  const approved = await stormclawApprove(marketContext);

  if (!approved) {
    console.log(`[STORMCLAW] Standing down — conditions not right.`);
    logActivity({
      agent: "stormclaw",
      action: "Standing down",
      detail: `${solAmount.toFixed(4)} SOL returned to treasury — conditions not favourable`,
      txHash: null,
      solscanUrl: null,
      type: "hold",
    });
    // Return the SOL allocation to stats (wasn't spent)
    updateStats({ treasurySOL: solAmount });
    return;
  }

  console.log(`[STORMCLAW] Raid approved. Executing ${solAmount.toFixed(4)} SOL concentrated buy.`);

  const txHash = await executeRaid(solAmount);

  if (txHash) {
    logActivity({
      agent: "stormclaw",
      action: "Raid executed",
      detail: `${solAmount.toFixed(4)} SOL concentrated buy · maximum price impact`,
      txHash,
      solscanUrl: `https://solscan.io/tx/${txHash}`,
      type: "raid",
    });
    updateStats({ totalBoughtBack: solAmount });
  } else {
    logActivity({
      agent: "stormclaw",
      action: "Raid queued",
      detail: `${solAmount.toFixed(4)} SOL staged — awaiting token launch`,
      txHash: null,
      solscanUrl: null,
      type: "raid",
    });
  }
}

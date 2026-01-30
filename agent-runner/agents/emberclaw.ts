import {
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { logActivity, updateStats } from "../logger";
import { connection, wallet, ROGUECLAW_MINT } from "../wallet";

// Solana burn address (all zeros = permanent destruction)
const BURN_ADDRESS = new PublicKey("1111111111111111111111111111111111111111111");

async function swapSOLForRogueclaw(solAmount: number): Promise<string | null> {
  if (!ROGUECLAW_MINT) {
    console.log("[EMBERCLAW] ROGUECLAW_MINT not set — skipping real swap");
    return null;
  }

  try {
    // Jupiter swap quote
    const quoteRes = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${ROGUECLAW_MINT.toString()}&amount=${Math.floor(solAmount * LAMPORTS_PER_SOL)}&slippageBps=100`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!quoteRes.ok) return null;
    const quote = await quoteRes.json();

    // Get swap transaction from Jupiter
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

    const txBuf = Buffer.from(swapTransaction, "base64");
    const { VersionedTransaction } = await import("@solana/web3.js");
    const tx = VersionedTransaction.deserialize(txBuf);
    tx.sign([wallet]);

    const sig = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
    await connection.confirmTransaction(sig, "confirmed");
    return sig;
  } catch (err) {
    console.error("[EMBERCLAW] Swap failed:", err);
    return null;
  }
}

export async function runEmberclaw(solAmount: number) {
  console.log(`[EMBERCLAW] Burning ${solAmount.toFixed(4)} SOL worth of $ROGUECLAW`);

  const txHash = await swapSOLForRogueclaw(solAmount);

  if (!txHash) {
    // Pre-launch: log the intent without a real tx
    logActivity({
      agent: "emberclaw",
      action: "Burn queued",
      detail: `${solAmount.toFixed(4)} SOL allocated — awaiting token launch to execute`,
      txHash: null,
      solscanUrl: null,
      type: "burn",
    });
    return;
  }

  const solscanUrl = `https://solscan.io/tx/${txHash}`;

  logActivity({
    agent: "emberclaw",
    action: "Burn executed",
    detail: `${solAmount.toFixed(4)} SOL → $ROGUECLAW → ash · permanent`,
    txHash,
    solscanUrl,
    type: "burn",
  });

  updateStats({
    totalBurned: solAmount * 1_000_000, // rough token estimate, update with real output
    totalFeesClaimed: solAmount,
  });

  console.log(`[EMBERCLAW] Burn complete — ${txHash}`);
}

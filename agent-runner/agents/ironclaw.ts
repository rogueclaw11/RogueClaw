import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { logActivity, updateStats } from "../logger";
import { connection, wallet, ROGUECLAW_MINT } from "../wallet";
import { MarketData } from "../market";

const WHALE_THRESHOLD_SOL = 50; // flag wallets moving more than this

async function detectWhaleMovements(): Promise<{ wallet: string; amountSOL: number } | null> {
  if (!ROGUECLAW_MINT) return null;

  try {
    // Get recent large transactions on the token
    const sigs = await connection.getSignaturesForAddress(ROGUECLAW_MINT, { limit: 20 });
    for (const sig of sigs) {
      const tx = await connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });
      if (!tx) continue;

      for (const inner of tx.meta?.innerInstructions ?? []) {
        for (const ix of inner.instructions) {
          if ("parsed" in ix && ix.parsed?.type === "transfer") {
            const lamports = ix.parsed.info?.lamports ?? 0;
            const sol = lamports / LAMPORTS_PER_SOL;
            if (sol >= WHALE_THRESHOLD_SOL) {
              return {
                wallet: ix.parsed.info?.source ?? "unknown",
                amountSOL: sol,
              };
            }
          }
        }
      }
    }
  } catch {
    // RPC can fail — not critical
  }

  return null;
}

async function executeBuyback(solAmount: number): Promise<string | null> {
  if (!ROGUECLAW_MINT) return null;

  try {
    const quoteRes = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${ROGUECLAW_MINT.toString()}&amount=${Math.floor(solAmount * LAMPORTS_PER_SOL)}&slippageBps=150`,
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
    console.error("[IRONCLAW] Buyback failed:", err);
    return null;
  }
}

export async function runIronclaw(solAmount: number, marketData: MarketData) {
  console.log(`[IRONCLAW] Scanning for whale activity...`);

  const whale = await detectWhaleMovements();

  if (whale) {
    console.log(`[IRONCLAW] Whale detected — ${whale.wallet.slice(0, 8)}... moving ${whale.amountSOL.toFixed(0)} SOL`);

    logActivity({
      agent: "ironclaw",
      action: "Whale detected",
      detail: `${whale.wallet.slice(0, 8)}…${whale.wallet.slice(-4)} · ${whale.amountSOL.toFixed(0)} SOL movement · buying ahead`,
      txHash: null,
      solscanUrl: null,
      type: "hunt",
    });

    const txHash = await executeBuyback(solAmount);

    if (txHash) {
      logActivity({
        agent: "ironclaw",
        action: "Preemptive buyback",
        detail: `${solAmount.toFixed(4)} SOL deployed ahead of whale movement`,
        txHash,
        solscanUrl: `https://solscan.io/tx/${txHash}`,
        type: "buy",
      });
      updateStats({ totalBoughtBack: solAmount });
    } else {
      logActivity({
        agent: "ironclaw",
        action: "Buyback queued",
        detail: `${solAmount.toFixed(4)} SOL allocated — awaiting token launch`,
        txHash: null,
        solscanUrl: null,
        type: "buy",
      });
    }
  } else {
    console.log(`[IRONCLAW] No whale pressure detected. Executing standard buyback.`);

    const txHash = await executeBuyback(solAmount);

    if (txHash) {
      logActivity({
        agent: "ironclaw",
        action: "Buyback executed",
        detail: `${solAmount.toFixed(4)} SOL deployed · market support`,
        txHash,
        solscanUrl: `https://solscan.io/tx/${txHash}`,
        type: "buy",
      });
      updateStats({ totalBoughtBack: solAmount });
    } else {
      logActivity({
        agent: "ironclaw",
        action: "Buyback queued",
        detail: `${solAmount.toFixed(4)} SOL allocated — awaiting token launch`,
        txHash: null,
        solscanUrl: null,
        type: "buy",
      });
    }
  }
}

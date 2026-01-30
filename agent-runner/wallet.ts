import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.AGENT_WALLET_PRIVATE_KEY) {
  throw new Error("AGENT_WALLET_PRIVATE_KEY not set in .env.local");
}

if (!process.env.SOLANA_RPC) {
  throw new Error("SOLANA_RPC not set in .env.local");
}

export const connection = new Connection(process.env.SOLANA_RPC, "confirmed");

export const wallet = Keypair.fromSecretKey(
  bs58.decode(process.env.AGENT_WALLET_PRIVATE_KEY)
);

export const ROGUECLAW_MINT = process.env.ROGUECLAW_MINT
  ? new PublicKey(process.env.ROGUECLAW_MINT)
  : null;

export const RAYDIUM_POOL = process.env.RAYDIUM_POOL
  ? new PublicKey(process.env.RAYDIUM_POOL)
  : null;

export async function getWalletSOL(): Promise<number> {
  const balance = await connection.getBalance(wallet.publicKey);
  return balance / LAMPORTS_PER_SOL;
}

export const MIN_ACTION_THRESHOLD = 0.1; // SOL — don't act below this
export const GAS_RESERVE = 0.01;         // SOL — always keep for gas

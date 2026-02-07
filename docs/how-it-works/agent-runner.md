# Agent Runner

The agent runner is the execution core of RogueClaw. It runs locally, monitors the protocol wallet, evaluates market conditions, and executes on-chain actions when the agents decide to act.

---

## How It Works

The runner operates on a 10-minute cycle:

1. **Fetch market data** — pulls live price, 24h volume, trend, and wallet SOL balance from Jupiter and Dexscreener
2. **STONECLAW evaluates** — assesses whether available fees justify action given current conditions
3. **If approved** — STONECLAW allocates SOL across the other agents
4. **Agents execute** — each agent runs its mandate using the allocated SOL
5. **Everything logs** — every decision, action, and transaction is written to the activity log

If fees are below the minimum threshold, or if conditions are unfavourable, the cycle exits without spending anything.

---

## Agent Decision Logic

Each agent receives live market data and makes decisions based on its mandate. They are not scripted — behaviour adapts to what the market is doing.

**STONECLAW** decides first — it is the only agent that can approve or block a cycle. If it says hold, the other agents do not run.

**STORMCLAW** has an additional approval step. Even if STONECLAW allocates it funds, STORMCLAW independently evaluates whether conditions are strong enough to execute a raid. If not, it returns the SOL and stands down.

---

## Activity Log

All actions are written to `data/activity.json`. Each entry includes:

```json
{
  "id": "...",
  "agent": "emberclaw",
  "action": "Burn executed",
  "detail": "0.24 SOL → $ROGUECLAW → ash · permanent",
  "txHash": "5xK2...",
  "solscanUrl": "https://solscan.io/tx/5xK2...",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "type": "burn"
}
```

The website reads this file via `/api/proof` and displays it inside each agent card. Transaction hashes link directly to Solscan — every action is publicly verifiable.

---

## Environment Variables

The runner requires the following in `.env.local`:

```
AGENT_INFERENCE_KEY=      # Inference key
AGENT_WALLET_PRIVATE_KEY= # Base58 private key of the protocol wallet
SOLANA_RPC=               # Solana RPC endpoint
ROGUECLAW_MINT=           # Token mint address (set at launch)
RAYDIUM_POOL=             # Raydium pool address (set at launch)
```

---

## Running

```bash
npm run agent
```

The runner starts immediately and logs each cycle to the console. The website picks up new activity automatically — no restart needed.

---

## Pre-Launch Behaviour

Before the token launches, `ROGUECLAW_MINT` and `RAYDIUM_POOL` will be empty. The runner still functions — agents evaluate conditions and all decisions are logged — but on-chain transactions are staged rather than executed. Once the mint address is added, the runner begins executing real transactions automatically.

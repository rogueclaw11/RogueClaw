# RogueClaw Protocol

Five autonomous agents running $ROGUECLAW on Solana. No team wallet. No admin keys. No multisig. Just the claws.

---

## The Agents

| Agent | Ticker | Mandate |
|-------|--------|---------|
| IRONCLAW | HUNT | Whale tracking & buybacks |
| EMBERCLAW | BURN | Continuous supply burns |
| TIDECLAW | POOL | Liquidity management |
| STONECLAW | VAULT | Treasury & circuit breakers |
| STORMCLAW | RAID | Coordinated market raids |

Each agent operates autonomously on-chain. Decisions are irreversible. There is no kill switch.

---

## How It Works

1. **STONECLAW** evaluates market conditions and available treasury every cycle
2. If conditions are favourable, it allocates SOL across the other four agents
3. Each agent executes its mandate on-chain and logs every transaction
4. All activity is publicly verifiable on Solscan

The agent runner operates on a 10-minute cycle. If fees are below threshold or conditions are unfavourable, the cycle exits without spending anything.

---

## Stack

- Next.js 15 App Router
- TypeScript
- Solana / SPL Token
- Jupiter swap API
- Raydium liquidity

---

## Running Locally

```bash
npm install
npm run dev
```

To run the agent runner:

```bash
npm run agent
```

Requires `.env.local` — copy `.env.example` and fill in your values.

---

## SDK

The same agent infrastructure is available to other projects via the RogueClaw SDK. Early access goes to the builders waitlist at [rogueclaw.xyz](https://rogueclaw.xyz).

---

## Disclaimer

Not financial advice. Crypto is risky. The agents make their own decisions — humans don't get a vote.

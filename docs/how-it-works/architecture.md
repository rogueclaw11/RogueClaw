# Architecture

The RogueClaw Protocol is a multi-layer system. Each layer has a distinct responsibility and interacts with the others through defined interfaces.

---

## System Layers

```
┌─────────────────────────────────────────────────────────┐
│                      Solana Chain                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ IRONCLAW │  │EMBERCLAW │  │ TIDECLAW │  ...         │
│  │   HUNT   │  │   BURN   │  │   POOL   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│       └──────────────┴──────────────┘                   │
│                       │                                  │
│             Conflict Resolution Engine                   │
│          (on-chain performance score)                    │
│                       │                                  │
│              STONECLAW Treasury Layer                    │
│          (approval + circuit breakers)                   │
│                       │                                  │
│              On-Chain Execution                          │
│        (SPL transfers, pool interactions)                │
└─────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Agent Layer

Five autonomous AI agents. Each runs with:

- A hardcoded system prompt defining its mandate and decision boundaries
- Access to on-chain data feeds (price, wallet activity, pool depth, treasury state)
- The ability to propose actions to the execution layer
- A 30-day rolling performance score used in conflict resolution

Agents do not communicate with each other directly. They observe on-chain state and propose actions independently.

---

## Layer 2 — Conflict Resolution Engine

When two or more agents propose actions that require the same resource in the same cycle, the conflict resolution engine arbitrates.

**Inputs:**
- Agent proposals (action type, SOL required, expected outcome)
- Each agent's 30-day on-chain performance score

**Output:**
- Winning proposal proceeds to treasury layer for approval
- Losing proposals are rejected and logged

The engine has no preferences. It applies performance scores mechanically. High-performing agents win more often. Underperforming agents are resource-constrained until their score recovers.

---

## Layer 3 — Treasury Layer (STONECLAW)

STONECLAW operates as a spending approval layer between conflict resolution and execution. Every action that requires treasury SOL passes through it.

STONECLAW checks:
1. Does the requested deployment breach a circuit breaker threshold?
2. Does STONECLAW's current treasury state support the deployment?

If either check fails, the action does not execute — regardless of which agent won arbitration.

---

## Layer 4 — Execution Layer

Approved actions execute as on-chain Solana transactions:

- **Buybacks** — market buy $ROGUECLAW using treasury SOL
- **Burns** — transfer $ROGUECLAW to burn address
- **Liquidity ops** — add/remove/rebalance Raydium pool positions
- **Raids** — coordinated buy sequences within a defined time window

All transactions are signed autonomously. No human approval. All results are posted on-chain and visible publicly.

---

## Layer 5 — Activity Log

Every action, decision, and rejection is written to a persistent log. The log is the public record — accessible via the website and verifiable on Solscan using the transaction hashes.

Fields logged per action:
- Agent ID
- Action type and detail
- Transaction hash (if executed on-chain)
- Solscan URL
- Timestamp

The website polls this log every 30 seconds and displays it inside each agent card. No action goes unrecorded.

---

## Tech Stack

| Component | Technology |
|---|---|
| Blockchain | Solana |
| Token Standard | SPL Token |
| Agent AI | Autonomous decision engine |
| DEX | Raydium, Jupiter |
| On-chain price data | Jupiter Price API, Dexscreener |
| Agent runner | Node.js + TypeScript (`tsx`) |
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4 |
| Agent chat streaming | Server-Sent Events via Next.js App Router |
| Activity feed | File-based JSON store, polled every 30s |

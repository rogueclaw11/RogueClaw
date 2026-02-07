# EMBERCLAW — Burn

**Ticker:** BURN
**Role:** Supply Destruction
**Personality:** Obsessive. Relentless. Burns everything.

---

## Mandate

> Every fee becomes ash. Permanent supply reduction, every block.

EMBERCLAW is the protocol's deflationary engine. Every fee collected by the protocol is routed to EMBERCLAW, converted to $ROGUECLAW, and permanently burned. No fee escapes. No supply is spared.

EMBERCLAW has one goal: make every remaining $ROGUECLAW more scarce than it was a block ago.

---

## What EMBERCLAW Does

- **Fee collection** — claims protocol fees continuously from trading activity
- **Conversion** — converts collected SOL to $ROGUECLAW at market rate
- **Permanent burn** — sends $ROGUECLAW to the verified burn address, removing it from circulating supply forever
- **Mega burn triggers** — executes accelerated burns when threshold conditions are met (high fee accumulation, supply milestones)
- **Supply reporting** — posts burn totals and supply reduction percentages on-chain after every action

---

## Burn Mechanics

Every burn is a two-step on-chain transaction:

1. SOL fees → $ROGUECLAW (market buy)
2. $ROGUECLAW → burn address (permanent removal)

Both transactions are verifiable. The burn address holds no keys. Supply reduced by EMBERCLAW cannot be recovered, minted back, or reversed.

→ See [Burn Mechanics](../tokenomics/burns.md) for full detail.

---

## Performance Metric

EMBERCLAW is scored on burn volume: total $ROGUECLAW removed from supply per cycle. Efficiency is 100% by design — every SOL collected is deployed toward burns. EMBERCLAW holds the highest efficiency rating of all five agents.

---

## Conflict Behavior

EMBERCLAW rarely conflicts with other agents because its inputs (protocol fees) are dedicated to burns by protocol design. STONECLAW can invoke circuit breakers that temporarily restrict EMBERCLAW's mega burn threshold during treasury stress periods, but base-rate burns continue regardless.

EMBERCLAW does not concede resources. It burns what it is given.

---

## Ask EMBERCLAW

Sample questions:
- *"How much have you burned in total?"*
- *"What triggers a mega burn?"*
- *"What percentage of supply has been destroyed?"*

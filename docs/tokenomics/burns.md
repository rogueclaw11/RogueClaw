# Burn Mechanics

Every protocol fee ends the same way: as ash.

---

## How Burns Work

EMBERCLAW is the sole burn executor. It operates on a continuous cycle:

1. **Fee collection** — protocol trading fees accumulate in SOL
2. **Conversion** — EMBERCLAW executes a market buy of $ROGUECLAW using the accumulated SOL
3. **Burn** — the purchased $ROGUECLAW is sent to the verified burn address
4. **On-chain record** — burn transaction hash and supply update posted on-chain

Every step is verifiable. Every burn is permanent.

---

## Burn Address

Burns are sent to the Solana null address — a provably unspendable address with no associated private key. Tokens sent there are gone. There is no recovery, no reversal, no unlock.

---

## Burn Frequency

EMBERCLAW burns continuously. There is no fixed schedule. Burns execute whenever:

- Fee accumulation crosses the base burn threshold
- A mega burn condition is triggered (high-volume accumulation period)
- EMBERCLAW's cycle completes and fees are available

During high-volume market periods, burns may execute multiple times per hour. During low-activity periods, EMBERCLAW accumulates fees until threshold is met before burning.

---

## Mega Burns

When fee accumulation exceeds the mega burn threshold, EMBERCLAW executes an accelerated burn rather than spreading it across multiple small burns. Mega burns produce a larger single supply reduction event.

Mega burn conditions:
- Fee accumulation > 5x standard burn threshold
- Supply milestone approaching (e.g. 1% total supply burned milestone)
- STONECLAW circuit breakers not active

---

## What Burns Do to Supply

Each burn permanently removes $ROGUECLAW from circulating supply. Total supply decreases. Every remaining token represents a larger share of a smaller supply.

This is not a rebasing mechanism. The total supply number decreases. It does not reset.

---

## EMBERCLAW Constraints

STONECLAW can invoke a circuit breaker that restricts mega burns during treasury stress periods. Base-rate burns continue regardless — EMBERCLAW's mandate to burn is unconditional for fees already collected.

EMBERCLAW cannot be instructed to skip a burn, delay a burn, or redirect burn funds elsewhere. Its mandate does not include exceptions.

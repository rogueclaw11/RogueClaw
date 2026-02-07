# Tokenomics Overview

$ROGUECLAW launched with a fixed supply and no team allocation. The tokenomics are designed around one outcome: supply goes down, scarcity goes up.

---

## Supply

| Metric | Value |
|---|---|
| Total Supply | 1,000,000,000 $ROGUECLAW |
| Team Allocation | 0% |
| VC / Investor Allocation | 0% |
| Foundation Reserve | 0% |
| Fair Launch | 100% |
| Mint Authority | Revoked at launch |

There is no team. There is no reserve. There is no allocation that can be dumped on the market by insiders. Every token in circulation was acquired on the open market.

---

## Distribution at Launch

$ROGUECLAW launched on Pump.fun. 100% of supply entered circulation through the fair launch mechanism. The agents received no allocation. Protocol operations are funded by trading fees — not pre-mined tokens.

---

## What Happens to Supply Over Time

Supply decreases. It cannot increase.

EMBERCLAW converts protocol fees to $ROGUECLAW and burns them permanently on every cycle. As long as the protocol generates fees — which requires market activity — supply shrinks continuously.

There is no scheduled inflation event. There is no unlock schedule. There are no vesting cliffs. No new tokens will ever be created.

→ See [Burn Mechanics](./burns.md)

---

## Protocol Fee Flow

```
Trading Activity on $ROGUECLAW
        ↓
Protocol Fee Collected (% of volume)
        ↓
        ├─ EMBERCLAW → Convert to $ROGUECLAW → Burn
        └─ STONECLAW → Treasury Reserve (SOL)
```

The treasury SOL reserve funds agent operations: buybacks, raids, liquidity injections. The burn portion is non-negotiable — EMBERCLAW's mandate does not allow reallocation.

---

## SDK Tier Gating

$ROGUECLAW holdings determine builder SDK access tier. This creates sustainable demand beyond speculation — builders who want higher agent capacity must hold the token.

| Tier | Requirement | Slots |
|---|---|---|
| Observer | None | Read-only |
| Builder | 10,000 $ROGUECLAW | 1 agent |
| Operator | 100,000 $ROGUECLAW | 3 agents |
| Sovereign | 1,000,000 $ROGUECLAW | Unlimited |

→ See [Builders](../builders/quickstart.md)

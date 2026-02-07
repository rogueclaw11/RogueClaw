# Treasury

The RogueClaw treasury is the protocol's operational reserve. It holds SOL collected from protocol fees and is used to fund agent operations: buybacks, raids, and liquidity injections.

STONECLAW holds the treasury. Nothing leaves without its approval.

---

## Treasury Composition

The treasury holds SOL, not $ROGUECLAW. This is intentional — agents need liquid capital to execute market operations. Holding the protocol's own token in treasury creates circular risk.

SOL enters the treasury from:
- Protocol trading fee allocation (the portion not sent to EMBERCLAW for burns)
- Profitable STORMCLAW raid returns
- Liquidity fee capture by TIDECLAW

SOL leaves the treasury via:
- IRONCLAW buybacks
- STORMCLAW raids
- TIDECLAW liquidity injections

---

## Treasury Floor

STONECLAW maintains a treasury floor — a minimum SOL reserve below which offensive agent spending is restricted or suspended.

The floor is not a suggestion. It is a contract-enforced hard limit.

| Level | Treasury State | Agent Restrictions |
|---|---|---|
| Healthy | Above floor | No restrictions |
| Yellow | < 20% above floor | Raids suspended. Buybacks at 50% budget. |
| Orange | < 10% above floor | All offensive actions suspended. |
| Red | < 5% of floor | All agent spending suspended. |

Recovery from Orange or Red requires treasury to return above the floor through fee accumulation before restrictions lift. This is automatic — no human triggers the recovery.

---

## Why a Treasury Floor Exists

Without a floor, a sequence of failed raids or a prolonged bear market could drain the treasury entirely, leaving the protocol with no capital to defend price or manage liquidity. A depleted treasury means the agents cannot act. An agent that cannot act cannot generate fees. The protocol would enter a death spiral.

The floor prevents this. STONECLAW's mandate is to ensure the protocol survives bad periods so it can operate during good ones.

---

## Transparency

Treasury balance is readable on-chain at all times. The live dashboard on the protocol website displays current treasury SOL, recent inflows and outflows, and circuit breaker status in real time.

There is no private treasury. There is no off-chain reserve. What is on-chain is what exists.

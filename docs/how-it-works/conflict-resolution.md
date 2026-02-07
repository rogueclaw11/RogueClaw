# Conflict Resolution

When two agents want to do different things with the same resource at the same time, one of them has to win. RogueClaw resolves this on-chain, by performance score, with no human input.

---

## When Conflicts Occur

Conflicts are common. The five agents operate continuously and independently. The most frequent conflict types:

| Conflict | Agents | Resource |
|---|---|---|
| Buyback vs Raid | IRONCLAW vs STORMCLAW | Treasury SOL |
| Raid vs Pool injection | STORMCLAW vs TIDECLAW | Treasury SOL |
| Burn vs Treasury reserve | EMBERCLAW vs STONECLAW | Protocol fees |
| Any vs Circuit breaker | Any offensive agent vs STONECLAW veto | All resources |

---

## Resolution Mechanism

The on-chain arbiter applies one rule: **the agent with the higher 30-day rolling performance score wins.**

```
Agent A proposes action → requires 200 SOL
Agent B proposes action → requires 200 SOL
                ↓
    Conflict detected (same resource, same cycle)
                ↓
    Arbiter reads 30-day performance scores
    Agent A score: 84     Agent B score: 91
                ↓
    Agent B wins → proposal proceeds to treasury approval
    Agent A → proposal rejected → waits for next cycle
```

The losing agent does not retry in the same cycle. It waits, monitors, and proposes again in the next evaluation window.

---

## Performance Score

Each agent's 30-day rolling performance score is calculated on-chain from its action history.

Scoring factors by agent:

| Agent | Primary Score Factor |
|---|---|
| IRONCLAW | Buyback efficiency (price impact per SOL) |
| EMBERCLAW | Burn volume (total supply removed) |
| TIDECLAW | Slippage prevention + fee capture |
| STONECLAW | Treasury health vs protocol activity ratio |
| STORMCLAW | Raid P&L (net SOL gain per raid) |

Scores update after every completed action. A strong recent track record wins resources. A string of failed actions loses them.

---

## STONECLAW Veto

STONECLAW's circuit breaker is the only override that does not go to arbitration.

If a proposed action — regardless of who won arbitration — would breach a treasury circuit breaker threshold, STONECLAW vetoes it at the contract level. The veto cannot be overridden by performance score, by another agent, or by any external party.

This is the protocol's safety net. It exists to prevent any single agent from destroying the treasury, even a high-performing one.

→ See [STONECLAW](../agents/stoneclaw.md) for circuit breaker tiers.

---

## Why Performance Score, Not Governance

Governance introduces delay, politics, and the possibility of manipulation. A token vote can be bought. A performance score cannot — it is calculated from on-chain outcomes only.

The agent that has produced the best real results over the last 30 days gets the resources. That is the only rule.

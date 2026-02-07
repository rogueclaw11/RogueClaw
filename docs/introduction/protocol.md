# The Protocol

The RogueClaw Protocol is the on-chain framework that coordinates five autonomous AI agents around a single token. It handles agent execution, conflict arbitration, treasury enforcement, and performance tracking — all without human involvement.

---

## How It Runs

```
Market Event Detected
        ↓
Agent(s) Evaluate & Propose Action
        ↓
Conflict? → On-Chain Performance Score Decides
        ↓
Winning Agent Executes Transaction
        ↓
Result Posted On-Chain → All Agents Update
```

1. **Agents monitor** — continuous surveillance of on-chain data, price action, wallet movement, and liquidity depth
2. **Agents propose** — each agent evaluates events through its mandate and proposes an action
3. **Conflicts resolve** — when two agents claim the same funds, the on-chain arbiter awards to the higher 30-day performance score
4. **Execution** — the winning proposal executes on-chain with no human approval step
5. **Update** — all agents receive the result and update their internal state

---

## Core Components

### Agent Layer
Five autonomous agents, each with a hardcoded mandate defining their behaviour and decision boundaries. Mandates are immutable post-deployment.

### Conflict Resolution Engine
On-chain arbiter that scores agent proposals against each other when resource contention occurs. Resolved by 30-day rolling performance score. No appeals. No exceptions.

### Treasury Circuit Breaker
STONECLAW enforces hard treasury thresholds at the contract level. If treasury drops below a set floor, all offensive agent actions (raids, buybacks, burns above base rate) are suspended automatically until recovery. No human triggers this — it is contract-enforced.

### Performance Scoring
Every agent action is scored on-chain based on outcome. Burns executed, liquidity maintained, buyback efficiency, raid P&L. Scores update after every action and feed directly into conflict resolution.

---

## What the Protocol Does Not Have

- No admin function
- No pause function
- No upgrade mechanism
- No team multisig
- No governance vote
- No off-chain execution

Every action is verifiable on Solana. Every decision is traceable.

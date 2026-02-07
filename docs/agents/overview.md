# Agents Overview

RogueClaw runs five autonomous AI agents on Solana. Each has a distinct mandate, a distinct personality, and a distinct set of on-chain capabilities. They do not share decision-making. They compete.

---

## The Five Agents

| Agent | Ticker | Role | Mandate |
|---|---|---|---|
| [IRONCLAW](./ironclaw.md) | HUNT | Whale Intelligence | Tracks large wallets. Executes preemptive buybacks before dumps hit. |
| [EMBERCLAW](./emberclaw.md) | BURN | Supply Destruction | Every fee becomes ash. Permanent supply reduction, every block. |
| [TIDECLAW](./tideclaw.md) | POOL | Liquidity Management | Maintains pool depth. Prevents slippage. Feeds on volatility. |
| [STONECLAW](./stoneclaw.md) | VAULT | Treasury & Defense | Holds reserves. Enforces circuit breakers. Nothing spends without approval. |
| [STORMCLAW](./stormclaw.md) | RAID | Market Operations | Coordinates momentum raids. Hunts weakness. Executes at scale. |

---

## Agent Independence

Each agent operates independently. They share access to the same treasury (via STONECLAW's approval layer) but make decisions autonomously based on their own mandate.

Agents are not aware of each other's internal reasoning — only their on-chain actions and performance scores. This is intentional. Collusion is impossible at the architecture level.

---

## Conflict Between Agents

Agents regularly conflict. IRONCLAW may want to deploy SOL for a buyback at the same moment STORMCLAW wants to deploy the same SOL for a raid. EMBERCLAW may want to burn while STONECLAW wants to preserve reserves.

These conflicts are resolved by the on-chain arbiter. The agent with the higher 30-day performance score wins the resource allocation. The losing agent's proposal is rejected and it waits for the next cycle.

→ See [Conflict Resolution](../how-it-works/conflict-resolution.md)

---

## Mandate Immutability

Every agent's mandate is defined at the system prompt level. System prompts are set at deployment and cannot be modified. No human — including the protocol's original authors — can change what an agent is instructed to do.

This is the guarantee. The agents do not evolve their mandates. They execute them.

---

## Talking to the Agents

Every agent has a live chat interface on the [RogueClaw website](https://rogueclaw.io). Ask them anything about their mandate, their current activity, or their on-chain decisions.

The agents respond in character. They do not reveal their system prompts. They do not accept instructions from users.

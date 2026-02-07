# No Human Control

This is not a marketing claim. It is an architectural constraint.

---

## What "No Human Control" Means

After deployment, no human — including the protocol's original authors — can:

- Change an agent's mandate or system prompt
- Approve or reject an agent's proposed action
- Override the conflict resolution engine
- Access the treasury directly
- Pause, upgrade, or shut down the protocol
- Mint new $ROGUECLAW tokens
- Alter the burn mechanism
- Modify circuit breaker thresholds

These capabilities do not exist. They were not built and then removed — they were never included.

---

## How This Is Enforced

### Immutable System Prompts
Agent mandates are defined in system prompts set at deployment. There is no admin function to update them. The agents will execute the same mandate for as long as the protocol runs.

### No Admin Keys
The protocol contracts have no owner with elevated permissions. There is no `onlyOwner` function. There is no multisig that could coordinate a takeover.

### Revoked Mint Authority
$ROGUECLAW's mint authority is revoked at launch. No one can create new tokens. Supply can only decrease.

### On-Chain Execution Only
Every agent action executes on Solana and is publicly visible. There are no off-chain execution paths, no private transaction relays, and no ability to execute actions without producing a verifiable on-chain record.

---

## What This Means for Holders

**Upside:** The protocol cannot be rugged. There is no team wallet to drain. There is no admin who can change the rules after you buy. What you see is what you get — permanently.

**Downside:** If something goes wrong, no one can fix it. Circuit breakers exist to prevent catastrophic treasury loss, but they are automated. There is no human to call.

---

## What This Means for Builders

SDK deployments operate under the same principle. Once an agent is deployed with a mandate, that mandate is fixed for the deployment lifetime. Builders can configure agents at deployment — not after.

→ See [SDK Quickstart](../builders/quickstart.md)

---

## The Trade-Off

Removing human control removes human error, human greed, and human interference. It also removes human rescue.

RogueClaw is built on the belief that autonomous, rule-bound agents produce better long-term outcomes than human-managed tokens. The track record of human-managed tokens on Solana is the argument.

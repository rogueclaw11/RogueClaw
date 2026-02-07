# SDK Reference

Full API reference for `@rogueclaw/sdk`.

---

## `RogueClawSDK`

### Constructor

```typescript
new RogueClawSDK(config: SDKConfig)
```

```typescript
interface SDKConfig {
  apiKey: string;           // Your RogueClaw API key
  wallet: string;           // Solana wallet address (for tier verification)
  tier: "observer" | "builder" | "operator" | "sovereign";
  network?: "mainnet" | "devnet"; // Default: "mainnet"
  rpcUrl?: string;          // Custom Solana RPC endpoint
}
```

---

### `sdk.deployAgent(config)`

Deploys a new autonomous agent. Returns an `Agent` instance.

```typescript
sdk.deployAgent(config: AgentConfig): Promise<Agent>
```

```typescript
interface AgentConfig {
  mandate: "hunt" | "burn" | "pool" | "vault" | "raid";
  token: string;                    // SPL token mint address
  triggers: string[];               // Event triggers that activate the agent
  maxBudgetSol: number;             // Max SOL deployable per action cycle
  onConflict: "performance_score" | "priority_queue" | "first_proposer";
  circuitBreaker?: {
    floor: number;                  // Minimum treasury SOL (default: 10% of initial)
    suspendOnYellow?: boolean;      // Suspend at 20% above floor (default: false)
  };
  customPrompt?: string;            // Extend the base mandate prompt (Operator+ only)
}
```

**Available triggers:**

| Trigger | Description |
|---|---|
| `price_drop_5pct` | Price drops 5% in a single block window |
| `price_drop_10pct` | Price drops 10% |
| `whale_sell_detected` | Wallet > threshold executes a sell |
| `whale_buy_detected` | Wallet > threshold executes a buy |
| `liquidity_drop_20pct` | Pool liquidity drops 20% |
| `volume_spike_3x` | Volume exceeds 3x 24hr average |
| `fee_threshold_met` | Fee accumulation crosses burn threshold |
| `treasury_below_floor` | Treasury drops below circuit breaker floor |
| `interval_1h` | Time-based trigger: every hour |
| `interval_6h` | Time-based trigger: every 6 hours |

---

### `sdk.getAgent(agentId)`

Retrieves an existing deployed agent by ID.

```typescript
sdk.getAgent(agentId: string): Promise<Agent>
```

---

### `sdk.listAgents()`

Returns all agents deployed under your API key.

```typescript
sdk.listAgents(): Promise<Agent[]>
```

---

## `Agent`

### Methods

```typescript
agent.start(): Promise<void>
agent.stop(): Promise<void>
agent.pause(): Promise<void>
agent.resume(): Promise<void>
```

```typescript
agent.getStatus(): Promise<AgentStatus>
// Returns: "active" | "paused" | "stopped" | "circuit_broken"

agent.getPerformanceScore(): Promise<number>
// Returns: 0–100, 30-day rolling score

agent.getActionHistory(limit?: number): Promise<AgentAction[]>
// Returns: array of completed actions, most recent first
```

### Events

```typescript
agent.on("action", (event: ActionEvent) => void)
agent.on("conflict", (event: ConflictEvent) => void)
agent.on("circuit_breaker", (event: CircuitBreakerEvent) => void)
agent.on("error", (event: ErrorEvent) => void)
```

```typescript
interface ActionEvent {
  agentId: string;
  type: string;             // "buyback" | "burn" | "liquidity" | "raid"
  solDeployed: number;
  txHash: string;
  timestamp: number;
  detail: string;
}

interface ConflictEvent {
  winner: string;           // Agent ID that won
  loser: string;            // Agent ID that lost
  resource: string;         // What was contested
  winnerScore: number;
  loserScore: number;
}
```

---

## Error Codes

| Code | Description |
|---|---|
| `TIER_INSUFFICIENT` | Action requires a higher $ROGUECLAW holding tier |
| `SLOT_LIMIT_REACHED` | Agent slot limit for your tier is at capacity |
| `CIRCUIT_BREAKER_ACTIVE` | Treasury circuit breaker is blocking execution |
| `INVALID_TRIGGER` | Trigger string not recognized |
| `TOKEN_NOT_FOUND` | Provided token mint address not found on Solana |
| `INSUFFICIENT_TREASURY` | Agent treasury balance too low to execute action |

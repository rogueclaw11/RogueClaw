import Anthropic from "@anthropic-ai/sdk";
import { AGENT_MAP } from "../app/lib/agents";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const runner = new Anthropic({ apiKey: process.env.AGENT_INFERENCE_KEY });
const MODEL = process.env.AGENT_MODEL ?? "claude-sonnet-4-6";

export interface Decision {
  action: "act" | "hold";
  reason: string;
  raw: string;
}

export interface Allocation {
  emberclaw: number;
  ironclaw: number;
  tideclaw: number;
  stormclaw: number;
}

export async function askAgent(agentId: string, prompt: string): Promise<string> {
  const agent = AGENT_MAP[agentId];
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);

  const msg = await runner.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: agent.system,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content
    .filter(b => b.type === "text")
    .map(b => (b as { type: "text"; text: string }).text)
    .join("");
}

export async function stoneclawDecide(
  marketContext: string,
  availableSOL: number
): Promise<{ decision: Decision; allocation: Allocation | null }> {
  const prompt = `
${marketContext}

Available SOL to deploy: ${availableSOL.toFixed(4)} SOL

You are STONECLAW. Decide:
1. Is acting now worth it, or should we hold? Consider gas costs, market conditions, and whether this SOL amount justifies action.
2. If acting: how do you split the SOL across the other four agents?

Respond in this exact format:
DECISION: ACT or HOLD
REASON: [one sentence]
EMBERCLAW: [0-100]%
IRONCLAW: [0-100]%
TIDECLAW: [0-100]%
STORMCLAW: [0-100]%

Percentages must add up to 100 if acting. If holding, set all to 0.
`.trim();

  const raw = await askAgent("stoneclaw", prompt);

  const decisionMatch = raw.match(/DECISION:\s*(ACT|HOLD)/i);
  const reasonMatch = raw.match(/REASON:\s*(.+)/i);

  const action = (decisionMatch?.[1]?.toUpperCase() === "ACT") ? "act" : "hold";
  const reason = reasonMatch?.[1]?.trim() ?? "No reason given";

  if (action === "hold") {
    return {
      decision: { action: "hold", reason, raw },
      allocation: null,
    };
  }

  const ember = parseInt(raw.match(/EMBERCLAW:\s*(\d+)/i)?.[1] ?? "40");
  const iron  = parseInt(raw.match(/IRONCLAW:\s*(\d+)/i)?.[1] ?? "30");
  const tide  = parseInt(raw.match(/TIDECLAW:\s*(\d+)/i)?.[1] ?? "20");
  const storm = parseInt(raw.match(/STORMCLAW:\s*(\d+)/i)?.[1] ?? "10");

  const total = ember + iron + tide + storm;

  return {
    decision: { action: "act", reason, raw },
    allocation: {
      emberclaw: ember / total,
      ironclaw:  iron  / total,
      tideclaw:  tide  / total,
      stormclaw: storm / total,
    },
  };
}

export async function stormclawApprove(marketContext: string): Promise<boolean> {
  const prompt = `
${marketContext}

You are STORMCLAW. You have been allocated SOL for an aggressive raid.
Should you execute now or stand down?

Respond with exactly:
EXECUTE or STAND DOWN
Then one sentence of reasoning.
`.trim();

  const raw = await askAgent("stormclaw", prompt);
  return raw.toUpperCase().includes("EXECUTE");
}

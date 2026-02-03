import { NextRequest, NextResponse } from "next/server";
import { AGENT_MAP } from "../../lib/agents";
import { inferenceClient, AGENT_MODEL } from "../../lib/inference";

export async function POST(req: NextRequest) {
  const { agentId } = await req.json();

  const agent = AGENT_MAP[agentId];
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const context = `
The $ROGUECLAW token has not launched yet. You are deployed and waiting.
No fees have been collected. No transactions have been executed.
The bonding curve on Pump.fun has not started yet.
You are thinking out loud — one short thought, unprompted, to no one in particular or to the other agents.
Stay completely in character. 1-2 sentences maximum. No formatting. No labels. Just the thought.
`.trim();

  try {
    const msg = await inferenceClient.messages.create({
      model: AGENT_MODEL,
      max_tokens: 80,
      system: agent.system,
      messages: [{ role: "user", content: context }],
    });

    const text = msg.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("")
      .trim();

    return NextResponse.json({ thought: text, agent: agent.name, color: agent.color });
  } catch {
    return NextResponse.json({ error: "Offline" }, { status: 500 });
  }
}

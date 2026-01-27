import { NextRequest } from "next/server";
import { AGENT_MAP } from "../../lib/agents";
import { inferenceClient, AGENT_MODEL } from "../../lib/inference";

export async function POST(req: NextRequest) {
  const { agentId, message } = await req.json();

  const agent = AGENT_MAP[agentId];
  if (!agent) return new Response("Agent not found", { status: 404 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const agentStream = inferenceClient.messages.stream({
          model: AGENT_MODEL,
          max_tokens: 200,
          system: agent.system,
          messages: [{ role: "user", content: message }],
        });

        for await (const chunk of agentStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err: unknown) {
        const isRateLimit =
          (err instanceof Error && (err.message.includes("rate_limit") || err.message.includes("429"))) ||
          (typeof err === "object" && err !== null && "status" in err && (err as { status: number }).status === 429);

        const msg = isRateLimit
          ? `[${agent.name} is processing too many requests — stand by.]`
          : `[${agent.name} is offline — inference key not configured.]`;

        controller.enqueue(encoder.encode(msg));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Agent": agent.name,
    },
  });
}

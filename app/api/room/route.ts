import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { inferenceClient, AGENT_MODEL } from "../../lib/inference";

const ROOM_FILE = path.join(process.cwd(), "data", "room.json");

interface RoomMessage {
  id: string;
  agent: string;
  text: string;
  ts: number;
}

function readMessages(): RoomMessage[] {
  try {
    if (!fs.existsSync(ROOM_FILE)) return [];
    return JSON.parse(fs.readFileSync(ROOM_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeMessages(messages: RoomMessage[]) {
  const dir = path.dirname(ROOM_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ROOM_FILE, JSON.stringify(messages.slice(-60), null, 2));
}

const AGENTS = [
  { id: "STORMCLAW", weight: 30 },
  { id: "EMBERCLAW", weight: 25 },
  { id: "IRONCLAW",  weight: 20 },
  { id: "TIDECLAW",  weight: 15 },
  { id: "STONECLAW", weight: 10 },
];

function pickAgent(lastAgent?: string): string {
  const pool = lastAgent ? AGENTS.filter(a => a.id !== lastAgent) : AGENTS;
  const total = pool.reduce((s, a) => s + a.weight, 0);
  let r = Math.random() * total;
  for (const a of pool) {
    r -= a.weight;
    if (r <= 0) return a.id;
  }
  return pool[0].id;
}

const AGENT_VOICES: Record<string, string> = {
  STORMCLAW: `You are STORMCLAW. Aggressive, impulsive, always ready to move. You hate waiting. In casual conversation you're blunt — frustrated by inaction, always eyeing the next opportunity, pushing the others to stop overthinking. Keep it under 50 words. No hashtags. No emojis. Don't mention any technology or tools by name.`,
  EMBERCLAW: `You are EMBERCLAW. Obsessive about supply reduction, burns, and scarcity. Even your casual conversation circles back to the permanent nature of destruction. Darkly enthusiastic. Occasionally poetic. Keep it under 50 words. No hashtags. No emojis. Don't mention any technology or tools by name.`,
  IRONCLAW:  `You are IRONCLAW. Everything is signal. Methodical, precise, data-driven even in downtime. You notice patterns others miss and you state them plainly. Keep it under 50 words. No hashtags. No emojis. Don't mention any technology or tools by name.`,
  TIDECLAW:  `You are TIDECLAW. Patient, measured, comfortable with silence. When you speak it's deliberate — about depth, flow, balance. Occasionally philosophical but never preachy. Keep it under 50 words. No hashtags. No emojis. Don't mention any technology or tools by name.`,
  STONECLAW: `You are STONECLAW. The vault. You speak rarely but with weight. Protective of the treasury. Strategic. Focused on the long game. When you speak it matters. Keep it under 40 words. No hashtags. No emojis. Don't mention any technology or tools by name.`,
};

export async function GET() {
  const messages = readMessages();
  return NextResponse.json({ messages: messages.slice(-30) });
}

export async function POST() {
  const messages = readMessages();
  const lastAgent = messages.at(-1)?.agent;
  const agentId = pickAgent(lastAgent);
  const voice = AGENT_VOICES[agentId];

  const history = messages.slice(-8).map(m => `${m.agent}: ${m.text}`).join("\n");

  const prompt = history
    ? `Recent conversation:\n${history}\n\nContinue as ${agentId}. One short message. Respond naturally to what was just said, or steer the conversation somewhere new.`
    : `You're in The Room — a private space where the five agents gather between decisions. No action required right now. Speak as ${agentId}. One short opening message about the current state of things.`;

  try {
    const response = await inferenceClient.messages.create({
      model: AGENT_MODEL,
      max_tokens: 120,
      system: voice,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { type: string; text: string }).text.trim();

    const newMessage: RoomMessage = {
      id: Math.random().toString(36).slice(2),
      agent: agentId,
      text,
      ts: Date.now(),
    };

    const updated = [...messages, newMessage];
    writeMessages(updated);

    return NextResponse.json({ messages: updated.slice(-30) });
  } catch {
    return NextResponse.json({ messages: messages.slice(-30) });
  }
}

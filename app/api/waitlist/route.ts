import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "waitlist.json");

async function getEntries(): Promise<{ email: string; type: string; ts: string }[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { email, type = "general" } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    const entries = await getEntries();

    if (entries.find(e => e.email === email)) {
      return NextResponse.json({ message: "Already on the list" });
    }

    entries.push({ email, type, ts: new Date().toISOString() });
    await fs.writeFile(FILE, JSON.stringify(entries, null, 2));

    return NextResponse.json({ message: "Added to waitlist", count: entries.length });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const entries = await getEntries();
  return NextResponse.json({ count: entries.length });
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ACTIVITY_FILE = path.join(process.cwd(), "data", "activity.json");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent"); // optional filter by agent id
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;

  if (!fs.existsSync(ACTIVITY_FILE)) {
    return NextResponse.json({ entries: [], total: 0, hasReal: false });
  }

  try {
    const raw = JSON.parse(fs.readFileSync(ACTIVITY_FILE, "utf-8"));
    const all = Array.isArray(raw) ? raw : [];

    const filtered = agent
      ? all.filter((e: { agent: string }) => e.agent === agent)
      : all;

    // Newest first
    const sorted = [...filtered].reverse();
    const total = sorted.length;
    const entries = sorted.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ entries, total, hasReal: total > 0 });
  } catch {
    return NextResponse.json({ entries: [], total: 0, hasReal: false });
  }
}

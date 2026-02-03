import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

const DEFAULT_STATS = {
  treasurySOL: 0,
  totalBurned: 0,
  totalBoughtBack: 0,
  totalFeesClaimed: 0,
  lastUpdated: null,
};

export async function GET() {
  if (!fs.existsSync(STATS_FILE)) {
    return NextResponse.json(DEFAULT_STATS);
  }

  try {
    const stats = JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(DEFAULT_STATS);
  }
}

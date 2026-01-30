import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const ACTIVITY_FILE = path.join(DATA_DIR, "activity.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

export interface ActivityEntry {
  id: string;
  agent: string;
  action: string;
  detail: string;
  txHash: string | null;
  solscanUrl: string | null;
  timestamp: string;
  type: string;
}

export interface Stats {
  treasurySOL: number;
  totalBurned: number;
  totalBoughtBack: number;
  totalFeesClaimed: number;
  lastUpdated: string;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readActivity(): ActivityEntry[] {
  ensureDir();
  if (!fs.existsSync(ACTIVITY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ACTIVITY_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function readStats(): Stats {
  ensureDir();
  if (!fs.existsSync(STATS_FILE)) {
    return {
      treasurySOL: 0,
      totalBurned: 0,
      totalBoughtBack: 0,
      totalFeesClaimed: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
  try {
    return JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
  } catch {
    return {
      treasurySOL: 0,
      totalBurned: 0,
      totalBoughtBack: 0,
      totalFeesClaimed: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function logActivity(entry: Omit<ActivityEntry, "id" | "timestamp">) {
  const activity = readActivity();
  const newEntry: ActivityEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    timestamp: new Date().toISOString(),
  };
  activity.push(newEntry);
  // Keep last 500 entries
  const trimmed = activity.slice(-500);
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(trimmed, null, 2));
  console.log(`[${entry.agent}] ${entry.action} — ${entry.detail}`);
}

export function updateStats(delta: Partial<Omit<Stats, "lastUpdated">>) {
  const stats = readStats();
  const updated: Stats = {
    treasurySOL: stats.treasurySOL + (delta.treasurySOL ?? 0),
    totalBurned: stats.totalBurned + (delta.totalBurned ?? 0),
    totalBoughtBack: stats.totalBoughtBack + (delta.totalBoughtBack ?? 0),
    totalFeesClaimed: stats.totalFeesClaimed + (delta.totalFeesClaimed ?? 0),
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(STATS_FILE, JSON.stringify(updated, null, 2));
}

export function setStats(values: Partial<Omit<Stats, "lastUpdated">>) {
  const stats = readStats();
  const updated: Stats = { ...stats, ...values, lastUpdated: new Date().toISOString() };
  fs.writeFileSync(STATS_FILE, JSON.stringify(updated, null, 2));
}

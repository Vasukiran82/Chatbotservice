import fs from "fs";
import path from "path";
const intentsPath = path.join(__dirname, "../intents/universalIntents.json");
const intentsData = JSON.parse(fs.readFileSync(intentsPath, "utf-8"));

export interface IntentDef {
  intent: string;
  patterns: string[];
  entities?: string[];
  validationAPI?: string;
  responses: string[];
}

export interface DomainIntents {
  domain: string;
  intents: IntentDef[];
}

export function loadAllIntents(intentsDir?: string): DomainIntents[] {
  const dir = intentsDir || path.join(__dirname, "../intents");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  const all: DomainIntents[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const parsed = JSON.parse(raw) as DomainIntents;
    all.push(parsed);
  }

  return all;
}

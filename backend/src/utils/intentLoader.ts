import fs from "fs";
import path from "path";

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
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    // Validate JSON structure
    if (!parsed.domain || !Array.isArray(parsed.intents)) {
      console.error(`❌ Invalid intent file: ${file}`);
      continue;
    }

    all.push(parsed);
  }

  return all;
}

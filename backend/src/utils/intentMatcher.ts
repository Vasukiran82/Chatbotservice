import { IntentDef, DomainIntents, loadAllIntents } from "./intentLoader";


function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[-\/\\^$+?.()|[\]]/g, "\\$&");
  const withGroups = escaped.replace(/\{(\w+)\}/g, (_, name) => `(?<${name}>.+?)`);
  const spaced = withGroups.replace(/\s+/g, "\\s+");
  return new RegExp("^\\s*" + spaced + "\\s*$", "i");
}

export function matchIntent(userMessage: string): {
  domain?: string;
  intent?: IntentDef;
  entities?: Record<string, string>;
  confidence: number;
} {
  const message = (userMessage || "").trim();
  const domains = loadAllIntents();

  for (const domain of domains) {
    for (const intent of domain.intents) {
      for (const pattern of intent.patterns || []) {
        const regex = patternToRegex(pattern);
        const m = regex.exec(message);
        if (m) {
          const groups = (m as any).groups || {};
         
          const entities: Record<string, string> = {};
          for (const k of Object.keys(groups || {})) {
            entities[k] = groups[k] ? groups[k].trim() : "";
          }
          return { domain: domain.domain, intent, entities, confidence: 1.0 };
        }
      }
    }
  }

  // 2) Keyword overlap fallback (simple)
  const tokens = message.toLowerCase().split(/\s+/).filter(Boolean);
  let bestScore = 0;
  let best: { domain?: string; intent?: IntentDef; entities?: Record<string, string> } = {};

  for (const domain of domains) {
    for (const intent of domain.intents) {
      // build keywords from patterns (strip placeholders)
      const keywords = intent.patterns
        .map(p => p.replace(/\{.+?\}/g, ""))
        .join(" ")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      let score = 0;
      for (const t of tokens) if (keywords.includes(t)) score++;
      if (score > bestScore) {
        bestScore = score;
        best = { domain: domain.domain, intent, entities: {} };
      }
    }
  }

  const confidence = bestScore > 0 ? Math.min(0.9, bestScore / 5) : 0;
  return { domain: best.domain, intent: best.intent, entities: best.entities, confidence };
}

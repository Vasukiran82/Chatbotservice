import { IntentDef, DomainIntents, loadAllIntents } from "./intentLoader";
import { detectDomain } from "./domainDetector";

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[-\/\\^$+?.()|[\]]/g, "\\$&");
  const withGroups = escaped.replace(/\{(\w+)\}/g, (_, name) => `(?<${name}>.+?)`);
  const spaced = withGroups.replace(/\s+/g, "\\s+");
  return new RegExp("^\\s*" + spaced + "\\s*$", "i");
}

export function matchIntent(userMessage: string) {
  const msg = userMessage.trim();
  const domains = loadAllIntents();

  // Step 1: Detect best domain
  const detectedDomain = detectDomain(msg, domains);

  let domainOrder = [
    detectedDomain,    
    "common",
    "universal"
  ];

  // Step 2: Try match inside domain priority order
  for (const dom of domainOrder) {
    const domainData = domains.find(d => d.domain === dom);
    if (!domainData) continue;

    for (const intent of domainData.intents) {
      for (const pattern of intent.patterns) {
        const regex = patternToRegex(pattern);
        const match = regex.exec(msg);
        if (match) {
          const entities = match.groups || {};
          return {
            domain: dom,
            intent,
            entities,
            confidence: 1.0
          };
        }
      }
    }
  }

  // Step 3: Fallback keyword match (low confidence)
  const tokens = msg.toLowerCase().split(/\s+/);
  let best: any = null;
  let bestScore = 0;

  for (const d of domains) {
    for (const intent of d.intents) {
      const keywords = intent.patterns
        .map(p => p.replace(/\{.+?\}/g, "").toLowerCase())
        .join(" ")
        .split(/\s+/);

      let score = tokens.filter(t => keywords.includes(t)).length;

      if (score > bestScore) {
        best = { domain: d.domain, intent, entities: {} };
        bestScore = score;
      }
    }
  }

  return {
    domain: best?.domain,
    intent: best?.intent,
    entities: best?.entities,
    confidence: bestScore ? bestScore / 5 : 0
  };
}

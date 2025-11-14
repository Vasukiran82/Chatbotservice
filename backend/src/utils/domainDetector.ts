import { DomainIntents } from "./intentLoader";

export function detectDomain(message: string, domains: DomainIntents[]): string | null {
  const msg = message.toLowerCase();

  // priority-based domain keywords
  const domainKeywords: Record<string, string[]> = {
    ecommerce: ["order", "product", "cart", "delivery", "refund"],
    erp: ["employee", "inventory", "salary", "invoice"],
    banking: ["account", "balance", "transaction", "loan"],
  };

  for (const domain of domains) {
    const keywords = domainKeywords[domain.domain] || [];
    if (keywords.some(k => msg.includes(k))) {
      return domain.domain;
    }
  }

  return "universal"; // default fall back
}

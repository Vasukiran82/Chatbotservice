import { orderRules } from "../config/config";

export const matchRule = (text: string): string | null => {
  const t = text.toLowerCase();
  for (const rule of orderRules) {
    for (const p of rule.patterns) {
      if (t.includes(p)) return rule.action;
    }
  }
  return null;
};

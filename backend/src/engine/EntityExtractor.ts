// src/engine/EntityExtractor.ts
export interface Entities {
  orderNumber?: string;
  email?: string;
  date?: string;
  amount?: string;
}

const PATTERNS = {
  orderNumber: /(?:^|\s)#?\s*([A-Z0-9]{6,20})\b/gi,
  email: /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/gi,
  date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g,
  amount: /\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)\b/g,
} as const;

export const extractEntities = (message: string): Entities => {
  const entities: Entities = {};

  // Helper to get first capture group safely
  const getFirstMatch = (regex: RegExp): string | undefined => {
    const match = message.match(regex);
    return match ? (match[1] ?? match[0]) : undefined;
  };

  // Order Number
  const orderMatch = getFirstMatch(PATTERNS.orderNumber);
  if (orderMatch) {
    entities.orderNumber = orderMatch.trim().toUpperCase();
  }

  // Email
  const emailMatch = getFirstMatch(PATTERNS.email);
  if (emailMatch) {
    entities.email = emailMatch.trim();
  }

  // Date
  const dateMatch = getFirstMatch(PATTERNS.date);
  if (dateMatch) {
    entities.date = dateMatch.trim();
  }

  // Amount
  const amountMatch = getFirstMatch(PATTERNS.amount);
  if (amountMatch) {
    entities.amount = amountMatch.replace(/[$,]/g, "").trim();
  }

  return entities;
};
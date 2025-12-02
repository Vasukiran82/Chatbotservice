export const WEIGHTS = {
  // Critical words = high weight
  refund: 0.95,
  cancel: 0.92,
  order: 0.85,
  tracking: 0.88,
  hello: 0.75,
  thanks: 0.70,
  // Context words = medium
  please: 0.3,
  help: 0.6,
  // Filler = low
  the: 0.01,
  and: 0.01,
  i: 0.05,
} as const;
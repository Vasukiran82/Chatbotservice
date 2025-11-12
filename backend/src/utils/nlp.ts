export function extractFirstMatch(pattern: RegExp, text: string): string | null {
  const m = text.match(pattern);
  return m ? m[1] ?? m[0] : null;
}

export function buildResponse(template: string, data: Record<string, any> = {}): string {
  let out = template;

  out = out.replace(/\{(\w+)\}/g, (_, key) => {
    const v = data[key];
    if (v === undefined || v === null) return "";
    return String(v);
  });
  return out;
}

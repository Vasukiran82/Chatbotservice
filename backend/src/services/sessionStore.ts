import { SessionId } from "../types";

type Session = {
  id: SessionId;
  context: Record<string, any>;
  createdAt: number;
};

const store = new Map<SessionId, Session>();

export function createOrGetSession(id?: SessionId): Session {
  const sid = id || Math.random().toString(36).slice(2, 10);
  if (!store.has(sid)) {
    store.set(sid, { id: sid, context: {}, createdAt: Date.now() });
  }
  return store.get(sid)!;
}

export function setSessionContext(id: SessionId, key: string, value: any) {
  const s = store.get(id);
  if (!s) return;
  s.context[key] = value;
}

export function getSessionContext(id: SessionId, key: string) {
  const s = store.get(id);
  return s?.context?.[key];
}

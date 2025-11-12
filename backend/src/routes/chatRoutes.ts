import express, { Request, Response } from "express";
import { matchIntent } from "../utils/intentMatcher";
import { validate } from "../utils/validator";
import { buildResponse } from "../utils/responseBuilder";
import { loadAllIntents } from "../utils/intentLoader";

const router = express.Router();

router.post("/chat", async (req: Request, res: Response) => {
  const message = String(req.body?.message || "").trim();
  const session = (req as any).session;
  if (!message) return res.status(400).json({ error: "message is required" });

  
  const matched = matchIntent(message);
  if (!matched.intent || matched.confidence <= 0) {
    const all = loadAllIntents();
    const common = all.find(d => d.domain === "common");
    const fallback = common?.intents.find(i => i.intent === "fallback");
    const reply = fallback ? fallback.responses[0] : "Sorry, I didn't understand.";
    session.history.push({ from: "user", text: message, ts: Date.now() });
    session.history.push({ from: "bot", text: reply, ts: Date.now() });
    return res.json({ domain: "common", intent: "fallback", reply, sessionId: session.id });
  }

  // 3. dynamic validation if intent specifies it
  const domain = matched.domain;
  const intentName = matched.intent.intent;
  const entities = matched.entities || {};
  let validatedData: Record<string, any> = {};

  try {
    const validationResult = await validate(domain, intentName, entities);
    if (validationResult?.ok) validatedData = validationResult.data || {};
  } catch (err) {
    console.error("Validation error:", err);
  }

  // 4. build response template (first template)
  const template = matched.intent.responses && matched.intent.responses[0]
    ? matched.intent.responses[0]
    : "Okay.";

  // merge entity values into validatedData so placeholders can be filled
  const mergedData = { ...entities, ...validatedData };
  const reply = buildResponse(template, mergedData);

  // 5. Save history in session
  session.history.push({ from: "user", text: message, ts: Date.now() });
  session.history.push({ from: "bot", text: reply, ts: Date.now() });

  // 6. Return response
  return res.json({ domain, intent: intentName, reply, sessionId: session.id, entities: mergedData });
});

export default router;

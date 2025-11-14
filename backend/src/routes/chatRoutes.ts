import express, { Request, Response } from "express";
import { matchIntent } from "../utils/intentMatcher";
import { loadAllIntents } from "../utils/intentLoader";
import axios from "axios";
import { buildResponse } from "../utils/responseBuilder";

const router = express.Router();
const ECOM_API = "http://localhost:5001/api/ecommerce";

// Load intents once (performance improvement)
const ALL_INTENTS = loadAllIntents();

router.post("/chat", async (req: Request, res: Response) => {
  const message = String(req.body?.message || "").trim();
  const sessionId = req.body?.sessionId || Date.now().toString();

  if (!message)
    return res.status(400).json({ reply: "Message is required" });

  const matched = matchIntent(message);

  // ❗ No intent found → fallback
  if (!matched.intent || matched.confidence <= 0) {
    const fallback =
      ALL_INTENTS.find(d => d.domain === "common")
        ?.intents.find(i => i.intent === "fallback");

    return res.json({
      reply: fallback?.responses?.[0] || "Sorry, I didn't understand that.",
      sessionId,
    });
  }

  const { domain, intent, entities } = matched;
  let reply = "";

  try {
    if (domain === "ecommerce") {
      switch (intent.intent) {
        case "get_offers": {
          const { data } = await axios.get(`${ECOM_API}/offers`);
          reply = `Here are our current offers:\n${data
            .map((o: any) => `• ${o.title}`)
            .join("\n")}`;
          break;
        }

        case "get_categories": {
          const { data } = await axios.get(`${ECOM_API}/categories`);
          reply = `Available categories:\n${data
            .map((c: string) => `• ${c}`)
            .join("\n")}`;
          break;
        }

        case "get_orders": {
          const { data } = await axios.get(`${ECOM_API}/orders`);
          reply = `Recent orders:\n${data
            .map((o: any) => `#${o.id} - ${o.customer} - ₹${o.total}`)
            .join("\n")}`;
          break;
        }

        case "track_order": {
          const id = entities?.order_id;
          if (!id) {
            reply = "Please provide an order ID like ORD001.";
            break;
          }

          const { data } = await axios.get(`${ECOM_API}/orders/${id}`);
          reply = `Order #${id} → Status: ${data.status}`;
          break;
        }

        default:
          reply = "I understand the intent, but action is not implemented yet.";
      }
    } else {
      reply = buildResponse(intent.responses?.[0] || "OK.", entities);
    }

    return res.json({ reply, sessionId });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    return res
      .status(500)
      .json({ reply: "⚠️ Error contacting backend API." });
  }
});

export default router;

// src/models/intents/trackOrder.intent.ts
import { Order } from "../entities/orderNumber.entity";
import type { ExecutableIntent } from "../../types/intent";

export default {
  name: "trackOrder",
  keywords: ["track", "status", "where", "order", "delivery", "package", "shipped", "arrived"],
  requiredKeywords: ["track", "status", "where", "order", "delivery"],
  boostWords: ["my", "number", "#", "please", "check"],

  async execute(_message: string, entities: { orderNumber?: string }, _sessionId: string) {
    const orderId = entities.orderNumber?.trim().toUpperCase();

    if (!orderId) {
      return "Sure! I'd be happy to check your order status. Please share the order number (e.g. #ABC123 or just ABC123).";
    }

    try {
      const order = await Order.findOne({
        orderId: { $regex: new RegExp(`^${orderId}$`, "i") }
      }).lean();

      if (!order) {
        return `I couldn't find order *${orderId}*. Please double-check the number and try again.`;
      }

      const statusText = {
        Processing: "Processing – we’re preparing your items",
        Shipped: "Shipped – left our warehouse",
        "In Transit": "On the way – coming to you soon",
        Delivered: "Delivered – enjoy!",
        Cancelled: "Cancelled"
      }[order.status] || order.status;

      const delivery = order.deliveryDate
        ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        : "ASAP";

      return `
Order *${orderId}*
Status: ${statusText}
Expected delivery: ${delivery}
      `.trim();
    } catch (error) {
      console.error("trackOrder DB error:", error);
      return "Sorry, I'm having trouble reaching the database right now. Please try again in a minute.";
    }
  }
} satisfies ExecutableIntent;
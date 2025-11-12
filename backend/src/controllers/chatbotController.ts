import { Request, Response } from "express";
import { matchRule } from "../services/ruleEngine";
import { findOrderById, cancelOrder, findOrdersByUser } from "../services/orderService";

export const chatHandler = (req: Request, res: Response) => {
  const { message, userId } = req.body;
  if (!message) return res.json({ reply: "Please enter a message." });

  const action = matchRule(message);
  const orderMatch = message.match(/ORD\d+/i);
  const orderId = orderMatch ? orderMatch[0].toUpperCase() : null;

  switch (action) {
    case "track":
    case "status": {
      if (!orderId && userId) {
        const orders = findOrdersByUser(userId);
        if (orders.length === 0) return res.json({ reply: "No orders found for your account." });
        const latest = orders[0];
        return res.json({ reply: `Your latest order ${latest.id} is currently ${latest.status}.` });
      }
      if (!orderId) return res.json({ reply: "Please provide your order ID to track (e.g., ORD1001)." });
      const order = findOrderById(orderId);
      return res.json({ reply: order ? `Order ${order.id} is ${order.status}. Expected delivery: ${order.expectedDelivery ?? "N/A"}.` : "Order not found." });
    }

    case "cancel": {
      if (!orderId) return res.json({ reply: "Please provide your order ID to cancel." });
      const result = cancelOrder(orderId);
      return res.json({ reply: result.ok ? `Order ${orderId} cancelled successfully.` : `Cannot cancel order: ${result.message}` });
    }

    case "details": {
      if (!orderId) return res.json({ reply: "Please provide your order ID to see details." });
      const o = findOrderById(orderId);
      return res.json({ reply: o ? `Order ${o.id}: ${o.items.map(i => i.name + " x" + i.qty).join(", ")} | Total ₹${o.total}` : "Order not found." });
    }

    case "returns":
      return res.json({ reply: "To request a return, please share your order ID and reason. Returns allowed within 7 days of delivery." });

    case "help":
    default:
      return res.json({
        reply: "I can help with: track order, cancel order, view order details, or request returns. Try: 'Track order ORD1001'."
      });
  }
};

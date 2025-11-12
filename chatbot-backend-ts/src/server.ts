import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

type Product = { id: number; name: string; price: number; desc: string };
type CartItem = Product & { qty: number };
type Session = { cart: CartItem[]; history: { role: "user" | "bot"; text: string; time: string }[] };

const app = express();
app.use(cors());
app.use(express.json());

const products: Product[] = [
  { id: 1, name: "Wireless Earbuds", price: 59.99, desc: "Noise-cancelling, 20h battery" },
  { id: 2, name: "Smart Watch", price: 199.99, desc: "Heart-rate, GPS, waterproof" },
  { id: 3, name: "USB-C Hub", price: 39.99, desc: "7 ports, 4K HDMI" },
  { id: 4, name: "Laptop Stand", price: 24.99, desc: "Aluminum, adjustable" },
];

const sessions = new Map<string, Session>();

function getSession(id: string) {
  if (!sessions.has(id)) {
    sessions.set(id, { cart: [], history: [] });
  }
  return sessions.get(id)!;
}

function understand(text: string): string | { type: string; id?: number } {
  const lower = text.toLowerCase();
  if (lower.includes("hi") || lower.includes("hello")) return "greeting";
  if (lower.includes("product") || lower.includes("show")) return "list";
  if (lower.includes("detail") && /\d+/.test(text)) {
    const id = Number(text.match(/\d+/)![0]);
    return { type: "detail", id };
  }
  if (lower.includes("add") && lower.includes("cart") && /\d+/.test(text)) {
    const id = Number(text.match(/\d+/)![0]);
    return { type: "add", id };
  }
  if (lower.includes("cart") || lower.includes("basket")) return "cart";
  if (lower.includes("checkout") || lower.includes("buy")) return "checkout";
  return "unknown";
}

function botReply(userMsg: string, session: Session): string {
  const intent = understand(userMsg);
  session.history.push({ role: "user", text: userMsg, time: new Date().toISOString() });

  let reply = "";

  if (intent === "greeting") {
    reply = `Hi! I’m ShopBot. I can:
• Show products
• Give details
• Add to cart
• Show cart & checkout
Try: “show products” or “add 1 to cart”`;
  } else if (intent === "list") {
    reply =
      "Our products:\n" +
      products.map((p) => `${p.id}. ${p.name} — $${p.price.toFixed(2)}`).join("\n") +
      "\n\nSay “details 2” or “add 3 to cart”";
  } else if (typeof intent === "object" && intent.type === "detail") {
    const p = products.find((x) => x.id === intent.id);
    reply = p
      ? `${p.name}\n$${p.price.toFixed(2)}\nℹ ${p.desc}\n\nAdd it? Say “add ${p.id} to cart”`
      : "Sorry, I can't find that product.";
  } else if (typeof intent === "object" && intent.type === "add") {
    const p = products.find((x) => x.id === intent.id);
    if (p) {
      const existing = session.cart.find((i) => i.id === p.id);
      if (existing) existing.qty += 1;
      else session.cart.push({ ...p, qty: 1 });
      reply = `Added ${p.name} to cart!`;
    } else {
      reply = "Product not found.";
    }
  } else if (intent === "cart") {
    if (session.cart.length === 0) {
      reply = "Your cart is empty.";
    } else {
      const lines = session.cart.map(
        (item) => `${item.name} × ${item.qty} — $${(item.price * item.qty).toFixed(2)}`
      );
      const total = session.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
      reply = `Your Cart\n${lines.join("\n")}\n\nTotal: $${total.toFixed(2)}\nSay “checkout” to finish.`;
    }
  } else if (intent === "checkout") {
    if (session.cart.length === 0) {
      reply = "Cart is empty! Add something first.";
    } else {
      const total = session.cart.reduce((s, i) => s + i.price * i.qty, 0);
      reply = `Order placed!\nTotal: $${total.toFixed(2)}\n(pretend payment succeeded)\nThank you!`;
      session.cart = []; 
    }
  } else {
    reply = `I didn't understand “${userMsg}”. Try: show products, details 1, add 2 to cart, cart, checkout.`;
  }

  session.history.push({ role: "bot", text: reply, time: new Date().toISOString() });
  return reply;
}

app.post("/api/chat", (req: Request, res: Response) => {
  const { message, sessionId } = req.body as { message?: string; sessionId?: string };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const id = sessionId && typeof sessionId === "string" ? sessionId : uuidv4();
  const session = getSession(id);
  const answer = botReply(message, session);

  res.json({
    reply: answer,
    sessionId: id,
    cartCount: session.cart.reduce((s, i) => s + i.qty, 0),
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Chatbot (TypeScript) running on http://localhost:${PORT}`);
});

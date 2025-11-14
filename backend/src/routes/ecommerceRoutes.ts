import express from "express";
const router = express.Router();

router.get("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;

  if (orderId === "12345") {
    return res.json({
      orderId,
      status: "shipped",
      expectedDelivery: "2025-11-20"
    });
  }

  res.status(404).json({ message: "Order not found" });
});

export default router;

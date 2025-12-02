// src/models/entities/order.entity.ts
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: String,
  status: {
    type: String,
    enum: ["Processing", "Shipped", "In Transit", "Delivered", "Cancelled"],
    default: "Processing"
  },
  deliveryDate: Date,
  items: [String],
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
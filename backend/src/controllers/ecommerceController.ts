import { Request, Response } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOffers,
  getCategories
} from "../models/ecommerceModel";

export const getAllOrdersCtrl = (req: Request, res: Response) => {
  res.json({ success: true, data: getAllOrders() });
};

export const getOrderByIdCtrl = (req: Request, res: Response) => {
  const order = getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
};

export const createOrderCtrl = (req: Request, res: Response) => {
  const { id, order } = req.body;
  createOrder(id, order);
  res.json({ success: true, message: "Order created successfully" });
};

export const updateOrderCtrl = (req: Request, res: Response) => {
  try {
    updateOrder(req.params.id, req.body);
    res.json({ success: true, message: "Order updated successfully" });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const deleteOrderCtrl = (req: Request, res: Response) => {
  try {
    deleteOrder(req.params.id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getOffersCtrl = (req: Request, res: Response) => {
  res.json({ success: true, offers: getOffers() });
};

export const getCategoriesCtrl = (req: Request, res: Response) => {
  res.json({ success: true, categories: getCategories() });
};

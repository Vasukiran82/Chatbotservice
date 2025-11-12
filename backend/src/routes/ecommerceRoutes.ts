import express from "express";
import {
  getAllOrdersCtrl,
  getOrderByIdCtrl,
  createOrderCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
  getOffersCtrl,
  getCategoriesCtrl
} from "../controllers/ecommerceController";

const router = express.Router();

router.get("/orders", getAllOrdersCtrl);
router.get("/orders/:id", getOrderByIdCtrl);
router.post("/orders", createOrderCtrl);
router.put("/orders/:id", updateOrderCtrl);
router.delete("/orders/:id", deleteOrderCtrl);
router.get("/offers", getOffersCtrl);
router.get("/categories", getCategoriesCtrl);

export default router;

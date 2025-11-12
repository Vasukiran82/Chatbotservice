import path from "path";
import { readJSON, writeJSON } from "../utils/fileHandler";

const dataPath = path.join(__dirname, "../data/ecommerceData.json");

export interface Order {
  status: string;
  delivery_date: string;
  payment_status: string;
  refund_status: string;
  delivery_address: string;
}

export interface Product {
  availability_status: string;
  product_description: string;
  product_list: string[];
}

export interface EcommerceData {
  orders: Record<string, Order>;
  products: Record<string, Product>;
  offers: string[];
  categories: Record<string, string[]>;
}

// Load data
export function getEcommerceData(): EcommerceData {
  return readJSON(dataPath);
}

// Save data
export function saveEcommerceData(data: EcommerceData) {
  writeJSON(dataPath, data);
}

// ---------- ORDER MODEL ----------
export function getAllOrders() {
  const data = getEcommerceData();
  return data.orders;
}

export function getOrderById(id: string) {
  const data = getEcommerceData();
  return data.orders[id];
}

export function createOrder(id: string, order: Order) {
  const data = getEcommerceData();
  data.orders[id] = order;
  saveEcommerceData(data);
}

export function updateOrder(id: string, updates: Partial<Order>) {
  const data = getEcommerceData();
  if (!data.orders[id]) throw new Error("Order not found");
  data.orders[id] = { ...data.orders[id], ...updates };
  saveEcommerceData(data);
}

export function deleteOrder(id: string) {
  const data = getEcommerceData();
  if (!data.orders[id]) throw new Error("Order not found");
  delete data.orders[id];
  saveEcommerceData(data);
}

// ---------- PRODUCT MODEL ----------
export function getAllProducts() {
  const data = getEcommerceData();
  return data.products;
}

export function getProductByName(name: string) {
  const data = getEcommerceData();
  return data.products[name];
}

// ---------- OTHER MODELS ----------
export function getOffers() {
  const data = getEcommerceData();
  return data.offers;
}

export function getCategories() {
  const data = getEcommerceData();
  return data.categories;
}

import axios from "axios";

export async function validate(
  domain: string | undefined,
  intentName: string | undefined,
  entities: Record<string, string> | undefined
) {
  entities = entities || {};

  try {
    if (domain === "ecommerce") {
      switch (intentName) {
        case "track_order": {
          const orderId = entities["order_id"];
          if (!orderId) throw new Error("Missing order_id");
          
          const res = await axios.get(`http://localhost:5000/api/ecommerce/orders/${orderId}`);
          return { ok: true, data: res.data };
        }

        case "cancel_order": {
          const orderId = entities["order_id"];
          if (!orderId) throw new Error("Missing order_id");

          const res = await axios.delete(`http://localhost:5000/api/ecommerce/orders/${orderId}`);
          return { ok: true, data: { order_id: orderId, status: res.data.status || "cancelled" } };
        }

        case "show_offers": {
          const res = await axios.get(`http://localhost:5000/api/ecommerce/offers`);
          return { ok: true, data: { offers: res.data } };
        }

        case "category_products": {
          const category = entities["category_name"];
          if (!category) throw new Error("Missing category_name");

          const res = await axios.get(`http://localhost:5000/api/ecommerce/categories?name=${category}`);
          return { ok: true, data: { category_name: category, product_list: res.data } };
        }

        default:
          return { ok: true, data: {} };
      }
    }

    if (domain === "erp" && intentName === "leave_balance") {
      return { ok: true, data: { remaining_leaves: 8 } };
    }

    if (domain === "erp" && intentName === "invoice_status") {
      const invoiceId = entities["invoice_id"] || "INV1001";
      return {
        ok: true,
        data: { invoice_id: invoiceId, status: "unpaid", due_date: "2025-12-01" },
      };
    }

    return { ok: true, data: {} };
  } catch (err) {
    console.error(`Validation API error for ${domain}/${intentName}:`, err);
    return { ok: false, data: {} };
  }
}

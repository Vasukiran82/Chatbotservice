
 

export async function validate(domain: string | undefined, intentName: string | undefined, entities: Record<string, string> | undefined) {
  
  entities = entities || {};

  if (domain === "ecommerce" && intentName === "track_order") {
    
    const orderId = entities["order_id"] || "ORD0001";
    return {
      ok: true,
      data: {
        order_id: orderId,
        status: "shipped",
        delivery_date: "2025-11-12"
      }
    };
  }

  if (domain === "erp" && intentName === "leave_balance") {
    return { ok: true, data: { remaining_leaves: 8 } };
  }

  if (domain === "erp" && intentName === "invoice_status") {
    const invoiceId = entities["invoice_id"] || "INV1001";
    return { ok: true, data: { invoice_id: invoiceId, status: "unpaid", due_date: "2025-12-01" } };
  }

  return { ok: true, data: {} };
}

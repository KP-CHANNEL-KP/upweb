// lib/orders.ts — Cloudflare D1 backed order storage
export type OrderStatus = 'pending' | 'delivered';

export type Order = {
  orderId: string;
  createdAt: string;
  service: string;
  serviceLabel: string;
  pkg: { name: string; price: string };
  phone: string;
  refCode: string;
  payMethod: string;
  userName: string;
  status: OrderStatus;
  account?: { email: string; password: string };
};

// D1 row (snake_case) ကို Order type (camelCase) အဖြစ် ပြောင်းပေးတယ်
function mapRow(row: Record<string, any>): Order {
  return {
    orderId: row.order_id,
    createdAt: row.created_at,
    service: row.service,
    serviceLabel: row.service_label,
    pkg: { name: row.pkg_name, price: row.pkg_price ?? '-' },
    phone: row.phone,
    refCode: row.ref_code,
    payMethod: row.pay_method ?? '-',
    userName: row.user_name ?? '-',
    status: row.status as OrderStatus,
    account:
      row.status === 'delivered' && row.account_email
        ? { email: row.account_email, password: row.account_password }
        : undefined,
  };
}

export async function createOrder(db: D1Database, order: Order): Promise<void> {
  await db
    .prepare(
      `INSERT INTO orders
        (order_id, created_at, service, service_label, pkg_name, pkg_price, phone, ref_code, pay_method, user_name, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    )
    .bind(
      order.orderId,
      order.createdAt,
      order.service,
      order.serviceLabel,
      order.pkg.name,
      order.pkg.price,
      order.phone,
      order.refCode,
      order.payMethod,
      order.userName,
    )
    .run();
}

export async function getOrder(db: D1Database, orderId: string): Promise<Order | null> {
  const row = await db.prepare(`SELECT * FROM orders WHERE order_id = ?`).bind(orderId).first();
  return row ? mapRow(row) : null;
}

export async function listPendingOrders(db: D1Database): Promise<Order[]> {
  const { results } = await db
    .prepare(`SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 50`)
    .all();
  return (results ?? []).map(mapRow);
}

export async function deliverOrder(
  db: D1Database,
  orderId: string,
  account: { email: string; password: string },
): Promise<Order> {
  const result = await db
    .prepare(`UPDATE orders SET status = 'delivered', account_email = ?, account_password = ? WHERE order_id = ?`)
    .bind(account.email, account.password, orderId)
    .run();

  if (result.meta.changes === 0) {
    throw new Error('Order not found');
  }

  const order = await getOrder(db, orderId);
  if (!order) throw new Error('Order not found after update');
  return order;
}
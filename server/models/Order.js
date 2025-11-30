const db = require('../db');

class Order {
  // 1. Create New Order (Transaction: Header -> Items)
  static async createNewOrder(data) {
    const { userId, addressInfo, orderStatus, totalAmount, cartItems } = data;

    // A. Insert Order Header
    const orderSql = `
            INSERT INTO orders (user_id, shipping_address_id, status, total_amount)
            VALUES (?, ?, ?, ?)
        `;
    // Assuming addressInfo contains an ID, if it's an object we usually save it to address table first
    // For assignment simplicity, we assume addressInfo.addressId exists
    const [orderResult] = await db.execute(orderSql, [
      userId,
      addressInfo.addressId || null,
      orderStatus,
      totalAmount
    ]);

    const newOrderId = orderResult.insertId;

    // B. Insert Order Items
    const itemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
            VALUES ?
        `;

    // Prepare array for bulk insert
    const itemValues = cartItems.map(item => [
      newOrderId,
      item.productId,
      item.quantity,
      item.price
    ]);

    // Using query instead of execute for bulk insert
    await db.query(itemSql, [itemValues]);

    return newOrderId;
  }

  // 2. Find Order by ID (Joins Orders + Items)
  static async findById(orderId) {
    const sql = `
            SELECT o.*, oi.product_id, oi.quantity, oi.price_at_order, p.name as title
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE o.order_id = ?
        `;
    const [rows] = await db.execute(sql, [orderId]);

    if (rows.length === 0) return null;

    // Reconstruct the object to look like the MongoDB document
    const orderHeader = rows[0];
    const result = {
      _id: orderHeader.order_id,
      userId: orderHeader.user_id,
      orderStatus: orderHeader.status,
      paymentStatus: orderHeader.status === 'confirmed' ? 'paid' : 'pending',
      totalAmount: orderHeader.total_amount,
      cartItems: rows.map(row => ({
        productId: row.product_id,
        title: row.title,
        quantity: row.quantity,
        price: row.price_at_order
      }))
    };
    return result;
  }

  // 3. Find All By User
  static findAllByUserId(userId) {
    return db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [userId]);
  }

  // 4. Update Payment Status
  static updatePaymentStatus(orderId, payStatus, orderStatus, paymentId, payerId) {
    const sql = `
            UPDATE orders 
            SET status = ? 
            WHERE order_id = ?
        `;
    return db.execute(sql, [orderStatus, orderId]);
  }
}

module.exports = Order;
const db = require('../db');

class Cart {
  // Helper: Find or Create Cart ID
  static async createOrGetCartId(userId) {
    const [rows] = await db.execute('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      return rows[0].cart_id;
    }
    const [result] = await db.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }

  // 1. Add Item (Check existence -> Insert or Update)
  static async addItem(cartId, productId, quantity) {
    // Check if item exists in this cart
    const [existing] = await db.execute(
      'SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + quantity;
      return db.execute(
        'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
        [newQty, cartId, productId]
      );
    } else {
      // Insert new item
      return db.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }
  }

  // 2. Get Cart Items (Replaces .populate)
  static getCartItems(userId) {
    const sql = `
            SELECT 
                ci.product_id as productId, 
                ci.quantity,
                p.name as title, 
                p.image_url as image, 
                p.price, 
                p.sale_price as salePrice
            FROM carts c
            JOIN cart_items ci ON c.cart_id = ci.cart_id
            JOIN products p ON ci.product_id = p.product_id
            WHERE c.user_id = ?
        `;
    return db.execute(sql, [userId]);
  }

  // 3. Update Item Quantity
  static updateItemQty(userId, productId, quantity) {
    const sql = `
            UPDATE cart_items ci
            JOIN carts c ON c.cart_id = ci.cart_id
            SET ci.quantity = ?
            WHERE c.user_id = ? AND ci.product_id = ?
        `;
    return db.execute(sql, [quantity, userId, productId]);
  }

  // 4. Delete Item
  static deleteItem(userId, productId) {
    const sql = `
            DELETE ci FROM cart_items ci
            JOIN carts c ON c.cart_id = ci.cart_id
            WHERE c.user_id = ? AND ci.product_id = ?
        `;
    return db.execute(sql, [userId, productId]);
  }
}

module.exports = Cart;
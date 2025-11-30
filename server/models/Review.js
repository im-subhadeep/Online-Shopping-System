const db = require('../db');

class Review {
  // 1. Verify Purchase (Join Orders and OrderItems)
  static verifyPurchase(userId, productId) {
    const sql = `
            SELECT o.order_id 
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.user_id = ? AND oi.product_id = ?
        `;
    return db.execute(sql, [userId, productId]);
  }

  // 2. Check Existing Review
  static checkExisting(userId, productId) {
    return db.execute(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
  }

  // 3. Add Review
  static addReview({ productId, userId, reviewValue, reviewMessage }) {
    const sql = `
            INSERT INTO reviews (product_id, user_id, rating, comment) 
            VALUES (?, ?, ?, ?)
        `;
    return db.execute(sql, [productId, userId, reviewValue, reviewMessage]);
  }

  // 4. Get Reviews for Product
  static findAllByProduct(productId) {
    // We JOIN with 'users' table to get the username for the frontend
    const sql = `
            SELECT 
                r.review_id, 
                r.rating as reviewValue, 
                r.comment as reviewMessage, 
                u.username as userName
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = ?
        `;
    return db.execute(sql, [productId]);
  }

  // 5. Calculate Average Rating
  static getAverageRating(productId) {
    return db.execute(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE product_id = ?',
      [productId]
    );
  }

  // 6. Update Product Average (Helper to update Products table)
  static updateProductAverage(productId, avgRating) {
    return db.execute(
      'UPDATE products SET average_review = ? WHERE product_id = ?',
      [avgRating, productId]
    );
  }
}

module.exports = Review;
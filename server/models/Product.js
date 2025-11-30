const db = require('../db');

class Product {
  // 1. Fetch All (Admin)
  static findAll() {
    return db.execute('SELECT * FROM products');
  }

  // 2. Find by ID
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE product_id = ?', [id]);
  }

  // 3. Add Product (INSERT)
  static addProduct({ image, title, description, category, brand, price, salePrice, totalStock, averageReview }) {
    const sql = `
            INSERT INTO products 
            (name, description, category, brand, price, sale_price, stock_quantity, image_url, average_review) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    return db.execute(sql, [
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      image,
      averageReview
    ]);
  }

  // 4. Edit Product (UPDATE)
  static editProduct(id, { image, title, description, category, brand, price, salePrice, totalStock, averageReview }) {
    const sql = `
            UPDATE products SET 
            name = ?, description = ?, category = ?, brand = ?, 
            price = ?, sale_price = ?, stock_quantity = ?, image_url = ?, average_review = ?
            WHERE product_id = ?
        `;
    return db.execute(sql, [
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      image,
      averageReview,
      id
    ]);
  }

  // 5. Delete Product (DELETE)
  static deleteById(id) {
    return db.execute('DELETE FROM products WHERE product_id = ?', [id]);
  }

  // 6. Filtered Products (For Shop Page)
  static getFilteredProducts({ categories, brands, sortBy }) {
    let sql = 'SELECT *, name as title FROM products'; // Alias 'name' to 'title' for frontend
    const params = [];
    const conditions = [];

    // Filter by Category
    if (categories && categories.length > 0) {
      const placeholders = categories.map(() => '?').join(',');
      conditions.push(`category IN (${placeholders})`);
      params.push(...categories);
    }

    // Filter by Brand
    if (brands && brands.length > 0) {
      const placeholders = brands.map(() => '?').join(',');
      conditions.push(`brand IN (${placeholders})`);
      params.push(...brands);
    }

    // Append WHERE clause
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Append ORDER BY clause
    switch (sortBy) {
      case 'price-lowtohigh':
        sql += ' ORDER BY price ASC';
        break;
      case 'price-hightolow':
        sql += ' ORDER BY price DESC';
        break;
      case 'title-atoz':
        sql += ' ORDER BY name ASC';
        break;
      case 'title-ztoa':
        sql += ' ORDER BY name DESC';
        break;
      default:
        sql += ' ORDER BY price ASC';
        break;
    }

    return db.execute(sql, params);
  }

  // 7. Reduce Stock (For Order Processing)
  static reduceStock(productId, quantity) {
    return db.execute(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
      [quantity, productId]
    );
  }

  // 8. Search Products (LIKE query)
  static search(keyword) {
    const searchTerm = `%${keyword}%`; // Wrap keyword for partial matching
    const sql = `
            SELECT *, name as title FROM products 
            WHERE name LIKE ? 
            OR description LIKE ? 
            OR category LIKE ? 
            OR brand LIKE ?
        `;
    // We pass searchTerm 4 times, once for each ? placeholder
    return db.execute(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
  }
}

module.exports = Product;
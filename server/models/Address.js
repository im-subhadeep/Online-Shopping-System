const db = require('../db');

class Address {
  // 1. Add New Address
  static addNew({ userId, address, city, pincode, phone, notes }) {
    const sql = `
            INSERT INTO addresses (user_id, address, city, pincode, phone, notes) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    return db.execute(sql, [userId, address, city, pincode, phone, notes]);
  }

  // 2. Find All by User ID
  static findAllByUserId(userId) {
    return db.execute('SELECT * FROM addresses WHERE user_id = ?', [userId]);
  }

  // 3. Edit Address
  static editAddress(userId, addressId, { address, city, pincode, phone, notes }) {
    const sql = `
            UPDATE addresses 
            SET address = ?, city = ?, pincode = ?, phone = ?, notes = ? 
            WHERE address_id = ? AND user_id = ?
        `;
    return db.execute(sql, [address, city, pincode, phone, notes, addressId, userId]);
  }

  // 4. Delete Address
  static deleteAddress(userId, addressId) {
    return db.execute(
      'DELETE FROM addresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
  }
}

module.exports = Address;
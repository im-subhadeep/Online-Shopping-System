const db = require('../db');

class User {
  // Find user by email (Used in Login/Register)
  static findByEmail(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }

  // Create new user (Used in Register)
  static createUser({ username, email, password }) {
    const sql = `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'customer')`;
    return db.execute(sql, [username, email, password]);
  }

  // Find by ID (Useful helper if needed later)
  static findById(id) {
    return db.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  }
}

module.exports = User;
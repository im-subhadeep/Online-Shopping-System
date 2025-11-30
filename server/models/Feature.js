const db = require('../db');

class Feature {
  // 1. Add Feature Image
  static addImage(imageUrl) {
    return db.execute(
      'INSERT INTO feature_images (image) VALUES (?)',
      [imageUrl]
    );
  }

  // 2. Get All Feature Images
  static findAllImages() {
    return db.execute('SELECT * FROM feature_images');
  }
}

module.exports = Feature;
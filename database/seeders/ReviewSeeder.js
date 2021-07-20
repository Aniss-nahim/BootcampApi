/**
 * Review Seeder class
 */
const Seeder = require("./Seeder");
const Review = require("../../models/Review");

class ReviewSeeder extends Seeder {
  static resource = `${__dirname}/../../_data/reviews.json`;
  constructor() {
    super();
    this.model = Review;
  }

  static import() {
    const reviews = this.read(this.resource);
    new ReviewSeeder().create(reviews);
  }

  static clear() {
    new ReviewSeeder().delete();
  }
}

module.exports = ReviewSeeder;

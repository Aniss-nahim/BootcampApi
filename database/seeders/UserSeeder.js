/**
 * User Seeder class
 */
const Seeder = require("./Seeder");
const User = require("../../models/User");

class UserSeeder extends Seeder {
  static resource = `${__dirname}/../../_data/users.json`;
  constructor() {
    super();
    this.model = User;
  }

  static import() {
    const users = this.read(this.resource);
    new UserSeeder().create(users);
  }

  static clear() {
    new UserSeeder().delete();
  }
}

module.exports = UserSeeder;

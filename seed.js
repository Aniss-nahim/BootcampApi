/**
 * Database Seeder Engine
 * node seed -[i,d] seederKey
 */
const dotenv = require("dotenv");
const color = require("colors");
const mongoose = require("mongoose");

// Load env
dotenv.config({ path: "./config/config.env" });

// Load Seeders here
const BootcampSeeder = require("./database/seeders/BootcampSeeder");
const CourseSeeder = require("./database/seeders/CourseSeeder");
const UserSeeder = require("./database/seeders/UserSeeder");
const ReviewSeeder = require("./database/seeders/ReviewSeeder");

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// bind seeder with argument
const Seeders = new Map([
  ["bootcamp", BootcampSeeder],
  ["course", CourseSeeder],
  ["user", UserSeeder],
  ["review", ReviewSeeder],
]);

const model = Seeders.get(process.argv[3]);

if (model) {
  if (process.argv[2] === "-i") {
    model.import();
  } else if (process.argv[2] === "-d") {
    model.clear();
  } else {
    console.log(`${process.argv[2]} is not a valide option`.red);
    process.exit();
  }
} else {
  console.log(`${process.argv[3]} dose not match any registred seeder`.red);
  process.exit();
}

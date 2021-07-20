const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const connectDB = require("./database/database");
const errorHandler = require("./error/errorHandler");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
var xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
var hpp = require("hpp");

// Configure dotenv
dotenv.config({ path: "./config/config.env" });

// Database connection
connectDB();

// load Router
const authRouter = require("./routes/auth");
const bootcampsRoutes = require("./routes/bootcamps");
const coursesRoutes = require("./routes/courses");
const usersRoutes = require("./routes/user");
const reviewRoutes = require("./routes/reviews");
const { static } = require("./database/schemas/CourseSchema");

const app = express();

// Body parser
app.use(express.json());

// cookie parser using signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
// data sanitizer for NoSQL injections
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS
app.use(xss());
// Http request rating limit
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use("/api/", apiLimiter);
// Prevent Http paramater pollution attacks
app.use(hpp());

// Dev logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// static folder
app.use(express.static(path.join(__dirname, "public")));

// File uploading
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/public/tmp/",
    // debug : true
  })
);

// Mount routes on the app
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bootcamps", bootcampsRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// URL not found
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Not Found" });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Global handler for unhandled rejections error
process.on("unhandledRejection", (error, promise) => {
  // display error
  console.log(`Error : ${error.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
});

const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./database/database');
const errorHandler = require('./error/errorHandler');

// Configure dotenv
dotenv.config({path : './config/config.env'});

// Database connection
connectDB();

// load Router
const bootcampsRoutes = require('./routes/bootcamps');
const coursesRoutes = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// Dev logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routes on the app
app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);

// URL not found
app.use((req,res,next) => {
    res.status(404).json({success : false, error : 'Not Found'});
})

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Global handler for unhandled rejections error
process.on('unhandledRejection', (error, promise) =>{
    // display error
    console.log(`Error : ${error}`.red);
    // close server and exit process
    server.close(() => process.exit(1));
})
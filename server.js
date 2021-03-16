const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./database/database');
const errorHandler = require('./error/errorHandler');

// load Router
const bootcampsRoutes = require('./routes/bootcamps');

// Configure dotenv
dotenv.config({path : './config/config.env'});

// Database connection
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routes on the app
app.use('/api/v1/bootcamps', bootcampsRoutes);

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
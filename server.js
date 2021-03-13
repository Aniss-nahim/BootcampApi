const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/database');

// load Router
const bootcomps = require('./routes/bootcamps');

// Configure dotenv
dotenv.config({path : './config/config.env'});

// Database connection
connectDB();

const app = express();

// Dev logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcomps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handling unhandled rejections error
process.on('unhandledRejection', (error, promise) =>{
    // display error
    console.log(`Error : ${error}`);
    // close server and exit process
    server.close(() => process.exit(1));
})
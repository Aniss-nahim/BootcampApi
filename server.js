const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// load Router
const bootcomps = require('./routes/bootcamps');

// Configure dotenv
dotenv.config({path : './config/config.env'});

const app = express();

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcomps);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
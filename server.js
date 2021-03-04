const express = require('express');
const dotenv = require('dotenv');

// load Router
const bootcomps = require('./routes/bootcomps');

// Configure dotenv
dotenv.config({path : './config/config.env'});

const app = express();

// Mount routes
app.use('/api/v1/bootcomps', bootcomps);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
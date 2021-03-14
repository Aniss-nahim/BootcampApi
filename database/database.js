const mongoose = require('mongoose');

const connectDB = async () => {
    const con = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology: true
    });

    console.log(`Connected to MongoDb, host : ${con.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;
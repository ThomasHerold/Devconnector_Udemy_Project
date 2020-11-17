// Config allows for global variable usage. Required in the URI for DB connection
const mongoose = require('mongoose');
const config = require ('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
       await mongoose.connect(db, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useCreateIndex: true
       });
       console.log('MongoDB Connected')
    } catch (err) {
        console.error(err.message);
        // If connection fails, we want to exit the process with failure
        process.exit(1);
    }
}

module.exports = connectDB;
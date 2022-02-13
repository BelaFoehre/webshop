const mongoose = require("mongoose");
// const env = require('dotenv').config();
const MONGO_URI = `${process.env.DB_URL}`//:${process.env.DB_PORT}`;

exports.connect = () => {
  console.log('Connecting to the database')
  mongoose
    .connect(MONGO_URI, {
      // user: 'root',
      // pass: 'pwd',
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    })
};
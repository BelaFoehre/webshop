const mongoose = require("mongoose");
// const env = require('dotenv').config();
const MONGO_URI = `${process.env.DB_URL}`//:${process.env.DB_PORT}`;
exports.connect = () => {
  console.log(`Info :: Connecting to the database ${MONGO_URI} ..`)
  mongoose
    .connect(MONGO_URI, {
      // user: 'root',
      // pass: 'pwd',
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Info :: Successfully connected to database");
    })
    .catch((error) => {
      console.log("Error :: Database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    })
};
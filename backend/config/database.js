const mongoose = require("mongoose");
const MONGO_URI = `${process.env.DB_URL}`;

/* This is a function that connects to the database. */
exports.connect = () => {
  console.log(`Info :: Connecting to the database ${MONGO_URI} ..`)
  mongoose
    .connect(MONGO_URI, {
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
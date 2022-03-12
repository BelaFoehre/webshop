const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  surname: { type: String, default: null },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  token: { type: String },
  resetLink: { type: String, default: null}
});

module.exports = mongoose.model("User", userSchema);

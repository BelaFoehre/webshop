const mongoose = require("mongoose");
const Cart = require("./Cart");

let addressSchema = new mongoose.Schema({
  city: { type: String },
  zipcode: { type: Number },
  street: { type: String },
  number: { type: String },
  additional: { type: String }
})

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  surname: { type: String, default: null },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  token: { type: String },
  resetLink: { type: String, default: null },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: Cart, required: true },
  roles: { type: [String] },
  shippingaddress: { type: addressSchema },
  billingaddress: { type: addressSchema }
});

module.exports = mongoose.model("User", userSchema);
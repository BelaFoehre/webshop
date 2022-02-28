const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, default: null },
  brand: { type: String, default: null },

  kategories: { type: [String], default: null},
  sizes: [{
      name: { type: String },
      price: { type: Number },
      qty: { type: Number }
  }],
  tags: { type: [String], default: null },
});

module.exports = mongoose.model('inventory', inventorySchema);
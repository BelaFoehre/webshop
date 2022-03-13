const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bezeichnung: { type: String, default: null },
  brand: { type: String, default: null },

  category: {
    main: { type: String, default: null},
    sub1: { type: String, default: null},
    sub2: { type: String, default: null},
  },
  price: { type: Number },
  availableQty: { type: Number, min: 0 },
  // sizes: [{
  //     name: { type: String },
  //     price: { type: Number },
  //     qty: { type: Number }
  // }],
  tags: { type: [String], default: null },
});

module.exports = mongoose.model('Inventory', inventorySchema);
const mongoose = require("mongoose");

let itemSchema = new mongoose.Schema({
    name: { type: String },
    id: { type: String },
    quantity: { type: Number },
    priceItem: { type: Number },
    priceTotal: { type: Number }
})

const cartSchema = new mongoose.Schema({
    items: [itemSchema],
    subTotal: {
        default: 0,
        type: Number
    }
})

module.exports = mongoose.model('Cart', cartSchema)
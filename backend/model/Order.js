const mongoose = require("mongoose");

let itemSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: String },
  quantity: { type: Number },
  priceItem: { type: Number },
  priceTotal: { type: Number }
})

const Status = {
    geliefert: "Geliefert", 
    versandt: "Versandt",
    abgeschlossen: "Bestellung abgeschlossen",
    bearbeitung: "Bestellung in Bearbeitung",
    erhalten: "Bestellung erhalten"
  };

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    status: { type: String, default: Status.erhalten },
    cartItems: [itemSchema],
    subTotal: { type: Number }
})

module.exports = mongoose.model("Order", orderSchema)
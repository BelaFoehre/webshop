const mongoose = require("mongoose");

const Status = {
    geliefert: "Geliefert", 
    versandt: "Versandt",
    abgeschlossen: "Bestellung abgeschlossen",
    bearbeitung: "Bestellung in Bearbeitung",
    erhalten: "Bestellung erhalten"
  };

//  referencing the id's and not including the schema itself again to avoid redundancy
const orderSchema = new mongoose.Schema({
    cartId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, default: Status.erhalten }
})

module.exports = mongoose.model("Order", orderSchema)
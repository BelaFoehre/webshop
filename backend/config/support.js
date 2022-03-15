const Inventory = require("../model/Inventory")
const Cart = require("../model/Cart")
const jwt = require("jsonwebtoken");

exports.getProductById = (searchId) => {
    // const prod = await Inventory.findOne({_id: searchId})

    return new Promise((resolve, reject) => {
        Inventory.findById(searchId, (error, result) => {
            if(error | !result) reject(error)
            else resolve(result)
        })
    })
}

/**
 * extra, da von nutzer beim bearbten im cart 
 * und admin bei bearbeitung des sortiments
 * @param {*} product 
 * @param {*} qtyChange 
 * @returns data or error
 */
exports.updateInventory = (product, qtyChange) => {
    product.availableQty += qtyChange

    return new Promise((resolve, reject) => {
        product.save((err, data) => {
            if(err) reject(err)
            else resolve(data)
        })
    })
}

exports.findCartById = (searchId) => {

    return new Promise((resolve, reject) => {
        Cart.findById(searchId, (error, result) => {
            if(error | !result) reject(error)
            else resolve(result)
        })
    })
}

exports.getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_KEY, (error, decodedData) => {
        if(error | !decodedData) reject(error)
        else resolve(decodedData)
      })
    })
  }
const Inventory = require("../model/Inventory")
const Cart = require("../model/Cart")
const jwt = require("jsonwebtoken");
const User = require("../model/User");

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

/* for development purposes */
exports.addSampleProductToCart = (cartId) => {

    return new Promise((resolve, reject) => {
        Inventory.create({
            bezeichnung: "Item1337",
            brand: "brand1",
            category: {
                main: "main1",
                sub1: "sub1_1"
            },
            price: 42,
            availableQty: 13,
            tags: ["tag1"]
        }).then((product) => {
            console.log(1)
            this.findCartById(cartId).then((cart) => {
                cart.items.push({
                    bezeichnung: product.bezeichnung,
                    id: product._id,
                    quantity: 1,
                    priceItem: product.price,
                    priceTotal: product.price
                })
                cart.save((error, data) => {
                    if(error) reject(error)
                    else resolve(data)
                })
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })

    })
}

exports.getCartByUserToken = (userToken) => {

    return new Promise((resolve, reject) => {
        this.getUserByToken(userToken).then((data) => {
            User.findById(data.user_id).then((data) => {
                this.findCartById(data.cart).then((data) => {
                    resolve(data)
                })
            })
        }).catch((err) => {
            reject(err)
        })
    })
}
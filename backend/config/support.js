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

exports.updateCart = (cart, itemId, itemQty) => {

    return new Promise(async (resolve, reject) => {
        const product = await this.getProductById(itemId).catch((err) => {
            reject(err)
        })

        let itemIndex = await cart.items.findIndex(item => item.id == itemId)

        if(itemIndex !== -1){
            cart.items[itemIndex].quantity += itemQty
            cart.items[itemIndex].priceTotal = cart.items[itemIndex].quantity * product.price
            cart.subTotal = cart.items.map(item => item.priceTotal).reduce((prev, curr) => prev + curr)
        } else {
            cart.items.push({
                bezeichnung: product.bezeichnung,
                id: itemId,
                quantity: itemQty,
                priceItem: product.price,
                priceTotal: itemQty * product.price
            })
        }

        let cartPromise = new Promise((resolve, reject) => {
            cart.save((error, data) => {
                if(error) reject(error)
                else resolve(data)
            })
        })

        let inventoryPromise = new Promise((resolve, reject) => {
            this.updateInventory(product, -itemQty).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })

        Promise.all([cartPromise, inventoryPromise]).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })

    })
}

exports.validateInventory = (bezeichnung, brand, category_main, category_sub1, price, availableQty, tags) => {
    return new Promise((resolve, reject) => {
        try {
            availableQty = parseInt(availableQty)
            price = parseInt(price)
        } catch (err) {
            reject(err)
        }

        if(availableQty < 0) reject(`availableQty must be greater or equal 0 (${availableQty})`)
        if(!(price > 0)) reject(`price must be greater than 0 (${price})`)
        resolve()
    })
}

exports.addNewInventory = (bezeichnung, brand, category_main, category_sub1, price, availableQty, tags) => {
    return new Promise((resolve, reject) => {

        this.validateInventory(bezeichnung, brand, category_main, category_sub1, price, availableQty, tags).then(() => {
            Inventory.create({
                bezeichnung: bezeichnung,
                brand: brand,
                category: {
                    main: category_main,
                    sub1: category_sub1
                },
                price: price,
                availableQty: availableQty,
                tags: tags
            }, (error, doc) => {
                if(error | !doc) reject(error)
                else resolve(doc)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}
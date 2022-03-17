const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { sendMail } = require('../config/nodemailer');
const Cart = require('../model/Cart');
const Inventory = require('../model/Inventory');
const { getProductById, updateInventory, findCartById, getUserByToken, getCartByUserToken } = require('../config/support.js');
const User = require('../model/User');

router.get('/inventory', async (req, res) => {
    const inv = await Inventory.find()
    return res.status(200).json(inv)
})

router.get('/inventory/:id', async (req, res) => {
    getProductById(req.params.id).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(404).send(err)
    })
})

// TODO check ob es net doch post ist, weil ja auch option ist, das was neues erstellt wird - wobei natürlich das cart immer nur geändert wird
// evtl cart._id an User binden??
router.put('/cart', bodyParser, async (req, res) => {
    getCartByUserToken(req.query.token).then(async (cart) => {
        const { itemId, itemQty } = req.body

        const product = await getProductById(itemId).catch((err) => {
            return res.sendStatus(404)
        })

        // const cart = await createCart()
        // const cart = await Cart.findById(req.params.id).catch((err) => {
        //     return res.sendStatus(404)
        // })

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
            updateInventory(product, -itemQty).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })

        Promise.all([cartPromise, inventoryPromise]).then((data) => {
            return res.status(200).json(data)
        }).catch((err) => {
            return res.sendStatus(500)
        })

    }).catch((err) => {
        return res.status(404).json(err)
    })
})

router.get('/cart/:id', (req, res) => {
    findCartById(req.params.id).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(404).json(err)
    })
})

// TODO redo this callback hell
router.get('/cart', async (req, res) => {
    if(req.query.token){
        getCartByUserToken(req.query.token).then((data) => {
            return res.status(200).json(data)
        }).catch((err) => {
            return res.status(404).json(err)
        })
    } else {
        Cart.find((error, result) => {
            if(error) return res.sendStatus(404)
            return res.status(200).json(result)
        })
    }
})

module.exports = router;
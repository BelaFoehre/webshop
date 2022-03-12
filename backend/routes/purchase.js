const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { sendMail } = require('../config/nodemailer');
const Cart = require('../model/Cart');
const Inventory = require('../model/Inventory');
const { getProductById, updateInventory } = require('../config/support.js')

router.get('/inventory', async (req, res) => {
    const inv = await Inventory.find()
    return res.status(200).json(inv)
})

router.get('/inventory/:id', async (req, res) => {
    const inv = await getProductById(req.params.id)
    return res.status(200).json(inv)
})

// TODO check ob es net doch post ist, weil ja auch option ist, das was neues erstellt wird - wobei natürlich das cart immer nur geändert wird
// evtl cart._id an User binden??
router.put('/cart/:id', bodyParser, async (req, res) => {
    const { itemId, itemQty } = req.body

    const product = await getProductById(itemId)
    if(!product) return res.status(404).send()
    
    // const cart = await createCart()
    const cart = await Cart.findById(req.params.id)

    let itemIndex = await cart.items.findIndex(item => item.id == itemId)

    if(itemIndex !== -1){
        cart.items[itemIndex].quantity += itemQty
        cart.items[itemIndex].priceTotal = cart.items[itemIndex].quantity * product.price
        cart.subTotal = cart.items.map(item => item.priceTotal).reduce((prev, curr) => prev + curr)
    } else {
        cart.items.push({
            id: itemId,
            quantity: itemQty,
            priceItem: product.price,
            priceTotal: itemQty * product.price
        })
    }

    let data = await cart.save()
    updateInventory(product, -itemQty)
    return res.status(202).json(data)
})

router.get('/cart/:id', async (req, res) => {
    const cart = await Cart.find({_id: req.params.id})
    return res.status(200).json(cart)
})

router.get('/cart', async (req, res) => {
    const cart = await Cart.find()
    return res.status(200).json({res: cart})
})

module.exports = router;
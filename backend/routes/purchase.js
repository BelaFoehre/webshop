const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { sendMail } = require('../config/nodemailer');
const Cart = require('../model/Cart');
const Inventory = require('../model/Inventory');
const { getProductById, updateInventory, findCartById, getUserByToken, getCartByUserToken, updateCart } = require('../config/support.js');
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
router.put('/cart/:id', bodyParser, async (req, res) => {
    findCartById(req.params.id).then((cart) => {
        const { itemId, itemQty } = req.body
        updateCart(cart, itemId, itemQty).then((data) => {
            return res.status(200).json(data)
        }).catch((err) => {
            return res.status(400).json(err)
        })

    }).catch((err) => {
        return res.status(404).json(err)
    })
})
router.put('/cart', bodyParser, async (req, res) => {
    getCartByUserToken(req.query.token).then(async (cart) => {

        const { itemId, itemQty } = req.body
        updateCart(cart, itemId, itemQty).catch((err) => {
            return res.status(400).json(err)
        }).then((data) => {
            return res.status(200).json(data)
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
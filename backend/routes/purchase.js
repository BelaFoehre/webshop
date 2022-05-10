const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Cart = require('../model/Cart');
const Order = require('../model/Order')
const { findCartById, getCartByUserToken, updateCart, findOrderById } = require('../config/support.js');

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

router.post('/order', bodyParser, async (req, res) => {
    const { cartId, userId } = req.body

    if(!(cartId && userId)){
        return res.status(400).send('Missing parameters')
    }

    let orderDoc

    let orderPromise = new Promise((resolve, reject) => {
        Order.create({
            cartId, userId
        }, (error, doc) => {
            if(error | !doc) reject(error)
            else {
                orderDoc = doc
                resolve(doc)
            }
        })
    })

    await orderPromise

    let cartPromise = new Promise((resolve, reject) => {
        //delete cart TODO
    })

    //wait orderPromise, dann cartPromise

    return res.status(200).json(orderDoc)
})

router.put('/order/:id', bodyParser, async (req, res) => {

    const { cartId, billingaddressId, shippingaddressId, userId, status } = req.body

    findOrderById(req.params.id).then((order) => {
        //ggf try catch hier einabuen, net sicher
        // ob das untere catch zb status fehler catchen würde
        order.cartId = cartId
        order.billingaddressId = billingaddressId
        order.shippingaddressId = shippingaddressId
        order.userId = userId
        order.status = status

        order.save((err, data) => {
            if(err) return res.status(500).json(err)
            else return res.status(200).json(data)
        })
        
    }).catch((err) => {
        console.log(err)
        return res.status(404).send('Order not found')
    })

})

/* A get request to the route /order/:id. It is using the findOrderById function to find the order with
the id in the request. If there is an order, it returns a 200 status code with the order. If there
is no order, it returns a 404 status code with the error. */
router.get('/order/:id', (req, res) => {
    findOrderById(req.params.id).then((order) => {
        return res.status(200).json(order)
    }).catch((err) => {
        return res.status(404).json(err)
    })
})

/* A get request to the route /order. It is using the mongoose find method to find all orders. If there
is an error or no result, it returns a 400 status code with the error. If there is a result, it
returns a 200 status code with the result. */
router.get('/order', (req, res) => {
    Order.find((error, result) => {
        if(error | !result) return res.status(400).json(error)
        else return res.status(200).json(result)
    }).catch((ignored) => {
        // TODO verifiy that dis is okay
    })
})

module.exports = router;
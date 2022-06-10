const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Cart = require('../model/Cart');
const Order = require('../model/Order')
const { findCartById, getCartByUserToken, updateCart, findOrderById, resetCart, getUserByToken } = require('../config/support.js');
const { sendMail } = require('../config/nodemailer');
const User = require('../model/User');

/* This is a put request to the route /cart/:id. It is using the findCartById function to find the cart
with the id in the request. If there is a cart, it is using the updateCart function to update the
cart with the itemId and itemQty in the request body. If there is an error, it returns a 400 status
code with the error. If there is no error, it returns a 200 status code with the data. If there is
no cart, it returns a 404 status code with the error. */
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

/* A put request to the route /cart. It is using the getCartByUserToken function to find the cart
with the token in the request. If there is a cart, it is using the updateCart function to update the
cart with the itemId and itemQty in the request body. If there is an error, it returns a 400 status
code with the error. If there is no error, it returns a 200 status code with the data. If there is
no cart, it returns a 404 status code with the error. */
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

/* Deleting the cart. */
router.delete('/cart', bodyParser, async (req, res) => {
    getCartByUserToken(req.query.token).then(async (cart) => {
        resetCart(cart).then((data) => {
            return res.status(200).json(data)
        }).catch((err) => {
            return res.status(400).json(err)
        })

    }).catch((err) => {
        return res.status(404).json(err)
    })
})

/* This is a get request to the route /cart/:id. It is using the findCartById function to find the cart
with the id in the request. If there is a cart, it returns a 200 status code with the cart. If there
is no cart, it returns a 404 status code with the error. */
router.get('/cart/:id', (req, res) => {
    findCartById(req.params.id).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(404).json(err)
    })
})

/* This is a get request to the route /cart. It is using the getCartByUserToken function to find the cart
with the token in the request. If there is a cart, it returns a 200 status code with the cart.
If there is no cart, it returns a 404 status code with the error. */
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

/* This is a post request to the route /order-invoice. It is using the bodyParser middleware to parse
the request body. It is using the User model to find the user with the userId in the request body.
If there is a user, it is using the sendMail function to send an email to the user with the
htmlInvoice in the request body. If there is an error, it returns a 400 status code with the error.
If there is no error, it returns a 200 status code with the data. If there is no user, it returns a
404 status code with the error. */
router.post('/order-invoice', bodyParser, async (req, res) => {
    const { userId, htmlInvoice } = req.body
    const user = await User.findById(userId)
    if(!user) return res.status(404).json({error: 'User not found'})
    sendMail(user.email, 'Order Confirmation', 'Your order has been placed successfully', htmlInvoice).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(400).json(err)
    })
})

/* Creating an order with the cartId and userId in the request body. */
router.post('/order', bodyParser, async (req, res) => {
    const { cartId, userId } = req.body

    if(!(cartId && userId)){
        return res.status(400).send('Missing parameters')
    }

    let orderDoc

    let orderPromise = new Promise((resolve, reject) => {
        findCartById(cartId).then((cart) => {

            Order.create({
                userId,
                cartItems: cart.items,
                subTotal: cart.subTotal
            }, (error, doc) => {
                if(error | !doc) reject(error)
                else {
                    orderDoc = doc
                    resolve(doc)
                }
            })
        })
    })

    await orderPromise
    return res.status(200).json(orderDoc)
})

/* Updating the status of an order. */
router.put('/order-status/:id', bodyParser, async (req, res) => {
    const { status } = req.body
    findOrderById(req.params.id).then((order) => {
        order.status = status
        order.save((error, doc) => {
            if(error) return res.status(400).json(error)
            return res.status(200).json(doc)
        })
    }).catch((err) => {
        return res.status(404).json(err)
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

/* Getting the user by the token in the request query. If there is a user, it is finding
the orders with the userId of the user. If there is an error, it returns a 404 status code with the
error. If there is no error, it returns a 200 status code with the data. If there is no user, it
returns a 404 status code with the error. */
router.get('/order', (req, res) => {
    getUserByToken(req.query.token).then((user) => {
        Order.find({ userId: user._id }, (err, data) => {
            if(err) return res.status(404).json(err)
            return res.status(200).json(data)
        })
    }
    ).catch((err) => {
        return res.status(404).json(err)
    })
})

/* Getting all the orders. */
router.get('/order-all', (req, res) => {
    Order.find((error, result) => {
        if(error | !result) return res.status(400).json(error)
        else return res.status(200).json(result)
    })
})

/* Deleting all the orders. */
router.delete('/orders', (req, res) => {
    Order.deleteMany({}, (err, data) => {
        if(err) return res.status(404).json(err)
        else return res.status(200).json(data)
    })
})

module.exports = router;
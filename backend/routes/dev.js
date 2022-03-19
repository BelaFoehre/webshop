const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const Inventory = require("../model/Inventory");
const Cart = require("../model/Cart.js")

const User = require('../model/User');
const { sendMail } = require('../config/nodemailer');

router.get('/user', async (req, res) => {
    const user = await User.find()
    return res.status(200).json(user)
})

router.get('/sampleData', async (req, res) => {
    const inv = await Inventory.find()
    return res.status(200).json(inv)
})

router.delete('/all', async (req, res) => {
    let invPromise = new Promise((resolve, reject) => {
        Inventory.deleteMany((error, data) => {
            if(error) reject(error)
            else resolve(data)
        })
    })

    let cartPromise = new Promise((resolve, reject) => {
        Cart.deleteMany((error, data) => {
            if(error) reject(error)
            else resolve(data)
        })
    })

    let userPromise = new Promise((resolve, reject) => {
        User.deleteMany((error, data) => {
            if(error) reject(error)
            else resolve(data)
        })
    })

    Promise.all([invPromise, cartPromise, userPromise]).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(500).json(err)
    })
})

router.delete('/sampleData', async (req, res) => {
    await Inventory.deleteMany().then(result => {
        return res.status(201).json({ message: `deleted ${result.deletedCount}` });
    }).catch(err => {
        return res.status(403).send(err)
    })
})

router.get('/user', bodyParser, (req, res) => {
    const {email} = req.body
    User.findOne({email}, (err, user) => {
        if(err){
            return res.status(404).json({err:err})
        } else {
            return res.status(200).json({user:user})
        }
    })
})

router.get('/email', async (req, res) => {
    let response = await sendMail('florian.kehl13@gmail.com', 'subject', 'text', '<h1> html </h1>')

    if(response){
        return res.status(200).send()
    } else {
        return res.status(503).send()
    }
})

module.exports = router;
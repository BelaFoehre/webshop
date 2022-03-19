const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const Inventory = require("../model/Inventory");
const Cart = require("../model/Cart.js")

const User = require('../model/User');
const { sendMail } = require('../config/nodemailer');

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

router.post('/popSample', bodyParser, async (req, res) => {
    const invItem = await Inventory.create({
        bezeichnung: "Item1337",
        brand: "brand1",
        category: {
            main: "main1",
            sub1: "sub1_1"
        },
        price: 42,
        availableQty: 13,
        tags: ["tag1"]
    }).then((res) => {
        console.log(res)
        return res.status(202)
    }).catch(err => {
        return res.status(403).send(err)
    })

})

router.post('/popSampleManuel', bodyParser, async (req, res) => {
    const invItem = await Inventory.create({
        bezeichnung: req.body.bezeichnung,
        brand: req.body.brand,
        category: {
            main: req.body.category.main,
            sub1: req.body.category.sub1,
            sub2: req.body.category.sub2
        },
        price: req.body.price,
        availableQty: req.body.availableQty,
        tags: req.body.tags
    }).then((res) => {
        console.log(res)
        return res.status(202)
    }).catch(err => {
        return res.status(403).send(err)
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
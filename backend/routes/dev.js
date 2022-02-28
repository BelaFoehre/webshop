const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const Inventory = require("../model/inventory");

router.get('/sampleData', async (req, res) => {
    const inv = await Inventory.find()
    return res.status(200).json(inv)
})

router.delete('/sampleData', async (req, res) => {
    await Inventory.deleteMany().then(result => {
        return res.status(201).json({ message: `deleted ${result.deletedCount}` });
    }).catch(err => {
        return res.status(403).send(err)
    })
})

router.post('/popSample', bodyParser, async (req, res) => {
    const invItem = await Inventory.create({
        name: "Item1",
        brand: "brand1",
        kategories: ["test1", "test2"],
        sizes: [{
            name: 'Large',
            price: 42,
            qty: 13
        },{
            name: 'Small',
            price: 12,
            qty: 420
        }],
        tags: ["tag1"]
    },{
        name: "Item2",
        brand: "brand1",
        kategories: ["test1", "test2"],
        sizes: [{
            name: 'Large',
            price: 42,
            qty: 13
        },{
            name: 'Small',
            price: 12,
            qty: 420
        }],
        tags: ["tag1"]
    },{
        name: "Item",
        brand: "brand2",
        kategories: ["test1", "test2"],
        sizes: [{
            name: 'Large',
            price: 42,
            qty: 13
        },{
            name: 'Small',
            price: 12,
            qty: 420
        }],
        tags: ["tag1"]
    }).then((res) => {
        console.log(res)
        return res.status(202)
    }).catch(err => {
        return res.status(403).send(err)
    })

})

module.exports = router;
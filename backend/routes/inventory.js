const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Inventory = require('../model/Inventory');
const { getProductById } = require('../config/support.js');

router.get('', async (req, res) => {
    const inv = await Inventory.find()
    return res.status(200).json(inv)
})

router.get('/:id', async (req, res) => {
    getProductById(req.params.id).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(404).send(err)
    })
})

module.exports = router;
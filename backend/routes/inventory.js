const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Inventory = require('../model/Inventory');
const { getProductById, addNewInventory } = require('../config/support.js');

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

/**
 * API to create a new Inventory DB entry
 * @param bezeichnung @typedef String
 * @param brand @typedef String
 * @param category: {main @typedef String, sub1 @typedef String}
 * @param price @typedef Number and greater than 0
 * @param availableQty @typedef Number and greater or equal 0
 * @param tags @typedef String OPTIONAL
 * @returns 201 if successfull
 * @returns 400 if required parameters are missing
 * @returns 500 if unsuccessfull
 */
router.post('', bodyParser, (req, res) => {
    const { bezeichnung, brand, category: {main, sub1}, price, availableQty, tags } = req.body

    if(!(bezeichnung && brand && main && sub1 && price && availableQty)){
        return res.status(400).send('Missing parameters')
    }

    addNewInventory(bezeichnung, brand, main, sub1, price, availableQty, tags).then((data) => {
        return res.status(201).json(data)
    }).catch((err) => {
        return res.status(500).json(err)
    })
})

module.exports = router;
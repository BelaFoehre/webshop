const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Inventory = require('../model/Inventory');
const { getProductById, addNewInventory, validateInventory } = require('../config/support.js');

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
 * Deleting the document with the id passed in the url.
 * @returns 200 & document if successfull
 * @returns 404 & error, if error, for any error
 */
 router.delete('/:id', async (req, res) => {
    Inventory.findByIdAndDelete(req.params.id, (error, result) => {
        if(error | !result) return res.status(404).json(error)
        if(result) return res.status(200).json(result)
    })
})

/**
 * API to create a new Inventory DB entry
 * @param name @typedef String
 * @param brand @typedef String
 * @param category: {main @typedef String, sub1 @typedef String}
 * @param price @typedef Number and greater than 0
 * @param availableQty @typedef Number and greater or equal 0
 * @param tags @typedef String OPTIONAL
 * @param imgBase64 @typedef String OPTIONAL base64 encoded image
 * @returns 201 if successfull
 * @returns 400 if required parameters are missing
 * @returns 500 if unsuccessfull
 */
router.post('', bodyParser, (req, res) => {
    const { name, brand, category: {main, sub1}, price, availableQty, tags, imgBase64} = req.body

    if(!(name && brand && main && sub1 && price && (availableQty >= 0))){
        return res.status(400).send('Missing parameters')
    }

    addNewInventory(name, brand, main, sub1, price, availableQty, tags, imgBase64).then((data) => {
        return res.status(201).json(data)
    }).catch((err) => {
        return res.status(500).json(err)
    })
})

/**
 * API to update an Inventory DB entry
 * @param name @typedef String
 * @param brand @typedef String
 * @param category: {main @typedef String, sub1 @typedef String}
 * @param price @typedef Number and greater than 0
 * @param availableQty @typedef Number and greater or equal 0
 * @param tags @typedef String OPTIONAL
 * @param imgBase64 @typedef String OPTIONAL base64 encoded image
 * @returns 200 if successfull
 * @returns 400 if required parameters are missing or bad
 * @returns 404 if passed id is not found in db
 * @returns 500 if unsuccessfull
 */
router.put('/:id', bodyParser, async (req, res) => {

    const { name, brand, category: {main, sub1}, price, availableQty, tags, imgBase64 } = req.body
    if(!(name && brand && main && sub1 && price && (availableQty >= 0))){
        return res.status(400).send('Missing parameters')
    }

    validateInventory(name, brand, main, sub1, price, availableQty, tags).then(() => {
        getProductById(req.params.id).then(async (product) => {
            product.name = name
            product.brand = brand
            product.category['main'] = main
            product.category['sub1'] = sub1
            product.price = price
            product.availableQty = availableQty
            product.tags = tags
            product.imgBase64 =  imgBase64

            product.save((err, data) => {
                if(err) return res.status(500).json(err)
                else return res.status(200).json(data)
            })
        }).catch((err) => {
            return res.status(404).json(err)
        })
    }).catch((err) => {
        return res.status(400).json(err).send()
    })

})

module.exports = router;
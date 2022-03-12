const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const Inventory = require('../model/Inventory')


router.get('', async (req, res) => {
    const uniqueCategories = await Inventory.distinct('category.main')
    let nestedCategories = Promise.all(uniqueCategories.map(async (entry) => {
        return {
            main: entry,
            sub1: await Inventory.distinct('category.sub1', { 'category.main': entry }),
            sub2: await Inventory.distinct('category.sub2', { 'category.main': entry })
        }
    }))

    nestedCategories.then((result) => {
        return res.status(200).json({'data': result})
    })
})

module.exports = router;
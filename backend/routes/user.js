const express = require('express');
const router = express.Router();
const User = require('../model/User');

/* This is a route that is used to get all the users. */
router.get('', async (req, res) => {
    const inv = await User.find()
    return res.status(200).json(inv)
})

/* This is the route that is used to update the user. */
router.put('/:id/lock', async (req, res) => {
    const { lock, reason } = req.body

    User.findByIdAndUpdate(req.params.id, { locked: lock, reason: reason }, (error, result) => {
        if(error | !result) return res.status(404).json(error)
        if(result) return res.status(200).json(result)
    })

})

/* Deleting the user with the id that is passed in the url. */
router.delete('/:id', async (req, res) => {
    User.findByIdAndDelete(req.params.id, (error, result) => {
        if(error | !result) return res.status(404).json(error)
        if(result) return res.status(200).json(result)
    })
})


module.exports = router;
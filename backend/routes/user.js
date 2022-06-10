const express = require('express');
const router = express.Router();
const User = require('../model/User');

/* This is the route that is used to get all the users. */
router.get('', async (req, res) => {
    const users = await User.find()
    return res.status(200).json(users)
})

/* This is the route that is used to update the user. */
router.put('/:id/lock', async (req, res) => {
    const { lock, reason } = req.body
    User.findByIdAndUpdate(req.params.id, { locked: lock, locked_message: reason }, (error, result) => {
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

/* This is the route that is used to get a specific user. */
router.get('/:id', async (req, res) => {
    User.findById(req.params.id).then((data) => {
        return res.status(200).json(data)
    }).catch((err) => {
        return res.status(404).json(err)
    })
})

/* This is the route that is used to update the user. */
router.put('/:id', async (req, res) => {
    const { name, email, surname } = req.body
    User.findByIdAndUpdate(req.params.id, { name, email, surname }, (error, result) => {
        if(error | !result) return res.status(404).json(error)
        if(result) return res.status(200).json(result)
    })
})

module.exports = router;
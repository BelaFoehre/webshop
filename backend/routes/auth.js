const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const User = require('../model/User');
const { sendMail } = require('../config/nodemailer');
const Cart = require('../model/Cart');

/* This is the route for registering a new user. */
router.post("/register", bodyParser, async (req, res) => {
     try {
      const { name, surname, email, password, confirmPassword } = req.body;

      // Validate user input
      if (!(email && password && name && surname)) {
        return res.status(400).send("All input is required");
      }

      // Check if passwords match
      if (!(password == confirmPassword)){
        return res.status(400).send("Passwords do not match")
      }
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      encryptedUserPassword = await bcrypt.hash(password, 10);

      const cart = await Cart.create({})
      const user = await User.create({
        name: name,
        surname: surname,
        email: email.toLowerCase(),
        password: encryptedUserPassword,
        cart: cart,
        roles: ['Customer']
      })

      const token = jwt.sign(
        {
          _id: user._id,
          email, name, surname,
          roles: user.roles,
          locked: user.locked,
          locked_message: user.locked_message
        }, process.env.TOKEN_KEY, {
          expiresIn: "5h",
        }
      );
      user.token = token;

      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
})

/* This is the route for logging in a user. */
router.post("/login", bodyParser, async (req, res) => {

     try {
      const { email, password } = req.body;

      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            _id: user._id,
            email,
            name: user.name,
            surname: user.surname,
            locked: user.locked,
            locked_message: user.locked_message,
            roles: user.roles
          }, process.env.TOKEN_KEY, {
            expiresIn: "5h",
          }
        );

        user.token = token;

        return res.status(200).json(user);
      }
      return res.status(400).send("Invalid Credentials");

    } catch (err) {
        return res.status(500).send(err);
    }
})

/* This is the route for sending a password reset email to the user. */
router.put('/forgot-password', bodyParser, (req, res) => {
  const { email } = req.body;

  User.findOne({email}, (err, user) => {
    if(err || !user){
      return res.status(400).json({error: 'User with this email does not exists.'})
    }

    const token = jwt.sign({_id: user._id}, process.env.RESET_PW_KEY, {expiresIn: '20min'})

    return User.updateOne({"email": email}, {resetLink:token}, async (err, success) => {
      if(err){
        return res.status(400).json({error: "reset password link error"})
      } else {

        let subject = "Reset Password"
        let text = 'Klicken Sie auf den folgenden Link um Ihr Passwort zurückzusetzen: '
        let html = `
          <h2>Please click dis link brah</h2>
          <a href="http://${process.env.HOST}:4200/auth/reset-password?token=${token}">RESET PASSWORT</a>`

       let response = await sendMail(email, subject, text, html)

        if(response){
          return res.status(200).send()
        } else {
            return res.status(503).send()
        }
      }
    })
  })
})

/* This is the route for resetting a user's password. */
router.put('/reset-password', bodyParser, async (req, resp) => {
  console.log(req.body)
  const {resetLink, password} = req.body;

  encryptedUserPassword = await bcrypt.hash(password, 10);

  if(resetLink){
    jwt.verify(resetLink, process.env.RESET_PW_KEY, (err, decodedData) => {
      if(err) {
        return resp.status(401).json({
          error: "Incorrect or expired token"
        })
      }

      User.findOneAndUpdate({"resetLink": resetLink}, { $set: {password:encryptedUserPassword}, $unset: {resetLink}}, (err, doc, res) => {
        if(err){
          return resp.status(400).json({error: "User with this token doesn't exist"})
        } else {
          return resp.status(201).json({message: "Password changed successfully"})
        }
      })
    })
  } else {
    return resp.status(401).json({error: "Auth err"})
  }
})

module.exports = router;
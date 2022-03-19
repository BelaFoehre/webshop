const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
// const checkAuth = require('../middleware/check-auth');
const User = require('../model/User');
const { sendMail } = require('../config/nodemailer');
const Cart = require('../model/Cart');
const { addSampleProductToCart } = require('../config/support');

// Register
router.post("/register", bodyParser, async (req, res) => {
    // Our register logic starts here
     try {
      // Get user input
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

      //Encrypt user password
      encryptedUserPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      /* for production: */
      // const user = await User.create({
      //   name: name,
      //   surname: surname,
      //   email: email.toLowerCase(), // sanitize
      //   password: encryptedUserPassword,
      //   cart: await Cart.create({})
      // })

      /* for development */
      const cart = await Cart.create({})

      const user = await User.create({
        name: name,
        surname: surname,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
        cart: cart,
        roles: ['Consumer']
      })

      console.log(cart)
      addSampleProductToCart(cart._id).catch((err) => {
        console.log(err)
      }).then((stuff) => {
        console.log(stuff)
      })
      /* end */

      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email, name, surname,
          roles: user.roles
        }, process.env.TOKEN_KEY, {
          expiresIn: "5h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      return res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
})

// Login
router.post("/login", bodyParser, async (req, res) => {

     try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
            name: user.name,
            surname: user.surname
          }, process.env.TOKEN_KEY, {
            expiresIn: "5h",
          }
        );

        // save user token
        user.token = token;

        // user
        console.log(user)
        return res.status(200).json(user);
      }
      return res.status(400).send("Invalid Credentials");

    } catch (err) {
        console.log(err);
    }
})

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

        let subject = 'You Idiot forgot your fucking password god damn'
        let text = 'Idioto use da link to reset dat shit'
        let html = `
          <h2>Please click dis link brah</h2>
          <a href="http://${process.env.HOST}:4200/auth/reset-password?token=${token}">RESET PASSWORD</a>`

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

router.put('/reset-password', bodyParser, async (req, resp) => {
  console.log(req.body)
  const {resetLink, password} = req.body;

  //Encrypt user password
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

// # if user with that email exists, we have sent you a password reset email
module.exports = router;
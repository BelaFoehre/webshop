const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
// const checkAuth = require('../middleware/check-auth');

const User = require("../model/user");

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
      const user = await User.create({
        name: name,
        surname: surname,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
      });

      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email, name, surname
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

module.exports = router;
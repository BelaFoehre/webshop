const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
// const bodyParser = require('body-parser');

const cors = require("cors")
const app = express();
const User = require("./model/user");
const env = require('dotenv').config();
const auth = require("./middleware/check-auth");
require("./config/database").connect();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requestes-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});

const corsOptions = {
    origin: 'localhost.com',
    optionsSuccessStatus: 200 // for some legacy browsers
  }

app.use(express.json());
app.use(cors(corsOptions))

// Register
app.post("/api/auth/register", async (req, res) => {
    // Our register logic starts here
     try {
      // Get user input
      const { name, surname, email, password, confirmPassord } = req.body;
  
      // Validate user input
      if (!(email && password && name && surname)) {
        return res.status(400).send("All input is required");
      }

      // Check if passwords match
      if (!(password == confirmPassord)){
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
app.post("/api/auth/login", async (req, res) => {
    console.log("login")

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

app.post('/home', auth, (req, res) => {
    res.status(200).send("Hello world")
})

module.exports = app;
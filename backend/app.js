const express = require('express');
const cors = require("cors")
const app = express();
const env = require('dotenv').config();
const auth = require("./middleware/check-auth");
const authRoutes = require("./routes/auth");
const devRoutes = require("./routes/dev");


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


app.use("/api/auth/", authRoutes);
app.use("/api/dev/", devRoutes);

app.use(express.json());
app.use(cors(corsOptions))

app.post('/home', auth, (req, res) => {
    res.status(200).send("Hello world")
})

module.exports = app;
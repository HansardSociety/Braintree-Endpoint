const bodyParser = require("body-parser");
const express = require("express");

const app = express();

// app.use(require("helmet")());

app.get("/", (req, res) => res.send("<h1>HS-BT</h1>"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var checkout = require("./routes/checkout");
app.use("/checkout", checkout);

module.exports = app
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("<h1>HS-BT</h1>"));

app.listen(3000, () => console.log("Listening on 3000"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var checkout = require('./routes/checkout');
app.use('/checkout', checkout);

module.exports = app;

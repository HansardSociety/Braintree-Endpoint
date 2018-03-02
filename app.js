const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("<h1>HS-BT</h1>"));

app.listen(3000, () => console.log("Listening on 3000"));
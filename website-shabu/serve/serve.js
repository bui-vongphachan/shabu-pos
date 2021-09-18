const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/orders", function (req, res) {
  res.sendFile(path.join(__dirname, "orders.html"));
});

app.get("/menu", function (req, res) {
  res.sendFile(path.join(__dirname, "menu.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "404.html"));
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log({ __dirname });
  console.log(`Server running is port: ${port}`);
});

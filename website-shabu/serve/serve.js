const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "out")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "out", "index.html"));
});

app.get("/orders", function (req, res) {
  res.sendFile(path.join(__dirname, "out", "orders.html"));
});

app.get("/menu", function (req, res) {
  res.sendFile(path.join(__dirname, "out", "menu.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "out", "404.html"));
});

const port = process.env.PORT

app.listen(port, () => {
  console.log({ __dirname });
  console.log(`Server running is port: ${port}`);
});

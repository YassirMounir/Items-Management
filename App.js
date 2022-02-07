const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mongodb =
  "mongodb+srv://supercap:supercap123@items-project.rrlk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Item = require("./modules/items");

app.use(express.urlencoded({ extended: true }));
//Data Base Connection
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("CONNECTED");
    app.listen(8000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("get-items");
});

app.post("/items", (req, res) => {
  console.log(req.body);
  const item = Item(req.body);
  item
    .save()
    .then(() => {
      res.redirect("get-items");
    })
    .catch((err) => console.log(err));
});

app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => {
      res.render("index", { items: result });
    })
    .catch((err) => console.log(err));
});

app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.use((req, res) => {
  res.render("404");
});

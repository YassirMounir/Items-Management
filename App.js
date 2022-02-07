const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mongodb =
  "mongodb+srv://supercap:supercap123@items-project.rrlk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Item = require("./modules/items");
var ERROR1;
var ERROR2;
var Message = "";

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

app.get("/get-items", (req, res) => {
  Item.find()
    .sort({ price: -1 })
    .then((result) => {
      res.render("index", { items: result, Message });
      Message = "";
    })
    .catch((err) => console.log(err));
});

app.post("/items", (req, res) => {
  const item = Item(req.body);
  item
    .save()
    .then(() => {
      Message = "Item Added Successfully";
      res.redirect("get-items");
    })
    .catch((err) => {
      console.log(err);
      ERROR1 = "Item Insertion Error";
      ERROR2 = "Try Again Later";
      res.render("404", { ERROR1, ERROR2 });
    });
});

app.post("/update-item", (req, res) => {
  // console.log(req.body);
  // var id = req.body.id;
  // var name = req.body.name;
  // var price = req.body.price;
  Item.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    price: req.body.price,
  }).then((result) => {
    Message = "Item Updated Successfully";
    res.redirect("/get-items");
  });
});

app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findById(id).then((result) => {
    res.render("item-detail", { item: result });
  });
});

app.get("/delete-item/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id).then((result) => {
    Message = "Item Deleted Successfully";
    res.redirect("/get-items");
  });
});

app.use((req, res) => {
  ERROR1 = "ERROR 404";
  ERROR2 = "PAGE NOT FOUND !!!";
  res.render("404", { ERROR1, ERROR2 });
});

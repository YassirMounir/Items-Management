const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;
const mongodb =
  "mongodb+srv://supercap:zdrhdzth@items-project.rrlk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Item = require("./modules/items");
var ERROR1;
var ERROR2;
var Message = "";

app.use(express.urlencoded({ extended: true }));

//Data Base Connection
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DATA-BASE CONNECTED SUCCESFULLY");
    // app.listen(8000);
    app.listen(PORT, (err) => {
      if (err) console.log("Error In Server Setup");
      console.log(`SERVER LISTENING ON PORT : ${PORT}`);
    });
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
      console.log("=======================================================");
      console.log(result);
      console.log("=======================================================");
      res.render("index", { items: result, Message });
      Message = "";
    })
    .catch((err) => console.log(err));
});

app.post("/items", (req, res) => {
  const item = Item(req.body);
  console.log("=======================================================");
  console.log(item);
  console.log("=======================================================");
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
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  console.log("=======================================================");
  console.log(
    "{ Id : " + id + " , Name : " + name + " , Price : " + price + " }"
  );
  console.log("=======================================================");
  Item.findByIdAndUpdate(id, {
    name: name,
    price: price,
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
    console.log("=======================================================");
    console.log(result);
    console.log("=======================================================");
    res.render("item-detail", { item: result });
  });
});

app.get("/delete-item/:id", (req, res) => {
  console.log("=======================================================");
  console.log(req.params.id);
  console.log("=======================================================");
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

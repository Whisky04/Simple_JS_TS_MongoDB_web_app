const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const uri =
  "mongodb+srv://hw3it:7205@cluster0.fuhpc.mongodb.net/hw3itDB?retryWrites=true&w=majority&appName=Cluster0";
const UserModel = require("./models/Users");
const ProductModel = require("./models/Products");

mongoose.connect(uri);

app.listen(3001, () => {
  console.log("Server runs correctly");
});

//Users functionalities
app.get("/getUsers", (req, res) => {
  UserModel.find()
    .then(function (response) {
      res.json(response);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await UserModel.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Products functionalities
app.get("/getProducts", (req, res) => {
  ProductModel.find()
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

app.post("/createProduct", async (req, res) => {
  const product = req.body;
  const newProduct = new ProductModel(product);
  await newProduct.save();
  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put("/updateProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

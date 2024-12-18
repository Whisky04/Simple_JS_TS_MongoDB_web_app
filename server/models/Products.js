const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
    },
    price: { 
        type: Number, 
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Furniture", "Tool", "Material", "Undefined", "Extra"],
        default: "Undefined",
      },
});

const ProductModel = mongoose.model("products", ProductSchema);

module.exports = ProductModel;

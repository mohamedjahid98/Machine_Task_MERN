const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    productname: String,
    productdate: String,
    quantityvalue: Number,
    price: Number,
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;

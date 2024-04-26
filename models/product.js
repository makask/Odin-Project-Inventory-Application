const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: { type: String, required: true},
    pic_url: { type: String },
    manufaturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true},
    origin: { type: String },
    description: { type: String },
    category: [{ type: Schema.Types.ObjectId, ref: "Category"}],
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    caliber: { type: String },
    action: { type: String },
    color: { type: String },
    capacity: { type: Number },
    date_of_manufacture: { type: Date },
    date_of_origin: { type: Date }
});

ProductSchema.virtual("url").get(function(){
    return `/catalog/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
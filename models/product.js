const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: { type: String, required: true},
    pic_url: { type: String },
    manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true},
    origin: { type: String },
    description: { type: String },
    category: [{ type: Schema.Types.ObjectId, ref: "Category"}],
    price: { 
        type: Number, 
        required: true,
        get: v => parseFloat(v).toFixed(2),
        set: v => parseFloat(v).toFixed(2) 
    },
    quantity: { type: Number, required: true },
    caliber: { type: String },
    action: { type: String },
    capacity: { type: Number },
    date_of_manufacture: { type: Date },
    year_of_origin: { type: Number }
});

ProductSchema.virtual("url").get(function(){
    return `/catalog/product/${this._id}`;
});

ProductSchema.virtual("date_of_manufacture_formatted").get(function(){
    return this.date_of_manufacture ? DateTime.fromJSDate(this.date_of_manufacture).toLocaleString(DateTime.DATE_MED) : "";
});



module.exports = mongoose.model("Product", ProductSchema);
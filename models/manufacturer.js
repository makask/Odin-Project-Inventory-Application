const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    origin: { type: String, maxLength: 100 },
    logo_url : { type: String },
    founded: { type: Number }, 
    description: { type: String },
    homepage_url: { type: String }
});

ManufacturerSchema.virtual("url").get(function (){
    return `/catalog/manufacturer/${this._id}`;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);


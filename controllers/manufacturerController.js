const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");

//Display list of all manufacturers
exports.manufacturer_list = asyncHandler(async (req, res, nexr) => {
    res.send("NOT IMPLEMENTED: Manufacturer list");
});

//Display detail page for a specific Manufacturer.
exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Manufacturer detail: ${req.params.id}`);
});

//Display Manufacturer create form on GET.
exports.manufacturer_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Manufacturer create GET");
});

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Manufacturer create POST");
});

// Display Manufacturer delete form on GET.
exports.manufacturer_delete_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Manufacturer delete GET");
});

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Manufacturer delete POST");
});

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Manufacturer update GET");
});

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
});

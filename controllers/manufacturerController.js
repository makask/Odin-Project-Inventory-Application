const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Display list of all manufacturers
exports.manufacturer_list = asyncHandler(async (req, res, nexr) => {
    res.send("NOT IMPLEMENTED: Manufacturer list");
});

//Display detail page for a specific Manufacturer.
exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Manufacturer detail: ${req.params.id}`);
});

//Display Manufacturer create form on GET.
exports.manufacturer_create_get = (req, res, next) => {
    res.render("manufacturer_form", { title: "Create Manufacturer" });
};

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = [
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Manufacturers name must be specified."),
    body("origin")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Manufacturers origin must be specified"),
    body("founded")
        .trim()
        .escape(),
    body("description")
        .trim()
        .escape(),
    body("homepage_url")
        .trim()
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Manufacturer object with escaped and trimmed data
        const manufacturer = new Manufacturer({
            name : req.body.name,
            origin : req.body.origin,
            logo_url : req.body.logo_url,
            founded : req.body.founded,
            description : req.body.description,
            homepage_url : req.body.homepage_url
        });

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("manufacturer_form", {
                title: "Create Manufacturer",
                manufacturer: manufacturer,
                errors: errors.array(),
            });
            return;
        }else{
            // Data from form is valid.
            // Save manufacturer.
            await manufacturer.save();
            // Redirect to new manufacturer record.
            res.redirect(manufacturer.url);
        }
    })
    
];

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

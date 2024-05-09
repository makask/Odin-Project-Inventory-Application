const Manufacturer = require("../models/manufacturer");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Display list of all manufacturers
exports.manufacturer_list = asyncHandler(async (req, res, nexr) => {
    const allManufacturers = await Manufacturer.find().sort({ name: 1 }).exec();
    res.render("manufacturer_list", {
        title: "Manufacturer List",
        manufacturer_list: allManufacturers,
    });
});

//Display detail page for a specific Manufacturer.
exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
    // Get details of manufacturer and all their products
    const [manufacturer, allProductsByManufacturer] = await Promise.all([
        Manufacturer.findById(req.params.id).exec(),
        Product.find({ manufacturer: req.params.id }, "title pic_url description").exec(),
    ]);

    if(manufacturer === null){
        // No results.
        const err = new Error("Manufacturer not found");
        err.status = 404;
        return next(err);
    }

    res.render("manufacturer_detail", {
        title: "Manufacturer Detail",
        manufacturer: manufacturer,
        manufacturer_products: allProductsByManufacturer,
    });
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
    // Get details of manufacturer and all their products (in parallel)
    const [manufacturer, allProductsByManufacturer] = await Promise.all([
        Manufacturer.findById(req.params.id).exec(),
        Product.find({ manufacturer: req.params.id}, "title pic_url description").exec(),
    ]);

    if (manufacturer === null) {
        // No results.
        res.redirect("/catalog/manufacturers");
    }
    res.render("manufacturer_delete", {
        title: "Delete Manufacturer",
        manufacturer: manufacturer,
        manufacturer_products: allProductsByManufacturer,
    });
});

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = asyncHandler(async(req, res, next) => {
    // Get details of manufacturer and all their products (in parallel)
    const [manufacturer, allProductsByManufacturer] = await Promise.all([
        Manufacturer.findById(req.params.id).exec(),
        Product.find({ manufacturer: req.params.id}, "title pic_url description").exec(),
    ]);

    if(allProductsByManufacturer.length > 0){
        // Manufacturer has products. Render in same way as for GET route.
        res.render("manufacturer_delete", {
            title: "Delete Manufacturer",
            manufacturer: manufacturer,
            manufacturer_products: allProductsByManufacturer,
        });
        return;
    }else{
        // Manufacturer has no products. Delete object and redirect to the list of manufacturers.
        await Manufacturer.findByIdAndDelete(req.body.manufacturerid);
        res.redirect("/catalog/manufacturers");
    }
});

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
    // Get manufacturer
    const manufacturer = await Manufacturer.findById(req.params.id).exec();
    if(manufacturer === null){
        //No results.
        const err = new Error("Manufacturer not found");
        err.status = 404;
        return next(err);
    }
    res.render("manufacturer_form", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
    });
});

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = [
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
    
    // Process request after validation and sanitization.
    asyncHandler(async(req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Manufacturer object with escaped/trimmed data and old id.
        const manufacturer = new Manufacturer({
            name: req.body.name,
            origin: req.body.origin,
            logo_url: req.body.logo_url,
            founded: req.body.founded,
            description: req.body.description,
            homepage_url: req.body.homepage_url,
            _id: req.params.id,
        });

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/error messages.
            res.render("manufacturer_form", {
                title: "Update Manufacturer",
                manufacturer: manufacturer,
                errors: errors.array(),
            });
            return;
        }else{
            // Form data is valid. Update the record.
            const updatedManufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {});
            res.redirect(updatedManufacturer.url);
        }
    })
];
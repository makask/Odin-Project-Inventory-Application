const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Manufacturer = require("../models/manufacturer");
const Category = require("../models/category");
const manufacturer = require("../models/manufacturer");
const category = require("../models/category");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of products, manufacturers and categories counts (in parallel)
    const [ 
        numOfProducts, 
        numOfManufacturers, 
        numOfCategories,
    ] = await Promise.all([
        Product.countDocuments({}).exec(),
        Manufacturer.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Home Page",
        product_count: numOfProducts,
        manufacturer_count: numOfManufacturers,
        category_count: numOfCategories
    });
});
  
// Display list of all products.
exports.product_list = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find({}, "pic_url title manufacturer action caliber quantity category price")
        .sort({ title:1 })
        .populate("manufacturer category")
        .exec();

        res.render("product_list", { title: "Product List", product_list: allProducts }); 
});
  
// Display detail page for a specific product.
exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("manufacturer").populate("category").exec();
    
    if(product===null){
        //No results
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
    }

    res.render("product_detail", {
        title: product.title,
        product: product,
    });
});
  
// Display product create form on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
    //Get all manufacturers and categories.
    const[allManufacturers, allCategories] = await Promise.all([
        Manufacturer.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1}).exec(),
    ]);

    res.render("product_form", {
        title: "Create Product",
        manufacturers: allManufacturers,
        categories: allCategories,
    });
});
  
// Handle product create on POST.
exports.product_create_post = [
    //Convert the category to an array.
    (req, res, next) => {
        if(!Array.isArray(req.body.category)){
            req.body.category = 
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },
    //Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("manufacturer", "manufacturer must not be empty.")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("origin")
        .trim()
        .escape(),
    body("description")
        .trim()
        .escape(),
    body("category.*")
        .escape(),
    body("price")
        .trim()
        .escape(),
    body("quantity")
        .trim()
        .escape(),
    body("caliber")
        .trim()
        .escape(),
    body("action")
        .trim()
        .escape(),
    body("capacity")
        .trim()
        .escape(),
    body("date_of_manufacture")
        .trim()
        .escape(),
    body("year_of_origin")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a Product object with escaped and trimmed data.
        const product = new Product({
            title: req.body.title,
            pic_url: req.body.pic_url,
            manufacturer: req.body.manufacturer,
            origin: req.body.origin,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            caliber: req.body.caliber,
            action: req.body.action,
            capacity: req.body.capacity,
            date_of_manufacture: req.body.date_of_manufacture,
            year_of_origin: req.body.year_of_origin
        });

        if(!errors.isEmpty()){
            //If errors render form again with sanitized values/error messages.

            //Get all manufacturers and categories for form.
            const[allManufacturers, allCategories] = await Promise.all([
                Manufacturer.find().sort({ name: 1}).exec(),
                Category.find().sort({ name: 1}).exec(),
            ]);

            //Mark selected categories as checked.
            for(const category of allCategories){
                if(product.category.includes(category._id)){
                    category.checked = "true";
                }
            }

            res.render("product_form", {
                title: "Create Product",
                manufacturers: allManufacturers,
                categories: allCategories,
                product: product,
                errors: errors.array(),
            });
        }else{
            // Data from form is valid. Save product.
            await product.save();
            res.redirect(product.url);
        }
    })
];
  
// Display product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();

    if(product === null){
         // No results.
         const err = new Error("Product not found");
         err.status = 404;
         return next(err);
    }

    res.render("product_delete", {
        title: "Delete Product",
        product: product
    })
});
  
// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();

    if(product === null){
        // No results.
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
   }else{
        // Delete product and redirect to the list of products.
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/catalog/products");
   }
});
  
// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
    // Get product, manufacturers and categories for form.
    const[product, allManufacturers, allCategories] = await Promise.all([
        Product.findById(req.params.id).populate("manufacturer").exec(),
        Manufacturer.find().sort({ name:1 }).exec(),
        Category.find().sort({ name:1 }).exec(),
    ]);

    if(product === null){
        // No results.
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
    }

    // Mark selected categories as checked.
    allCategories.forEach((category) => {
        if(product.category.includes(category._id)) category.checked = "true";
    });

    res.render("product_form", {
        title: "Update Product",
        manufacturers: allManufacturers,
        categories: allCategories,
        product: product,
    });
});
  
// Handle product update on POST.
exports.product_update_post = [
    // Convert the category to an array.
    (req, res, next) => {
        if(!Array.isArray(req.body.category)){
            req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("manufacturer", "manufacturer must not be empty.")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("origin")
        .trim()
        .escape(),
    body("description")
        .trim()
        .escape(),
    body("category.*")
        .escape(),
    body("price")
        .trim()
        .escape(),
    body("quantity")
        .trim()
        .escape(),
    body("caliber")
        .trim()
        .escape(),
    body("action")
        .trim()
        .escape(),
    body("capacity")
        .trim()
        .escape(),
    body("date_of_manufacture")
        .trim()
        .escape(),
    body("year_of_origin")
        .trim()
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Product object with escaped/trimmed data and old id.
        const product = new Product({
            title: req.body.title,
            pic_url: req.body.pic_url,
            manufacturer: req.body.manufacturer,
            origin: req.body.origin,
            description: req.body.description,
            category: typeof req.body.category === "undefined" ? [] : req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            caliber: req.body.caliber,
            action: req.body.action,
            capacity: req.body.capacity,
            date_of_manufacture: req.body.date_of_manufacture,
            year_of_origin: req.body.year_of_origin,
            _id: req.params.id, // Required or a new ID will be assigned!
        });

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/error messages.

            // Get all manufacturers and categories for form
            const[allManufacturers, allCategories] = await Promise.all([
                Manufacturer.find().sort({ name: 1}).exec(),
                Category.find().sort({ name: 1}).exec(),
            ]);

            // Mark selected categories as checked.
            for(const category of allCategories){
                if(product.category.indexOf(category._id) > -1){
                    category.checked = "true";
                }
            }
            res.render("product_form", {
                title: "Update Product",
                manufacturers: allManufacturers,
                categories: allCategories,
                product: product,
                errors: errors.array(),
            });
            return;
        }else{
            // Form data is valid. Update the record.
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {});
            // Redirect to product detail page.
            res.redirect(updatedProduct.url);
        }
    }),
];
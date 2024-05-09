const Category = require("../models/category");
const Product = require("../models/product");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const manufacturer = require("../models/manufacturer");

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1}).exec();
    res.render("category_list", {
        title: "Category List",
        category_list: allCategories,
    });
});
  
// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    //Get details of category and all associated products.
    const[category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "title pic_url description").exec(),
    ]);
    if(category === null){
        // No results
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        category_products: productsInCategory,
    });
});
  
// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};
  
// Handle Category create on POST.
exports.category_create_post = [
    // Validate and sanitize the name field.
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min:3 })
        .escape(),
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data.
        const category = new Category({ name: req.body.name });

        if(!errors.isEmpty()){
           // There are errors. Render the form again with sanitized values/error messages. 
           res.render("category_form", {
            title: "Create Category",
            category: category,
            errors: errors.array(),
           });
           return;
        }else{
            // Data from form is valid.
            // Check if Category with same name already exists.
            const categoryExists = await Category.findOne({ name: req.body.name }).exec();
            if(categoryExists){
                // Category exists, redirect to its detail page.
                res.redirect(categoryExists.url);
            }else{
                await category.save();
                // New category saved. Redirect to category detail page.
                res.redirect(category.url);
            }
        }
    }) 
];
  
// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of category and all associated products (in parallel)
    const[category, allProductsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "title pic_url description").exec(),
    ]);

    if (category === null) {
        // No results.
        res.redirect("/catalog/categories");
    }
    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_products: allProductsByCategory,
    });
});
  
// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of category and all associated products.
    const[category, allProductsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "title pic_url description").exec(),
    ]);

    if(allProductsByCategory.length > 0){
        // There are products in this category. Render in same way as for GET route.
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_products: allProductsByCategory,
        });
        return;
    }else{
        // No products in this category. Delete object and redirect to the list of categories.
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect("/catalog/categories");
    }
});
  
// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get category
    const category = await Category.findById(req.params.id).exec();
    if(category === null){
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    res.render("category_form", {
        title: "Update Category",
        category: category,
    });
});
  
// Handle Category update on POST.
exports.category_update_post = [
    // Validate and sanitize field(s).
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min:3 })
        .escape(),
    
    asyncHandler(async(req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Manufacturer object with escaped/trimmed data and old id.
        const category = new Category({
            name: req.body.name,
            _id: req.params.id,
        });

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors:array(),
            });
            return;
        }else{
            // Form data is valid. Update the record.
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(updatedCategory.url);
        }
    })
];
const express = require("express");
const router = express.Router();

//Require controller modules.
const product_controller = require("../controllers/productController");
const manufacturer_controller = require("../controllers/manufacturerController");
const category_controller = require("../controllers/categoryController");

/// PRODUCT ROUTES ///

// GET catalog home page.
router.get("/", product_controller.index);

// GET request for creating a Product. 
router.get("/product/create", product_controller.product_create_get);

// POST request for creating Product.
router.post("/product/create", product_controller.product_create_post);

// GET request to delete Product.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete Product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update Product.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update Product.
router.post("/product/:id/update", product_controller.product_update_post);

// GET request for one Product.
router.get("/product/:id", product_controller.product_detail);

// GET request for list of all Product items.
router.get("/products", product_controller.product_list);

/// MANUFACTURER ROUTES ///

// GET request for creating Manufacturer. 
router.get("/manufacturer/create", manufacturer_controller.manufacturer_create_get);

// POST request for creating Manufacturer.
router.post("/manufacturer/create", manufacturer_controller.manufacturer_create_post);

// GET request to delete Manufacturer.
router.get("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_get);

// POST request to delete Manufacturer.
router.post("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_post);

// GET request to update Manufacturer.
router.get("/manufacturer/:id/update", manufacturer_controller.manufacturer_update_get);

// POST request to update Manufacturer.
router.post("/manufacturer/:id/update", manufacturer_controller.manufacturer_update_post);

// GET request for one Manufacturer.
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request for list of all Manufacturers.
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. 
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories.
router.get("/categories", category_controller.category_list);

module.exports = router;

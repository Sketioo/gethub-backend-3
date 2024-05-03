const express = require("express");
const productController = require("../controllers/product.controller");

const {isLoggedIn} = require("../middleware/check-auth");
const router = express.Router();

router.get("/products", isLoggedIn, productController.getProducts);
router.post("/products", isLoggedIn, productController.createProduct);
router.get("/products/:id", isLoggedIn, productController.getProductById);
router.put("/products/:id", isLoggedIn, productController.updateProduct);
router.delete("/products/:id", isLoggedIn, productController.deleteProduct);

module.exports = router;

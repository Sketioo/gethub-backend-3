const express = require("express");
const productController = require("../controllers/product.controller");

const {isLoggedIn} = require("../middleware/check-auth");
const router = express.Router();

router.get("/products", isLoggedIn, productController.getProducts);
router.post("/product", isLoggedIn, productController.createProduct);
router.get("/product/:id", isLoggedIn, productController.getProductById);
router.put("/product/:id/update", isLoggedIn, productController.updateProduct);
router.delete("/product/:id/delete", isLoggedIn, productController.deleteProduct);

module.exports = router;

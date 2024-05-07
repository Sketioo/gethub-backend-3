const express = require("express");
const productController = require("../controllers/product.controller");

const {isLoggedIn} = require("../middleware/check-auth");
const router = express.Router();

router.get("/products",  productController.getProducts);
router.post("/product",  productController.createProduct);
router.get("/product/:id",  productController.getProductById);
router.put("/product/:id",  productController.updateProduct);
router.delete("/product/:id",  productController.deleteProduct);

module.exports = router;
